const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const reportPath = path.join(__dirname, '..', 'reports', 'regression-' + timestamp);

// Generate base report
report.generate({
    jsonDir: path.join(__dirname, '..', 'reports', 'json'),
    reportPath: reportPath,
    pageTitle: 'Vulcan E-Commerce Test Report',
    reportName: 'Regression Test Results',
    displayDuration: true,
    displayReportTime: true,
    hideMetadata: true,
    metadata: {
        browser: { name: 'Chromium', version: 'Latest' },
        device: 'Desktop',
        platform: { name: 'macOS', version: 'Sonoma' }
    },
    customData: {
        title: 'Execution Info',
        data: [
            { label: 'Project', value: 'Vulcan E-Commerce Storefront' },
            { label: 'Environment', value: 'QA' },
            { label: 'Platform', value: 'macOS (Desktop)' },
            { label: 'Browser', value: 'Chromium (Playwright)' },
            { label: 'Execution Date', value: new Date().toLocaleString() },
            { label: 'Tags', value: '@Regression (excluding @Checkout)' }
        ]
    }
});

// CSS and JS to inject into all HTML files
var currentYear = new Date().getFullYear();
var execDate = new Date().toLocaleString();

var vulcanCSS = '\n<style id="vulcan-theme">\n' +
    '.vulcan-header { background: linear-gradient(135deg, #003087 0%, #002060 100%); padding: 30px; text-align: center; border-bottom: 4px solid #0066CC; }\n' +
    '.vulcan-header img { max-width: 200px; filter: brightness(0) invert(1); margin-bottom: 15px; }\n' +
    '.vulcan-header h1 { color: white; font-size: 2em; margin: 0; font-weight: 600; }\n' +
    '.vulcan-header h2 { color: #ccc; font-size: 1.2em; margin-top: 5px; font-weight: 400; }\n' +
    '.exec-info-bar { background: #002060; padding: 12px 30px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-bottom: 2px solid #0066CC; }\n' +
    '.exec-info-item { color: white; font-size: 0.85em; display: flex; gap: 6px; }\n' +
    '.exec-info-item .label { color: #99b3cc; }\n' +
    '.exec-info-item .value { font-weight: 600; }\n' +
    '.navbar { display: none !important; }\n' +
    '.card-header { background: #003087 !important; color: white !important; border-bottom: 2px solid #0066CC; }\n' +
    '.card-header h4, .card-header .h4 { color: white !important; }\n' +
    'footer, .footer { display: none !important; }\n' +
    '.vulcan-footer { background: linear-gradient(135deg, #003087 0%, #002060 100%); color: white; padding: 15px 30px; text-align: center; font-size: 0.85em; border-top: 4px solid #0066CC; margin-top: 20px; page-break-inside: avoid !important; break-inside: avoid !important; }\n' +
    '.vulcan-footer p { margin: 3px 0; color: #ccc; }\n' +
    '.vulcan-footer strong { color: white; }\n' +
    '.table thead th { background: #003087 !important; color: white !important; }\n' +
    '.table tbody td { vertical-align: middle !important; }\n' +
    '.progress-bar.passed, .bg-success { background-color: #28a745 !important; }\n' +
    '.progress-bar.failed, .bg-danger { background-color: #dc3545 !important; }\n' +
    '.ct-series-a .ct-slice-donut { stroke: #28a745 !important; }\n' +
    '.ct-series-b .ct-slice-donut { stroke: #dc3545 !important; }\n' +
    'a { color: #003087; }\n' +
    '.export-btn { background: #003087; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }\n' +
    '.export-btn:hover { background: #0066CC; }\n' +
    '.linear-progress { width: 100%; background: #e9ecef; border-radius: 4px; height: 20px; overflow: hidden; display: flex; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); }\n' +
    '.linear-progress .pass-bar { background: linear-gradient(90deg, #28a745, #34ce57); height: 100%; transition: width 0.3s ease; }\n' +
    '.linear-progress .fail-bar { background: linear-gradient(90deg, #dc3545, #ff6b6b); height: 100%; transition: width 0.3s ease; }\n' +
    '/* Hide the all-tags section on feature pages */\n' +
    '.feature-tags, p:has(.tag), div:has(> .tag):not(.scenario-tags) { display: none !important; }\n' +
    '.tag { display: none !important; }\n' +
    'i.fa-tags { display: none !important; }\n' +
    '/* Print styles to prevent page breaks */\n' +
    '@media print {\n' +
    '  .vulcan-footer { page-break-inside: avoid !important; break-inside: avoid !important; page-break-before: avoid !important; }\n' +
    '  .table { page-break-inside: auto; }\n' +
    '  .table tr { page-break-inside: avoid; page-break-after: auto; }\n' +
    '}\n' +
    '</style>\n';

var vulcanJS = '\n<script>\n' +
    'document.addEventListener("DOMContentLoaded", function() {\n' +
    '  setTimeout(function() {\n' +
    '    // Module name mapping from feature names\n' +
    '    var moduleMap = {\n' +
    '      "login": "Login",\n' +
    '      "search": "Search",\n' +
    '      "product display": "PDP",\n' +
    '      "pdp": "PDP",\n' +
    '      "product listing": "PLP",\n' +
    '      "plp": "PLP",\n' +
    '      "quarry": "Quarry Selector",\n' +
    '      "address selector": "Quarry Selector",\n' +
    '      "cart": "Cart",\n' +
    '      "add to cart": "Cart",\n' +
    '      "checkout": "Checkout",\n' +
    '      "my account": "My Account",\n' +
    '      "profile": "My Account",\n' +
    '      "update my profile": "My Account"\n' +
    '    };\n' +
    '    \n' +
    '    function getModuleName(featureName) {\n' +
    '      var name = featureName.toLowerCase();\n' +
    '      for (var key in moduleMap) {\n' +
    '        if (name.includes(key)) return moduleMap[key];\n' +
    '      }\n' +
    '      return featureName;\n' +
    '    }\n' +
    '    \n' +
    '    // Hide the customData section (Execution Info table)\n' +
    '    var customDataCards = document.querySelectorAll(".card");\n' +
    '    customDataCards.forEach(function(card) {\n' +
    '      var header = card.querySelector(".card-header");\n' +
    '      if (header && header.textContent.includes("Execution Info")) {\n' +
    '        card.style.display = "none";\n' +
    '      }\n' +
    '    });\n' +
    '    \n' +
    '    // Find the features table and enhance it\n' +
    '    var tables = document.querySelectorAll(".table, table");\n' +
    '    tables.forEach(function(table) {\n' +
    '      var headers = table.querySelectorAll("thead th");\n' +
    '      var hideIdx = [];\n' +
    '      var featureIdx = -1, passedIdx = -1, failedIdx = -1, totalIdx = -1;\n' +
    '      \n' +
    '      headers.forEach(function(th, idx) {\n' +
    '        var txt = th.textContent.toLowerCase().trim();\n' +
    '        var html = th.innerHTML.toLowerCase();\n' +
    '        // Hide Tag, Device, OS, Browser, Date columns\n' +
    '        if (txt === "" || txt.includes("device") || txt.includes("os") || txt.includes("browser") || txt.includes("date") || html.includes("fa-tags") || html.includes("fa-desktop")) {\n' +
    '          hideIdx.push(idx);\n' +
    '        }\n' +
    '        if (txt.includes("feature")) { featureIdx = idx; th.textContent = "Module"; }\n' +
    '        if (txt.includes("passed") || html.includes("text-success")) passedIdx = idx;\n' +
    '        if (txt.includes("failed") || html.includes("text-danger")) failedIdx = idx;\n' +
    '        if (txt.includes("scenarios") || txt.includes("total")) totalIdx = idx;\n' +
    '      });\n' +
    '      \n' +
    '      // Hide unwanted columns\n' +
    '      hideIdx.forEach(function(idx) {\n' +
    '        table.querySelectorAll("tr").forEach(function(row) {\n' +
    '          var cells = row.querySelectorAll("th, td");\n' +
    '          if (cells[idx]) cells[idx].style.display = "none";\n' +
    '        });\n' +
    '      });\n' +
    '      \n' +
    '      // Map feature names to module names and hide "Update My Profile" row\n' +
    '      if (featureIdx >= 0) {\n' +
    '        var bodyRows = table.querySelectorAll("tbody tr");\n' +
    '        bodyRows.forEach(function(row) {\n' +
    '          var cells = row.querySelectorAll("td");\n' +
    '          if (cells[featureIdx]) {\n' +
    '            var link = cells[featureIdx].querySelector("a");\n' +
    '            var originalText = link ? link.textContent.trim() : cells[featureIdx].textContent.trim();\n' +
    '            \n' +
    '            // Hide the "Update My Profile" row completely\n' +
    '            if (originalText.toLowerCase().includes("update my profile")) {\n' +
    '              row.style.display = "none";\n' +
    '              return;\n' +
    '            }\n' +
    '            \n' +
    '            if (link) {\n' +
    '              link.textContent = getModuleName(originalText);\n' +
    '            } else {\n' +
    '              cells[featureIdx].textContent = getModuleName(originalText);\n' +
    '            }\n' +
    '          }\n' +
    '        });\n' +
    '      }\n' +
    '      \n' +
    '      // Add Pass%, Fail%, and Progress columns if we have passed/failed data\n' +
    '      if (passedIdx >= 0 && failedIdx >= 0) {\n' +
    '        var headerRow = table.querySelector("thead tr");\n' +
    '        if (headerRow) {\n' +
    '          var passPercentTh = document.createElement("th");\n' +
    '          passPercentTh.innerHTML = "Pass %";\n' +
    '          passPercentTh.style.cssText = "background: #003087 !important; color: white !important; text-align: center;";\n' +
    '          headerRow.appendChild(passPercentTh);\n' +
    '          \n' +
    '          var failPercentTh = document.createElement("th");\n' +
    '          failPercentTh.innerHTML = "Fail %";\n' +
    '          failPercentTh.style.cssText = "background: #003087 !important; color: white !important; text-align: center;";\n' +
    '          headerRow.appendChild(failPercentTh);\n' +
    '          \n' +
    '          var progressTh = document.createElement("th");\n' +
    '          progressTh.innerHTML = "Progress";\n' +
    '          progressTh.style.cssText = "background: #003087 !important; color: white !important; text-align: center; min-width: 150px;";\n' +
    '          headerRow.appendChild(progressTh);\n' +
    '        }\n' +
    '        \n' +
    '        // Add data cells for each row\n' +
    '        var bodyRows = table.querySelectorAll("tbody tr");\n' +
    '        bodyRows.forEach(function(row) {\n' +
    '          var cells = row.querySelectorAll("td");\n' +
    '          var passed = 0, failed = 0;\n' +
    '          \n' +
    '          if (cells[passedIdx]) passed = parseInt(cells[passedIdx].textContent) || 0;\n' +
    '          if (cells[failedIdx]) failed = parseInt(cells[failedIdx].textContent) || 0;\n' +
    '          var total = passed + failed;\n' +
    '          var passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;\n' +
    '          var failPercent = total > 0 ? ((failed / total) * 100).toFixed(1) : 0;\n' +
    '          \n' +
    '          var passTd = document.createElement("td");\n' +
    '          passTd.innerHTML = "<span style=\\"color: #28a745; font-weight: 600;\\">" + passPercent + "%</span>";\n' +
    '          passTd.style.textAlign = "center";\n' +
    '          row.appendChild(passTd);\n' +
    '          \n' +
    '          var failTd = document.createElement("td");\n' +
    '          failTd.innerHTML = "<span style=\\"color: " + (failed > 0 ? "#dc3545" : "#6c757d") + "; font-weight: 600;\\">" + failPercent + "%</span>";\n' +
    '          failTd.style.textAlign = "center";\n' +
    '          row.appendChild(failTd);\n' +
    '          \n' +
    '          var progressTd = document.createElement("td");\n' +
    '          progressTd.innerHTML = \'<div style="width: 100%; background: #e9ecef; border-radius: 4px; height: 20px; overflow: hidden; display: flex;">\' +\n' +
    '            \'<div style="width: \' + passPercent + \'%; background: linear-gradient(90deg, #28a745, #34ce57); height: 100%;"></div>\' +\n' +
    '            \'<div style="width: \' + failPercent + \'%; background: linear-gradient(90deg, #dc3545, #ff6b6b); height: 100%;"></div>\' +\n' +
    '            \'</div>\';\n' +
    '          progressTd.style.minWidth = "150px";\n' +
    '          row.appendChild(progressTd);\n' +
    '        });\n' +
    '      }\n' +
    '    });\n' +
    '  }, 300);\n' +
    '});\n' +
    '</script>\n';

var vulcanHeader = '\n<div class="vulcan-header">\n' +
    '  <img src="https://www.vulcanmaterials.com/images/default-source/logos/vulcan-materials-company-logo.png" alt="Vulcan Materials Company">\n' +
    '  <h1>E-Commerce Storefront</h1>\n' +
    '  <h2>Test Execution Report</h2>\n' +
    '</div>\n' +
    '<div class="exec-info-bar">\n' +
    '  <div class="exec-info-item"><span class="label">Platform:</span><span class="value">macOS (Desktop)</span></div>\n' +
    '  <div class="exec-info-item"><span class="label">Browser:</span><span class="value">Chromium</span></div>\n' +
    '  <div class="exec-info-item"><span class="label">Environment:</span><span class="value">QA</span></div>\n' +
    '  <div class="exec-info-item"><span class="label">Suite:</span><span class="value">Regression</span></div>\n' +
    '  <div class="exec-info-item"><span class="label">Date:</span><span class="value">' + execDate + '</span></div>\n' +
    '</div>\n' +
    '<div style="padding: 15px 30px; background: #f8f9fa; text-align: right; border-bottom: 1px solid #dee2e6;">\n' +
    '  <button class="export-btn" onclick="window.print()">Export to PDF</button>\n' +
    '</div>\n';

var vulcanFooter = '\n<div class="vulcan-footer">\n' +
    '  <p><strong>Vulcan Materials Company</strong> - E-Commerce Storefront Automation</p>\n' +
    '  <p>Framework: Playwright + Cucumber.js | Browser: Chromium</p>\n' +
    '  <p>' + currentYear + ' Vulcan Materials Company. All Rights Reserved.</p>\n' +
    '</div>\n';

// Process ALL HTML files in the report directory
function processHtmlFile(filePath) {
    var html = fs.readFileSync(filePath, 'utf-8');
    
    // Inject CSS before </head>
    html = html.replace('</head>', vulcanCSS + vulcanJS + '</head>');
    
    // Add header after <body>
    html = html.replace(/<body[^>]*>/, '$&' + vulcanHeader);
    
    // Remove original footer completely
    html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');
    
    // Remove "Maintained by" text anywhere
    html = html.replace(/Maintained by[\s\S]*?Find me on:[\s\S]*?<\/div>/gi, '</div>');
    html = html.replace(/<p[^>]*>[^<]*Maintained by[^<]*<\/p>/gi, '');
    html = html.replace(/<div[^>]*>[^<]*Maintained by[\s\S]*?<\/div>/gi, '');
    
    // Add Vulcan footer before </body>
    html = html.replace('</body>', vulcanFooter + '</body>');
    
    fs.writeFileSync(filePath, html);
    console.log('  Processed: ' + path.basename(filePath));
}

// Find and process all HTML files
function processAllHtmlFiles(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var filePath = path.join(dir, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processAllHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
            processHtmlFile(filePath);
        }
    });
}

console.log('\nApplying Vulcan theme to all report pages...');
processAllHtmlFiles(reportPath);
console.log('\nVulcan theme applied successfully!');
console.log('Report: ' + reportPath + '/index.html');

// Generate PDF with timestamp
async function generatePDF() {
    const pdfTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const pdfFileName = `Vulcan_Regression_Report_${pdfTimestamp}.pdf`;
    const pdfPath = path.join(reportPath, pdfFileName);
    
    console.log('\nGenerating PDF report...');
    
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Load the HTML report
        await page.goto('file://' + path.join(reportPath, 'index.html'), { 
            waitUntil: 'networkidle' 
        });
        
        // Wait for content to render
        await page.waitForTimeout(2000);
        
        // Generate PDF with optimized settings
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            landscape: true,
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '15px',
                right: '15px',
                bottom: '15px',
                left: '15px'
            },
            scale: 0.85
        });
        
        await browser.close();
        
        console.log('PDF saved: ' + pdfPath);
        return pdfPath;
    } catch (error) {
        console.error('PDF generation failed:', error.message);
        console.log('You can still export manually using the "Export to PDF" button in the report.');
        return null;
    }
}

// Run PDF generation
generatePDF().then(function(pdfPath) {
    if (pdfPath) {
        console.log('\n✅ Report generation complete!');
        console.log('   HTML: ' + reportPath + '/index.html');
        console.log('   PDF:  ' + pdfPath);
    }
});
