const fs = require('fs');

function extractScenarios(content) {
    const scenarios = [];
    const lines = content.split('\n');
    
    let currentTags = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('@')) {
            const nextNonEmptyLine = lines.slice(i + 1).find(l => l.trim());
            if (!nextNonEmptyLine || !nextNonEmptyLine.includes('Feature:')) {
                currentTags = line.match(/@\w+/g) || [];
            }
        } 
        else if (line.match(/^(Scenario|Scenario Outline):/)) {
            const scenarioMatch = line.match(/(?:Scenario|Scenario Outline):\s*(.+)/);
            if (scenarioMatch) {
                const name = scenarioMatch[1].trim();
                const tags = [...currentTags];
                
                let priority = null;
                if (tags.some(t => t.includes('@P1') || t.includes('@Sanity'))) {
                    priority = 'P1';
                } else if (tags.some(t => t.includes('@P2'))) {
                    priority = 'P2';
                } else if (tags.some(t => t.includes('@P3'))) {
                    priority = 'P3';
                }
                
                scenarios.push({ name: name.substring(0, 40), priority, tagCount: tags.length, tags });
                currentTags = [];
            }
        }
    }
    return scenarios;
}

const content = fs.readFileSync('Ecomm/features/login.feature', 'utf8');
const scenarios = extractScenarios(content);
console.log('Login scenarios:');
scenarios.forEach((s, i) => {
    console.log(`${i+1}. ${s.name} - Priority: ${s.priority || 'None'} - Tags: ${s.tags.join(',')}`);
});

const withPriority = scenarios.filter(s => s.priority).length;
console.log(`\nTotal: ${scenarios.length}, With priority: ${withPriority}, Missing: ${scenarios.length - withPriority}`);
