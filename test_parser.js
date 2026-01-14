const fs = require('fs');

const content = fs.readFileSync('Ecomm/features/login.feature', 'utf8');
const lines = content.split('\n');

let currentTags = [];
let scenarioNum = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Collect tags
    if (line.startsWith('@')) {
        // Skip feature-level tags (tags before Feature:)
        const nextNonEmptyLine = lines.slice(i + 1).find(l => l.trim());
        if (!nextNonEmptyLine || !nextNonEmptyLine.includes('Feature:')) {
            currentTags = line.match(/@\w+/g) || [];
            console.log(`Line ${i+1}: Found tags: ${currentTags.join(', ')}`);
        }
    } 
    // Found a scenario
    else if (line.match(/^(Scenario|Scenario Outline):/)) {
        scenarioNum++;
        const scenarioMatch = line.match(/(?:Scenario|Scenario Outline):\s*(.+)/);
        if (scenarioMatch) {
            const name = scenarioMatch[1].trim();
            console.log(`\nScenario ${scenarioNum} (Line ${i+1}): ${name.substring(0, 50)}`);
            console.log(`  Tags assigned: ${currentTags.join(', ') || 'NONE'}`);
            currentTags = [];
        }
    }
}
