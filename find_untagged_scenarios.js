const fs = require('fs');
const path = require('path');

const featureFiles = fs.readdirSync('Ecomm/features').filter(f => f.endsWith('.feature'));

console.log('Scenarios without @P1, @P2, or @P3 tags:\n');

featureFiles.forEach(file => {
    const content = fs.readFileSync(path.join('Ecomm/features', file), 'utf8');
    const lines = content.split('\n');
    
    let currentTags = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Collect tags
        if (line.startsWith('@')) {
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && !nextLine.includes('Feature:')) {
                currentTags = line.match(/@\w+/g) || [];
            }
        } 
        // Check scenario
        else if (line.match(/^Scenario:/)) {
            const hasPriorityTag = currentTags.some(t => t.match(/@P[123]/) || t.match(/@Sanity/));
            if (!hasPriorityTag) {
                console.log(`${file}: Line ${i+1}`);
                console.log(`  Tags: ${currentTags.join(', ') || 'NONE'}`);
                console.log(`  ${line.substring(0, 80)}`);
                console.log('');
            }
            currentTags = [];
        }
    }
});
