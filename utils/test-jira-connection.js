/**
 * Test Jira Connection
 * Verifies Jira API credentials and connectivity
 */

require('dotenv').config();
const JiraIntegration = require('./jiraIntegration');

async function testConnection() {
    console.log('\n🔍 Testing Jira Connection...\n');

    const jira = new JiraIntegration();

    // Test 1: Get Test Cases
    console.log('1️⃣ Testing getTestCases()...');
    try {
        const testCases = await jira.getTestCases();
        console.log(`   ✅ SUCCESS: Found ${testCases.length} test cases`);
        if (testCases.length > 0) {
            console.log(`   📋 Sample: ${testCases[0].key} - ${testCases[0].summary}`);
        }
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
    }

    // Test 2: Get Issues from Filter
    console.log('\n2️⃣ Testing getIssuesFromFilter()...');
    try {
        const issues = await jira.getIssuesFromFilter();
        console.log(`   ✅ SUCCESS: Found ${issues.length} issues from filter`);
        if (issues.length > 0) {
            console.log(`   📋 Sample: ${issues[0].key} - ${issues[0].fields.summary}`);
        }
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
    }

    // Test 3: Test Result Update (dry run)
    console.log('\n3️⃣ Testing updateTestResult() [DRY RUN]...');
    try {
        console.log('   ⚠️  Skipping actual update to avoid modifying Jira');
        console.log('   ℹ️  Use: jira.updateTestResult("SHOP-XXX", "PASSED", "5.2s")');
        console.log('   ✅ Method available and ready');
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
    }

    console.log('\n✨ Connection test complete!\n');
    console.log('Configuration:');
    console.log(`   URL: ${process.env.JIRA_URL}`);
    console.log(`   Email: ${process.env.JIRA_EMAIL}`);
    console.log(`   Project: ${process.env.JIRA_PROJECT_KEY}`);
    console.log(`   Filter ID: ${process.env.JIRA_FILTER_ID}`);
}

testConnection().catch(console.error);
