# Vulcan Test Dashboard - Quick Start Guide

## 🚀 Starting the Dashboard

### Step 1: Start Backend Server
```bash
cd dashboard
node server.js
```

**Expected Output**:
```
✓ Dashboard server running on http://localhost:3001
✓ Discovered 9 test modules
✓ Ready to accept connections
```

### Step 2: Open Dashboard
- Open browser to: **http://localhost:3001**
- Dashboard will load with 5 tabs visible in sidebar

---

## 📋 Using Each Tab

### 1️⃣ Modules Tab (Default View)
**Purpose**: Select and run test modules

**Steps**:
1. View all available modules in grid
2. See statistics: modules, scenarios, Jira stories
3. **Option A**: Click **"Run All"** button on any module
4. **Option B**: Click **"Select Scenarios"** → Choose specific tests → **"Run Selected"**
5. Execution automatically starts and switches to Execution tab

### 2️⃣ Execution Tab
**Purpose**: Monitor running tests in real-time

**What You'll See**:
- ✅ Execution ID
- ✅ Status indicator (Running/Passed/Failed)
- ✅ Live console logs (color-coded)
- ✅ Stop button (if running)

**Auto-Scroll**: Logs automatically scroll to latest entry

### 3️⃣ Analytics Tab
**Purpose**: View test execution history and statistics

**Features**:
1. **Top Stats Cards**:
   - Total executions
   - Passed count
   - Failed count
   - Pass rate %

2. **Filter Controls**:
   - Status: All/Completed/Running/Failed
   - Module: Select specific module

3. **Execution History Table**:
   - Click any row to see detailed results
   - View passed/failed breakdown
   - Check execution duration

4. **Download Report**:
   - Click **"Download Report"** button
   - Exports full history as JSON

### 4️⃣ AI Commander Tab (Demo Mode)
**Purpose**: Generate tests using natural language

**How to Use**:
1. Type command in input field, OR
2. Click any example command chip:
   - "Generate test scenarios for Cart module"
   - "Run all P1 tests"
   - "Analyze last execution failures"
3. Click **"Send"** button
4. View command history with status

**Note**: AI integration coming soon - currently shows demo responses

### 5️⃣ Defects Tab (Demo Mode)
**Purpose**: Create Jira defects from test failures

**Steps**:
1. Fill in form:
   - **Summary**: Brief issue description
   - **Description**: Detailed steps to reproduce
   - **Module**: Select from dropdown
   - **Priority**: P1/P2/P3/P4
   - **Screenshot**: Upload image (optional)
2. Click **"Create Jira Defect"**
3. View in "Recent Defects" panel

**Note**: Jira integration coming soon - currently demo mode

---

## 🎯 Common Workflows

### Run All Tests in a Module
```
Modules Tab → Click module "Run All" → Watch in Execution Tab
```

### Run Specific Scenarios
```
Modules Tab → Click "Select Scenarios" → Choose tests → "Run Selected" → Watch execution
```

### Review Last 10 Executions
```
Analytics Tab → View history table → Click row for details
```

### Filter Failed Executions
```
Analytics Tab → Status dropdown → Select "Completed" → Review failed tests
```

### Export Test Report
```
Analytics Tab → Click "Download Report" → Save JSON file
```

---

## 🎨 Dashboard Features

### Sidebar Navigation
- **⊞ Modules**: Test module selection
- **▶ Execution**: Real-time test monitoring
- **📊 Analytics**: History and statistics
- **🤖 AI Commander**: Natural language commands
- **⚠ Defects**: Jira defect logging

### Visual Indicators
- 🟢 **Green**: Passed tests
- 🔴 **Red**: Failed tests
- 🟡 **Yellow**: Running tests
- 🔵 **Blue**: Ready/Available

### Real-Time Features
- Live log streaming (SSE)
- Auto-updating status
- Instant execution feedback

---

## ⚙️ Configuration

### Environment Variables (.env)
```bash
# Jira Configuration
JIRA_URL=vulcanmaterials.atlassian.net
JIRA_EMAIL=your-email@vulcanmaterials.com
JIRA_API_TOKEN=your-token
JIRA_FILTER_ID=16283
JIRA_PROJECT_KEY=SHOP

# Test Configuration
TEST_ENV=QA
TEST_URL=https://qa-shop.vulcanmaterials.com
```

### Test Tags
- **@Sanity**: 33 critical P1 scenarios
- **@Regression**: 135 total scenarios

---

## 🔧 Troubleshooting

### Dashboard Won't Load
**Problem**: Page shows connection error
**Solution**:
```bash
# Verify server is running
cd dashboard
node server.js

# Check port 3001 is available
lsof -i :3001
```

### No Modules Showing
**Problem**: Module grid is empty
**Solution**:
```bash
# Verify feature files exist
ls -la Ecomm/features/*.feature

# Restart server to refresh
# Ctrl+C to stop, then:
node server.js
```

### Execution Logs Not Streaming
**Problem**: Logs frozen or not updating
**Solution**:
1. Check browser console for errors (F12)
2. Verify SSE connection in Network tab
3. Refresh page (F5)

### Tests Won't Run
**Problem**: Execution fails to start
**Solution**:
```bash
# Verify Playwright installed
npm list playwright

# Check test configuration
cat playwright.config.js

# Test manually
npx cucumber-js Ecomm/features/login-page-validation.feature
```

---

## 📊 Understanding Statistics

### Module Stats Card
- **Total Modules**: Count of .feature files
- **Total Scenarios**: All test scenarios across modules
- **Jira Stories**: Linked Jira issues
- **Priority Breakdown**: P1 (critical), P2 (high), P3 (medium)

### Module Card Details
- **Scenarios**: Total test cases in module
- **Jira Stories**: Associated Jira issues
- **P1/P2/P3**: Priority distribution

### Analytics Stats
- **Total Executions**: All test runs (historical)
- **Passed**: Executions with 0 failures
- **Failed**: Executions with 1+ failures
- **Pass Rate**: (Passed / Total) × 100%

---

## 🎓 Best Practices

### Running Tests
1. ✅ **Use scenario selection** for specific test cases
2. ✅ **Run @Sanity** for smoke testing (33 tests)
3. ✅ **Run @Regression** for full coverage (135 tests)
4. ✅ **Monitor execution tab** for real-time feedback
5. ✅ **Review analytics** after each run

### Managing Executions
1. ✅ **Stop hanging executions** using Stop button
2. ✅ **Filter by module** to track specific areas
3. ✅ **Download reports** for stakeholder meetings
4. ✅ **Check pass rate trends** in analytics

### Defect Logging
1. ✅ **Create defect immediately** after failure
2. ✅ **Include screenshot** for visual issues
3. ✅ **Set correct priority** (P1 for blockers)
4. ✅ **Link to module** for traceability

---

## 🔐 Security Notes

### Credentials
- Never commit `.env` file to Git
- Rotate Jira API tokens regularly
- Use read-only tokens when possible

### Access
- Dashboard runs on localhost (development)
- For production, add authentication
- Consider VPN/firewall for remote access

---

## 📞 Support

### Issues?
1. Check this Quick Start Guide
2. Review `/dashboard/DASHBOARD_FEATURES.md` for detailed docs
3. Check browser console for errors (F12 → Console)
4. Verify server logs in terminal

### Common Commands
```bash
# Start dashboard
node dashboard/server.js

# Stop dashboard
Ctrl+C

# Test Jira connection
node utils/test-jira-connection.js

# Run tests manually
npx cucumber-js Ecomm/features/login-page-validation.feature --tags "@Sanity"

# View module statistics
curl http://localhost:3001/api/modules/stats
```

---

## 🚀 Next Steps

1. **Explore All Tabs**: Click through each tab to familiarize yourself
2. **Run Sample Test**: Execute Login module to see execution flow
3. **Check Analytics**: View execution history after running tests
4. **Try AI Commander**: Test example commands (demo mode)
5. **Create Defect**: Fill in defect form to see workflow (demo mode)

---

**Happy Testing! 🎉**

**Dashboard Version**: 1.0.0  
**Framework**: Playwright + Cucumber + React  
**Theme**: Vulcan Corporate Blue
