# Test Automation Dashboard - UI Components Export

## 📦 What's Included

This package contains **only the frontend UI components** for the test automation dashboard. You'll need to create your own backend API in JavaScript/Node.js.

### Files Structure:
```
UI_EXPORT/
├── README.md                 # This file
├── package.json              # Dependencies (React, Vite, TailwindCSS)
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── App.tsx                   # Main application with tab routing
├── api.ts                    # API client (needs backend endpoints)
├── types.ts                  # TypeScript type definitions
└── components/               # All UI components
    ├── ModuleSelector.tsx           ⭐ Main module grid view
    ├── TestExecutionPanel.tsx       ⭐ Test execution view
    ├── Sidebar.tsx                  # Navigation sidebar
    ├── Header.tsx                   # App header
    ├── AICommandWindow.tsx          # AI test generation
    ├── DefectLogger.tsx             # Jira defect logging
    ├── TestAnalytics.tsx            # Test analytics
    └── ... (other components)
```

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

**Dependencies installed:**
- React 18
- TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Query (data fetching)
- Axios (HTTP client)
- Lucide React (icons)
- React Hot Toast (notifications)

### 2. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:4000` (configurable in `vite.config.ts`)

---

## 🔧 Backend API Requirements

You need to create these endpoints in your JavaScript/Node.js backend:

### Required API Endpoints:

#### 1. **GET /api/modules**
Returns list of test modules

**Response:**
```json
[
  {
    "id": "login",
    "name": "Login Module",
    "description": "User authentication tests",
    "status": "ready",
    "scenarioCount": 5,
    "jiraStoryCount": 12,
    "featureFileScenarioCount": 5,
    "priorityCounts": {
      "p1": 3,
      "p2": 1,
      "p3": 1
    },
    "tags": ["@smoke", "@P1", "@locked"],
    "icon": "User"
  }
]
```

#### 2. **GET /api/modules/stats**
Dashboard statistics

**Response:**
```json
{
  "totalModules": 22,
  "readyModules": 4,
  "totalScenarios": 49,
  "totalJiraStories": 100
}
```

#### 3. **GET /api/modules/:moduleId/scenarios**
Get scenarios for a specific module

**Response:**
```json
{
  "module": "login",
  "scenarios": [
    {
      "name": "Valid login with email",
      "priority": "P1",
      "tags": ["@smoke", "@P1"],
      "description": "Test valid login flow",
      "file": "login.feature",
      "line": 10
    }
  ]
}
```

#### 4. **POST /api/tests/run**
Execute tests

**Request:**
```json
{
  "modules": ["login", "cart"],
  "headless": true,
  "selectedScenarios": {
    "login": ["Valid login with email"],
    "cart": ["Add single product"]
  }
}
```

**Response:**
```json
{
  "executionId": "exec-123456",
  "status": "started",
  "timestamp": "2026-01-14T14:30:00Z"
}
```

#### 5. **GET /api/tests/execution/:executionId/stream**
Server-Sent Events (SSE) stream for real-time logs

**SSE Events:**
```
event: log
data: {"timestamp": "2026-01-14T14:30:01Z", "level": "info", "message": "Starting test execution..."}

event: status
data: {"status": "running", "progress": 50}

event: complete
data: {"status": "completed", "passed": 10, "failed": 0}
```

#### 6. **GET /api/modules/:moduleId/jira-url**
Get Jira URL for module stories

**Response:**
```json
{
  "module": "login",
  "jiraUrl": "https://your-jira.atlassian.net/issues/?filter=12345"
}
```

---

## 🎨 UI Components Overview

### 1. **ModuleSelector.tsx** - Main View
- Grid of module cards
- Priority filtering (P1, P2, P3, ALL)
- Scenario selection modal
- Search and filter
- Individual module test execution

**Key Features:**
- Click module card to select
- Click "👁 View" to see scenarios
- Click "▶️ Run" to execute tests
- Click Jira count to open Jira stories

### 2. **TestExecutionPanel.tsx** - Execution View
- Real-time test execution logs
- SSE (Server-Sent Events) streaming
- Stop/Start controls
- Execution history
- Download logs

### 3. **Priority System**
```
P1 (Critical)  - Red badge    - Blocker issues
P2 (Important) - Orange badge - Major features
P3 (Optional)  - Green badge  - Nice-to-have
```

---

## 🔌 Connecting to Your Backend

### Update API Base URL

In `api.ts`, line 4:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

**Options:**
1. **Environment variable**: Create `.env` file
   ```
   VITE_API_URL=http://your-backend:8000/api
   ```

2. **Direct change**: Update the fallback URL
   ```typescript
   const API_BASE_URL = 'http://your-backend:3001/api';
   ```

---

## 🧩 Integration Guide

### Step 1: Module Discovery
Scan your test directory to build module list:

```javascript
// Example Node.js code
const fs = require('fs');
const path = require('path');

function discoverModules(testDir) {
  const modules = [];
  const dirs = fs.readdirSync(testDir);
  
  dirs.forEach(dir => {
    const modulePath = path.join(testDir, dir);
    if (fs.statSync(modulePath).isDirectory()) {
      const scenarios = parseFeatureFiles(modulePath);
      modules.push({
        id: dir,
        name: formatName(dir),
        scenarioCount: scenarios.length,
        priorityCounts: countPriorities(scenarios),
        status: 'ready'
      });
    }
  });
  
  return modules;
}
```

### Step 2: Priority Tag Extraction
Parse test files for @P1, @P2, @P3 tags:

```javascript
function countPriorities(scenarios) {
  const counts = { p1: 0, p2: 0, p3: 0 };
  
  scenarios.forEach(scenario => {
    if (scenario.tags.includes('@P1')) counts.p1++;
    else if (scenario.tags.includes('@P2')) counts.p2++;
    else if (scenario.tags.includes('@P3')) counts.p3++;
  });
  
  return counts;
}
```

### Step 3: Test Execution
Spawn test process and stream output:

```javascript
const { spawn } = require('child_process');

app.post('/api/tests/run', (req, res) => {
  const { modules, headless } = req.body;
  const executionId = generateId();
  
  // Start test process
  const testProcess = spawn('npm', ['test', '--', ...modules]);
  
  // Send SSE
  res.setHeader('Content-Type', 'text/event-stream');
  
  testProcess.stdout.on('data', (data) => {
    res.write(`event: log\ndata: ${JSON.stringify({ message: data.toString() })}\n\n`);
  });
  
  testProcess.on('close', (code) => {
    res.write(`event: complete\ndata: ${JSON.stringify({ status: 'completed', code })}\n\n`);
    res.end();
  });
});
```

### Step 4: Jira Integration
Fetch story counts from Jira API:

```javascript
const axios = require('axios');

async function getJiraStories(moduleKeywords) {
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
  
  const response = await axios.get(
    `${jiraUrl}/rest/api/3/search`,
    {
      headers: { Authorization: `Basic ${auth}` },
      params: {
        jql: `project = ${project} AND status != Done`,
        maxResults: 100
      }
    }
  );
  
  // Filter by module keywords
  return response.data.issues.filter(issue => 
    moduleKeywords.some(keyword => 
      issue.fields.summary.toLowerCase().includes(keyword)
    )
  ).length;
}
```

---

## 🎯 Color Scheme

```css
/* Priority Badges */
P1: bg-red-50 border-red-500 text-red-700
P2: bg-orange-50 border-orange-500 text-orange-700
P3: bg-green-50 border-green-500 text-green-700
ALL: bg-gray-100 border-gray-500 text-gray-700

/* Status Badges */
Ready: bg-green-100 text-green-800
In Progress: bg-yellow-100 text-yellow-800
Not Started: bg-gray-100 text-gray-800
```

---

## 📸 Component Screenshots

### Module Cards
- Clean card design with hover effects
- Priority pills (colored badges)
- Jira story count (clickable link)
- Run button with loading state

### Scenario Modal
- Full-screen overlay
- Priority filter tabs
- Checkbox list with select all/none
- Scenario count per priority

### Execution Panel
- Terminal-style log output
- Auto-scroll to bottom
- Colored log levels (info, warn, error)
- Stop button for running tests

---

## 🔐 Environment Variables

Create `.env` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Jira Integration (optional)
VITE_JIRA_URL=https://your-jira.atlassian.net
VITE_JIRA_PROJECT=PROJ
```

---

## 📦 Build for Production

```bash
npm run build
```

Output in `dist/` folder. Deploy to any static hosting:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

---

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color'
      }
    }
  }
}
```

### Change Port
Edit `vite.config.ts`:
```typescript
server: {
  port: 5000  // Your preferred port
}
```

### Add New Module Icons
In `ModuleSelector.tsx`, update icon mapping:
```typescript
const iconMap = {
  'login': User,
  'cart': ShoppingCart,
  'your-module': YourIcon
}
```

---

## ✅ Checklist for Integration

- [ ] Install dependencies (`npm install`)
- [ ] Update API base URL in `api.ts`
- [ ] Create backend endpoints (see API Requirements section)
- [ ] Implement module discovery from your test directory
- [ ] Add priority tag extraction (@P1, @P2, @P3)
- [ ] Set up SSE for real-time log streaming
- [ ] Configure Jira integration (optional)
- [ ] Test end-to-end: select module → run tests → view logs
- [ ] Deploy to production

---

## 📞 Support

For questions or issues:
1. Check backend API responses in browser DevTools
2. Verify CORS headers on backend
3. Check console for React errors
4. Test API endpoints with curl/Postman first

---

## 📄 License

This UI package is shared for internal use. Adapt as needed for your framework.

---

**Happy Testing! 🚀**
