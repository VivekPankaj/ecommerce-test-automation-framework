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

const failedScenariosList = [];
const passedScenariosList = [];
const allScenarios = [];

// Process each feature
resultsData.forEach(feature => {
    feature.elements.forEach(scenario => {
        if (scenario.type === 'scenario') {
            totalScenarios++;
            
            let scenarioFailed = false;
            let scenarioPassed = true;
            const failedStepsInScenario = [];
            const allStepsInScenario = [];
            let screenshotPath = null;
            
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
                feature: feature.name,
                scenario: scenario.name,
                line: scenario.line,
                status: scenarioFailed ? 'failed' : (scenarioPassed ? 'passed' : 'skipped'),
                steps: allStepsInScenario,
                failedSteps: failedStepsInScenario,
                screenshot: screenshotPath
            };
            
            allScenarios.push(scenarioData);
            
            if (scenarioFailed) {
                failedScenarios++;
                failedScenariosList.push(scenarioData);
            } else if (scenarioPassed) {
                passedScenarios++;
                passedScenariosList.push(scenarioData);
            }
        }
    });
});

// Calculate percentages
const passRate = ((passedScenarios / totalScenarios) * 100).toFixed(1);
const failRate = ((failedScenarios / totalScenarios) * 100).toFixed(1);

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
            background: #003087; /* Vulcan Blue */
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
            background: #003087; /* Vulcan Blue */
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #0066CC;
        }
        .header .logo-container {
            margin-bottom: 20px;
        }
        .header .logo {
            max-width: 250px;
            height: auto;
            filter: brightness(0) invert(1); /* Make logo white */
        }
        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .header h2 {
            font-size: 1.5em;
            margin-bottom: 15px;
            font-weight: 400;
            color: #E0E0E0;
        }
        .header p {
            font-size: 1em;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #003087; /* Vulcan Blue */
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
        .stat-card.total { border-left-color: #003087; } /* Vulcan Blue */
        .stat-card.total .number { color: #003087; }
        .progress-bar {
            margin: 30px;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            border: 2px solid #E0E0E0;
        }
        .progress-bar h3 {
            margin-bottom: 15px;
            color: #333;
        }
        .progress-container {
            height: 40px;
            background: #e9ecef;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
        }
        .progress-passed {
            background: linear-gradient(90deg, #28a745, #20c997);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .progress-failed {
            background: linear-gradient(90deg, #dc3545, #c82333);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .section {
            padding: 30px;
        }
        .section h2 {
            color: #003087; /* Vulcan Blue */
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #003087;
            font-weight: 600;
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
            margin-bottom: 5px;
            flex: 1;
        }
        .screenshot-link {
            background: #003087; /* Vulcan Blue */
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
            background: #0066CC; /* Lighter Vulcan Blue */
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0,48,135,0.3);
        }
        .feature-name {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
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
            color: #003087; /* Vulcan Blue */
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
        .error-details {
            background: #fff;
            padding: 15px;
            margin-top: 10px;
            border-radius: 4px;
            border: 1px solid #ffcdd2;
        }
        .error-step {
            color: #d32f2f;
            font-family: 'Courier New', monospace;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .error-message {
            color: #666;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
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
        .timestamp {
            color: #999;
            font-size: 0.9em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://www.vulcanmaterials.com/images/default-source/logos/vulcan-materials-company-logo.png" alt="Vulcan Materials Company" class="logo">
            </div>
            <h1>E-Commerce Storefront</h1>
            <h2>Test Execution Report</h2>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
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
        </div>

        <div class="progress-bar">
            <h3>Test Coverage Overview</h3>
            <div class="progress-container">
                <div class="progress-passed" style="width: ${passRate}%">${passRate}% Passed</div>
                <div class="progress-failed" style="width: ${failRate}%">${failRate}% Failed</div>
            </div>
        </div>

        <div class="section">
            <h2>✅ Passed Scenarios (${passedScenarios})</h2>
            <ul class="scenario-list">
                ${passedScenariosList.map((item, index) => `
                    <li class="scenario-item" onclick="toggleSteps('passed-${index}')">
                        <div class="scenario-header">
                            <div class="scenario-name">
                                <span class="expand-icon">▶</span>
                                ${item.scenario}
                                <span class="badge passed">PASSED</span>
                            </div>
                        </div>
                        <div class="feature-name">📁 ${item.feature} (Line: ${item.line})</div>
                        <div id="passed-${index}" class="steps-container">
                            <strong>Test Steps (${item.steps.length}):</strong>
                            ${item.steps.map(step => `
                                <div class="step-item passed">
                                    <span class="step-status passed">✓ PASSED</span>
                                    <span class="step-keyword">${step.keyword}</span>${step.name}
                                </div>
                            `).join('')}
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>❌ Failed Scenarios (${failedScenarios})</h2>
            <ul class="scenario-list">
                ${failedScenariosList.map((item, index) => `
                    <li class="scenario-item failed" onclick="toggleSteps('failed-${index}')">
                        <div class="scenario-header">
                            <div class="scenario-name">
                                <span class="expand-icon">▶</span>
                                ${item.scenario}
                                <span class="badge failed">FAILED</span>
                            </div>
                            ${item.screenshot ? `<a href="#" class="screenshot-link" onclick="event.stopPropagation(); openScreenshot('failed-${index}'); return false;">📸 View Screenshot</a>` : ''}
                        </div>
                        <div class="feature-name">📁 ${item.feature} (Line: ${item.line})</div>
                        <div id="failed-${index}" class="steps-container">
                            <strong>Test Steps (${item.steps.length}):</strong>
                            ${item.steps.map(step => {
                                let statusClass = step.status;
                                let statusIcon = step.status === 'passed' ? '✓' : step.status === 'failed' ? '✗' : '⊘';
                                let statusText = step.status === 'passed' ? 'PASSED' : step.status === 'failed' ? 'FAILED' : 'SKIPPED';
                                return `
                                <div class="step-item ${statusClass}">
                                    <span class="step-status ${statusClass}">${statusIcon} ${statusText}</span>
                                    <span class="step-keyword">${step.keyword}</span>${step.name}
                                    ${step.status === 'failed' && step.error ? `
                                        <div class="error-message" style="margin-top: 10px;">${step.error.substring(0, 300)}${step.error.length > 300 ? '...' : ''}</div>
                                    ` : ''}
                                </div>
                            `}).join('')}
                        </div>
                        ${item.screenshot ? `
                            <div id="screenshot-failed-${index}" style="display: none; margin-top: 15px; text-align: center;">
                                <img src="${item.screenshot}" style="max-width: 100%; border: 2px solid #dc3545; border-radius: 8px;" alt="Failed step screenshot"/>
                            </div>
                        ` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="footer">
            <p><strong>Vulcan Materials Company</strong> - E-Commerce Storefront Automation</p>
            <p>Framework: Playwright + Cucumber.js | Browser: Chromium</p>
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
                if (screenshotDiv.style.display === 'none') {
                    screenshotDiv.style.display = 'block';
                } else {
                    screenshotDiv.style.display = 'none';
                }
            }
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
console.log(`\n📊 SCENARIO STATISTICS:`);
console.log(`   Total Scenarios:  ${totalScenarios}`);
console.log(`   ✅ Passed:        ${passedScenarios} (${passRate}%)`);
console.log(`   ❌ Failed:        ${failedScenarios} (${failRate}%)`);
console.log(`\n📊 STEP STATISTICS:`);
console.log(`   Total Steps:      ${totalSteps}`);
console.log(`   ✅ Passed:        ${passedSteps}`);
console.log(`   ❌ Failed:        ${failedSteps}`);
console.log(`   ⏭️  Skipped:       ${skippedSteps}`);
console.log('\n' + '='.repeat(80));
console.log(`\n📄 HTML Report generated: ${reportPath}`);
console.log(`\n💡 Open the report with: open test-report.html\n`);
