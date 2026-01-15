const fs = require('fs');
const path = require('path');

// Read the JSON results
const resultsPath = path.join(__dirname, 'test_results.json');
const resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// Initialize counters
let totalScenarios = 0;
let passedScenarios = 0;
let failedScenarios = 0;
let totalSteps = 0;
let passedSteps = 0;
let failedSteps = 0;
let skippedSteps = 0;
let totalDuration = 0;

const failedScenariosList = [];
const passedScenariosList = [];
const allScenarios = [];
const moduleStats = {}; // Track stats by module/feature

// Helper function to extract module name from feature name
function getModuleName(featureName) {
    if (!featureName) return 'Unknown Module';
    
    // Map feature names to cleaner module names
    const moduleMap = {
        'Add to Cart Functionality': 'Add to Cart',
        'Search Functionality Validation': 'Search',
        'Product Display Page (PDP) Validation': 'PDP',
        'Product Listing Page (PLP) Validation': 'PLP',
        'Quarry Address Selector Modal Validation': 'Quarry Selector',
        'Login Page Validation': 'Login',
        'My Account Validation': 'My Account',
        'Checkout Flow': 'Checkout',
        'Update My Profile Information': 'My Profile',
        'Inspect Cart Structure': 'Cart Inspection'
    };
    
    return moduleMap[featureName] || featureName;
}

// Process each feature
resultsData.forEach(feature => {
    const featureName = feature.name || 'Unknown Feature';
    const moduleName = getModuleName(featureName);
    
    // Initialize module stats
    if (!moduleStats[moduleName]) {
        moduleStats[moduleName] = {
            fullName: featureName,
            total: 0,
            passed: 0,
            failed: 0,
            scenarios: [],
            duration: 0
        };
    }
    
    feature.elements.forEach(scenario => {
        if (scenario.type === 'scenario') {
            totalScenarios++;
            
            let scenarioFailed = false;
            let scenarioPassed = true;
            const failedStepsInScenario = [];
            const allStepsInScenario = [];
            let screenshotPath = null;
            let scenarioDuration = 0;
            
            scenario.steps.forEach(step => {
                // Skip hidden steps (hooks)
                if (step.hidden) {
                    return;
                }
                
                totalSteps++;
                
                const stepInfo = {
                    keyword: step.keyword,
                    name: step.name,
                    status: step.result.status,
                    error: step.result.error_message,
                    duration: step.result.duration
                };
                
                allStepsInScenario.push(stepInfo);
                
                // Add step duration to total
                if (step.result.duration) {
                    totalDuration += step.result.duration;
                    scenarioDuration += step.result.duration;
                }
                
                if (step.result.status === 'passed') {
                    passedSteps++;
                } else if (step.result.status === 'failed') {
                    failedSteps++;
                    scenarioFailed = true;
                    scenarioPassed = false;
                    failedStepsInScenario.push(stepInfo);
                    
                    // Check for screenshot attachment
                    if (step.embeddings && step.embeddings.length > 0) {
                        step.embeddings.forEach(embedding => {
                            if (embedding.mime_type === 'image/png') {
                                screenshotPath = `data:${embedding.mime_type};base64,${embedding.data}`;
                            }
                        });
                    }
                } else if (step.result.status === 'skipped') {
                    skippedSteps++;
                    scenarioPassed = false;
                } else if (step.result.status === 'undefined') {
                    scenarioPassed = false;
                }
            });
            
            const scenarioData = {
                feature: featureName,
                module: moduleName,
                scenario: scenario.name,
                line: scenario.line,
                status: scenarioFailed ? 'failed' : (scenarioPassed ? 'passed' : 'skipped'),
                steps: allStepsInScenario,
                failedSteps: failedStepsInScenario,
                screenshot: screenshotPath,
                duration: scenarioDuration
            };
            
            allScenarios.push(scenarioData);
            
            // Add to module stats
            moduleStats[moduleName].total++;
            moduleStats[moduleName].scenarios.push(scenarioData);
            moduleStats[moduleName].duration += scenarioDuration;
            
            if (scenarioFailed) {
                failedScenarios++;
                failedScenariosList.push(scenarioData);
                moduleStats[moduleName].failed++;
            } else if (scenarioPassed) {
                passedScenarios++;
                passedScenariosList.push(scenarioData);
                moduleStats[moduleName].passed++;
            }
        }
    });
});

// Calculate percentages
const passRate = ((passedScenarios / totalScenarios) * 100).toFixed(1);
const failRate = ((failedScenarios / totalScenarios) * 100).toFixed(1);

// Convert duration from nanoseconds to human readable format
function formatDuration(nanoseconds) {
    const seconds = nanoseconds / 1000000000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

const executionTime = formatDuration(totalDuration);
const executionTimeSeconds = (totalDuration / 1000000000).toFixed(2);

// Generate module summary HTML
function generateModuleSummary() {
    const modules = Object.keys(moduleStats).sort();
    
    // Calculate totals
    let totalScenarios = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;
    
    const tableRows = modules.map(moduleName => {
        const stats = moduleStats[moduleName];
        const passPercent = ((stats.passed / stats.total) * 100).toFixed(1);
        const failPercent = ((stats.failed / stats.total) * 100).toFixed(1);
        const statusIcon = stats.failed > 0 ? '❌' : '✅';
        const statusClass = stats.failed > 0 ? 'status-failed' : 'status-passed';
        const moduleTime = formatDuration(stats.duration);
        
        // Accumulate totals
        totalScenarios += stats.total;
        totalPassed += stats.passed;
        totalFailed += stats.failed;
        totalDuration += stats.duration;
        
        return `
        <tr class="module-row ${statusClass}" onclick="scrollToModule('${moduleName}')">
            <td class="module-name-cell">📦 ${moduleName}</td>
            <td class="status-cell">${statusIcon}</td>
            <td class="numeric-cell">${stats.total}</td>
            <td class="numeric-cell passed-text">${stats.passed}</td>
            <td class="numeric-cell failed-text">${stats.failed}</td>
            <td class="numeric-cell">${passPercent}%</td>
            <td class="time-cell">${moduleTime}</td>
            <td class="progress-cell">
                <div class="progress-bar-mini">
                    <div class="progress-fill passed" style="width: ${passPercent}%"></div>
                    <div class="progress-fill failed" style="width: ${failPercent}%"></div>
                </div>
            </td>
        </tr>
        `;
    }).join('');
    
    // Calculate overall pass rate
    const overallPassRate = ((totalPassed / totalScenarios) * 100).toFixed(1);
    const overallFailRate = ((totalFailed / totalScenarios) * 100).toFixed(1);
    const totalTime = formatDuration(totalDuration);
    const overallStatus = totalFailed > 0 ? '❌' : '✅';
    
    return `
    <table class="module-summary-table">
        <thead>
            <tr>
                <th>Module</th>
                <th>Status</th>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Pass Rate</th>
                <th>Time</th>
                <th>Progress</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
        <tfoot>
            <tr class="totals-row">
                <td class="module-name-cell"><strong>📊 TOTAL</strong></td>
                <td class="status-cell">${overallStatus}</td>
                <td class="numeric-cell"><strong>${totalScenarios}</strong></td>
                <td class="numeric-cell passed-text"><strong>${totalPassed}</strong></td>
                <td class="numeric-cell failed-text"><strong>${totalFailed}</strong></td>
                <td class="numeric-cell"><strong>${overallPassRate}%</strong></td>
                <td class="time-cell"><strong>${totalTime}</strong></td>
                <td class="progress-cell">
                    <div class="progress-bar-mini">
                        <div class="progress-fill passed" style="width: ${overallPassRate}%"></div>
                        <div class="progress-fill failed" style="width: ${overallFailRate}%"></div>
                    </div>
                </td>
            </tr>
        </tfoot>
    </table>
    `;
}

// Generate module details HTML
function generateModuleDetails() {
    const modules = Object.keys(moduleStats).sort();
    
    return modules.map(moduleName => {
        const stats = moduleStats[moduleName];
        
        const scenariosHTML = stats.scenarios.map((scenario, index) => {
            const scenarioId = `${moduleName.replace(/\s+/g, '-')}-${index}`;
            const statusClass = scenario.status === 'failed' ? 'failed' : 'passed';
            
            return `
            <li class="scenario-item ${statusClass}" onclick="toggleSteps('${scenarioId}')">
                <div class="scenario-header">
                    <div class="scenario-name">
                        <span class="expand-icon">▶</span>
                        ${scenario.scenario}
                        <span class="badge ${statusClass}">${scenario.status.toUpperCase()}</span>
                    </div>
                    ${scenario.screenshot ? `<a href="#" class="screenshot-link" onclick="event.stopPropagation(); openScreenshot('${scenarioId}'); return false;">📸 Screenshot</a>` : ''}
                </div>
                <div class="scenario-meta">Line: ${scenario.line} | Steps: ${scenario.steps.length}</div>
                <div id="${scenarioId}" class="steps-container">
                    <strong>Test Steps:</strong>
                    ${scenario.steps.map(step => {
                        let statusIcon = step.status === 'passed' ? '✓' : step.status === 'failed' ? '✗' : '⊘';
                        let statusText = step.status === 'passed' ? 'PASSED' : step.status === 'failed' ? 'FAILED' : 'SKIPPED';
                        return `
                        <div class="step-item ${step.status}">
                            <span class="step-status ${step.status}">${statusIcon} ${statusText}</span>
                            <span class="step-keyword">${step.keyword}</span>${step.name}
                            ${step.status === 'failed' && step.error ? `
                                <div class="error-message">${step.error.substring(0, 300)}${step.error.length > 300 ? '...' : ''}</div>
                            ` : ''}
                        </div>
                    `}).join('')}
                </div>
                ${scenario.screenshot ? `
                    <div id="screenshot-${scenarioId}" class="screenshot-container">
                        <img src="${scenario.screenshot}" alt="Failed step screenshot"/>
                    </div>
                ` : ''}
            </li>
            `;
        }).join('');
        
        return `
        <div class="module-section" id="module-${moduleName.replace(/\s+/g, '-')}">
            <h2 class="module-section-title">
                ${stats.failed > 0 ? '❌' : '✅'} ${moduleName}
                <span class="module-summary">(${stats.passed}/${stats.total} passed • ⏱️ ${formatDuration(stats.duration)})</span>
            </h2>
            <ul class="scenario-list">
                ${scenariosHTML}
            </ul>
        </div>
        `;
    }).join('');
}

// Generate HTML Report
const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Vulcan E-Commerce Test Execution Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #003087;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: #003087;
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #0066CC;
        }
        .header .logo {
            max-width: 250px;
            height: auto;
            filter: brightness(0) invert(1);
            margin-bottom: 20px;
        }
        .header h1 { font-size: 2.2em; margin-bottom: 10px; font-weight: 600; }
        .header h2 { font-size: 1.5em; margin-bottom: 15px; font-weight: 400; color: #E0E0E0; }
        .timestamp { color: #999; font-size: 0.9em; margin-top: 5px; }
        
        .export-buttons {
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            text-align: right;
        }
        .export-btn {
            background: #003087;
            color: white;
            padding: 10px 25px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            margin-left: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,48,135,0.2);
        }
        .export-btn:hover {
            background: #0066CC;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,48,135,0.3);
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #003087;
            transition: transform 0.2s ease;
        }
        .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,48,135,0.2);
        }
        .stat-card h3 {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .stat-card .number {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
        }
        .stat-card.passed { border-left-color: #28a745; }
        .stat-card.passed .number { color: #28a745; }
        .stat-card.failed { border-left-color: #dc3545; }
        .stat-card.failed .number { color: #dc3545; }
        .stat-card.total { border-left-color: #003087; }
        .stat-card.total .number { color: #003087; }
        
        .executive-summary {
            padding: 30px;
            background: white;
        }
        .executive-summary h2 {
            color: #003087;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #003087;
            font-weight: 600;
        }
        
        /* Table-based Module Summary */
        .module-summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .module-summary-table thead {
            background: #003087;
            color: white;
        }
        .module-summary-table th {
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 0.95em;
        }
        .module-summary-table th:nth-child(2),
        .module-summary-table th:nth-child(3),
        .module-summary-table th:nth-child(4),
        .module-summary-table th:nth-child(5),
        .module-summary-table th:nth-child(6) {
            text-align: center;
        }
        .module-summary-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .module-summary-table tbody tr:hover {
            background: #f8f9fa;
            transform: scale(1.01);
        }
        .module-summary-table tbody tr.status-passed {
            border-left: 4px solid #28a745;
        }
        .module-summary-table tbody tr.status-failed {
            border-left: 4px solid #dc3545;
        }
        .module-summary-table td {
            padding: 12px 15px;
            font-size: 0.9em;
        }
        .module-name-cell {
            font-weight: 600;
            color: #003087;
            min-width: 180px;
        }
        .status-cell {
            text-align: center;
            font-size: 1.3em;
        }
        .numeric-cell {
            text-align: center;
            font-weight: 500;
        }
        .passed-text {
            color: #28a745;
        }
        .failed-text {
            color: #dc3545;
        }
        .time-cell {
            text-align: center;
            color: #666;
            font-family: 'Courier New', monospace;
        }
        .progress-cell {
            width: 150px;
            padding: 12px 20px;
        }
        .progress-bar-mini {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
        }
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        .progress-fill.passed { background: #28a745; }
        .progress-fill.failed { background: #dc3545; }
        
        /* Totals Footer Row */
        .module-summary-table tfoot {
            background: #f8f9fa;
            border-top: 3px solid #003087;
        }
        .module-summary-table tfoot tr.totals-row {
            font-weight: 700;
            font-size: 1.05em;
            cursor: default;
        }
        .module-summary-table tfoot tr.totals-row:hover {
            background: #f8f9fa;
            transform: none;
        }
        .module-summary-table tfoot td {
            padding: 15px;
            color: #003087;
        }
        
        .module-section {
            padding: 30px;
            border-top: 2px solid #e0e0e0;
        }
        .module-section-title {
            color: #003087;
            margin-bottom: 20px;
            font-size: 1.8em;
            font-weight: 600;
        }
        .module-summary {
            font-size: 0.7em;
            color: #666;
            font-weight: 400;
        }
        
        .scenario-list {
            list-style: none;
        }
        .scenario-item {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #28a745;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .scenario-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .scenario-item.failed {
            border-left-color: #dc3545;
            background: #fff5f5;
        }
        .scenario-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .scenario-name {
            font-weight: bold;
            color: #333;
            flex: 1;
        }
        .scenario-meta {
            color: #666;
            font-size: 0.85em;
            margin-top: 5px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: bold;
            margin-left: 10px;
        }
        .badge.passed { background: #d4edda; color: #155724; }
        .badge.failed { background: #f8d7da; color: #721c24; }
        
        .screenshot-link {
            background: #003087;
            color: white;
            padding: 6px 15px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 0.85em;
            margin-left: 10px;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        .screenshot-link:hover {
            background: #0066CC;
            transform: scale(1.05);
        }
        
        .steps-container {
            display: none;
            margin-top: 15px;
            padding: 15px;
            background: white;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }
        .steps-container.expanded {
            display: block;
        }
        .step-item {
            padding: 10px;
            margin: 5px 0;
            border-left: 3px solid #ddd;
            background: #f8f9fa;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .step-item.passed {
            border-left-color: #28a745;
            background: #d4edda;
        }
        .step-item.failed {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        .step-item.skipped {
            border-left-color: #ffc107;
            background: #fff3cd;
            opacity: 0.7;
        }
        .step-keyword {
            font-weight: bold;
            color: #003087;
            margin-right: 5px;
        }
        .step-status {
            float: right;
            font-size: 0.85em;
            padding: 2px 8px;
            border-radius: 3px;
        }
        .step-status.passed {
            background: #28a745;
            color: white;
        }
        .step-status.failed {
            background: #dc3545;
            color: white;
        }
        .step-status.skipped {
            background: #ffc107;
            color: #333;
        }
        .error-message {
            background: #fff;
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
            border: 1px solid #ffcdd2;
            color: #d32f2f;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            white-space: pre-wrap;
        }
        .screenshot-container {
            display: none;
            margin-top: 15px;
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .screenshot-container img {
            max-width: 100%;
            border: 2px solid #dc3545;
            border-radius: 8px;
        }
        .expand-icon {
            margin-right: 10px;
            transition: transform 0.3s ease;
        }
        .scenario-item.expanded .expand-icon {
            transform: rotate(90deg);
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #dee2e6;
        }
        
        @media print {
            .export-buttons { display: none; }
            .screenshot-link { display: none; }
            .steps-container { display: none !important; }
            .screenshot-container { display: none !important; }
            .scenario-item { cursor: default; page-break-inside: avoid; }
            .module-section { page-break-before: always; }
            body { background: white; padding: 0; }
            .expand-icon { display: none; }
        }
        
        /* Execution Info Bar */
        .execution-info {
            background: linear-gradient(135deg, #002366 0%, #003087 100%);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
            border-bottom: 3px solid #0066CC;
        }
        .exec-info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 0.9em;
        }
        .exec-info-item .label {
            color: #99b3cc;
            font-weight: 500;
        }
        .exec-info-item .value {
            color: white;
            font-weight: 600;
        }
        .exec-info-item .icon {
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.vulcanmaterials.com/images/default-source/logos/vulcan-materials-company-logo.png" alt="Vulcan Materials Company" class="logo">
            <h1>E-Commerce Storefront</h1>
            <h2>Test Execution Report</h2>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
            <p class="timestamp">Total Execution Time: ${executionTime}</p>
        </div>
        
        <!-- Execution Info Bar -->
        <div class="execution-info">
            <div class="exec-info-item">
                <span class="icon">🖥️</span>
                <span class="label">Platform:</span>
                <span class="value">macOS (Desktop)</span>
            </div>
            <div class="exec-info-item">
                <span class="icon">🌐</span>
                <span class="label">Browser:</span>
                <span class="value">Chromium (Playwright)</span>
            </div>
            <div class="exec-info-item">
                <span class="icon">🌍</span>
                <span class="label">Environment:</span>
                <span class="value">QA</span>
            </div>
            <div class="exec-info-item">
                <span class="icon">🏷️</span>
                <span class="label">Test Suite:</span>
                <span class="value">Regression</span>
            </div>
            <div class="exec-info-item">
                <span class="icon">🔧</span>
                <span class="label">Framework:</span>
                <span class="value">Playwright + Cucumber.js</span>
            </div>
        </div>

        <div class="export-buttons">
            <button class="export-btn" onclick="exportToPDF()">
                📄 Export to PDF
            </button>
        </div>

        <div class="summary">
            <div class="stat-card total">
                <h3>Total Scenarios</h3>
                <div class="number">${totalScenarios}</div>
            </div>
            <div class="stat-card passed">
                <h3>Passed Scenarios</h3>
                <div class="number">${passedScenarios}</div>
                <p style="margin-top: 10px; color: #28a745; font-weight: bold;">${passRate}%</p>
            </div>
            <div class="stat-card failed">
                <h3>Failed Scenarios</h3>
                <div class="number">${failedScenarios}</div>
                <p style="margin-top: 10px; color: #dc3545; font-weight: bold;">${failRate}%</p>
            </div>
            <div class="stat-card total">
                <h3>Total Steps</h3>
                <div class="number">${totalSteps}</div>
                <p style="margin-top: 10px; font-size: 0.9em;">
                    ✅ ${passedSteps} | ❌ ${failedSteps} | ⏭️ ${skippedSteps}
                </p>
            </div>
            <div class="stat-card total">
                <h3>Execution Time</h3>
                <div class="number" style="font-size: 1.8em;">${executionTime}</div>
                <p style="margin-top: 10px; font-size: 0.9em;">
                    (${executionTimeSeconds} seconds)
                </p>
            </div>
        </div>

        <div class="executive-summary">
            <h2>📊 Executive Summary - Module Status</h2>
            ${generateModuleSummary()}
        </div>

        ${generateModuleDetails()}

        <div class="footer">
            <p><strong>Vulcan Materials Company</strong> - E-Commerce Storefront Automation</p>
            <p>© ${new Date().getFullYear()} Vulcan Materials Company. All Rights Reserved.</p>
        </div>
    </div>
    
    <script>
        function toggleSteps(id) {
            const stepsContainer = document.getElementById(id);
            const scenarioItem = stepsContainer.closest('.scenario-item');
            
            if (stepsContainer.classList.contains('expanded')) {
                stepsContainer.classList.remove('expanded');
                scenarioItem.classList.remove('expanded');
            } else {
                stepsContainer.classList.add('expanded');
                scenarioItem.classList.add('expanded');
            }
        }
        
        function openScreenshot(id) {
            const screenshotDiv = document.getElementById('screenshot-' + id);
            if (screenshotDiv) {
                if (screenshotDiv.style.display === 'none' || screenshotDiv.style.display === '') {
                    screenshotDiv.style.display = 'block';
                } else {
                    screenshotDiv.style.display = 'none';
                }
            }
        }
        
        function scrollToModule(moduleName) {
            const moduleId = 'module-' + moduleName.replace(/\s+/g, '-');
            const moduleElement = document.getElementById(moduleId);
            console.log('Attempting to scroll to:', moduleName, '→ ID:', moduleId);
            console.log('Element found:', moduleElement);
            
            if (moduleElement) {
                moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Highlight the module briefly
                moduleElement.style.backgroundColor = '#fff9e6';
                setTimeout(() => {
                    moduleElement.style.backgroundColor = '';
                }, 2000);
            } else {
                console.error('Module element not found for ID:', moduleId);
                // Fallback: try to find by partial match
                const allModules = document.querySelectorAll('.module-section');
                console.log('Available modules:', Array.from(allModules).map(m => m.id));
            }
        }
        
        function exportToPDF() {
            // Do NOT expand scenarios for PDF - keep them collapsed
            // This keeps the PDF concise with just summary information
            window.print();
        }
    </script>
</body>
</html>
`;

// Write HTML report
const reportPath = path.join(__dirname, 'test-report.html');
fs.writeFileSync(reportPath, htmlReport);

// Console summary
console.log('\n' + '='.repeat(80));
console.log('VULCAN E-COMMERCE TEST EXECUTION SUMMARY');
console.log('='.repeat(80));
console.log(`\n⏱️  EXECUTION TIME: ${executionTime} (${executionTimeSeconds}s)`);
console.log(`\n📊 SCENARIO STATISTICS:`);
console.log(`   Total Scenarios:  ${totalScenarios}`);
console.log(`   ✅ Passed:        ${passedScenarios} (${passRate}%)`);
console.log(`   ❌ Failed:        ${failedScenarios} (${failRate}%)`);
console.log(`\n📊 MODULE STATISTICS:`);

Object.keys(moduleStats).sort().forEach(moduleName => {
    const stats = moduleStats[moduleName];
    const modulePassRate = ((stats.passed / stats.total) * 100).toFixed(1);
    const statusIcon = stats.failed > 0 ? '❌' : '✅';
    const moduleTime = formatDuration(stats.duration);
    console.log(`   ${statusIcon} ${moduleName.padEnd(20)} ${stats.passed}/${stats.total} (${modulePassRate}%) ⏱️ ${moduleTime}`);
});

console.log(`\n📊 STEP STATISTICS:`);
console.log(`   Total Steps:      ${totalSteps}`);
console.log(`   ✅ Passed:        ${passedSteps}`);
console.log(`   ❌ Failed:        ${failedSteps}`);
console.log(`   ⏭️  Skipped:       ${skippedSteps}`);
console.log('\n' + '='.repeat(80));
console.log(`\n📄 HTML Report generated: ${reportPath}`);
console.log(`\n💡 Open the report with: open test-report.html`);
console.log(`📄 Export to PDF: Click the "Export to PDF" button in the report`);
console.log(`📊 Module Navigation: Click any module card to jump to detailed scenarios\n`);
