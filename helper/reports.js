const report = require('multiple-cucumber-html-reporter');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS 

report.generate({
    jsonDir: './path-to-json-output', // Path to the folder containing JSON files 
    reportPath: `./test-results-${timestamp}`, // Path where the HTML report will be saved with timestamp 
    metadata: {
        browser: {
            name: 'chrome',
            version: '91',
        },
        device: 'Local Machine',
        platform: {
            name: 'windows',
            version: '10',
        },
        timestamp: new Date().toISOString(), // Add timestamp to metadata 
    },
});