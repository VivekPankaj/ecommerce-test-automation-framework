const fs = require('fs');
const path = require('path');

// Find all feature files
const featuresDir = path.join(__dirname, 'Ecomm', 'features');
const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.feature'));

console.log('\n' + '='.repeat(100));
console.log('PRIORITY TAG ANALYSIS');
console.log('='.repeat(100));

const moduleStats = {};

featureFiles.forEach(file => {
    const filePath = path.join(featuresDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const moduleName = file.replace('.feature', '');
    moduleStats[moduleName] = {
        total: 0,
        p1: 0,
        p2: 0,
        p3: 0,
        untagged: [],
        scenarios: []
    };
    
    let currentTags = [];
    let currentScenario = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Collect tags
        if (line.startsWith('@')) {
            currentTags.push(...line.split(' ').filter(t => t.startsWith('@')));
        }
        // Process scenario
        else if (line.startsWith('Scenario:')) {
            currentScenario = line.replace('Scenario:', '').trim();
            moduleStats[moduleName].total++;
            
            const hasP1 = currentTags.some(t => t === '@P1');
            const hasP2 = currentTags.some(t => t === '@P2');
            const hasP3 = currentTags.some(t => t === '@P3');
            
            if (hasP1) moduleStats[moduleName].p1++;
            else if (hasP2) moduleStats[moduleName].p2++;
            else if (hasP3) moduleStats[moduleName].p3++;
            else {
                moduleStats[moduleName].untagged.push({
                    line: i + 1,
                    scenario: currentScenario,
                    tags: currentTags.join(' ')
                });
            }
            
            moduleStats[moduleName].scenarios.push({
                name: currentScenario,
                priority: hasP1 ? 'P1' : hasP2 ? 'P2' : hasP3 ? 'P3' : 'NONE',
                tags: currentTags.join(' ')
            });
            
            currentTags = [];
            currentScenario = null;
        }
        // Reset tags if we hit an empty line or Feature line
        else if (!line || line.startsWith('Feature:') || line.startsWith('#')) {
            currentTags = [];
        }
    }
});

// Print results
for (const [module, stats] of Object.entries(moduleStats)) {
    if (stats.total === 0) continue;
    
    console.log(`\n📁 ${module}`);
    console.log(`   Total Scenarios: ${stats.total}`);
    console.log(`   P1: ${stats.p1} | P2: ${stats.p2} | P3: ${stats.p3} | Untagged: ${stats.untagged.length}`);
    
    const sum = stats.p1 + stats.p2 + stats.p3 + stats.untagged.length;
    if (sum !== stats.total) {
        console.log(`   ⚠️  MISMATCH! Sum (${sum}) ≠ Total (${stats.total})`);
    } else {
        console.log(`   ✅ Count matches!`);
    }
    
    if (stats.untagged.length > 0) {
        console.log(`\n   ⚠️  UNTAGGED SCENARIOS:`);
        stats.untagged.forEach(item => {
            console.log(`      Line ${item.line}: ${item.scenario}`);
            console.log(`      Tags: ${item.tags || '(no tags)'}`);
        });
    }
}

console.log('\n' + '='.repeat(100));
console.log('SUMMARY');
console.log('='.repeat(100));

let grandTotal = 0;
let grandP1 = 0;
let grandP2 = 0;
let grandP3 = 0;
let grandUntagged = 0;

for (const stats of Object.values(moduleStats)) {
    grandTotal += stats.total;
    grandP1 += stats.p1;
    grandP2 += stats.p2;
    grandP3 += stats.p3;
    grandUntagged += stats.untagged.length;
}

console.log(`\nTotal Scenarios Across All Features: ${grandTotal}`);
console.log(`P1: ${grandP1} | P2: ${grandP2} | P3: ${grandP3} | Untagged: ${grandUntagged}`);
console.log(`Sum: ${grandP1 + grandP2 + grandP3 + grandUntagged}`);
console.log('\n');
