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
