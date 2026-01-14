const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

// Generate the dashboard HTML
function generateDashboard() {
    let resultsData = [];
    let priorityData = {};
    
    // Read test results if available
    const resultsPath = path.join(__dirname, 'test_results.json');
    if (fs.existsSync(resultsPath)) {
        try {
            const content = fs.readFileSync(resultsPath, 'utf8');
            if (content.trim()) {
                resultsData = JSON.parse(content);
            }
        } catch (e) {
            console.log('Could not parse test_results.json:', e.message);
        }
    }
    
    // Analyze priority tags from feature files
    const featuresDir = path.join(__dirname, 'Ecomm', 'features');
    const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));
    
    let grandTotal = 0, grandP1 = 0, grandP2 = 0, grandP3 = 0, grandUntagged = 0;
    const moduleStats = {};
    
    featureFiles.forEach(file => {
        const filePath = path.join(featuresDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const moduleName = file.replace('.feature', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        moduleStats[moduleName] = { total: 0, p1: 0, p2: 0, p3: 0, untagged: 0, scenarios: [] };
        
        let currentTags = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('@')) {
                currentTags.push(...line.split(' ').filter(t => t.startsWith('@')));
            } else if (line.startsWith('Scenario:')) {
                const scenarioName = line.replace('Scenario:', '').trim();
                moduleStats[moduleName].total++;
                grandTotal++;
                
                const hasP1 = currentTags.some(t => t === '@P1');
                const hasP2 = currentTags.some(t => t === '@P2');
                const hasP3 = currentTags.some(t => t === '@P3');
                
                let priority = 'Untagged';
                if (hasP1) { moduleStats[moduleName].p1++; grandP1++; priority = 'P1'; }
                else if (hasP2) { moduleStats[moduleName].p2++; grandP2++; priority = 'P2'; }
                else if (hasP3) { moduleStats[moduleName].p3++; grandP3++; priority = 'P3'; }
                else { moduleStats[moduleName].untagged++; grandUntagged++; }
                
                moduleStats[moduleName].scenarios.push({ name: scenarioName, priority, tags: currentTags.join(' ') });
                currentTags = [];
            } else if (!line || line.startsWith('Feature:') || line.startsWith('#')) {
                currentTags = [];
            }
        }
    });
    
    // Process test results
    let totalScenarios = 0, passedScenarios = 0, failedScenarios = 0;
    let totalSteps = 0, passedSteps = 0, failedSteps = 0, skippedSteps = 0;
    const scenarioResults = [];
    
    resultsData.forEach(feature => {
        (feature.elements || []).forEach(scenario => {
            if (scenario.type === 'scenario' || scenario.keyword === 'Scenario') {
                totalScenarios++;
                let failed = false;
                const steps = [];
                
                (scenario.steps || []).forEach(step => {
                    if (!step.hidden) {
                        totalSteps++;
                        const status = step.result?.status || 'unknown';
                        if (status === 'passed') passedSteps++;
                        else if (status === 'failed') { failedSteps++; failed = true; }
                        else if (status === 'skipped') skippedSteps++;
                        
                        steps.push({
                            keyword: step.keyword?.trim() || '',
                            name: step.name || '',
                            status: status,
                            error: step.result?.error_message?.substring(0, 300) || ''
                        });
                    }
                });
                
                if (failed) failedScenarios++;
                else if (steps.some(s => s.status === 'passed')) passedScenarios++;
                
                scenarioResults.push({
                    feature: feature.name || 'Unknown',
                    name: scenario.name || 'Unknown',
                    status: failed ? 'failed' : 'passed',
                    steps: steps
                });
            }
        });
    });
    
    const passRate = totalScenarios > 0 ? ((passedScenarios / totalScenarios) * 100).toFixed(1) : 0;
    
    // Build module cards HTML
    let moduleCardsHtml = '';
    for (const [name, stats] of Object.entries(moduleStats)) {
        if (stats.total === 0) continue;
        const sum = stats.p1 + stats.p2 + stats.p3 + stats.untagged;
        const match = sum === stats.total;
        moduleCardsHtml += `
            <div class="module-card">
                <div class="module-header">
                    <span class="module-name">${name}</span>
                    <span class="module-total">${stats.total} scenarios</span>
                </div>
                <div class="priority-breakdown">
                    <span class="priority p1">P1: ${stats.p1}</span>
                    <span class="priority p2">P2: ${stats.p2}</span>
                    <span class="priority p3">P3: ${stats.p3}</span>
                    ${stats.untagged > 0 ? `<span class="priority untagged">Untagged: ${stats.untagged}</span>` : ''}
                </div>
                <div class="count-status ${match ? 'match' : 'mismatch'}">
                    ${match ? '✅ Count matches' : '⚠️ Mismatch detected'}
                </div>
            </div>
        `;
    }
    
    // Build scenario results HTML
    let scenarioResultsHtml = '';
    scenarioResults.forEach((s, idx) => {
        const stepsHtml = s.steps.map(step => `
            <div class="step ${step.status}">
                <span class="step-icon">${step.status === 'passed' ? '✅' : step.status === 'failed' ? '❌' : '⏭️'}</span>
                <span class="step-keyword">${step.keyword}</span>
                <span class="step-name">${step.name}</span>
                ${step.error ? `<div class="step-error">${step.error}</div>` : ''}
            </div>
        `).join('');
        
        scenarioResultsHtml += `
            <div class="scenario-card ${s.status}" onclick="toggleSteps(${idx})">
                <div class="scenario-header">
                    <span class="scenario-status ${s.status}">${s.status === 'passed' ? '✅ PASS' : '❌ FAIL'}</span>
                    <span class="scenario-name">${s.name}</span>
                    <span class="scenario-feature">${s.feature}</span>
                </div>
                <div class="scenario-steps" id="steps-${idx}" style="display: none;">
                    ${stepsHtml}
                </div>
            </div>
        `;
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="30">
    <title>Vulcan E-Commerce Test Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        .header {
            background: #003366;
            color: white;
            padding: 20px 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header h1 { font-size: 1.8em; }
        .header .logo { height: 50px; }
        .header .refresh-info { font-size: 0.9em; opacity: 0.8; }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card .number { font-size: 2.5em; font-weight: bold; }
        .stat-card .label { color: #666; margin-top: 5px; }
        .stat-card.passed .number { color: #28a745; }
        .stat-card.failed .number { color: #dc3545; }
        .stat-card.total .number { color: #003366; }
        
        .section { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .section h2 { color: #003366; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #003366; }
        
        .module-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .module-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #003366; }
        .module-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .module-name { font-weight: bold; }
        .module-total { color: #666; }
        .priority-breakdown { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
        .priority { padding: 3px 8px; border-radius: 4px; font-size: 0.85em; }
        .priority.p1 { background: #dc3545; color: white; }
        .priority.p2 { background: #ffc107; color: #333; }
        .priority.p3 { background: #17a2b8; color: white; }
        .priority.untagged { background: #6c757d; color: white; }
        .count-status { font-size: 0.9em; }
        .count-status.match { color: #28a745; }
        .count-status.mismatch { color: #dc3545; }
        
        .scenario-card { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .scenario-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .scenario-card.passed { border-left: 4px solid #28a745; }
        .scenario-card.failed { border-left: 4px solid #dc3545; }
        .scenario-header { display: flex; align-items: center; gap: 15px; }
        .scenario-status { padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.85em; }
        .scenario-status.passed { background: #d4edda; color: #155724; }
        .scenario-status.failed { background: #f8d7da; color: #721c24; }
        .scenario-name { flex: 1; font-weight: 500; }
        .scenario-feature { color: #666; font-size: 0.9em; }
        
        .scenario-steps { margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6; }
        .step { padding: 8px 12px; margin: 5px 0; background: white; border-radius: 4px; display: flex; align-items: flex-start; gap: 10px; }
        .step.passed { border-left: 3px solid #28a745; }
        .step.failed { border-left: 3px solid #dc3545; }
        .step.skipped { border-left: 3px solid #ffc107; opacity: 0.7; }
        .step-keyword { font-weight: bold; color: #003366; min-width: 60px; }
        .step-name { flex: 1; }
        .step-error { color: #dc3545; font-family: monospace; font-size: 0.85em; margin-top: 5px; padding: 8px; background: #fff5f5; border-radius: 4px; }
        
        .summary-bar { display: flex; height: 30px; border-radius: 15px; overflow: hidden; margin: 10px 0; }
        .summary-bar .passed { background: #28a745; }
        .summary-bar .failed { background: #dc3545; }
        .summary-bar span { display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em; }
        
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Vulcan E-Commerce Test Dashboard</h1>
            <div class="refresh-info">Auto-refreshes every 30 seconds | Last updated: ${new Date().toLocaleString()}</div>
        </div>
        <div style="font-size: 2em;">🏗️</div>
    </div>
    
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card total">
                <div class="number">${grandTotal}</div>
                <div class="label">Total Test Cases</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #dc3545;">
                <div class="number" style="color: #dc3545;">${grandP1}</div>
                <div class="label">P1 - Critical</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #ffc107;">
                <div class="number" style="color: #ffc107;">${grandP2}</div>
                <div class="label">P2 - High</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #17a2b8;">
                <div class="number" style="color: #17a2b8;">${grandP3}</div>
                <div class="label">P3 - Medium</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 Last Execution Results</h2>
            <div class="stats-grid">
                <div class="stat-card total">
                    <div class="number">${totalScenarios}</div>
                    <div class="label">Scenarios Run</div>
                </div>
                <div class="stat-card passed">
                    <div class="number">${passedScenarios}</div>
                    <div class="label">Passed</div>
                </div>
                <div class="stat-card failed">
                    <div class="number">${failedScenarios}</div>
                    <div class="label">Failed</div>
                </div>
                <div class="stat-card">
                    <div class="number">${passRate}%</div>
                    <div class="label">Pass Rate</div>
                </div>
            </div>
            ${totalScenarios > 0 ? `
            <div class="summary-bar">
                <span class="passed" style="width: ${passRate}%">${passedScenarios} passed</span>
                <span class="failed" style="width: ${100 - passRate}%">${failedScenarios} failed</span>
            </div>
            ` : '<p style="text-align: center; color: #666;">No test results available. Run tests to see results.</p>'}
        </div>
        
        <div class="section">
            <h2>📁 Module Breakdown</h2>
            <div class="module-grid">
                ${moduleCardsHtml}
            </div>
        </div>
        
        ${scenarioResults.length > 0 ? `
        <div class="section">
            <h2>📋 Scenario Details (Click to expand steps)</h2>
            ${scenarioResultsHtml}
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <p>Vulcan Materials Company - E-Commerce Storefront Automation</p>
        <p>Framework: Playwright + Cucumber.js</p>
    </div>
    
    <script>
        function toggleSteps(idx) {
            const el = document.getElementById('steps-' + idx);
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    </script>
</body>
</html>
    `;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/dashboard') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(generateDashboard());
    } else if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'running', timestamp: new Date().toISOString() }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 VULCAN TEST DASHBOARD SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`\n📊 Dashboard URL: http://localhost:${PORT}/`);
    console.log(`📡 API Status:    http://localhost:${PORT}/api/status`);
    console.log('\n💡 The dashboard auto-refreshes every 30 seconds');
    console.log('💡 Press Ctrl+C to stop the server\n');
    console.log('='.repeat(60) + '\n');
});
