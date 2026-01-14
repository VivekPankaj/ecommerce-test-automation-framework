# Vulcan E-Commerce Test Automation - Quick Start Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Launching the Dashboard](#launching-the-dashboard)
4. [Running Tests](#running-tests)
5. [Test Tags Reference](#test-tags-reference)
6. [Common Commands](#common-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before running tests, ensure you have:

- **Node.js** v18 or higher installed
- **npm** (comes with Node.js)
- Clone the repository and install dependencies:

```bash
git clone https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation.git
cd vulcan_ecomm_storefront_automation
npm install
```

---

## Quick Start

### 1. Install Dependencies (First Time Only)
```bash
npm install
```

### 2. Launch Dashboard
```bash
./start-dashboard.sh
```
Or manually:
```bash
node dashboard/server.js
```
Then open: **http://localhost:3001/**

### 3. Run All Tests
```bash
npm run test:all
```

---

## Launching the Dashboard

### Option 1: Using the Startup Script (Recommended)
```bash
./start-dashboard.sh
```
This will:
- Kill any existing dashboard process
- Start the dashboard server
- Automatically open your browser to http://localhost:3001/

### Option 2: Manual Start
```bash
node dashboard/server.js
```
Then open http://localhost:3001/ in your browser.

### Dashboard Features
- **Modules View**: See all test modules with P1/P2/P3 breakdown
- **Execution**: Run tests directly from the UI
- **Analytics**: View test execution history
- **Executive Report**: Generate stakeholder reports
- **AI Commander**: Natural language test execution

---

## Running Tests

### Run All Tests
```bash
npx cucumber-js --config .cucumber.json
```

### Run by Priority Level

| Priority | Description | Command |
|----------|-------------|---------|
| **P1** | Critical Tests | `npx cucumber-js --config .cucumber.json --tags "@P1"` |
| **P2** | High Priority | `npx cucumber-js --config .cucumber.json --tags "@P2"` |
| **P3** | Medium Priority | `npx cucumber-js --config .cucumber.json --tags "@P3"` |

### Run Sanity Tests
```bash
npx cucumber-js --config .cucumber.json --tags "@Sanity"
```

### Run Regression Tests
```bash
npx cucumber-js --config .cucumber.json --tags "@Regression"
```

### Run by Module

| Module | Command |
|--------|---------|
| **Add to Cart** | `npx cucumber-js --config .cucumber.json --tags "@AddToCart"` |
| **Checkout** | `npx cucumber-js --config .cucumber.json --tags "@Checkout"` |
| **Login** | `npx cucumber-js --config .cucumber.json --tags "@Login"` |
| **My Account** | `npx cucumber-js --config .cucumber.json --tags "@MyAccount"` |
| **Search** | `npx cucumber-js --config .cucumber.json --tags "@Search"` |
| **Product Display** | `npx cucumber-js --config .cucumber.json --tags "@PDP"` |
| **Product Listing** | `npx cucumber-js --config .cucumber.json --tags "@PLP"` |

### Combine Tags

**Run P1 Sanity tests only:**
```bash
npx cucumber-js --config .cucumber.json --tags "@P1 and @Sanity"
```

**Run Add to Cart P1 tests:**
```bash
npx cucumber-js --config .cucumber.json --tags "@AddToCart and @P1"
```

**Run multiple modules:**
```bash
npx cucumber-js --config .cucumber.json --tags "@Login or @Search"
```

**Exclude a tag:**
```bash
npx cucumber-js --config .cucumber.json --tags "@Sanity and not @P3"
```

---

## Test Tags Reference

### Priority Tags
| Tag | Description | Count |
|-----|-------------|-------|
| `@P1` | Critical - Must pass for release | 58 |
| `@P2` | High - Important functionality | 51 |
| `@P3` | Medium - Nice to have | 8 |

### Suite Tags
| Tag | Description |
|-----|-------------|
| `@Sanity` | Quick smoke tests |
| `@Regression` | Full regression suite |

### Module Tags
| Tag | Module | Scenarios |
|-----|--------|-----------|
| `@AddToCart` | Add to Cart | 29 |
| `@Checkout` | Checkout Flow | 42 |
| `@Login` | Login | 5 |
| `@MyAccount` | My Account | 12 |
| `@Search` | Search | 9 |
| `@PDP` | Product Display Page | 10 |
| `@PLP` | Product Listing Page | 10 |

---

## Common Commands

### Generate Test Report
```bash
# Run tests with JSON output
npx cucumber-js --config .cucumber.json --tags "@AddToCart" --format json:test_results.json

# Generate HTML report
node generate-report.js

# Open report
open test-report.html
```

### Rerun Failed Tests
```bash
npx cucumber-js @rerun.txt
```

### Run Specific Feature File
```bash
npx cucumber-js Ecomm/features/add-to-cart.feature
```

### Run Specific Scenario by Line Number
```bash
npx cucumber-js Ecomm/features/add-to-cart.feature:39
```

### Check Priority Tag Distribution
```bash
node check-priority-tags.js
```

---

## Troubleshooting

### Dashboard Won't Start
```bash
# Kill any process on port 3001
lsof -ti :3001 | xargs kill -9

# Restart dashboard
node dashboard/server.js
```

### Tests Timing Out
The QA environment may be slow. Increase timeout in `.cucumber.json`:
```json
{
  "default": {
    "timeout": 180000
  }
}
```

### Browser Not Opening
Install Playwright browsers:
```bash
npx playwright install
```

### Missing Dependencies
```bash
npm install
```

### View Test Execution Logs
Check the terminal output or view logs in the dashboard under "Execution" tab.

---

## Folder Structure

```
vulcan_ecomm_storefront_automation/
├── Ecomm/
│   └── features/           # Feature files (Gherkin)
│       ├── add-to-cart.feature
│       ├── checkout.feature
│       └── step_definitions/  # Step implementations
├── dashboard/              # Test Dashboard UI
│   ├── server.js          # Dashboard server
│   └── public/            # Static assets
├── pageobjects/           # Page Object Models
├── utils/                 # Utilities
├── start-dashboard.sh     # Dashboard launcher script
├── generate-report.js     # Report generator
└── .cucumber.json         # Cucumber configuration
```

---

## Need Help?

- **Dashboard**: http://localhost:3001/
- **API Docs**: http://localhost:3001/api/modules
- **Repository**: https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation

---

*Last Updated: January 14, 2026*
