/**
 * Vulcan E-Commerce Test Dashboard - Backend Server
 * Express.js server with Jira integration and real-time test execution
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const JiraIntegration = require('../utils/jiraIntegration');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Jira Integration
const jira = new JiraIntegration();

// Active test executions
const activeExecutions = new Map();

// SSE clients for real-time updates
const sseClients = new Map();

/**
 * Module Discovery - Auto-discover test modules from feature files
 */
/**
 * Calculate estimated execution time
 */
function calculateEstimatedTime(scenarioCount) {
    const AVG_SCENARIO_TIME_SECONDS = 45;
    const totalSeconds = scenarioCount * AVG_SCENARIO_TIME_SECONDS;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return `${totalSeconds}s`;
    }
}

function discoverModules() {
    const featuresDir = path.join(__dirname, '../Ecomm/features');
    const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
    
    const modules = [];
    
    featureFiles.forEach(file => {
        const filePath = path.join(featuresDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract module info
        const featureLine = content.match(/Feature:\s*(.+)/);
        
        // Extract feature-level tags (tags that appear before the Feature: line)
        const lines = content.split('\n');
        const featureLineIndex = lines.findIndex(line => line.includes('Feature:'));
        let featureTags = [];
        
        // Look backwards from Feature line to find tags
        if (featureLineIndex > 0) {
            for (let i = featureLineIndex - 1; i >= 0; i--) {
                const line = lines[i].trim();
                if (line.startsWith('@')) {
                    featureTags = line.match(/@\w+/g) || [];
                    break;
                } else if (line && !line.startsWith('#')) {
                    break; // Stop if we hit non-tag, non-comment content
                }
            }
        }
        
        if (featureLine) {
            const moduleName = featureLine[1].trim();
            
            // Use specific module tag (skip generic @Regression/@Sanity, prefer @Login/@Checkout etc)
            const genericTags = ['Regression', 'Sanity'];
            const moduleTag = featureTags
                .map(t => t.substring(1))
                .find(t => !genericTags.includes(t)) || 
                featureTags[0]?.substring(1) || 'Unknown';
            
            // Count scenarios by priority
            const scenarios = extractScenarios(content);
            const priorityCounts = {
                p1: scenarios.filter(s => s.priority === 'P1').length,
                p2: scenarios.filter(s => s.priority === 'P2').length,
                p3: scenarios.filter(s => s.priority === 'P3').length
            };
            
            modules.push({
                id: moduleTag.toLowerCase(),
                name: moduleName,
                description: `${moduleName} test scenarios`,
                status: 'ready',
                scenarioCount: scenarios.length,
                jiraStoryCount: 0, // Will be fetched from Jira
                priorityCounts,
                tags: featureTags || [],
                featureFile: file,
                scenarios,
                estimatedTime: calculateEstimatedTime(scenarios.length)
            });
        }
    });
    
    return modules;
}

/**
 * Extract scenarios from feature file content
 */
function extractScenarios(content) {
    const scenarios = [];
    const lines = content.split('\n');
    
    let currentTags = [];
    let inScenario = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Collect tags
        if (line.startsWith('@')) {
            // Skip feature-level tags (tags before Feature:)
            const nextNonEmptyLine = lines.slice(i + 1).find(l => l.trim());
            if (!nextNonEmptyLine || !nextNonEmptyLine.includes('Feature:')) {
                currentTags = line.match(/@\w+/g) || [];
            }
        } 
        // Found a scenario
        else if (line.match(/^(Scenario|Scenario Outline):/)) {
            const scenarioMatch = line.match(/(?:Scenario|Scenario Outline):\s*(.+)/);
            if (scenarioMatch) {
                const name = scenarioMatch[1].trim();
                const tags = [...currentTags]; // Copy the tags for this scenario
                
                // Determine priority - only assign if explicitly tagged
                let priority = null;
                if (tags.some(t => t.includes('@P1') || t.includes('@Sanity'))) {
                    priority = 'P1';
                } else if (tags.some(t => t.includes('@P2'))) {
                    priority = 'P2';
                } else if (tags.some(t => t.includes('@P3'))) {
                    priority = 'P3';
                }
                
                // Extract description from first Given/When/Then after this line
                let description = '';
                for (let j = i + 1; j < lines.length && j < i + 20; j++) {
                    const descMatch = lines[j].trim().match(/^(Given|When|Then)\s+(.+)/);
                    if (descMatch) {
                        description = descMatch[2].trim();
                        break;
                    }
                }
                
                scenarios.push({
                    name,
                    priority,
                    tags,
                    description,
                    isRegression: tags.some(t => t.toLowerCase().includes('regression')),
                    isSanity: tags.some(t => t.toLowerCase().includes('sanity'))
                });
                
                currentTags = []; // Reset tags for next scenario
            }
        } 
        // Also reset tags if we hit a blank line followed by tags (between scenarios)
        else if (!line && currentTags.length > 0) {
            // Keep tags if next non-empty line is Scenario
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && !nextLine.startsWith('@') && !nextLine.match(/^(Scenario|Scenario Outline):/)) {
                currentTags = [];
            }
        }
    }
    
    return scenarios;
}

/**
 * Fetch Jira story counts for modules
 */
async function enrichModulesWithJiraData(modules) {
    try {
        // Get all issues from filter
        const issues = await jira.getIssuesFromFilter();
        
        // Define keyword mappings for each module type with include/exclude logic
        const moduleKeywordMap = {
            'addtocart': {
                include: ['cart', 'add to cart', 'cart summary', 'cart page', 'cart update'],
                exclude: ['checkout', 'payment', 'pay by link']
            },
            'checkout': {
                include: ['checkout', 'payment', 'pay by link', 'place order', 'delivery order'],
                exclude: []
            },
            'login': {
                include: ['login', 'sign in', 'sign out', 'signin', 'logout', 'authentication'],
                exclude: []
            },
            'search': {
                include: ['search', 'product search'],
                exclude: ['quarry']
            },
            'pdp': {
                include: ['pdp', 'product display', 'product detail'],
                exclude: []
            },
            'plp': {
                include: ['plp', 'product listing', 'product list', 'category'],
                exclude: []
            },
            'my-account': {
                include: ['my account', 'account', 'profile', 'user profile'],
                exclude: []
            },
            'quarry-selector': {
                include: ['quarry', 'quarry selector', 'location selector'],
                exclude: []
            },
            'inspect-cart': {
                include: ['inspect cart', 'cart structure'],
                exclude: []
            }
        };
        
        modules.forEach(module => {
            const moduleId = module.id.toLowerCase();
            
            // Get keywords for this module
            const config = moduleKeywordMap[moduleId] || { include: [], exclude: [] };
            const includeKeywords = [...config.include, module.name.toLowerCase()];
            const excludeKeywords = config.exclude || [];
            
            const matchingIssues = issues.filter(issue => {
                const summary = (issue.fields.summary || '').toLowerCase();
                
                // Check if matches any include keyword
                const matches = includeKeywords.some(kw => summary.includes(kw));
                
                // Check if should be excluded
                const excluded = excludeKeywords.some(kw => summary.includes(kw));
                
                return matches && !excluded;
            });
            
            module.jiraStoryCount = matchingIssues.length;
            module.jiraIssues = matchingIssues.map(i => ({
                key: i.key,
                summary: i.fields.summary
            }));
        });
        
        return modules;
    } catch (error) {
        console.error('Error fetching Jira data:', error.message);
        return modules;
    }
}

/**
 * API: Get all modules
 */
app.get('/api/modules', async (req, res) => {
    try {
        let modules = discoverModules();
        modules = await enrichModulesWithJiraData(modules);
        
        res.json({ modules });
    } catch (error) {
        console.error('Error getting modules:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: Get scenarios for a specific module
 */
app.get('/api/modules/:moduleId/scenarios', (req, res) => {
    try {
        const modules = discoverModules();
        const module = modules.find(m => m.id === req.params.moduleId);
        
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }
        
        res.json({ scenarios: module.scenarios });
    } catch (error) {
        console.error('Error getting scenarios:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: Run tests
 */
app.post('/api/tests/run', (req, res) => {
    const { modules, headless = true, selectedScenarios = {}, tags: customTags } = req.body;
    
    if (!modules || modules.length === 0) {
        return res.status(400).json({ error: 'No modules specified' });
    }
    
    // Generate execution ID
    const executionId = `exec_${Date.now()}`;
    
    // Get actual module tags from the discovered modules
    const discoveredModules = discoverModules();
    const moduleTagsMap = {};
    discoveredModules.forEach(m => {
        // Find the module-specific tag (not @Regression, @Sanity etc.)
        const genericTags = ['@Regression', '@Sanity', '@Smoke'];
        const moduleSpecificTag = m.tags?.find(t => !genericTags.includes(t)) || 
                                  m.tags?.[0] || 
                                  `@${m.id.charAt(0).toUpperCase() + m.id.slice(1)}`;
        moduleTagsMap[m.id] = moduleSpecificTag;
    });
    
    // Build tag expression
    let tags;
    if (customTags) {
        // Check if customTags contains priority tags (@P1, @P2, @P3)
        const hasPriorityTags = /@P[1-3]/i.test(customTags);
        // Check if customTags contains suite tags (@Sanity, @Regression, @Smoke)
        const hasSuiteTags = /@(Sanity|Regression|Smoke)/i.test(customTags);
        
        if (hasSuiteTags && !hasPriorityTags) {
            // Running a test suite (Sanity, Regression) - just use the suite tag directly
            // No need to combine with module tags
            tags = customTags;
            console.log(`Running test suite: ${tags}`);
        } else if (hasPriorityTags && modules.length === 1) {
            // Single module with priority selection - use module tag AND priority
            const moduleTag = moduleTagsMap[modules[0]] || `@${modules[0].charAt(0).toUpperCase() + modules[0].slice(1)}`;
            tags = `(${moduleTag}) and (${customTags})`;
            console.log(`Running ${modules[0]} with priority filter: ${tags}`);
        } else if (hasPriorityTags) {
            // Multiple modules with priority - just use priority tags (run across all)
            tags = customTags;
            console.log(`Running priority tests across modules: ${tags}`);
        } else {
            // Other custom tags - combine with module tags
            const moduleTags = modules.map(m => moduleTagsMap[m] || `@${m.charAt(0).toUpperCase() + m.slice(1)}`).join(' or ');
            tags = `(${moduleTags}) and (${customTags})`;
            console.log(`Running with custom tags: ${tags}`);
        }
    } else {
        // Default to module-based tags only
        tags = modules.map(m => moduleTagsMap[m] || `@${m.charAt(0).toUpperCase() + m.slice(1)}`).join(' or ');
        console.log(`Running module(s): ${tags}`);
    }
    
    console.log(`\n=== Test Execution Started ===`);
    console.log(`Execution ID: ${executionId}`);
    console.log(`Modules: ${modules.join(', ')}`);
    console.log(`Tags: ${tags}`);
    console.log(`==============================\n`);
    
    // Start test execution
    const cucumberArgs = [
        'cucumber-js',
        'Ecomm/features/*.feature',  // Explicit feature path for proper file discovery
        '--require', 'Ecomm/features/step_definitions/**/*.js',
        '--require', 'Ecomm/features/support/**/*.js',
        '--tags', tags,
        '--format', 'json:test_results.json',
        '--format', 'progress'
    ];
    
    const testProcess = spawn('npx', cucumberArgs, {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, HEADLESS: headless ? 'true' : 'false' },
        detached: true  // Create process group for proper cleanup
    });
    
    // Store execution info with scenario names for display
    const selectedModuleData = discoveredModules.filter(m => modules.includes(m.id));
    const scenarioNames = [];
    selectedModuleData.forEach(m => {
        m.scenarios.forEach(s => {
            let shouldInclude = true;
            
            if (customTags) {
                // Check for suite tags (Sanity, Regression)
                const hasSanityTag = /@sanity/i.test(customTags);
                const hasRegressionTag = /@regression/i.test(customTags);
                
                // Check for priority tags
                const priorityMatches = customTags.match(/@P[1-3]/gi) || [];
                const hasPriorityTags = priorityMatches.length > 0;
                
                // Apply filters
                if (hasSanityTag && !hasRegressionTag) {
                    // Only include Sanity scenarios
                    shouldInclude = s.isSanity === true;
                } else if (hasRegressionTag && !hasSanityTag) {
                    // Only include Regression scenarios
                    shouldInclude = s.isRegression === true;
                }
                
                // Additionally filter by priority if specified
                if (shouldInclude && hasPriorityTags) {
                    shouldInclude = priorityMatches.some(p => 
                        s.priority.toUpperCase() === p.replace('@', '').toUpperCase()
                    );
                }
            }
            
            if (shouldInclude) {
                scenarioNames.push({ 
                    module: m.name, 
                    name: s.name, 
                    priority: s.priority,
                    isSanity: s.isSanity,
                    isRegression: s.isRegression
                });
            }
        });
    });
    
    activeExecutions.set(executionId, {
        process: testProcess,
        startTime: new Date(),
        modules,
        selectedScenarios,
        tags,
        scenarioNames,  // Added scenario names for execution display
        currentScenarioIndex: 0,
        logs: [],
        status: 'running'
    });
    
    // Capture output
    testProcess.stdout.on('data', (data) => {
        const log = data.toString();
        const execution = activeExecutions.get(executionId);
        execution.logs.push({ type: 'stdout', message: log, timestamp: new Date() });
        
        // Broadcast to SSE clients
        broadcastLog(executionId, { type: 'stdout', message: log });
    });
    
    testProcess.stderr.on('data', (data) => {
        const log = data.toString();
        const execution = activeExecutions.get(executionId);
        execution.logs.push({ type: 'stderr', message: log, timestamp: new Date() });
        
        // Broadcast to SSE clients
        broadcastLog(executionId, { type: 'stderr', message: log });
    });
    
    testProcess.on('close', (code) => {
        const execution = activeExecutions.get(executionId);
        execution.status = code === 0 ? 'passed' : 'failed';
        execution.endTime = new Date();
        execution.exitCode = code;
        
        // Sync results to Jira
        syncResultsToJira();
        
        // Broadcast completion
        broadcastLog(executionId, { 
            type: 'complete', 
            status: execution.status,
            exitCode: code 
        });
    });
    
    res.json({ 
        executionId,
        status: 'started',
        message: `Test execution started for modules: ${modules.join(', ')}`
    });
});

/**
 * API: SSE Stream for test execution logs
 */
app.get('/api/tests/execution/:executionId/stream', (req, res) => {
    const { executionId } = req.params;
    
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', executionId })}\n\n`);
    
    // Store client
    if (!sseClients.has(executionId)) {
        sseClients.set(executionId, []);
    }
    sseClients.get(executionId).push(res);
    
    // Send existing logs
    const execution = activeExecutions.get(executionId);
    if (execution) {
        execution.logs.forEach(log => {
            res.write(`data: ${JSON.stringify(log)}\n\n`);
        });
    }
    
    // Handle client disconnect
    req.on('close', () => {
        const clients = sseClients.get(executionId);
        if (clients) {
            const index = clients.indexOf(res);
            if (index > -1) clients.splice(index, 1);
        }
    });
});

/**
 * Broadcast log to all SSE clients for execution
 */
function broadcastLog(executionId, logData) {
    const clients = sseClients.get(executionId);
    if (clients) {
        clients.forEach(client => {
            try {
                client.write(`data: ${JSON.stringify(logData)}\n\n`);
            } catch (error) {
                console.error('Error broadcasting to client:', error);
            }
        });
    }
}

/**
 * API: Get execution status
 */
app.get('/api/tests/execution/:executionId', (req, res) => {
    const { executionId } = req.params;
    const execution = activeExecutions.get(executionId);
    
    if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
    }
    
    res.json({
        executionId,
        status: execution.status,
        startTime: execution.startTime,
        endTime: execution.endTime,
        modules: execution.modules,
        logsCount: execution.logs.length,
        scenarioNames: execution.scenarioNames || [],
        tags: execution.tags || ''
    });
});

/**
 * API: Stop execution
 */
app.post('/api/tests/execution/:executionId/stop', (req, res) => {
    const { executionId } = req.params;
    const execution = activeExecutions.get(executionId);
    
    if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
    }
    
    if (execution.status === 'running') {
        const pid = execution.process.pid;
        
        // Kill the entire process tree on macOS/Linux
        try {
            // First try SIGTERM
            process.kill(-pid, 'SIGTERM');
        } catch (e) {
            // If process group kill fails, try killing the process directly
            try {
                execution.process.kill('SIGTERM');
            } catch (e2) {
                console.log('Process already terminated');
            }
        }
        
        // Force kill after 2 seconds if still running
        setTimeout(() => {
            try {
                process.kill(-pid, 'SIGKILL');
            } catch (e) {
                try {
                    execution.process.kill('SIGKILL');
                } catch (e2) {
                    // Process already dead
                }
            }
        }, 2000);
        
        execution.status = 'stopped';
        execution.endTime = new Date();
        
        // Broadcast stop to SSE clients
        broadcastLog(executionId, { 
            type: 'system', 
            message: '⛔ Test execution stopped by user',
            status: 'stopped'
        });
        
        res.json({ message: 'Execution stopped successfully' });
    } else {
        res.json({ message: 'Execution already completed' });
    }
});

/**
 * API: Get latest test results from test_results.json
 */
app.get('/api/tests/results', (req, res) => {
    try {
        const resultsPath = path.join(__dirname, '..', 'test_results.json');
        if (fs.existsSync(resultsPath)) {
            const content = fs.readFileSync(resultsPath, 'utf-8');
            const results = JSON.parse(content);
            
            // Parse cucumber JSON format to extract module stats
            const moduleStats = {};
            const scenarios = [];
            
            results.forEach(feature => {
                const featureName = feature.name || 'Unknown';
                if (!moduleStats[featureName]) {
                    moduleStats[featureName] = {
                        name: featureName,
                        total: 0,
                        passed: 0,
                        failed: 0,
                        duration: 0,
                        scenarios: []
                    };
                }
                
                (feature.elements || []).forEach(scenario => {
                    if (scenario.type === 'scenario') {
                        moduleStats[featureName].total++;
                        
                        let scenarioDuration = 0;
                        let scenarioStatus = 'passed';
                        const failedSteps = [];
                        
                        (scenario.steps || []).forEach(step => {
                            if (step.result) {
                                if (step.result.duration) {
                                    scenarioDuration += step.result.duration;
                                }
                                if (step.result.status === 'failed') {
                                    scenarioStatus = 'failed';
                                    failedSteps.push({
                                        name: step.name,
                                        error: step.result.error_message || 'Step failed'
                                    });
                                }
                            }
                        });
                        
                        if (scenarioStatus === 'passed') {
                            moduleStats[featureName].passed++;
                        } else {
                            moduleStats[featureName].failed++;
                        }
                        
                        moduleStats[featureName].duration += scenarioDuration;
                        
                        const scenarioInfo = {
                            name: scenario.name,
                            feature: featureName,
                            status: scenarioStatus,
                            duration: scenarioDuration,
                            tags: (scenario.tags || []).map(t => t.name),
                            failedSteps: failedSteps
                        };
                        
                        moduleStats[featureName].scenarios.push(scenarioInfo);
                        scenarios.push(scenarioInfo);
                    }
                });
            });
            
            res.json({
                success: true,
                modules: Object.values(moduleStats),
                scenarios: scenarios,
                summary: {
                    total: scenarios.length,
                    passed: scenarios.filter(s => s.status === 'passed').length,
                    failed: scenarios.filter(s => s.status === 'failed').length,
                    duration: scenarios.reduce((sum, s) => sum + s.duration, 0)
                }
            });
        } else {
            res.json({ success: false, message: 'No test results file found' });
        }
    } catch (error) {
        console.error('Error reading test results:', error);
        res.status(500).json({ error: 'Failed to read test results' });
    }
});

/**
 * API: Get dashboard statistics
 */
app.get('/api/modules/stats', async (req, res) => {
    try {
        let modules = discoverModules();
        modules = await enrichModulesWithJiraData(modules);
        
        // Count tag-based scenarios (Regression and Sanity)
        let regressionCount = 0;
        let sanityCount = 0;
        
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        
        modules.forEach(module => {
            const featurePath = path.join(featuresDir, module.featureFile);
            if (fs.existsSync(featurePath)) {
                const content = fs.readFileSync(featurePath, 'utf-8');
                const lines = content.split('\n');
                
                // First, find Feature-level tags
                let featureTags = '';
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('Feature:')) {
                        // Look back for tags before Feature declaration
                        for (let j = i - 1; j >= 0; j--) {
                            const prevLine = lines[j].trim();
                            if (prevLine.startsWith('@')) {
                                featureTags = prevLine + ' ' + featureTags;
                            } else if (prevLine !== '' && !prevLine.startsWith('#')) {
                                break;
                            }
                        }
                        break;
                    }
                }
                
                // Now count scenarios and apply feature tags to each
                lines.forEach((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('Scenario:') || trimmedLine.startsWith('Scenario Outline:')) {
                        // Get scenario-level tags
                        let scenarioTags = '';
                        for (let i = index - 1; i >= 0; i--) {
                            const prevLine = lines[i].trim();
                            if (prevLine.startsWith('@')) {
                                scenarioTags = prevLine + ' ' + scenarioTags;
                            } else if (prevLine !== '') {
                                break;
                            }
                        }
                        
                        // Combine feature tags and scenario tags
                        const allTags = (featureTags + ' ' + scenarioTags).toLowerCase();
                        
                        if (allTags.includes('@regression')) {
                            regressionCount++;
                        }
                        if (allTags.includes('@sanity')) {
                            sanityCount++;
                        }
                    }
                });
            }
        });
        
        const p1Count = modules.reduce((sum, m) => sum + m.priorityCounts.p1, 0);
        const p2Count = modules.reduce((sum, m) => sum + m.priorityCounts.p2, 0);
        const p3Count = modules.reduce((sum, m) => sum + m.priorityCounts.p3, 0);
        
        const stats = {
            totalModules: modules.length,
            readyModules: modules.filter(m => m.status === 'ready').length,
            totalScenarios: modules.reduce((sum, m) => sum + m.scenarioCount, 0),
            totalJiraStories: modules.reduce((sum, m) => sum + m.jiraStoryCount, 0),
            priorityBreakdown: {
                p1: p1Count,
                p2: p2Count,
                p3: p3Count
            },
            tagBreakdown: {
                regression: regressionCount,
                sanity: sanityCount
            },
            estimatedExecutionTime: {
                regression: calculateEstimatedTime(regressionCount),
                sanity: calculateEstimatedTime(sanityCount),
                p1: calculateEstimatedTime(p1Count),
                p2: calculateEstimatedTime(p2Count),
                p3: calculateEstimatedTime(p3Count)
            }
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: Get execution history
 */
app.get('/api/tests/history', (req, res) => {
    const history = Array.from(activeExecutions.entries()).map(([id, exec]) => ({
        executionId: id,
        status: exec.status,
        startTime: exec.startTime,
        endTime: exec.endTime,
        modules: exec.modules,
        exitCode: exec.exitCode
    }));
    
    res.json({ executions: history });
});

/**
 * Sync test results to Jira
 */
async function syncResultsToJira() {
    try {
        const resultsPath = path.join(__dirname, '../test_results.json');
        if (fs.existsSync(resultsPath)) {
            await jira.syncTestResults(resultsPath);
            console.log('✓ Results synced to Jira');
        }
    } catch (error) {
        console.error('Error syncing to Jira:', error.message);
    }
}

/**
 * Serve React frontend
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============ AI FEATURE GENERATOR ENDPOINTS ============

/**
 * Generate test scenarios from Jira story/epic/filter
 */
app.post('/api/ai/generate-scenarios', async (req, res) => {
    const { jiraInput, inputType } = req.body;
    
    try {
        let jiraDetails = null;
        let acceptanceCriteria = [];
        let scenarios = [];
        let childStories = []; // Track child stories for epics
        
        // Fetch Jira details based on input type
        if (inputType === 'story') {
            // Fetch single story
            const issue = await jira.getIssue(jiraInput);
            
            if (!issue) {
                return res.json({ success: false, error: `Could not find Jira issue: ${jiraInput}` });
            }
            
            jiraDetails = {
                key: issue.key,
                summary: issue.fields?.summary || 'No summary',
                status: issue.fields?.status?.name || 'Unknown',
                description: issue.fields?.description || '',
                type: 'Story'
            };
            
            // Extract acceptance criteria - prioritize AC field, fall back to description
            acceptanceCriteria = getAcceptanceCriteriaFromIssue(issue);
            
        } else if (inputType === 'epic') {
            // Fetch Epic and all its child stories
            const epic = await jira.getIssue(jiraInput);
            
            if (!epic) {
                return res.json({ success: false, error: `Could not find Epic: ${jiraInput}` });
            }
            
            console.log(`\n=== Processing Epic: ${jiraInput} ===`);
            console.log(`Epic Summary: ${epic.fields?.summary}`);
            
            jiraDetails = {
                key: epic.key,
                summary: epic.fields?.summary || 'No summary',
                status: epic.fields?.status?.name || 'Unknown',
                description: epic.fields?.description || '',
                type: 'Epic',
                childCount: 0
            };
            
            // Use Agile API to get child issues of the Epic (most reliable method)
            console.log(`Fetching child stories using Agile API...`);
            let epicChildren = [];
            
            try {
                epicChildren = await jira.getEpicChildren(jiraInput);
                console.log(`✓ Found ${epicChildren.length} child stories in Epic`);
            } catch (err) {
                console.log(`Agile API failed: ${err.message}`);
            }
            
            if (epicChildren && epicChildren.length > 0) {
                jiraDetails.childCount = epicChildren.length;
                
                // Process each child story
                for (const child of epicChildren) {
                    const childKey = child.key;
                    const childSummary = child.fields?.summary || 'No summary';
                    const childStatus = child.fields?.status?.name || 'Unknown';
                    
                    console.log(`  Processing child: ${childKey} - ${childSummary}`);
                    
                    // Store child story info
                    childStories.push({
                        key: childKey,
                        summary: childSummary,
                        status: childStatus
                    });
                    
                    // Extract AC from child story
                    const childAC = getAcceptanceCriteriaFromIssue(child);
                    console.log(`    Found ${childAC.length} AC items`);
                    
                    // Tag each AC with the source story
                    childAC.forEach(ac => {
                        acceptanceCriteria.push({
                            text: ac,
                            sourceKey: childKey,
                            sourceSummary: childSummary
                        });
                    });
                }
            } else {
                console.log('No child stories found, using Epic AC only');
                // Fall back to Epic's own AC
                const epicAC = getAcceptanceCriteriaFromIssue(epic);
                epicAC.forEach(ac => {
                    acceptanceCriteria.push({
                        text: ac,
                        sourceKey: epic.key,
                        sourceSummary: epic.fields?.summary
                    });
                });
            }
            
            // Update jiraDetails with child stories info
            jiraDetails.childStories = childStories;
            
        } else if (inputType === 'filter') {
            // Fetch issues from filter/JQL
            const jql = jiraInput.match(/^\d+$/) 
                ? `filter = ${jiraInput}` 
                : jiraInput;
            
            try {
                const issues = await jira.searchIssues(jql);
                
                if (!issues || issues.length === 0) {
                    return res.json({ success: false, error: 'No issues found for the given filter/JQL' });
                }
                
                jiraDetails = {
                    key: `Filter: ${jiraInput}`,
                    summary: `${issues.length} issues found`,
                    status: 'N/A'
                };
                
                // Extract AC from all issues - prioritize AC field
                issues.forEach(issue => {
                    const ac = getAcceptanceCriteriaFromIssue(issue);
                    acceptanceCriteria = [...acceptanceCriteria, ...ac];
                });
            } catch (err) {
                return res.json({ success: false, error: `JQL error: ${err.message}` });
            }
        }
        
        // Process acceptance criteria - handle both object format (epic) and string format (story)
        let processedAC = [];
        let isEpicFormat = acceptanceCriteria.length > 0 && typeof acceptanceCriteria[0] === 'object';
        
        if (isEpicFormat) {
            // Epic format - AC has sourceKey and text
            // Consolidate and group similar AC from different stories
            console.log(`\n=== Consolidating ${acceptanceCriteria.length} AC items from Epic ===`);
            processedAC = consolidateEpicAC(acceptanceCriteria);
            console.log(`Consolidated into ${processedAC.length} unique AC groups`);
        } else {
            // Story format - AC is just strings, remove duplicates
            processedAC = [...new Set(acceptanceCriteria)];
        }
        
        // Generate test scenarios from acceptance criteria
        scenarios = generateScenariosFromAC(processedAC, jiraDetails, isEpicFormat);
        
        // For API response, flatten AC to strings for display
        const displayAC = isEpicFormat 
            ? processedAC.map(ac => `[${ac.sources.map(s => s.key).join(', ')}] ${ac.text}`)
            : processedAC;
        
        res.json({
            success: true,
            jiraDetails,
            acceptanceCriteria: displayAC,
            scenarios,
            isEpic: inputType === 'epic',
            childStories: jiraDetails.childStories || []
        });
        
    } catch (error) {
        console.error('Error generating scenarios:', error);
        res.json({ success: false, error: error.message });
    }
});

/**
 * Check if scenarios already exist in feature files
 */
app.post('/api/ai/check-scenario-matches', (req, res) => {
    const { scenarios } = req.body;
    
    try {
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
        
        const matches = [];
        
        featureFiles.forEach(file => {
            const content = fs.readFileSync(path.join(featuresDir, file), 'utf8');
            
            scenarios.forEach(scenario => {
                // Check for similar scenario names (fuzzy match)
                const scenarioName = scenario.name.toLowerCase();
                const words = scenarioName.split(/\s+/).filter(w => w.length > 3);
                
                // Find existing scenarios in the file
                const existingScenarios = content.match(/Scenario(?:\s+Outline)?:\s*(.+)/gi) || [];
                
                existingScenarios.forEach(existing => {
                    const existingName = existing.replace(/Scenario(?:\s+Outline)?:\s*/i, '').toLowerCase();
                    
                    // Count matching words
                    const matchingWords = words.filter(word => existingName.includes(word));
                    const matchRatio = matchingWords.length / words.length;
                    
                    if (matchRatio >= 0.5) { // 50% word match threshold
                        matches.push({
                            featureFile: file,
                            scenarioName: existing.replace(/Scenario(?:\s+Outline)?:\s*/i, ''),
                            newScenario: scenario.name,
                            matchRatio: Math.round(matchRatio * 100)
                        });
                    }
                });
            });
        });
        
        res.json({
            hasMatches: matches.length > 0,
            matches: matches.slice(0, 10) // Limit to 10 matches
        });
        
    } catch (error) {
        console.error('Error checking matches:', error);
        res.json({ hasMatches: false, error: error.message });
    }
});

/**
 * Smart Scenario Analysis - Determines whether to add steps to existing scenarios or create new ones
 */
app.post('/api/ai/smart-scenario-analysis', (req, res) => {
    const { scenarios, moduleId } = req.body;
    
    try {
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
        
        // Find relevant feature file
        let targetFile = null;
        for (const file of featureFiles) {
            const content = fs.readFileSync(path.join(featuresDir, file), 'utf8');
            if (content.includes(`@${moduleId}`) || file.toLowerCase().includes(moduleId.toLowerCase())) {
                targetFile = file;
                break;
            }
        }
        
        const result = {
            recommendations: [],
            newScenarios: [],
            extendExisting: [],
            skipDuplicates: []
        };
        
        if (!targetFile) {
            // No existing feature file - all scenarios are new
            result.newScenarios = scenarios;
            result.recommendations.push({
                type: 'info',
                message: `No existing feature file found for module "${moduleId}". All scenarios will be new.`
            });
            return res.json({ success: true, ...result });
        }
        
        const filePath = path.join(featuresDir, targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse existing scenarios with their steps
        const existingScenarios = parseExistingScenariosWithSteps(content);
        
        scenarios.forEach(newScenario => {
            const analysis = analyzeScenarioFit(newScenario, existingScenarios);
            
            if (analysis.action === 'skip') {
                result.skipDuplicates.push({
                    scenario: newScenario,
                    reason: analysis.reason,
                    existingMatch: analysis.existingScenario
                });
            } else if (analysis.action === 'extend') {
                result.extendExisting.push({
                    scenario: newScenario,
                    targetScenario: analysis.existingScenario,
                    additionalSteps: analysis.additionalSteps,
                    reason: analysis.reason
                });
            } else {
                result.newScenarios.push(newScenario);
            }
        });
        
        // Add summary recommendations
        if (result.skipDuplicates.length > 0) {
            result.recommendations.push({
                type: 'info',
                message: `${result.skipDuplicates.length} scenario(s) already covered by existing tests`
            });
        }
        if (result.extendExisting.length > 0) {
            result.recommendations.push({
                type: 'suggestion',
                message: `${result.extendExisting.length} scenario(s) can be added as steps to existing tests`
            });
        }
        if (result.newScenarios.length > 0) {
            result.recommendations.push({
                type: 'new',
                message: `${result.newScenarios.length} new scenario(s) will be created`
            });
        }
        
        res.json({ 
            success: true, 
            targetFile,
            existingScenariosCount: existingScenarios.length,
            ...result 
        });
        
    } catch (error) {
        console.error('Error in smart analysis:', error);
        res.json({ success: false, error: error.message });
    }
});

/**
 * Apply smart scenario recommendations - extend existing + add new
 */
app.post('/api/ai/apply-smart-scenarios', (req, res) => {
    const { moduleId, newScenarios, extendExisting, jiraKey } = req.body;
    
    try {
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
        
        let targetFile = null;
        for (const file of featureFiles) {
            const content = fs.readFileSync(path.join(featuresDir, file), 'utf8');
            if (content.includes(`@${moduleId}`) || file.toLowerCase().includes(moduleId.toLowerCase())) {
                targetFile = file;
                break;
            }
        }
        
        if (!targetFile) {
            return res.json({ success: false, error: `Feature file not found for module: ${moduleId}` });
        }
        
        const filePath = path.join(featuresDir, targetFile);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const changes = [];
        
        // Apply extensions to existing scenarios
        if (extendExisting && extendExisting.length > 0) {
            extendExisting.forEach(ext => {
                const scenarioName = ext.targetScenario.name;
                const additionalSteps = ext.additionalSteps;
                
                // Find the scenario in content and add steps before the last step or at the end
                const scenarioRegex = new RegExp(
                    `(Scenario[^:]*:\\s*${escapeRegex(scenarioName)}[\\s\\S]*?)((?=\\n\\s*(?:@|Scenario|Feature|$))|$)`,
                    'i'
                );
                
                const match = content.match(scenarioRegex);
                if (match) {
                    let scenarioContent = match[1];
                    const afterScenario = match[2] || '';
                    
                    // Find the last Then step and add new steps after it
                    const lines = scenarioContent.split('\n');
                    const lastThenIndex = lines.reduce((lastIdx, line, idx) => {
                        if (line.trim().match(/^(Then|And)\s+/i)) {
                            return idx;
                        }
                        return lastIdx;
                    }, -1);
                    
                    if (lastThenIndex !== -1) {
                        // Insert additional steps after the last Then
                        const indent = lines[lastThenIndex].match(/^\s*/)[0];
                        const newStepsFormatted = additionalSteps.map(step => 
                            `${indent}And ${step.text}  # Added from ${jiraKey}`
                        ).join('\n');
                        
                        lines.splice(lastThenIndex + 1, 0, newStepsFormatted);
                        const updatedScenario = lines.join('\n');
                        
                        content = content.replace(match[0], updatedScenario + afterScenario);
                        changes.push({
                            type: 'extended',
                            scenario: scenarioName,
                            stepsAdded: additionalSteps.length
                        });
                    }
                }
            });
        }
        
        // Add new scenarios at the end
        if (newScenarios && newScenarios.length > 0) {
            const gherkinScenarios = newScenarios.map(s => formatScenarioAsGherkin(s, jiraKey)).join('\n\n');
            content = content.trimEnd() + '\n\n' + `  # ========== New Scenarios from ${jiraKey} ==========\n` + gherkinScenarios;
            changes.push({
                type: 'added',
                count: newScenarios.length
            });
        }
        
        fs.writeFileSync(filePath, content);
        
        res.json({
            success: true,
            message: `Updated ${targetFile}`,
            changes,
            filePath: `Ecomm/features/${targetFile}`
        });
        
    } catch (error) {
        console.error('Error applying smart scenarios:', error);
        res.json({ success: false, error: error.message });
    }
});

/**
 * Add scenarios to existing feature file
 */
app.post('/api/ai/add-to-feature', (req, res) => {
    const { moduleId, scenarios, jiraKey } = req.body;
    
    try {
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        
        // Find the feature file for the module
        const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
        let targetFile = null;
        
        for (const file of featureFiles) {
            const content = fs.readFileSync(path.join(featuresDir, file), 'utf8');
            if (content.includes(`@${moduleId}`) || file.toLowerCase().includes(moduleId.toLowerCase())) {
                targetFile = file;
                break;
            }
        }
        
        if (!targetFile) {
            return res.json({ success: false, error: `Could not find feature file for module: ${moduleId}` });
        }
        
        const filePath = path.join(featuresDir, targetFile);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Generate Gherkin scenarios
        const gherkinScenarios = scenarios.map(s => formatScenarioAsGherkin(s, jiraKey)).join('\n\n');
        
        // Add scenarios at the end of the file
        content = content.trimEnd() + '\n\n' + `  # ========== AI Generated Scenarios from ${jiraKey} ==========\n` + gherkinScenarios;
        
        fs.writeFileSync(filePath, content);
        
        res.json({
            success: true,
            message: `Added ${scenarios.length} scenario(s) to ${targetFile}`,
            filePath: `Ecomm/features/${targetFile}`
        });
        
    } catch (error) {
        console.error('Error adding to feature:', error);
        res.json({ success: false, error: error.message });
    }
});

/**
 * Create new feature file with scenarios
 */
app.post('/api/ai/create-feature', (req, res) => {
    const { fileName, scenarios, jiraKey, featureTitle } = req.body;
    
    try {
        const featuresDir = path.join(__dirname, '../Ecomm/features');
        
        // Sanitize filename
        let sanitizedName = fileName.toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        if (!sanitizedName.endsWith('.feature')) {
            sanitizedName += '.feature';
        }
        
        const filePath = path.join(featuresDir, sanitizedName);
        
        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return res.json({ success: false, error: `Feature file already exists: ${sanitizedName}` });
        }
        
        // Generate module tag from filename
        const moduleTag = sanitizedName.replace('.feature', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        
        // Generate Gherkin scenarios
        const gherkinScenarios = scenarios.map(s => formatScenarioAsGherkin(s, jiraKey)).join('\n\n');
        
        // Create feature file content
        const featureContent = `@${moduleTag} @Regression
Feature: ${featureTitle}
  As a Vulcan Shop user
  I want to ${featureTitle.toLowerCase()}
  So that I can complete my tasks efficiently

  # Generated from Jira: ${jiraKey}
  # Generated on: ${new Date().toISOString()}

${gherkinScenarios}
`;
        
        fs.writeFileSync(filePath, featureContent);
        
        res.json({
            success: true,
            message: `Created new feature file: ${sanitizedName} with ${scenarios.length} scenario(s)`,
            filePath: `Ecomm/features/${sanitizedName}`
        });
        
    } catch (error) {
        console.error('Error creating feature:', error);
        res.json({ success: false, error: error.message });
    }
});

/**
 * Helper: Escape special regex characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Helper: Parse existing scenarios from feature file content with their steps
 */
function parseExistingScenariosWithSteps(content) {
    const scenarios = [];
    const lines = content.split('\n');
    
    let currentScenario = null;
    let inScenario = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for scenario start
        const scenarioMatch = line.match(/^(Scenario(?:\s+Outline)?)\s*:\s*(.+)$/i);
        if (scenarioMatch) {
            // Save previous scenario if exists
            if (currentScenario) {
                scenarios.push(currentScenario);
            }
            
            currentScenario = {
                type: scenarioMatch[1],
                name: scenarioMatch[2].trim(),
                tags: [],
                steps: [],
                lineNumber: i + 1
            };
            inScenario = true;
            
            // Look for tags above this line
            for (let j = i - 1; j >= 0 && j >= i - 5; j--) {
                const prevLine = lines[j].trim();
                if (prevLine.startsWith('@')) {
                    currentScenario.tags.push(...prevLine.split(/\s+/).filter(t => t.startsWith('@')));
                } else if (prevLine && !prevLine.startsWith('#')) {
                    break;
                }
            }
            continue;
        }
        
        // Check for step
        if (inScenario) {
            const stepMatch = line.match(/^(Given|When|Then|And|But)\s+(.+)$/i);
            if (stepMatch) {
                currentScenario.steps.push({
                    keyword: stepMatch[1],
                    text: stepMatch[2].trim()
                });
            }
            
            // Check for end of scenario (next scenario, feature, or significant tag section)
            if (line.startsWith('@') && lines[i + 1] && lines[i + 1].trim().match(/^Scenario/i)) {
                // Tags for next scenario - this scenario ends
                if (currentScenario) {
                    scenarios.push(currentScenario);
                    currentScenario = null;
                }
                inScenario = false;
            }
        }
    }
    
    // Don't forget the last scenario
    if (currentScenario) {
        scenarios.push(currentScenario);
    }
    
    return scenarios;
}

/**
 * Helper: Analyze if a new scenario fits into existing scenarios or needs to be new
 */
function analyzeScenarioFit(newScenario, existingScenarios) {
    const newName = newScenario.name.toLowerCase();
    const newSteps = newScenario.steps || [];
    const newAC = (newScenario.originalAC || '').toLowerCase();
    
    // Extract key concepts from new scenario
    const newKeywords = extractKeywords(newName + ' ' + newAC);
    
    for (const existing of existingScenarios) {
        const existingName = existing.name.toLowerCase();
        const existingKeywords = extractKeywords(existingName + ' ' + existing.steps.map(s => s.text).join(' '));
        
        // Calculate similarity
        const commonKeywords = newKeywords.filter(k => existingKeywords.includes(k));
        const similarity = commonKeywords.length / Math.max(newKeywords.length, 1);
        
        // High similarity (>70%) - likely duplicate
        if (similarity > 0.7) {
            // Check if steps are also similar
            const newStepTexts = newSteps.map(s => s.text.toLowerCase());
            const existingStepTexts = existing.steps.map(s => s.text.toLowerCase());
            
            const coveredSteps = newStepTexts.filter(ns => 
                existingStepTexts.some(es => 
                    es.includes(ns.substring(0, 20)) || ns.includes(es.substring(0, 20))
                )
            );
            
            if (coveredSteps.length >= newStepTexts.length * 0.6) {
                return {
                    action: 'skip',
                    reason: `Already covered by "${existing.name}" (${Math.round(similarity * 100)}% similar)`,
                    existingScenario: existing
                };
            }
        }
        
        // Medium similarity (40-70%) - might extend existing
        if (similarity >= 0.4 && similarity <= 0.7) {
            // Find steps in new scenario that don't exist in the existing one
            const additionalSteps = newSteps.filter(newStep => {
                const newText = newStep.text.toLowerCase();
                return !existing.steps.some(es => {
                    const esText = es.text.toLowerCase();
                    return esText.includes(newText.substring(0, 15)) || 
                           newText.includes(esText.substring(0, 15)) ||
                           wordSimilarity(esText, newText) > 0.6;
                });
            });
            
            // If only 1-3 new steps needed, suggest extending
            if (additionalSteps.length > 0 && additionalSteps.length <= 3) {
                // Only suggest extension if the new steps are "Then" assertions or validations
                const assertionSteps = additionalSteps.filter(s => 
                    s.keyword.toLowerCase() === 'then' || 
                    s.text.toLowerCase().includes('should') ||
                    s.text.toLowerCase().includes('verify') ||
                    s.text.toLowerCase().includes('display') ||
                    s.text.toLowerCase().includes('see')
                );
                
                if (assertionSteps.length > 0) {
                    return {
                        action: 'extend',
                        reason: `Can add ${assertionSteps.length} verification step(s) to "${existing.name}"`,
                        existingScenario: existing,
                        additionalSteps: assertionSteps
                    };
                }
            }
        }
    }
    
    // No good match found - create new scenario
    return {
        action: 'new',
        reason: 'No similar existing scenario found'
    };
}

/**
 * Helper: Extract meaningful keywords from text
 */
function extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                       'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 
                       'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
                       'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
                       'into', 'through', 'during', 'before', 'after', 'above', 'below',
                       'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why',
                       'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
                       'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
                       'so', 'than', 'too', 'very', 'just', 'that', 'this', 'these', 'those',
                       'user', 'verify', 'validate', 'check', 'ensure', 'confirm'];
    
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word))
        .filter((word, index, self) => self.indexOf(word) === index); // unique
}

/**
 * Helper: Calculate word-level similarity between two strings
 */
function wordSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    const common = words1.filter(w => words2.includes(w));
    return common.length / Math.max(words1.length, words2.length);
}

/**
 * Helper: Find and extract the Acceptance Criteria field from Jira issue
 * This looks for custom fields named "Acceptance Criteria" or similar
 */
function findAcceptanceCriteriaField(issue) {
    if (!issue || !issue.fields) return null;
    
    const fields = issue.fields;
    const names = issue.names || {};
    const renderedFields = issue.renderedFields || {};
    
    // Debug: Log search attempt
    console.log('=== Searching for Acceptance Criteria field ===');
    
    // PRIORITY 1: Check the known AC field (customfield_10474)
    const knownACFieldId = 'customfield_10474';
    if (fields[knownACFieldId]) {
        console.log(`✓ Found AC in known field: ${knownACFieldId}`);
        // Prefer renderedFields if available (HTML format is more readable)
        if (renderedFields[knownACFieldId]) {
            console.log('  Using rendered version');
            return renderedFields[knownACFieldId];
        }
        return fields[knownACFieldId];
    }
    
    // PRIORITY 2: Search by field name if names are available
    if (Object.keys(names).length > 0) {
        for (const [fieldId, fieldName] of Object.entries(names)) {
            const fieldNameLower = (fieldName || '').toLowerCase().trim();
            // Check for exact or near-exact match
            if (fieldNameLower === 'acceptance criteria' || 
                fieldNameLower === 'acceptance criteria:' ||
                fieldNameLower.startsWith('acceptance criteria')) {
                console.log(`✓ Found AC field by name: ${fieldId} (${fieldName})`);
                if (fields[fieldId]) {
                    if (renderedFields[fieldId]) {
                        return renderedFields[fieldId];
                    }
                    return fields[fieldId];
                }
            }
        }
    }
    
    // PRIORITY 3: Check all customfield_* fields for Given/When/Then content
    for (const [key, value] of Object.entries(fields)) {
        if (key.startsWith('customfield_') && value) {
            const content = typeof value === 'string' ? value : JSON.stringify(value);
            if (content.toLowerCase().includes('given') && 
                content.toLowerCase().includes('when') && 
                content.toLowerCase().includes('then')) {
                console.log(`✓ Found AC content in field: ${key}`);
                if (renderedFields[key]) {
                    return renderedFields[key];
                }
                return value;
            }
        }
    }
    
    // Also check renderedFields directly for Given/When/Then content
    for (const [key, value] of Object.entries(renderedFields)) {
        if (key.startsWith('customfield_') && value) {
            const content = typeof value === 'string' ? value : '';
            if (content.toLowerCase().includes('given') && 
                content.toLowerCase().includes('when') && 
                content.toLowerCase().includes('then')) {
                console.log(`✓ Found AC in rendered field: ${key}`);
                return value;
            }
        }
    }
    
    console.log('✗ No dedicated Acceptance Criteria field found');
    return null;
}

/**
 * Helper: Get all acceptance criteria from a Jira issue
 * Prioritizes the dedicated AC field, falls back to description
 */
function getAcceptanceCriteriaFromIssue(issue) {
    if (!issue) return [];
    
    // First, try to find dedicated Acceptance Criteria field
    const acField = findAcceptanceCriteriaField(issue);
    if (acField) {
        console.log('Using dedicated Acceptance Criteria field');
        const criteria = extractAcceptanceCriteria(acField);
        if (criteria.length > 0) {
            return criteria;
        }
    }
    
    // Fall back to description field
    console.log('Falling back to description field');
    return extractAcceptanceCriteria(issue.fields?.description || '');
}

/**
 * Helper: Extract acceptance criteria from Jira description (Enhanced ADF Parser)
 */
function extractAcceptanceCriteria(description) {
    if (!description) return [];
    
    const criteria = [];
    
    // Handle Atlassian Document Format (ADF) - JSON format with deep parsing
    if (typeof description === 'object') {
        const extractFromADF = (node, depth = 0) => {
            if (!node) return [];
            const items = [];
            
            // Handle text nodes
            if (node.type === 'text' && node.text) {
                return [node.text];
            }
            
            // Handle list items (bullet points, numbered lists)
            if (node.type === 'listItem' || node.type === 'bulletList' || node.type === 'orderedList') {
                if (node.content) {
                    node.content.forEach(child => {
                        items.push(...extractFromADF(child, depth + 1));
                    });
                }
                return items;
            }
            
            // Handle paragraphs
            if (node.type === 'paragraph' && node.content) {
                const paragraphText = node.content
                    .map(child => extractFromADF(child, depth + 1))
                    .flat()
                    .join('');
                if (paragraphText.trim()) {
                    items.push(paragraphText.trim());
                }
                return items;
            }
            
            // Handle headings (might indicate AC section)
            if (node.type === 'heading' && node.content) {
                const headingText = node.content
                    .map(child => extractFromADF(child, depth + 1))
                    .flat()
                    .join('');
                if (headingText.toLowerCase().includes('acceptance') || 
                    headingText.toLowerCase().includes('criteria') ||
                    headingText.toLowerCase().includes('scenario')) {
                    items.push(`[SECTION] ${headingText}`);
                }
                return items;
            }
            
            // Handle tables
            if (node.type === 'tableRow' && node.content) {
                const rowText = node.content
                    .map(cell => {
                        if (cell.content) {
                            return cell.content.map(c => extractFromADF(c, depth + 1)).flat().join(' ');
                        }
                        return '';
                    })
                    .filter(t => t.trim())
                    .join(' | ');
                if (rowText.trim()) {
                    items.push(rowText.trim());
                }
                return items;
            }
            
            // Recursively handle content arrays
            if (node.content && Array.isArray(node.content)) {
                node.content.forEach(child => {
                    items.push(...extractFromADF(child, depth + 1));
                });
            }
            
            return items;
        };
        
        const extractedItems = extractFromADF(description);
        criteria.push(...extractedItems.filter(item => 
            item && 
            typeof item === 'string' && 
            item.length > 5 && 
            !item.startsWith('[SECTION]')
        ));
    } else {
        // Handle plain text description
        const descStr = String(description);
        
        // Split by common delimiters
        const lines = descStr.split(/[\n\r]+|(?<=\.)(?=[A-Z])|(?:^|\s)[-*•]\s/);
        
        lines.forEach(line => {
            const trimmed = line.trim()
                .replace(/^[-*•\d.)\]]+\s*/, '') // Remove bullet/number prefixes
                .replace(/^\s*(given|when|then|and)\s+/i, '') // Clean Gherkin prefixes
                .trim();
            
            if (trimmed.length > 10 && trimmed.length < 500 && !trimmed.startsWith('http')) {
                criteria.push(trimmed);
            }
        });
    }
    
    // Remove duplicates and empty items
    const uniqueCriteria = [...new Set(criteria.filter(c => c && c.trim().length > 10))];
    
    return uniqueCriteria.slice(0, 30); // Limit to 30 criteria
}

/**
 * Helper: Parse structured Given/When/Then AC into complete scenarios
 * Handles numbered AC like:
 * 1. Given I am displayed product suggestions
 *    When I click on the product suggestion
 *    Then I should be taken directly to that product's PDP
 * Also handles markdown-style formatting:
 * # Given I am on the website
 * ## When I click on search
 */
function parseStructuredAC(rawText) {
    const scenarios = [];
    
    // Convert to string if needed
    let text = typeof rawText === 'string' ? rawText : JSON.stringify(rawText);
    
    // Clean HTML tags and normalize text
    text = text
        .replace(/<br\s*\/?>/gi, '\n')           // Convert <br> to newlines
        .replace(/<\/li>/gi, '\n')               // Convert </li> to newlines
        .replace(/<li>/gi, '\n')                 // Convert <li> to newlines
        .replace(/<ol>/gi, '')                   // Remove <ol>
        .replace(/<\/ol>/gi, '')                 // Remove </ol>
        .replace(/<ul>/gi, '')                   // Remove <ul>
        .replace(/<\/ul>/gi, '')                 // Remove </ul>
        .replace(/<del>.*?<\/del>/gi, '')        // Remove strikethrough content
        .replace(/<[^>]+>/g, '')                 // Remove remaining HTML tags
        .replace(/&nbsp;/g, ' ')                 // Convert &nbsp; to space
        .replace(/&quot;/g, '"')                 // Convert &quot; to quote
        .replace(/&amp;/g, '&')                  // Convert &amp; to &
        .replace(/\\n/g, '\n')                   // Convert escaped newlines
        .replace(/\r\n/g, '\n')                  // Normalize line endings
        .replace(/^#+\s*/gm, '')                 // Remove markdown headers (# ##)
        .replace(/\n\s*\n/g, '\n');              // Remove empty lines
    
    console.log('=== Parsing Structured AC ===');
    console.log('Cleaned text:', text.substring(0, 200));
    
    // Split into lines and process
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let currentScenario = null;
    let lastKeyword = null; // Track last keyword for lines without explicit keyword
    
    lines.forEach((line, idx) => {
        // Skip noise lines
        if (line.length < 5 || line.match(/^\d+\.?\s*$/) || line.startsWith('http')) {
            return;
        }
        
        // Remove leading numbers like "1." or "-" or "*"
        let cleanLine = line.replace(/^[\d\.\-\*]+\s*/, '').trim();
        const lineLower = cleanLine.toLowerCase().trim();
        
        // Check for Given/When/Then keywords (including markdown prefixed ones)
        if (lineLower.startsWith('given ') || lineLower === 'given') {
            // Start a new scenario
            if (currentScenario && (currentScenario.given.length > 0 || currentScenario.when.length > 0 || currentScenario.then.length > 0)) {
                scenarios.push(currentScenario);
            }
            currentScenario = { given: [], when: [], then: [] };
            const stepText = cleanLine.replace(/^given\s*/i, '').trim();
            if (stepText) currentScenario.given.push(stepText);
            lastKeyword = 'given';
        } else if (lineLower.startsWith('when ') || lineLower === 'when') {
            if (!currentScenario) currentScenario = { given: [], when: [], then: [] };
            const stepText = cleanLine.replace(/^when\s*/i, '').trim();
            if (stepText) currentScenario.when.push(stepText);
            lastKeyword = 'when';
        } else if (lineLower.startsWith('then ') || lineLower === 'then') {
            if (!currentScenario) currentScenario = { given: [], when: [], then: [] };
            const stepText = cleanLine.replace(/^then\s*/i, '').trim();
            if (stepText) currentScenario.then.push(stepText);
            lastKeyword = 'then';
        } else if (lineLower.startsWith('and ') || lineLower.startsWith('but ')) {
            if (currentScenario && lastKeyword) {
                const stepText = cleanLine.replace(/^(and|but)\s*/i, '').trim();
                if (stepText) {
                    currentScenario[lastKeyword].push(stepText);
                }
            }
        } else if (currentScenario && lastKeyword && cleanLine.length > 3) {
            // Line without keyword - might be continuation of previous step
            // Only add if it looks like a meaningful step text
            if (!cleanLine.match(/^[\d\.\-\*]+$/) && cleanLine.length > 10) {
                // Check if this line looks like a "When" or "Then" based on keywords
                if (lineLower.includes('i click') || lineLower.includes('i press') || 
                    lineLower.includes('i enter') || lineLower.includes('i select') ||
                    lineLower.includes('i view') || lineLower.includes('i am on')) {
                    if (!currentScenario) currentScenario = { given: [], when: [], then: [] };
                    currentScenario.when.push(cleanLine);
                    lastKeyword = 'when';
                } else if (lineLower.includes('i should') || lineLower.includes('should see') || 
                           lineLower.includes('should be') || lineLower.includes('it should') ||
                           lineLower.includes('should display') || lineLower.includes('should trigger')) {
                    if (!currentScenario) currentScenario = { given: [], when: [], then: [] };
                    currentScenario.then.push(cleanLine);
                    lastKeyword = 'then';
                }
            }
        }
    });
    
    // Don't forget the last scenario
    if (currentScenario && (currentScenario.given.length > 0 || currentScenario.when.length > 0 || currentScenario.then.length > 0)) {
        scenarios.push(currentScenario);
    }
    
    console.log(`Parsed ${scenarios.length} structured scenarios`);
    scenarios.forEach((s, i) => {
        console.log(`  Scenario ${i+1}: Given(${s.given.length}), When(${s.when.length}), Then(${s.then.length})`);
    });
    
    return scenarios;
}

/**
 * Helper: Consolidate AC from multiple stories in an Epic
 * Groups similar AC together and tracks their sources
 */
function consolidateEpicAC(acItems) {
    const consolidated = [];
    const processedTexts = new Set();
    
    // First, parse structured AC from each story
    const parsedByStory = {};
    
    acItems.forEach(item => {
        const key = item.sourceKey;
        if (!parsedByStory[key]) {
            parsedByStory[key] = {
                key: key,
                summary: item.sourceSummary,
                scenarios: []
            };
        }
        
        // Parse the AC text for Given/When/Then structure
        const parsed = parseStructuredAC(item.text);
        if (parsed.length > 0) {
            parsedByStory[key].scenarios.push(...parsed);
        } else {
            // If not structured, keep as raw text
            parsedByStory[key].scenarios.push({
                raw: item.text,
                given: [],
                when: [],
                then: []
            });
        }
    });
    
    console.log(`Parsed AC from ${Object.keys(parsedByStory).length} stories`);
    
    // Now consolidate similar scenarios across stories
    const allScenarios = [];
    
    Object.entries(parsedByStory).forEach(([storyKey, storyData]) => {
        storyData.scenarios.forEach(scenario => {
            // Create a signature for the scenario to detect duplicates
            const signature = createScenarioSignature(scenario);
            
            // Check if we already have a similar scenario
            const existing = allScenarios.find(s => {
                const existingSig = createScenarioSignature(s.scenario);
                return calculateSimilarity(signature, existingSig) > 0.7; // 70% similarity threshold
            });
            
            if (existing) {
                // Add this story as another source
                if (!existing.sources.find(s => s.key === storyKey)) {
                    existing.sources.push({ key: storyKey, summary: storyData.summary });
                }
            } else {
                // New unique scenario
                allScenarios.push({
                    scenario: scenario,
                    sources: [{ key: storyKey, summary: storyData.summary }]
                });
            }
        });
    });
    
    console.log(`Consolidated to ${allScenarios.length} unique scenarios`);
    
    // Convert back to AC format for generateScenariosFromAC
    allScenarios.forEach(item => {
        const scenario = item.scenario;
        let text = '';
        
        if (scenario.raw) {
            text = scenario.raw;
        } else {
            // Reconstruct text from Given/When/Then
            if (scenario.given.length > 0) text += scenario.given.map(g => `Given ${g}`).join('\n') + '\n';
            if (scenario.when.length > 0) text += scenario.when.map(w => `When ${w}`).join('\n') + '\n';
            if (scenario.then.length > 0) text += scenario.then.map(t => `Then ${t}`).join('\n');
        }
        
        consolidated.push({
            text: text.trim(),
            sources: item.sources,
            parsedScenario: scenario
        });
    });
    
    return consolidated;
}

/**
 * Helper: Create a signature string for a scenario to compare similarity
 */
function createScenarioSignature(scenario) {
    if (scenario.raw) {
        return scenario.raw.toLowerCase().replace(/[^\w\s]/g, '').trim();
    }
    
    const parts = [
        ...scenario.given,
        ...scenario.when,
        ...scenario.then
    ];
    
    return parts.join(' ').toLowerCase().replace(/[^\w\s]/g, '').trim();
}

/**
 * Helper: Calculate similarity between two scenario signatures
 */
function calculateSimilarity(sig1, sig2) {
    if (!sig1 || !sig2) return 0;
    
    const words1 = sig1.split(/\s+/).filter(w => w.length > 3);
    const words2 = sig2.split(/\s+/).filter(w => w.length > 3);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const commonWords = words1.filter(w => words2.includes(w));
    return commonWords.length / Math.max(words1.length, words2.length);
}

/**
 * Helper: Generate test scenarios from acceptance criteria (AI-Enhanced Logic)
 * Now handles both structured Given/When/Then AC and unstructured text
 * @param {Array} acceptanceCriteria - Array of AC items (strings or objects with text/sources)
 * @param {Object} jiraDetails - Jira issue details
 * @param {Boolean} isEpicFormat - Whether AC is in Epic format with sources
 */
function generateScenariosFromAC(acceptanceCriteria, jiraDetails, isEpicFormat = false) {
    const scenarios = [];
    const summary = (jiraDetails?.summary || '').toLowerCase();
    const jiraKey = jiraDetails?.key || 'Unknown';
    
    // Determine module/feature tags based on summary keywords
    const baseTags = ['@Regression'];
    const moduleTagMap = {
        'login': '@Login', 'auth': '@Login', 'sign in': '@Login', 'sign-in': '@Login',
        'cart': '@Cart', 'basket': '@Cart', 'add to cart': '@Cart',
        'checkout': '@Checkout', 'payment': '@Checkout', 'order': '@Checkout',
        'search': '@Search', 'find': '@Search', 'query': '@Search', 'no results': '@Search', 'suggestion': '@Search',
        'product': '@PDP', 'pdp': '@PDP', 'item detail': '@PDP',
        'listing': '@PLP', 'plp': '@PLP', 'category': '@PLP',
        'account': '@MyAccount', 'profile': '@MyAccount', 'user': '@MyAccount',
        'quarry': '@QuarrySelector', 'location': '@QuarrySelector', 'address': '@QuarrySelector'
    };
    
    // Find matching module tag
    let moduleTag = '@Sanity';
    for (const [keyword, tag] of Object.entries(moduleTagMap)) {
        if (summary.includes(keyword)) {
            moduleTag = tag;
            break;
        }
    }
    baseTags.push(moduleTag);
    
    // Handle Epic format vs Story format
    if (isEpicFormat && acceptanceCriteria.length > 0 && acceptanceCriteria[0].parsedScenario) {
        // Epic format - AC already has parsed scenarios with source info
        console.log(`Processing ${acceptanceCriteria.length} consolidated scenarios from Epic`);
        
        acceptanceCriteria.forEach((acItem, index) => {
            const parsed = acItem.parsedScenario;
            const sources = acItem.sources || [];
            
            // Generate scenario name from the When/Then
            let scenarioName = '';
            if (parsed.when && parsed.when.length > 0) {
                scenarioName = parsed.when[0];
            } else if (parsed.then && parsed.then.length > 0) {
                scenarioName = parsed.then[0];
            } else if (parsed.given && parsed.given.length > 0) {
                scenarioName = parsed.given[0];
            } else if (parsed.raw) {
                scenarioName = parsed.raw.substring(0, 60);
            }
            
            // Clean up scenario name
            scenarioName = scenarioName
                .replace(/^(I|the user|user|system)\s+/gi, '')
                .replace(/[^\w\s-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Capitalize first letter
            scenarioName = scenarioName.charAt(0).toUpperCase() + scenarioName.slice(1);
            
            // Truncate if too long
            if (scenarioName.length > 60) {
                scenarioName = scenarioName.substring(0, 57) + '...';
            }
            
            // Build complete Gherkin steps
            const steps = [];
            
            if (parsed.given) {
                parsed.given.forEach((g, i) => {
                    steps.push({ keyword: i === 0 ? 'Given' : 'And', text: g });
                });
            }
            
            if (parsed.when) {
                parsed.when.forEach((w, i) => {
                    steps.push({ keyword: i === 0 ? 'When' : 'And', text: w });
                });
            }
            
            if (parsed.then) {
                parsed.then.forEach((t, i) => {
                    steps.push({ keyword: i === 0 ? 'Then' : 'And', text: t });
                });
            }
            
            // If no structured steps, create generic ones
            if (steps.length === 0 && parsed.raw) {
                steps.push({ keyword: 'Given', text: 'the user is on the application' });
                steps.push({ keyword: 'When', text: 'the user performs the action' });
                steps.push({ keyword: 'Then', text: parsed.raw });
            }
            
            // Build tags including source story keys
            const scenarioTags = [...baseTags, '@P2', `@${jiraKey}`];
            sources.forEach(source => {
                if (!scenarioTags.includes(`@${source.key}`)) {
                    scenarioTags.push(`@${source.key}`);
                }
            });
            
            scenarios.push({
                name: `Verify ${scenarioName}`,
                description: `Consolidated from: ${sources.map(s => s.key).join(', ')}`,
                tags: scenarioTags,
                steps: steps,
                source: 'epic_consolidated',
                module: moduleTag.replace('@', ''),
                sourceStories: sources // Include source stories for UI display
            });
        });
        
        return scenarios;
    }
    
    // STORY FORMAT: Try to parse structured Given/When/Then AC format
    // Join all AC into single text to parse structured scenarios
    const fullACText = Array.isArray(acceptanceCriteria) 
        ? acceptanceCriteria.map(ac => typeof ac === 'string' ? ac : ac.text).join('\n')
        : acceptanceCriteria;
    const structuredScenarios = parseStructuredAC(fullACText);
    
    console.log(`Found ${structuredScenarios.length} structured scenarios from AC`);
    
    if (structuredScenarios.length > 0) {
        // We have structured Given/When/Then - use them directly!
        structuredScenarios.forEach((parsed, index) => {
            // Generate scenario name from the When/Then
            let scenarioName = '';
            if (parsed.when.length > 0) {
                scenarioName = parsed.when[0];
            } else if (parsed.then.length > 0) {
                scenarioName = parsed.then[0];
            } else if (parsed.given.length > 0) {
                scenarioName = parsed.given[0];
            }
            
            // Clean up scenario name
            scenarioName = scenarioName
                .replace(/^(I|the user|user|system)\s+/gi, '')
                .replace(/[^\w\s-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Capitalize first letter
            scenarioName = scenarioName.charAt(0).toUpperCase() + scenarioName.slice(1);
            
            // Truncate if too long
            if (scenarioName.length > 60) {
                scenarioName = scenarioName.substring(0, 57) + '...';
            }
            
            // Build complete Gherkin steps
            const steps = [];
            
            parsed.given.forEach((g, i) => {
                steps.push({
                    keyword: i === 0 ? 'Given' : 'And',
                    text: g
                });
            });
            
            parsed.when.forEach((w, i) => {
                steps.push({
                    keyword: i === 0 ? 'When' : 'And',
                    text: w
                });
            });
            
            parsed.then.forEach((t, i) => {
                steps.push({
                    keyword: i === 0 ? 'Then' : 'And',
                    text: t
                });
            });
            
            // Determine priority based on content
            const allText = [...parsed.given, ...parsed.when, ...parsed.then].join(' ').toLowerCase();
            let priority = '@P2';
            if (allText.includes('error') || allText.includes('fail') || allText.includes('invalid')) {
                priority = '@P1';
            }
            
            scenarios.push({
                name: `Verify ${scenarioName}`,
                description: `Scenario ${index + 1} from ${jiraKey}`,
                tags: [...baseTags, priority, `@${jiraKey}`],
                steps: steps,
                source: 'structured_ac',
                module: moduleTag.replace('@', '')
            });
        });
        
        return scenarios;
    }
    
    // FALLBACK: If no structured AC found, use the original categorization logic
    console.log('No structured AC found, using categorization logic');
    
    // AI-like scenario categorization
    const scenarioCategories = {
        positive: [],      // Happy path scenarios
        negative: [],      // Error/edge cases
        validation: [],    // Field validations
        navigation: [],    // Navigation/UI flow
        display: [],       // Display/visibility checks
        functional: []     // Core functionality
    };
    
    // Categorize each acceptance criteria
    acceptanceCriteria.forEach((ac) => {
        const acLower = ac.toLowerCase();
        
        if (acLower.includes('error') || acLower.includes('invalid') || acLower.includes('fail') || 
            acLower.includes('no result') || acLower.includes('empty') || acLower.includes('not found')) {
            scenarioCategories.negative.push(ac);
        } else if (acLower.includes('validate') || acLower.includes('required') || acLower.includes('format') ||
                   acLower.includes('length') || acLower.includes('mandatory')) {
            scenarioCategories.validation.push(ac);
        } else if (acLower.includes('navigate') || acLower.includes('redirect') || acLower.includes('click') ||
                   acLower.includes('link') || acLower.includes('button') || acLower.includes('go to')) {
            scenarioCategories.navigation.push(ac);
        } else if (acLower.includes('display') || acLower.includes('show') || acLower.includes('visible') ||
                   acLower.includes('appear') || acLower.includes('see') || acLower.includes('present')) {
            scenarioCategories.display.push(ac);
        } else if (acLower.includes('can') || acLower.includes('able') || acLower.includes('should') ||
                   acLower.includes('must') || acLower.includes('allow')) {
            scenarioCategories.functional.push(ac);
        } else {
            scenarioCategories.positive.push(ac);
        }
    });
    
    // Generate scenarios per category with smart grouping
    const generateScenarioFromAC = (ac, category, index) => {
        // Clean and format scenario name
        let scenarioName = ac
            .replace(/^(given|when|then|and|should|must|can|will|the user|user|system)\s+/gi, '')
            .replace(/[^\w\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Capitalize properly
        scenarioName = scenarioName
            .split(' ')
            .map((word, i) => i === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
            .join(' ');
        
        // Truncate if too long
        if (scenarioName.length > 70) {
            scenarioName = scenarioName.substring(0, 67) + '...';
        }
        
        // Add action prefix based on category
        const prefixMap = {
            positive: 'Verify',
            negative: 'Validate error when',
            validation: 'Verify validation for',
            navigation: 'Verify user can navigate to',
            display: 'Verify display of',
            functional: 'Verify'
        };
        
        const prefix = prefixMap[category] || 'Verify';
        const fullName = `${prefix} ${scenarioName}`;
        
        // Determine priority
        let priority = '@P2';
        const acLower = ac.toLowerCase();
        if (acLower.includes('critical') || acLower.includes('must') || acLower.includes('required') ||
            category === 'negative') {
            priority = '@P1';
        } else if (acLower.includes('optional') || acLower.includes('nice to have') || 
                   acLower.includes('enhancement')) {
            priority = '@P3';
        }
        
        // Generate smart steps based on AC content
        const steps = generateSmartSteps(ac, category, summary);
        
        return {
            name: fullName,
            tags: [...baseTags, priority, `@${jiraKey.replace(/-/g, '')}`],
            steps: steps,
            originalAC: ac,
            category: category
        };
    };
    
    // Process each category
    Object.entries(scenarioCategories).forEach(([category, items]) => {
        items.forEach((ac, index) => {
            scenarios.push(generateScenarioFromAC(ac, category, index));
        });
    });
    
    // If no scenarios generated from categories, create from summary
    if (scenarios.length === 0 && jiraDetails?.summary) {
        scenarios.push({
            name: `Verify ${jiraDetails.summary}`,
            tags: [...baseTags, '@P2'],
            steps: [
                { keyword: 'Given', text: 'the user is on the application' },
                { keyword: 'When', text: 'the user performs the required action' },
                { keyword: 'Then', text: 'the expected outcome should be achieved' }
            ],
            originalAC: jiraDetails.summary,
            category: 'functional'
        });
    }
    
    return scenarios;
}

/**
 * Helper: Generate smart Gherkin steps based on AC content and context
 */
function generateSmartSteps(ac, category, contextSummary) {
    const steps = [];
    const acLower = ac.toLowerCase();
    const context = contextSummary.toLowerCase();
    
    // Determine starting context (Given)
    if (context.includes('search') || acLower.includes('search')) {
        steps.push({ keyword: 'Given', text: 'the user is on the search page' });
    } else if (context.includes('cart') || acLower.includes('cart')) {
        steps.push({ keyword: 'Given', text: 'the user has items in the cart' });
    } else if (context.includes('login') || acLower.includes('login')) {
        steps.push({ keyword: 'Given', text: 'the user is on the login page' });
    } else if (context.includes('checkout')) {
        steps.push({ keyword: 'Given', text: 'the user is on the checkout page' });
    } else if (context.includes('product') || context.includes('pdp')) {
        steps.push({ keyword: 'Given', text: 'the user is on the product detail page' });
    } else {
        steps.push({ keyword: 'Given', text: 'the user is logged in and on the application' });
    }
    
    // Determine action (When) based on category and keywords
    if (category === 'negative') {
        if (acLower.includes('search') || acLower.includes('no result')) {
            steps.push({ keyword: 'When', text: 'the user searches for a non-existent product' });
        } else if (acLower.includes('invalid')) {
            steps.push({ keyword: 'When', text: 'the user enters invalid data' });
        } else if (acLower.includes('empty')) {
            steps.push({ keyword: 'When', text: 'the user submits with empty fields' });
        } else {
            steps.push({ keyword: 'When', text: 'the user performs an invalid action' });
        }
    } else if (category === 'navigation') {
        if (acLower.includes('click')) {
            const buttonMatch = acLower.match(/click(?:s|ing)?\s+(?:on\s+)?(?:the\s+)?["']?(\w+[\w\s]*?)["']?(?:\s+button|\s+link)?/i);
            steps.push({ keyword: 'When', text: `the user clicks on the ${buttonMatch ? buttonMatch[1] : 'specified'} element` });
        } else {
            steps.push({ keyword: 'When', text: 'the user navigates to the target page' });
        }
    } else if (category === 'validation') {
        steps.push({ keyword: 'When', text: 'the user interacts with the form fields' });
    } else if (acLower.includes('enter') || acLower.includes('input') || acLower.includes('type')) {
        steps.push({ keyword: 'When', text: 'the user enters the required information' });
    } else if (acLower.includes('select') || acLower.includes('choose')) {
        steps.push({ keyword: 'When', text: 'the user selects the appropriate option' });
    } else {
        steps.push({ keyword: 'When', text: 'the user performs the specified action' });
    }
    
    // Determine expected outcome (Then) based on category and keywords
    if (category === 'negative') {
        if (acLower.includes('message') || acLower.includes('error')) {
            steps.push({ keyword: 'Then', text: 'an appropriate error message should be displayed' });
        } else if (acLower.includes('no result')) {
            steps.push({ keyword: 'Then', text: 'a "no results found" message should be displayed' });
        } else {
            steps.push({ keyword: 'Then', text: 'the system should handle the error gracefully' });
        }
        steps.push({ keyword: 'And', text: 'the user should be able to recover from the error state' });
    } else if (category === 'display') {
        steps.push({ keyword: 'Then', text: 'the expected content should be visible on the page' });
        if (acLower.includes('format') || acLower.includes('style')) {
            steps.push({ keyword: 'And', text: 'the content should be properly formatted' });
        }
    } else if (category === 'navigation') {
        steps.push({ keyword: 'Then', text: 'the user should be redirected to the correct page' });
        steps.push({ keyword: 'And', text: 'the page content should load successfully' });
    } else if (category === 'validation') {
        steps.push({ keyword: 'Then', text: 'appropriate validation feedback should be shown' });
    } else {
        steps.push({ keyword: 'Then', text: 'the expected outcome should be achieved' });
        if (acLower.includes('success')) {
            steps.push({ keyword: 'And', text: 'a success confirmation should be displayed' });
        }
    }
    
    return steps;
}

/**
 * Helper: Format scenario as Gherkin
 */
function formatScenarioAsGherkin(scenario, jiraKey) {
    const tags = scenario.tags.join(' ');
    let gherkin = `  ${tags}\n`;
    gherkin += `  Scenario: ${scenario.name}\n`;
    gherkin += `    # Source: ${jiraKey}\n`;
    
    scenario.steps.forEach(step => {
        gherkin += `    ${step.keyword} ${step.text}\n`;
    });
    
    return gherkin;
}

/**
 * Get all existing step definitions from step_definitions folder
 */
function getExistingStepDefinitions() {
    const stepsDir = path.join(__dirname, '../Ecomm/features/step_definitions');
    const stepFiles = fs.readdirSync(stepsDir).filter(f => f.endsWith('.js'));
    
    const existingSteps = [];
    
    stepFiles.forEach(file => {
        const content = fs.readFileSync(path.join(stepsDir, file), 'utf8');
        
        // Match Given, When, Then step patterns
        const stepPatterns = [
            /Given\s*\(\s*["'`](.+?)["'`]/g,
            /When\s*\(\s*["'`](.+?)["'`]/g,
            /Then\s*\(\s*["'`](.+?)["'`]/g
        ];
        
        stepPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                existingSteps.push({
                    pattern: match[1],
                    file: file,
                    regex: stepPatternToRegex(match[1])
                });
            }
        });
    });
    
    return existingSteps;
}

/**
 * Convert Cucumber step pattern to regex for matching
 */
function stepPatternToRegex(pattern) {
    // Replace {string}, {int}, {word} placeholders with regex patterns
    let regex = pattern
        .replace(/\{string\}/g, '"[^"]*"')
        .replace(/\{int\}/g, '\\d+')
        .replace(/\{word\}/g, '\\w+')
        .replace(/\{float\}/g, '[\\d.]+')
        .replace(/[.*+?^${}()|[\]\\]/g, (match) => {
            // Don't escape our placeholder replacements
            if (match === '"' || match === '[' || match === ']' || match === '*' || match === '+' || match === '\\') {
                return match;
            }
            return '\\' + match;
        });
    
    return new RegExp('^' + regex + '$', 'i');
}

/**
 * Check if a step matches existing step definitions
 */
function findMatchingStepDefinition(stepText, existingSteps) {
    for (const step of existingSteps) {
        if (step.regex.test(stepText)) {
            return step;
        }
    }
    return null;
}

/**
 * API: Get existing step definitions
 */
app.get('/api/ai/step-definitions', (req, res) => {
    try {
        const existingSteps = getExistingStepDefinitions();
        res.json({
            success: true,
            count: existingSteps.length,
            steps: existingSteps.map(s => ({
                pattern: s.pattern,
                file: s.file
            }))
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

/**
 * API: Check which steps need new definitions
 */
app.post('/api/ai/check-step-definitions', (req, res) => {
    const { scenarios } = req.body;
    
    try {
        const existingSteps = getExistingStepDefinitions();
        const missingSteps = [];
        const foundSteps = [];
        
        scenarios.forEach(scenario => {
            scenario.steps.forEach(step => {
                const match = findMatchingStepDefinition(step.text, existingSteps);
                if (match) {
                    foundSteps.push({
                        step: `${step.keyword} ${step.text}`,
                        matchedPattern: match.pattern,
                        file: match.file
                    });
                } else {
                    // Check if not already in missing list
                    const key = `${step.keyword} ${step.text}`;
                    if (!missingSteps.find(m => m.step === key)) {
                        missingSteps.push({
                            step: key,
                            keyword: step.keyword,
                            text: step.text
                        });
                    }
                }
            });
        });
        
        res.json({
            success: true,
            totalSteps: foundSteps.length + missingSteps.length,
            existingCount: foundSteps.length,
            missingCount: missingSteps.length,
            foundSteps,
            missingSteps
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

/**
 * API: Generate step definition code for missing steps
 */
app.post('/api/ai/generate-step-definitions', (req, res) => {
    const { missingSteps, moduleName } = req.body;
    
    try {
        // Generate step definition code
        const stepDefCode = generateStepDefinitionCode(missingSteps, moduleName);
        
        res.json({
            success: true,
            code: stepDefCode,
            fileName: `${moduleName.toLowerCase()}Steps.js`
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

/**
 * API: Save generated step definitions to file
 */
app.post('/api/ai/save-step-definitions', (req, res) => {
    const { code, fileName, appendToExisting } = req.body;
    
    try {
        const stepsDir = path.join(__dirname, '../Ecomm/features/step_definitions');
        const filePath = path.join(stepsDir, fileName);
        
        if (appendToExisting && fs.existsSync(filePath)) {
            // Append to existing file
            let existingContent = fs.readFileSync(filePath, 'utf8');
            
            // Add separator comment
            const separator = `\n\n// ========== AI Generated Steps - ${new Date().toISOString()} ==========\n\n`;
            existingContent += separator + code;
            
            fs.writeFileSync(filePath, existingContent);
            
            res.json({
                success: true,
                message: `Appended step definitions to ${fileName}`,
                filePath: `Ecomm/features/step_definitions/${fileName}`
            });
        } else {
            // Create new file or overwrite
            const fullCode = generateStepDefinitionFile(code, fileName);
            fs.writeFileSync(filePath, fullCode);
            
            res.json({
                success: true,
                message: `Created step definitions file: ${fileName}`,
                filePath: `Ecomm/features/step_definitions/${fileName}`
            });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

/**
 * Generate step definition code for missing steps
 */
function generateStepDefinitionCode(missingSteps, moduleName) {
    const pageObjectName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 'Page';
    
    let code = '';
    
    missingSteps.forEach(step => {
        const { keyword, text } = step;
        
        // Extract parameters from step text
        const params = [];
        let paramIndex = 0;
        let stepPattern = text.replace(/"([^"]+)"/g, () => {
            params.push(`param${++paramIndex}`);
            return '{string}';
        });
        
        // Also check for numbers
        stepPattern = stepPattern.replace(/\b(\d+)\b/g, () => {
            params.push(`num${++paramIndex}`);
            return '{int}';
        });
        
        const paramList = params.length > 0 ? params.join(', ') : '';
        const asyncParams = params.length > 0 ? `${paramList}` : '';
        
        code += `${keyword}("${stepPattern}", async function(${asyncParams}) {\n`;
        code += `    // TODO: Implement step\n`;
        code += `    // Page Object: ${pageObjectName}\n`;
        
        // Generate implementation hints based on keywords
        if (text.toLowerCase().includes('click') || text.toLowerCase().includes('select')) {
            code += `    // await this.page.click('selector');\n`;
        } else if (text.toLowerCase().includes('enter') || text.toLowerCase().includes('type') || text.toLowerCase().includes('input')) {
            code += `    // await this.page.fill('selector', ${params[0] || "'value'"});\n`;
        } else if (text.toLowerCase().includes('should see') || text.toLowerCase().includes('should be displayed') || text.toLowerCase().includes('verify')) {
            code += `    // const element = await this.page.locator('selector');\n`;
            code += `    // await expect(element).toBeVisible();\n`;
        } else if (text.toLowerCase().includes('navigate') || text.toLowerCase().includes('go to')) {
            code += `    // await this.page.goto('url');\n`;
        } else if (text.toLowerCase().includes('wait')) {
            code += `    // await this.page.waitForTimeout(1000);\n`;
        }
        
        code += `    console.log('Step: ${keyword} ${text}');\n`;
        code += `});\n\n`;
    });
    
    return code;
}

/**
 * Generate full step definition file with imports
 */
function generateStepDefinitionFile(stepCode, fileName) {
    const moduleName = fileName.replace('Steps.js', '').replace(/^\w/, c => c.toUpperCase());
    const pageObjectName = moduleName + 'Page';
    
    return `// ============================================================================
// ${moduleName} Step Definitions
// ============================================================================
// Generated by AI Feature Generator
// Created: ${new Date().toISOString()}
// ============================================================================

const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
// const ${pageObjectName} = require('../../../pageobjects/${pageObjectName}');

// let ${moduleName.toLowerCase()}Page;

// Reset page object before each scenario
Before(function() {
    // ${moduleName.toLowerCase()}Page = null;
});

${stepCode}
`;
}

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   🚀 Vulcan Test Dashboard Server                    ║
║                                                       ║
║   Server running on: http://localhost:${PORT}        ║
║   API Docs: http://localhost:${PORT}/api/modules     ║
║                                                       ║
║   Jira Integration: ✓ Enabled                        ║
║   Real-time Logs: ✓ SSE Stream                       ║
║   Module Discovery: ✓ Auto-scan                      ║
╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
