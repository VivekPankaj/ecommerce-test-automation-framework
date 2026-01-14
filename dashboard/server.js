/**
 * Vulcan E-Commerce Test Dashboard - Backend Server
 * Express.js server with Jira integration and real-time test execution
 */

require('dotenv').config();
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
        
        modules.forEach(module => {
            // Count issues matching module keywords
            const keywords = [
                module.name.toLowerCase(),
                module.id.toLowerCase()
            ];
            
            const matchingIssues = issues.filter(issue => {
                const summary = issue.fields.summary.toLowerCase();
                const description = issue.fields.description?.toLowerCase() || '';
                return keywords.some(kw => summary.includes(kw) || description.includes(kw));
            });
            
            module.jiraStoryCount = matchingIssues.length;
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
        moduleTagsMap[m.id] = m.tags && m.tags.length > 0 ? m.tags[0] : `@${m.id.charAt(0).toUpperCase() + m.id.slice(1)}`;
    });
    
    // Build tag expression
    let tags;
    if (customTags) {
        // If custom tags provided (priority/regression/sanity), combine with module tags
        const moduleTags = modules.map(m => moduleTagsMap[m] || `@${m.charAt(0).toUpperCase() + m.slice(1)}`).join(' or ');
        // Combine: (module tags) AND (custom tags)
        tags = `(${moduleTags}) and (${customTags})`;
    } else {
        // Default to module-based tags only
        tags = modules.map(m => moduleTagsMap[m] || `@${m.charAt(0).toUpperCase() + m.slice(1)}`).join(' or ');
    }
    
    // Start test execution
    const cucumberArgs = [
        'cucumber-js',
        '--config', '.cucumber.json',
        '--tags', tags,
        '--format', 'json:test_results.json',
        '--format', 'progress'
    ];
    
    const testProcess = spawn('npx', cucumberArgs, {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, HEADLESS: headless ? 'true' : 'false' }
    });
    
    // Store execution info
    activeExecutions.set(executionId, {
        process: testProcess,
        startTime: new Date(),
        modules,
        selectedScenarios,
        tags,
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
        logsCount: execution.logs.length
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
        execution.process.kill('SIGTERM');
        execution.status = 'stopped';
        execution.endTime = new Date();
        
        res.json({ message: 'Execution stopped successfully' });
    } else {
        res.json({ message: 'Execution already completed' });
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
