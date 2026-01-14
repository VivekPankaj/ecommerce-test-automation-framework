# Dashboard Quick Start Guide

## 🚀 Launch Dashboard
```bash
node ---

### 5️⃣ AI Commander Tab ⚡
**What it does**: Natural language test commands
- Type commands like "Generate test scenarios for Cart module"
- View command history
- See processing status

**Status**: 🚧 Coming Soon (UI ready, backend integration in progress)

**Example Commands**:
- "Generate test scenarios for Cart module"
- "Run all P1 tests"
- "Analyze last execution failures"
- "Create regression suite for Checkout"
- "Find flaky tests in Search module"

---

### 6️⃣ Defects Tab# Opens on http://localhost:3001
```

## 📋 5-Tab Navigation

### 1️⃣ Modules Tab
**What it does**: Select and run test modules
- View all test modules with stats
- Run entire module or selected scenarios
- See Jira story counts and priorities

**Quick Actions**:
- Click "Run All Tests" → Starts execution
- Click "View Scenarios" → Select specific tests
- Selected scenarios → "Run Selected Tests"

---

### 2️⃣ Execution Tab  
**What it does**: Monitor tests in real-time
- Live streaming logs (green/red)
- Stop button during execution
- Status tracking (Running/Passed/Failed)

**Auto-switches here when you start tests from Modules tab**

---

### 3️⃣ Analytics Tab
**What it does**: Review test history and trends
- Execution history table
- Pass rate statistics
- Filter by status/module
- Download JSON reports

**Quick Actions**:
- Click any row → View detailed results
- Use filters → Narrow down executions
- Click "Download Report" → Export as JSON

---

### 4️⃣ Executive Report Tab 📋 **NEW!**
**What it does**: Professional executive summary
- KPI cards (Total, Passed, Failed, Pass Rate)
- Executive narrative summary
- Module execution table
- Smart recommendations
- Export to PDF/Excel (coming soon)

**Perfect for:**
- Management presentations
- Deployment decisions
- Quality metrics reporting
- Stakeholder updates

**Quick Actions**:
- Auto-loads latest test execution
- View professional summary
- Get deployment recommendations
- Export report (framework ready)

---

### 5️⃣ AI Commander Tab ⚡
**What it does**: Natural language test commands
- Type commands like "Generate test scenarios for Cart module"
- View command history
- See processing status

**Status**: 🚧 Coming Soon (UI ready, backend integration in progress)

**Example Commands**:
- "Generate test scenarios for Cart module"
- "Run all P1 tests"
- "Analyze last execution failures"
- "Create regression suite for Checkout"
- "Find flaky tests in Search module"

---

### 5️⃣ Defects Tab
**What it does**: Create Jira defects from test failures
- Fill form: Summary, Description, Module, Priority
- Upload screenshot (optional)
- View recent defects

**Status**: 🚧 Coming Soon (UI ready, Jira endpoint integration in progress)

**Form Fields**:
- **Summary**: Brief issue description (required)
- **Description**: Detailed reproduction steps (required)
- **Module**: Select from dropdown (required)
- **Priority**: P1 (Critical) → P4 (Low)
- **Screenshot**: Upload image file

---

## 🎨 Vulcan Theme
- **Primary**: Vulcan Blue (#003087)
- **Secondary**: Light Blue (#0066CC)
- **Success**: Green (#28a745)
- **Error**: Red (#dc3545)
- **Warning**: Yellow (#ffc107)

---

## 🔧 Backend API Endpoints

### ✅ Active Endpoints
1. `GET /api/modules` - List all modules
2. `GET /api/modules/:id/scenarios` - Get scenarios
3. `POST /api/tests/run` - Start execution
4. `GET /api/tests/execution/:id/stream` - SSE logs
5. `POST /api/tests/execution/:id/stop` - Stop tests
6. `GET /api/modules/stats` - Statistics
7. `GET /api/tests/history` - Execution history

### 🚧 Coming Soon
1. `POST /api/ai/command` - AI command processing
2. `POST /api/defects/create` - Create Jira defect
3. `POST /api/defects/upload` - Upload screenshot

---

## 📊 Test Execution Flow

```
Modules Tab
    ↓
  Select Module/Scenarios
    ↓
  Click "Run Tests"
    ↓
Execution Tab (auto-opens)
    ↓
  Monitor Live Logs
    ↓
  Execution Completes
    ↓
Analytics Tab
    ↓
  View Results & History
```

---

## 🎯 Quick Tips

1. **Start Simple**: Use Modules tab to run your first test
2. **Watch Live**: Execution tab shows real-time progress
3. **Review History**: Analytics tab shows all past runs
4. **Filter Results**: Use status/module filters in Analytics
5. **Download Data**: Export execution history as JSON

---

## 🐛 Troubleshooting

**Dashboard won't load?**
```bash
# Check if server is running
lsof -ti:3001

# If not running, start it
node dashboard/server.js
```

**No modules showing?**
- Verify feature files exist in `Ecomm/features/`
- Check server console for errors
- Refresh browser (Ctrl+R / Cmd+R)

**Execution not starting?**
- Verify Playwright is installed: `npx playwright --version`
- Check package.json for test scripts
- Review server logs for errors

**SSE logs not streaming?**
- Ensure execution ID is valid
- Check browser console for connection errors
- Verify port 3001 is not blocked by firewall

---

## 📁 File Locations

- **Dashboard Server**: `dashboard/server.js`
- **Frontend**: `dashboard/public/index.html`
- **Features Doc**: `dashboard/FEATURES.md`
- **Quick Start**: `dashboard/QUICKSTART.md` (this file)
- **Test Modules**: `Ecomm/features/*.feature`

---

## 🔐 Environment Setup

Required in `.env`:
```env
JIRA_URL=https://vulcanmaterials.atlassian.net
JIRA_EMAIL=your-email@vulcanmaterials.com
JIRA_API_TOKEN=your-token
JIRA_FILTER_ID=16283
JIRA_PROJECT_KEY=SHOP
TEST_ENV=QA
TEST_URL=https://qa-shop.vulcanmaterials.com
```

---

## 🎓 Learn More

- **Full Features**: See `FEATURES.md`
- **Backend API**: Review `server.js` comments
- **Test Framework**: Playwright + Cucumber.js docs
- **Jira Integration**: Check `utils/jiraIntegration.js`

---

**Happy Testing! 🧪**
