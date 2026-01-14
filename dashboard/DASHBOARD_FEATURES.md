# Vulcan E-Commerce Test Dashboard - Feature Documentation

## Overview
Comprehensive test automation dashboard with 5 integrated tabs for managing test modules, monitoring execution, analyzing results, AI-powered test generation, and Jira defect logging.

## Architecture
- **Backend**: Express.js server (Port 3001) with 8 REST API endpoints
- **Frontend**: Single-page React application (no build step required)
- **Real-time**: Server-Sent Events (SSE) for live test logs
- **Integration**: Jira API v2 for defect management
- **Theme**: Vulcan corporate branding (Blue #003087, #0066CC)

---

## Features by Tab

### 1. 📦 Modules Tab
**Purpose**: View and execute test modules

**Features**:
- Auto-discovery of test modules from feature files
- Display of module statistics:
  - Total modules/scenarios
  - Jira story counts
  - Priority breakdown (P1/P2/P3)
- Module cards with:
  - Scenario count
  - Jira stories linked
  - Priority distribution
  - Quick actions: "Run All" and "Select Scenarios"
- Scenario selection modal:
  - View all scenarios in a module
  - Select specific scenarios to run
  - Run selected button

**API Endpoints Used**:
- `GET /api/modules` - Get all modules
- `GET /api/modules/stats` - Get aggregate statistics
- `GET /api/modules/:id/scenarios` - Get scenarios for a module
- `POST /api/tests/run` - Start test execution

---

### 2. ▶️ Execution Tab
**Purpose**: Monitor real-time test execution

**Features**:
- Real-time log streaming via SSE
- Execution status indicators:
  - Running (yellow pulse)
  - Passed (green)
  - Failed (red)
- Live console output display:
  - Color-coded logs (green for stdout, red for stderr)
  - Auto-scroll to latest log
  - Terminal-style formatting
- Stop execution button (while running)
- Execution ID display
- Full-screen mode when accessed from Execution tab
- Modal mode when launched from Modules tab

**API Endpoints Used**:
- `GET /api/tests/execution/:id/stream` - SSE stream for logs
- `POST /api/tests/execution/:id/stop` - Stop running execution

---

### 3. 📊 Analytics Tab
**Purpose**: View execution history and aggregate statistics

**Features**:
- **Statistics Dashboard**:
  - Total executions
  - Passed executions
  - Failed executions
  - Pass rate percentage
- **Filters**:
  - Filter by status (All/Completed/Running/Failed)
  - Filter by module
- **Execution History Table**:
  - Execution ID (shortened)
  - Modules executed
  - Status badge
  - Duration
  - Results (passed/failed/total)
  - Start timestamp
  - Click row to view details
- **Execution Details Modal**:
  - Full execution ID
  - Status and timestamps
  - Module list
  - Results breakdown with visual cards
- **Download Report**:
  - Export full history as JSON file
  - Dated filename format

**API Endpoints Used**:
- `GET /api/tests/history` - Get execution history

---

### 4. 🤖 AI Commander Tab
**Purpose**: Natural language test generation and automation (Coming Soon)

**Features**:
- **Command Input**:
  - Text field for natural language commands
  - Send button with loading state
- **Example Commands** (Quick-fill chips):
  - "Generate test scenarios for Cart module"
  - "Run all P1 tests"
  - "Analyze last execution failures"
  - "Create regression suite for Checkout"
  - "Find flaky tests in Search module"
- **Command History**:
  - Display of submitted commands
  - Status indicators (Processing/Completed/Error)
  - Timestamp for each command
  - AI responses shown in expandable sections
- **Status**: Demo mode - AI integration in progress

**Planned API Endpoints**:
- `POST /api/ai/command` - Process AI command (TODO)
- `GET /api/ai/history` - Get command history (TODO)

**Future Capabilities**:
- Generate test scenarios from natural language
- Run specific test combinations via commands
- Analyze test failures and suggest fixes
- Create custom test suites dynamically
- Identify flaky or problematic tests

---

### 5. ⚠️ Defects Tab
**Purpose**: Create and track Jira defects from test failures

**Features**:
- **Defect Creation Form**:
  - Summary field (required)
  - Description field (required, multi-line)
  - Module dropdown (populated from modules)
  - Priority selection (P1/P2/P3/P4)
  - Screenshot upload
  - Submit button with loading state
- **Recent Defects List**:
  - Defect summary
  - Jira ID
  - Module and priority
  - Creation timestamp
  - Status badge
  - Description preview (truncated)
- **Status**: Demo mode - Jira integration in progress

**Planned API Endpoints**:
- `POST /api/defects/create` - Create Jira defect (TODO)
- `POST /api/defects/upload` - Upload screenshot (TODO)
- `GET /api/defects/recent` - Get recent defects (TODO)

**Jira Integration (Backend Ready)**:
- Create issues in SHOP project
- Attach screenshots
- Set priority and module labels
- Auto-link to test execution
- Track defect status

---

## Navigation

### Sidebar
- Fixed left sidebar (64px wide)
- 5 tab buttons with icons:
  - ⊞ Modules
  - ▶ Execution
  - 📊 Analytics
  - 🤖 AI Commander
  - ⚠ Defects
- Active tab highlighted in light blue (#0066CC)
- Footer displays:
  - Framework version (Playwright + Cucumber)
  - Jira connection status
  - Test environment (QA)

### Header
- Vulcan gradient background
- "Vulcan E-Commerce Test Dashboard" title
- Tagline: "Automated Testing Platform"

---

## Styling & Theme

### Color Palette (Vulcan Corporate)
- **Primary**: #003087 (Vulcan Blue)
- **Secondary**: #0066CC (Light Blue)
- **Success**: #28a745 (Green)
- **Error**: #dc3545 (Red)
- **Warning**: #ffc107 (Yellow)
- **Background**: White, #f8f9fa (Light Gray)

### Design Elements
- Rounded cards with shadows
- Gradient headers (Vulcan blue → light blue)
- Hover effects on interactive elements
- Status badges with color coding
- Responsive grid layouts
- Smooth transitions and animations

---

## Backend API Endpoints

### Existing Endpoints
1. `GET /api/modules` - List all test modules
2. `GET /api/modules/:id/scenarios` - Get scenarios for module
3. `GET /api/modules/stats` - Get aggregate statistics
4. `POST /api/tests/run` - Start test execution
5. `GET /api/tests/execution/:id/stream` - SSE log stream
6. `POST /api/tests/execution/:id/stop` - Stop execution
7. `GET /api/tests/history` - Get execution history
8. `GET /api/tests/execution/:id/status` - Get execution status

### Planned Endpoints (TODO)
9. `POST /api/ai/command` - Process AI command
10. `GET /api/ai/history` - Get AI command history
11. `POST /api/defects/create` - Create Jira defect
12. `POST /api/defects/upload` - Upload screenshot
13. `GET /api/defects/recent` - Get recent defects
14. `GET /api/tests/history/aggregate` - Enhanced aggregate stats

---

## Usage

### Starting the Dashboard
```bash
# Terminal 1: Start backend server
cd dashboard
node server.js

# Dashboard available at: http://localhost:3001
```

### Running Tests
1. Navigate to **Modules** tab
2. Click **"Run All"** on a module card, OR
3. Click **"Select Scenarios"** to choose specific tests
4. Execution automatically switches to **Execution** tab
5. View real-time logs and status
6. Check results in **Analytics** tab

### Analyzing Results
1. Navigate to **Analytics** tab
2. View aggregate statistics at top
3. Filter by status or module
4. Click any execution row for details
5. Download full report as JSON

### Creating Defects (Demo Mode)
1. Navigate to **Defects** tab
2. Fill in defect form:
   - Summary of issue
   - Detailed description
   - Select module
   - Choose priority
   - Upload screenshot (optional)
3. Click **"Create Jira Defect"**
4. View in Recent Defects list

### AI Commands (Demo Mode)
1. Navigate to **AI Commander** tab
2. Type natural language command or click example
3. Click **Send**
4. View processing status
5. Check Command History for results

---

## Technical Stack

### Frontend
- **React 18** (via CDN, no build step)
- **TailwindCSS** (via CDN)
- **Babel Standalone** (JSX transformation)
- **Server-Sent Events** (real-time logs)

### Backend
- **Node.js** with Express.js
- **Child Process** (test execution)
- **File System** (feature file parsing)
- **Jira API v2** (defect management)

### Testing Framework
- **Playwright** (browser automation)
- **Cucumber.js** (BDD scenarios)
- **@Sanity** tag (33 P1 scenarios)
- **@Regression** tag (135 scenarios)

---

## File Structure
```
dashboard/
├── server.js              # Express.js backend (508 lines)
├── public/
│   └── index.html         # React frontend (1300+ lines)
├── reference/             # Reference UI (TypeScript, for features)
│   ├── App.tsx
│   ├── Sidebar.tsx
│   └── components/
│       ├── AICommandWindow.tsx
│       ├── DefectLogger.tsx
│       ├── TestAnalytics.tsx
│       ├── ModuleSelector.tsx
│       └── TestExecutionPanel.tsx
└── DASHBOARD_FEATURES.md  # This file

utils/
└── jiraIntegration.js     # Jira API wrapper (280 lines)

.env                       # Environment & Jira credentials
```

---

## Next Steps

### Immediate
1. ✅ Complete 5-tab navigation structure
2. ✅ Implement Analytics tab
3. ✅ Implement AI Commander tab (demo mode)
4. ✅ Implement Defect Logger tab (demo mode)

### Backend Integration (TODO)
1. Create AI command processing endpoint
   - Integrate with OpenAI or similar LLM
   - Parse natural language commands
   - Execute test generation/analysis
2. Create Jira defect endpoints
   - Connect to existing `utils/jiraIntegration.js`
   - Handle screenshot uploads
   - Track defect lifecycle
3. Enhance analytics endpoint
   - Add trend calculations
   - Generate pass rate charts
   - Export formatted reports

### Future Enhancements
1. **AI Features**:
   - Auto-generate test scenarios
   - Intelligent test selection
   - Failure pattern analysis
   - Self-healing tests
2. **Analytics**:
   - Trend charts (Chart.js)
   - Flakiness detection
   - Performance metrics
   - Historical comparisons
3. **Defects**:
   - Auto-create from failures
   - Screenshot capture on fail
   - Link to execution details
   - Bulk defect creation
4. **General**:
   - User authentication
   - Role-based access
   - Scheduled executions
   - Email notifications
   - Slack integration

---

## Benefits

### For QA Engineers
- **One dashboard** for all test activities
- **Real-time feedback** during execution
- **Easy defect logging** without leaving dashboard
- **Historical data** for trend analysis

### For Test Automation
- **Quick module execution** with scenario selection
- **Live log monitoring** replaces terminal watching
- **AI assistance** for test generation (coming soon)
- **Integrated Jira** for defect tracking

### For Management
- **Executive statistics** (pass rate, coverage)
- **Execution history** with filtering
- **Downloadable reports** for stakeholders
- **Professional Vulcan branding**

---

## Maintenance

### Updating Modules
- Auto-discovered from `Ecomm/features/*.feature` files
- No manual configuration needed
- Restart server.js to refresh module list

### Modifying Theme
- Edit CSS in `dashboard/public/index.html` `<style>` section
- Update Vulcan color variables:
  - `.vulcan-gradient`
  - `.vulcan-blue`
  - `.vulcan-button`

### Adding API Endpoints
1. Edit `dashboard/server.js`
2. Add route handler
3. Update this documentation
4. Restart server

---

## Support

**Dashboard Issues**:
- Check browser console for errors
- Verify server.js is running on port 3001
- Ensure test modules exist in `Ecomm/features/`

**Jira Integration**:
- Verify `.env` credentials
- Test with `node utils/test-jira-connection.js`
- Check Jira API v2 endpoints

**Test Execution**:
- Verify Playwright installed
- Check `package.json` dependencies
- Review `playwright.config.js`

---

**Version**: 1.0.0  
**Last Updated**: January 14, 2026  
**Framework**: Playwright + Cucumber.js + React  
**Theme**: Vulcan Corporate Blue/White
