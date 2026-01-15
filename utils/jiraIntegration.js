/**
 * Jira Integration Utility
 * Manages test case synchronization and results update with Jira
 */

require('dotenv').config();
const axios = require('axios');

class JiraIntegration {
    constructor() {
        this.jiraUrl = process.env.JIRA_URL;
        this.jiraEmail = process.env.JIRA_EMAIL;
        this.jiraApiToken = process.env.JIRA_API_TOKEN;
        this.jiraFilterId = process.env.JIRA_FILTER_ID;
        this.jiraProjectKey = process.env.JIRA_PROJECT_KEY;

        // Create axios instance with auth
        this.jiraClient = axios.create({
            baseURL: this.jiraUrl,
            headers: {
                'Authorization': `Basic ${Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Get issues from Jira filter
     */
    async getIssuesFromFilter() {
        try {
            // Use API v3 with POST for JQL search (new Atlassian API)
            const response = await this.jiraClient.post('/rest/api/3/search/jql', {
                jql: `filter=${this.jiraFilterId}`,
                maxResults: 100,
                fields: ['summary', 'status', 'priority', 'assignee', 'description']
            });

            return response.data.issues;
        } catch (error) {
            console.error('Error fetching issues from Jira:', error.message);
            // Fallback: try direct project query with v3 API
            try {
                const fallbackResponse = await this.jiraClient.post('/rest/api/3/search/jql', {
                    jql: `project = ${this.jiraProjectKey} ORDER BY created DESC`,
                    maxResults: 100,
                    fields: ['summary', 'status', 'priority', 'description']
                });
                return fallbackResponse.data.issues;
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError.message);
                throw error;
            }
        }
    }

    /**
     * Get test cases for the project
     */
    async getTestCases() {
        try {
            // Use filter-based query with API v3
            const jql = `project = ${this.jiraProjectKey} ORDER BY created DESC`;
            
            const response = await this.jiraClient.post('/rest/api/3/search/jql', {
                jql: jql,
                maxResults: 100,
                fields: ['summary', 'status', 'priority', 'labels']
            });

            return response.data.issues.map(issue => ({
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status?.name || 'Unknown',
                priority: issue.fields.priority?.name || 'Medium',
                labels: issue.fields.labels || [],
                id: issue.id
            }));
        } catch (error) {
            console.error('Error fetching test cases from Jira:', error.message);
            return [];
        }
    }

    /**
     * Update test execution result in Jira
     */
    async updateTestResult(issueKey, status, executionTime, errorMessage = null) {
        try {
            const comment = this.buildCommentBody(status, executionTime, errorMessage);

            // Add comment to the issue (API v2)
            await this.jiraClient.post(`/rest/api/2/issue/${issueKey}/comment`, {
                body: comment
            });

            // Update issue status if needed
            if (status === 'PASSED') {
                await this.transitionIssue(issueKey, 'Done');
            } else if (status === 'FAILED') {
                await this.transitionIssue(issueKey, 'In Progress');
            }

            console.log(`✓ Updated ${issueKey}: ${status}`);
            return true;
        } catch (error) {
            console.error(`Error updating ${issueKey}:`, error.message);
            return false;
        }
    }

    /**
     * Transition issue to new status
     */
    async transitionIssue(issueKey, statusName) {
        try {
            // Get available transitions (API v2)
            const transitionsResponse = await this.jiraClient.get(`/rest/api/2/issue/${issueKey}/transitions`);
            const transitions = transitionsResponse.data.transitions;

            // Find matching transition
            const transition = transitions.find(t => 
                t.name.toLowerCase().includes(statusName.toLowerCase()) ||
                t.to.name.toLowerCase().includes(statusName.toLowerCase())
            );

            if (transition) {
                await this.jiraClient.post(`/rest/api/2/issue/${issueKey}/transitions`, {
                    transition: { id: transition.id }
                });
            }
        } catch (error) {
            console.log(`Could not transition ${issueKey}:`, error.message);
        }
    }

    /**
     * Build comment body for test result
     */
    buildCommentBody(status, executionTime, errorMessage) {
        const timestamp = new Date().toLocaleString();
        const statusEmoji = status === 'PASSED' ? '✅' : '❌';
        
        let comment = `${statusEmoji} Test Execution Result\n`;
        comment += `Status: ${status}\n`;
        comment += `Execution Time: ${executionTime}\n`;
        comment += `Timestamp: ${timestamp}\n`;
        comment += `Environment: ${process.env.TEST_ENV || 'QA'}\n`;
        
        if (errorMessage) {
            comment += `\nError:\n${errorMessage}`;
        }
        
        return comment;
    }

    /**
     * Create test execution summary in Jira
     */
    async createExecutionSummary(testResults) {
        try {
            const summary = this.generateExecutionSummary(testResults);
            
            // Create a new issue for the test execution (API v2)
            const response = await this.jiraClient.post('/rest/api/2/issue', {
                fields: {
                    project: { key: this.jiraProjectKey },
                    summary: `Test Execution - ${new Date().toLocaleDateString()}`,
                    description: summary,
                    issuetype: { name: 'Task' }
                }
            });

            console.log(`✓ Created execution summary: ${response.data.key}`);
            return response.data.key;
        } catch (error) {
            console.error('Error creating execution summary:', error.message);
            return null;
        }
    }

    /**
     * Generate execution summary text
     */
    generateExecutionSummary(testResults) {
        const total = testResults.length;
        const passed = testResults.filter(r => r.status === 'PASSED').length;
        const failed = testResults.filter(r => r.status === 'FAILED').length;
        const passRate = ((passed / total) * 100).toFixed(2);

        let summary = `Test Execution Summary\n\n`;
        summary += `Total Tests: ${total}\n`;
        summary += `Passed: ${passed} (${passRate}%)\n`;
        summary += `Failed: ${failed}\n`;
        summary += `Environment: ${process.env.TEST_ENV || 'QA'}\n`;
        summary += `Execution Date: ${new Date().toLocaleString()}\n\n`;
        
        if (failed > 0) {
            summary += `Failed Tests:\n`;
            testResults.filter(r => r.status === 'FAILED').forEach(r => {
                summary += `- ${r.name}: ${r.error}\n`;
            });
        }

        return summary;
    }

    /**
     * Sync test results from Cucumber JSON to Jira
     */
    async syncTestResults(cucumberJsonPath) {
        try {
            const fs = require('fs');
            const cucumberResults = JSON.parse(fs.readFileSync(cucumberJsonPath, 'utf8'));

            const results = [];
            
            for (const feature of cucumberResults) {
                for (const scenario of feature.elements) {
                    // Extract Jira ticket from tags (e.g., @SHOP-123)
                    const jiraTag = scenario.tags.find(tag => 
                        tag.name.startsWith('@' + this.jiraProjectKey + '-')
                    );

                    if (jiraTag) {
                        const issueKey = jiraTag.name.substring(1); // Remove @
                        const status = scenario.steps.every(s => s.result.status === 'passed') ? 'PASSED' : 'FAILED';
                        const executionTime = this.calculateScenarioTime(scenario.steps);
                        const errorMessage = this.extractErrorMessage(scenario.steps);

                        await this.updateTestResult(issueKey, status, executionTime, errorMessage);
                        
                        results.push({
                            issueKey,
                            name: scenario.name,
                            status,
                            executionTime
                        });
                    }
                }
            }

            return results;
        } catch (error) {
            console.error('Error syncing test results:', error.message);
            return [];
        }
    }

    /**
     * Calculate total execution time for scenario
     */
    calculateScenarioTime(steps) {
        const totalNanoseconds = steps.reduce((sum, step) => 
            sum + (step.result.duration || 0), 0
        );
        const seconds = (totalNanoseconds / 1000000000).toFixed(2);
        return `${seconds}s`;
    }

    /**
     * Extract error message from failed steps
     */
    extractErrorMessage(steps) {
        const failedStep = steps.find(s => s.result.status === 'failed');
        if (failedStep && failedStep.result.error_message) {
            return failedStep.result.error_message.split('\n').slice(0, 5).join('\n');
        }
        return null;
    }

    /**
     * Get a single Jira issue by key
     */
    async getIssue(issueKey) {
        try {
            // Fetch all fields to capture custom fields like Acceptance Criteria
            const response = await this.jiraClient.get(`/rest/api/3/issue/${issueKey}`, {
                params: {
                    expand: 'names,renderedFields'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching issue ${issueKey}:`, error.message);
            return null;
        }
    }

    /**
     * Search Jira issues by JQL
     */
    async searchIssues(jql, maxResults = 50) {
        try {
            const response = await this.jiraClient.post('/rest/api/3/search/jql', {
                jql: jql,
                maxResults: maxResults,
                fields: ['*all'],
                expand: ['names', 'renderedFields']
            });
            return response.data.issues || [];
        } catch (error) {
            console.error('Error searching issues:', error.message);
            // Try fallback with v2 API
            try {
                const fallbackResponse = await this.jiraClient.post('/rest/api/2/search', {
                    jql: jql,
                    maxResults: maxResults,
                    fields: ['*all']
                });
                return fallbackResponse.data.issues || [];
            } catch (fallbackError) {
                console.error('Fallback search also failed:', fallbackError.message);
                throw error;
            }
        }
    }

    /**
     * Get child issues of an Epic using Agile API
     * This is the most reliable way to find stories linked to an Epic
     */
    async getEpicChildren(epicKey, maxResults = 100) {
        try {
            const response = await this.jiraClient.get(`/rest/agile/1.0/epic/${epicKey}/issue`, {
                params: {
                    maxResults: maxResults,
                    fields: 'summary,issuetype,status,description,customfield_10474'
                }
            });
            return response.data.issues || [];
        } catch (error) {
            console.error(`Error fetching children of Epic ${epicKey}:`, error.message);
            return [];
        }
    }
}

module.exports = JiraIntegration;
