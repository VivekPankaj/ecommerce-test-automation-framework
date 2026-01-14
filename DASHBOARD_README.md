# 🚀 Vulcan Test Dashboard

## Overview

The Vulcan Test Dashboard is a comprehensive web-based interface for managing and executing automated test suites. It provides real-time test execution, Jira integration, and detailed reporting capabilities.

## 🎯 Features

### 1. Module Management
- **Auto-discovery**: Automatically scans feature files and discovers test modules
- **Module Cards**: Visual cards showing module status, scenario counts, and Jira stories
- **Priority Filtering**: Filter scenarios by P1 (Critical), P2 (Important), P3 (Optional)
- **Scenario Selection**: Select specific scenarios to run from each module

### 2. Test Execution
- **Real-time Logs**: Live streaming of test execution logs using Server-Sent Events (SSE)
- **Execution Control**: Start, stop, and monitor test runs
- **Execution History**: View past test executions with results
- **Headless/Headed Mode**: Choose between headless or headed browser execution

### 3. Jira Integration
- **Story Counts**: Displays Jira story counts per module
- **Auto-sync Results**: Automatically updates Jira with test execution results
- **Test Case Mapping**: Maps test scenarios to Jira issues via tags
- **Execution Summaries**: Creates summary issues for test runs

### 4. Analytics & Reporting
- **Dashboard Statistics**: Total modules, scenarios, Jira stories
- **Priority Breakdown**: P1/P2/P3 scenario distribution
- **Pass Rate Tracking**: Module-wise pass rates
- **Execution Time**: Track execution duration per module

## 🏗️ Architecture

```
vulcan_ecomm_storefront_automation/
├── dashboard/
│   ├── server.js                 # Express.js backend API
│   └── public/
│       └── index.html            # React frontend (single-page app)
├── utils/
│   ├── jiraIntegration.js        # Jira API wrapper
│   └── test-jira-connection.js   # Connection test utility
├── Ecomm/features/               # Cucumber feature files
└── .env                          # Environment configuration
```

### Backend API (Express.js)

**Port**: 3001

**Endpoints**:
- `GET /api/modules` - Get all test modules
- `GET /api/modules/:moduleId/scenarios` - Get scenarios for a module
- `POST /api/tests/run` - Start test execution
- `GET /api/tests/execution/:executionId/stream` - SSE stream for logs
- `GET /api/tests/execution/:executionId` - Get execution status
- `POST /api/tests/execution/:executionId/stop` - Stop execution
- `GET /api/modules/stats` - Get dashboard statistics
- `GET /api/tests/history` - Get execution history

### Frontend (React)

**Components**:
- **App**: Main application container
- **Header**: Application header with branding
- **ModuleCard**: Individual module card with actions
- **ScenarioModal**: Modal for scenario selection
- **ExecutionPanel**: Real-time execution logs viewer

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
npm install express axios dotenv socket.io cors

# Verify installation
npm list express axios dotenv
```

### 2. Configuration

Create `.env` file in project root:

```env
# Jira Configuration
JIRA_URL=https://vulcanmaterials.atlassian.net
JIRA_EMAIL=pankajv@vmcmail.com
JIRA_API_TOKEN=your_api_token_here
JIRA_FILTER_ID=16283
JIRA_PROJECT_KEY=SHOP

# Test Environment
TEST_ENV=QA
TEST_URL=https://qa-shop.vulcanmaterials.com

# Server Configuration
PORT=3001
```

### 3. Test Jira Connection

```bash
npm run test:jira
```

Expected output:
```
🔍 Testing Jira Connection...

1️⃣ Testing getTestCases()...
   ✅ SUCCESS: Found 100 test cases
   📋 Sample: SHOP-123 - Test login functionality

2️⃣ Testing getIssuesFromFilter()...
   ✅ SUCCESS: Found 50 issues from filter
   📋 Sample: SHOP-456 - Implement cart functionality

✨ Connection test complete!
```

### 4. Start Dashboard

```bash
npm run dashboard
```

Expected output:
```
╔═══════════════════════════════════════════════════════╗
║   🚀 Vulcan Test Dashboard Server                    ║
║                                                       ║
║   Server running on: http://localhost:3001           ║
║   API Docs: http://localhost:3001/api/modules        ║
║                                                       ║
║   Jira Integration: ✓ Enabled                        ║
║   Real-time Logs: ✓ SSE Stream                       ║
║   Module Discovery: ✓ Auto-scan                      ║
╚═══════════════════════════════════════════════════════╝
```

### 5. Access Dashboard

Open browser and navigate to:
```
http://localhost:3001
```

## 📋 Usage

### Running Tests via Dashboard

1. **View All Modules**
   - Dashboard displays all available test modules
   - Each card shows scenario count, Jira stories, and priority breakdown

2. **Run Entire Module**
   - Click "Run Tests" button on module card
   - Tests execute with all scenarios
   - Logs stream in real-time

3. **Run Selected Scenarios**
   - Click "View Scenarios" button
   - Select priority filter (ALL/P1/P2/P3)
   - Check scenarios to run
   - Click "Run X Tests" button

4. **Monitor Execution**
   - Execution panel opens automatically
   - View real-time logs (color-coded: green=stdout, red=stderr)
   - Stop execution anytime with "Stop" button
   - Results auto-sync to Jira

### Running Tests via CLI

```bash
# Run specific module
npx cucumber-js --tags "@Login"

# Run by priority
npx cucumber-js --tags "@P1"

# Run sanity suite
npm run test:sanity

# Run full regression
npm run test:regression
```

## 🎨 UI Components

### Module Card
```
┌─────────────────────────────────┐
│ Login Module              [ready]│
│ User authentication tests       │
├─────────────┬───────────────────┤
│ Scenarios: 5│ Jira Stories: 12  │
├─────────────┴───────────────────┤
│ [P1: 3] [P2: 1] [P3: 1]         │
├─────────────────────────────────┤
│ [▶ Run Tests] [👁 View Scenarios]│
└─────────────────────────────────┘
```

### Priority Badges

- **P1 (Critical)**: Red badge - Must-have flows
- **P2 (Important)**: Orange badge - Important functionality
- **P3 (Optional)**: Green badge - Nice-to-have tests

### Scenario Selection Modal

```
╔═══════════════════════════════════════╗
║ Login Module                          ║
║ Select scenarios to execute           ║
╠═══════════════════════════════════════╣
║ [ALL (5)] [P1 (3)] [P2 (1)] [P3 (1)] ║
╠═══════════════════════════════════════╣
║ ☑ Valid login with email        [P1] ║
║ ☑ Invalid credentials            [P1] ║
║ ☑ Logout functionality           [P1] ║
║ ☐ Remember me checkbox           [P2] ║
║ ☐ Forgot password link           [P3] ║
╠═══════════════════════════════════════╣
║ 3 scenarios selected                  ║
║              [Cancel] [Run 3 Tests]   ║
╚═══════════════════════════════════════╝
```

## 🔗 Jira Integration

### Mapping Tests to Jira

Add Jira issue key as tag in feature file:

```gherkin
@Login @SHOP-123
Scenario: Valid login with email
  Given user is on login page
  When user enters valid credentials
  Then user should be logged in
```

### Auto-sync Results

After test execution:
1. Extracts Jira tags from scenarios
2. Updates corresponding Jira issues with:
   - Test status (PASSED/FAILED)
   - Execution time
   - Error message (if failed)
   - Environment (QA/STAGING/PROD)
3. Transitions issues (PASSED → Done, FAILED → In Progress)
4. Adds comment with execution details

### Manual Sync

```javascript
const jira = new JiraIntegration();
await jira.syncTestResults('./test_results.json');
```

## 📊 API Examples

### Get Modules
```bash
curl http://localhost:3001/api/modules
```

Response:
```json
{
  "modules": [
    {
      "id": "login",
      "name": "Login Module",
      "description": "User authentication tests",
      "status": "ready",
      "scenarioCount": 5,
      "jiraStoryCount": 12,
      "priorityCounts": { "p1": 3, "p2": 1, "p3": 1 },
      "tags": ["@Login", "@Sanity"],
      "featureFile": "login-page-validation.feature",
      "scenarios": [...]
    }
  ]
}
```

### Run Tests
```bash
curl -X POST http://localhost:3001/api/tests/run \
  -H "Content-Type: application/json" \
  -d '{
    "modules": ["login", "cart"],
    "headless": true,
    "selectedScenarios": {
      "login": ["Valid login with email"],
      "cart": ["Add single product"]
    }
  }'
```

Response:
```json
{
  "executionId": "exec_1705234567890",
  "status": "started",
  "message": "Test execution started for modules: login, cart"
}
```

### Stream Logs (SSE)
```bash
curl -N http://localhost:3001/api/tests/execution/exec_1705234567890/stream
```

Response:
```
data: {"type":"connected","executionId":"exec_1705234567890"}

data: {"type":"stdout","message":"Starting test execution...\n"}

data: {"type":"stdout","message":"✓ Valid login with email\n"}

data: {"type":"complete","status":"passed","exitCode":0}
```

## 🛠️ Development

### Running in Dev Mode

```bash
# Install nodemon
npm install -g nodemon

# Start with auto-reload
npm run dashboard:dev
```

### Adding New Modules

1. Create feature file in `Ecomm/features/`
2. Add appropriate tags (@ModuleName, @P1/@P2/@P3)
3. Dashboard auto-discovers on next request

### Customizing Module Detection

Edit `dashboard/server.js`:

```javascript
function discoverModules() {
    // Customize module discovery logic
    // Add custom metadata, filtering, grouping
}
```

### Customizing Jira Mapping

Edit `utils/jiraIntegration.js`:

```javascript
async enrichModulesWithJiraData(modules) {
    // Customize Jira issue matching
    // Add custom field extraction
}
```

## 🔧 Troubleshooting

### Dashboard Not Loading

**Issue**: `Cannot GET /`

**Solution**:
```bash
# Check if server is running
curl http://localhost:3001/api/modules

# Verify public folder exists
ls dashboard/public/index.html
```

### SSE Connection Error

**Issue**: Logs not streaming

**Solution**:
```bash
# Check browser console for errors
# Verify execution ID is valid
curl http://localhost:3001/api/tests/execution/<executionId>
```

### Jira API Errors

**Issue**: `401 Unauthorized`

**Solution**:
```bash
# Test connection
npm run test:jira

# Verify credentials in .env
cat .env | grep JIRA

# Regenerate API token if needed
# https://id.atlassian.com/manage-profile/security/api-tokens
```

### Module Discovery Issues

**Issue**: Modules not appearing

**Solution**:
```bash
# Check feature files exist
ls Ecomm/features/*.feature

# Verify feature file format
head -n 10 Ecomm/features/login-page-validation.feature

# Check server logs
npm run dashboard
```

## 📈 Performance

### Optimization Tips

1. **Limit Concurrent Executions**: Run one module at a time
2. **Use Headless Mode**: Faster execution without browser UI
3. **Filter by Priority**: Run P1 tests first for quick feedback
4. **Selective Scenarios**: Only run changed/affected tests

### Benchmarks

- **Module Discovery**: ~50ms for 10 modules
- **SSE Connection**: <100ms latency
- **Jira API Call**: 200-500ms per request
- **Test Execution Start**: <1s overhead

## 🔒 Security

### Best Practices

1. **Never commit `.env`**: Already in `.gitignore`
2. **Use API tokens**: Not passwords
3. **Rotate tokens**: Every 90 days
4. **Restrict CORS**: Update `cors()` config in production
5. **Use HTTPS**: In production environment

### Production Checklist

- [ ] Environment variables secured
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] API rate limiting implemented
- [ ] Authentication added (if needed)
- [ ] Logs sanitized (no secrets)

## 📝 NPM Scripts

```json
{
  "test:sanity": "Run @Sanity test suite (33 scenarios)",
  "test:regression": "Run @Regression test suite (135 scenarios)",
  "dashboard": "Start dashboard server",
  "dashboard:dev": "Start dashboard with auto-reload",
  "test:jira": "Test Jira API connection",
  "report": "Generate HTML test report"
}
```

## 📞 Support

### Common Commands

```bash
# Check server status
curl http://localhost:3001/api/modules/stats

# View execution history
curl http://localhost:3001/api/tests/history

# Test specific module
npx cucumber-js --tags "@Login"

# Generate report
npm run report
```

### Logs Location

- **Test Results**: `test_results.json`
- **Cucumber Report**: `cucumber-report.html`
- **Screenshots**: `screenshot*.png`
- **Server Logs**: Console output

## 🎓 Additional Resources

- **Cucumber.js Docs**: https://github.com/cucumber/cucumber-js
- **Playwright Docs**: https://playwright.dev
- **Jira REST API**: https://developer.atlassian.com/cloud/jira/platform/rest/v3
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

**Version**: 1.0.0  
**Last Updated**: January 14, 2026  
**Maintainer**: Vulcan QA Team
