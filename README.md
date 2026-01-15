# E-Commerce Test Automation Framework# Vulcan E-Commerce Storefront Automation



<p align="center">

  <img src="https://img.shields.io/badge/Playwright-2.x-45ba4b?logo=playwright" alt="Playwright">Automated testing framework for Vulcan Materials e-commerce storefront using **Playwright** and **Cucumber BDD**. This project implements behavior-driven development (BDD) testing for comprehensive validation of login, logout, product search, listing, display and quarry selector functionality.

  <img src="https://img.shields.io/badge/Cucumber-BDD-23D96C?logo=cucumber" alt="Cucumber">

  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js" alt="Node.js">

  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">**Repository:** [vulcan_ecomm_storefront_automation](https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation)  

  <img src="https://img.shields.io/badge/Jira-Integration-0052CC?logo=jira" alt="Jira">**Target Application:** https://qa-shop.vulcanmaterials.com

</p>

---

A comprehensive automated testing framework for e-commerce storefronts using **Playwright** and **Cucumber BDD**, featuring an **AI-powered Test Dashboard** with Jira integration for intelligent test scenario generation.

## Table of Contents

**Repository:** [ecommerce-test-automation-framework](https://github.com/VivekPankaj/ecommerce-test-automation-framework)

- [Prerequisites](#prerequisites)

---- [Installation & Setup](#installation--setup)

- [Running Tests](#running-tests)

## 🚀 Key Features- [Project Structure](#project-structure)

- [Available Scripts](#available-scripts)

### 🧪 Test Automation- [Environment Configuration](#environment-configuration)

- **Playwright + Cucumber BDD** - Behavior-driven development with powerful browser automation- [Test Reports](#test-reports)

- **Page Object Model (POM)** - Clean, maintainable test architecture- [Feature Coverage](#feature-coverage)

- **Cross-browser Testing** - Chromium, Firefox, WebKit support- [Troubleshooting](#troubleshooting)

- **Parallel Execution** - Fast test runs with concurrent browser instances

---

### 📊 Test Dashboard

- **Real-time Test Execution** - Run and monitor tests from the browser## Prerequisites

- **Module-based Organization** - Tests grouped by feature modules

- **Live Logs & Progress** - SSE-based real-time status updatesBefore setting up this project, ensure you have the following installed:

- **Beautiful HTML Reports** - Themed reports with PDF export

- **Node.js** v20 or higher ([Download](https://nodejs.org/))

### 🤖 AI Feature Generator- **npm** (comes with Node.js)

- **Jira Integration** - Import acceptance criteria from Stories, Epics, or Filters- **Git** for version control

- **Epic Consolidation** - Automatically fetch and merge AC from child stories- **Windows/Mac/Linux** OS support via Playwright

- **Smart Parsing** - Detect Given/When/Then patterns from various formats

- **Duplicate Detection** - RAG-based matching against existing test scenarios### Verify Installation

- **Scenario Selection** - Choose which scenarios to save with checkbox selection

- **Source Tracking** - See which Jira stories contributed to each scenario```bash

node --version    # Should be v20.x or higher

---npm --version     # Should be 9.x or higher

```

## 📋 Table of Contents

---

- [Prerequisites](#prerequisites)

- [Installation & Setup](#installation--setup)## Installation & Setup

- [Running Tests](#running-tests)

- [Test Dashboard](#test-dashboard)### Step 1: Clone the Repository

- [AI Feature Generator](#ai-feature-generator)

- [Project Structure](#project-structure)```bash

- [Environment Configuration](#environment-configuration)git clone https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation.git

- [Jira Integration](#jira-integration)cd vulcan_ecomm_storefront_automation

- [Test Reports](#test-reports)```

- [API Reference](#api-reference)

- [Troubleshooting](#troubleshooting)### Step 2: Install Dependencies



---Install all project dependencies including Playwright and Cucumber:



## Prerequisites```bash

npm install @cucumber/cucumber

Before setting up this project, ensure you have the following installed:```

```bash

- **Node.js** v20 or higher ([Download](https://nodejs.org/))npm install multiple-cucumber-html-reporter --save-dev

- **npm** v9 or higher (comes with Node.js)```

- **Git** for version control



### Verify Installation

### Step 3: Install Playwright Browsers

```bash

node --version    # Should be v20.x or higherDownload and install Playwright browser binaries (Chromium, Firefox, WebKit):

npm --version     # Should be 9.x or higher

``````bash

npx playwright install

---```



## Installation & Setup



### Step 1: Clone the Repository### Step 4: Verify Setup



```bashVerify that all dependencies are properly installed:

git clone https://github.com/VivekPankaj/ecommerce-test-automation-framework.git

cd ecommerce-test-automation-framework```bash

```npx playwright --version

npx cucumber-js --version

### Step 2: Install Dependencies```



```bash---

npm install

```## Running Tests



### Step 3: Install Playwright Browsers### Run All Tests Locally



```bashExecute all Cucumber feature tests in headed mode (with browser visible):

npx playwright install

``````bash

npx cucumber-js --config .cucumber.json

### Step 4: Configure Environment```



Create a `.env` file in the root directory:



```env

# Application Configuration

BASE_URL=https://your-ecommerce-site.com### Run Specific Feature Tests

TEST_ENV=QA

#### Search Tests Only

# Jira Integration (optional but recommended for AI Feature Generator)```bash

JIRA_URL=https://your-company.atlassian.netnpx cucumber-js Ecomm/features/search.feature --exit --format json:./path-to-json-output/cucumber.json

JIRA_EMAIL=your-email@company.com```

JIRA_API_TOKEN=your-jira-api-token

JIRA_PROJECT_KEY=ECM#### Product Listing Tests Only

```bash

# OpenAI (optional - for AI-enhanced scenario generation)npx cucumber-js Ecomm/features/product-listing-page-validation.feature --exit --format json:./path-to-json-output/cucumber.json

OPENAI_API_KEY=your-openai-api-key```

```

#### Product Display Tests Only

### Step 5: Verify Setup```bash

npx cucumber-js Ecomm/features/product-display-page-validation.feature --exit --format json:./path-to-json-output/cucumber.json

```bash```

npx playwright --version

npx cucumber-js --version### Run Tests by Tags

```

Run tests with specific tags:

---

```bash

## Running Tests# Sanity tests only

npx cucumber-js Ecomm/features --require Ecomm/features/step_definitions --require Ecomm/features/support --tags "@Sanity" --exit --format json:./path-to-json-output/cucumber.json

### Run All Tests

# Product tile validation tests

```bashnpx cucumber-js Ecomm/features --require Ecomm/features/step_definitions --require Ecomm/features/support --tags "@product-tile-validation" --exit --format json:./path-to-json-output/cucumber.json

npx cucumber-js --config .cucumber.json```

```

## Project Structure

### Run Specific Feature

```

```bashvulcan_ecomm_storefront_automation/

# Search tests│

npx cucumber-js Ecomm/features/search.feature├── Ecomm/                              # BDD Test Suite (Cucumber)

│   └── features/

# Product listing tests│       ├── Search.feature              # Search functionality tests

npx cucumber-js Ecomm/features/product-listing-page-validation.feature│       ├── ProductListing.feature      # Product listing page (PLP) tests

│       ├── ProductDisplay.feature      # Product display page (PDP) tests

# Login tests|       ├── login.feature               # Login page tests

npx cucumber-js Ecomm/features/login-page-validation.feature|       ├── QuarrySelector.feature     # Quarry address selector page tests

```│       ├── step_definitions/           # Cucumber step implementations

│       │   ├── searchSteps.js

### Run Tests by Tags│       │   ├── productListingSteps.js

│       │   └── productDisplaySteps.js

```bash│       │   ├── loginSteps.js

# Sanity tests│       │   └── quarrySelectorSteps.js

npx cucumber-js --tags "@Sanity"│       └── support/

│           └── hooks.js                # Browser setup, screenshots, cleanup

# Regression tests│

npx cucumber-js --tags "@Regression"├── pageobjects/                        # Page Object Model (POM) Pattern

│   ├── LoginPage.js                    # Login page interactions

# Specific module│   ├── SearchPage.js                   # Search page interactions

npx cucumber-js --tags "@Search"│   ├── ProductListingPage.js           # Product listing page (PLP) interactions

```│   └── ProductDisplayPage.js           # Product display page (PDP) interactions

│   ├── LoginPage.js                    # Login page (PLP) interactions

### Run in Headless Mode│   └── QuarrySelectorPage.js           # Quarry selector page (PDP) interactions

│

```bash├── utils/                              # Utilities & Test Data

HEADLESS=true npx cucumber-js --config .cucumber.json│   ├── test-base.js                    # Test configuration & base setup

```│   ├── APiUtils.js                     # API testing utilities & helpers

│   └── placeorderTestData.json         # Test data for order scenarios

---│

├── helper/                             # Helper Functions

## Test Dashboard│   └── reports.js                      # HTML report generation

│

The Test Dashboard provides a web-based interface for test management and execution.├── .github/

│   └── workflows/

### Starting the Dashboard│       └── vulcan-automation-tests.yml # CI/CD GitHub Actions workflow

│

```bash├── playwright-report/                  # Playwright HTML test reports

cd dashboard├── test-results-YYYY-MM-DD.../         # Timestamped test result folders

node server.js├── path-to-json-output/                # Cucumber JSON output

```│   └── cucumber.json                   # Cucumber test results (JSON format)

│

Access the dashboard at: **http://localhost:3001**├── playwright.config.js                # Playwright configuration

├── playwright.config1.js               # Alternative Playwright config

### Dashboard Features├── playwright.service.config.js        # Playwright service config

├── .cucumber.json                      # Cucumber configuration

| Tab | Description |├── package.json                        # Project dependencies & scripts

|-----|-------------|├── package-lock.json                   # Locked dependency versions

| **Test Runner** | Execute tests by module with real-time progress |└── README.md                           # Project documentation (this file)

| **Reports** | View and export beautiful HTML/PDF test reports |```

| **AI Feature Generator** | Generate test scenarios from Jira acceptance criteria |

### Project Directory Details

### Dashboard Architecture

**Ecomm/features/** - Cucumber BDD test scenarios

```- Feature files written in Gherkin syntax

┌─────────────────────────────────────────────────────────────┐- Step definitions that implement the test scenarios

│  🚀 Test Dashboard                                          │- Support/hooks for browser setup and teardown

├─────────────────────────────────────────────────────────────┤

│  [Test Runner] [Reports] [AI Feature Generator]             │**pageobjects/** - Page Object Model abstraction layer

├─────────────────────────────────────────────────────────────┤- Encapsulates page interactions and locators

│                                                             │- Reduces code duplication and improves maintainability

│  📦 Test Modules                    📊 Execution Status     │- Follows Playwright POM best practices

│  ┌─────────────────────┐           ┌──────────────────┐    │

│  │ ☑️ Login             │           │ Total: 45        │    │**utils/** - Shared utilities and test data

│  │ ☑️ Search            │           │ Passed: 42 ✅    │    │- Configuration and base test setup

│  │ ☑️ Product Listing   │           │ Failed: 3 ❌     │    │- API testing utilities for backend testing

│  │ ☑️ Product Display   │           │ Duration: 2m 34s │    │- Test data files for data-driven testing

│  │ ☑️ Quarry Selector   │           └──────────────────┘    │

│  └─────────────────────┘                                    │**helper/** - Helper modules

│                                                             │- Report generation functions

│  [▶️ Run Selected Tests]                                     │- Custom assertion and utility methods

│                                                             │

└─────────────────────────────────────────────────────────────┘**.github/workflows/** - CI/CD automation

```- Automated test execution on push/PR

- GitHub Actions pipeline configuration

---

**Test Output Directories** - Auto-generated test artifacts

## AI Feature Generator- Screenshots and trace files from test execution

- HTML reports for test result visualization

The AI Feature Generator transforms Jira acceptance criteria into Cucumber test scenarios.- JSON reports for CI/CD integration



### How It Works---



```## Environment Configuration

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐

│   Jira       │────▶│   Parse AC   │────▶│  Match with  │────▶│   Generate   │### Default Settings

│   Story/Epic │     │   Content    │     │  Existing    │     │   Scenarios  │

└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘The project uses default settings optimized for QA testing:

```

| Setting | Value | Description |

### Supported Input Types|---------|-------|-------------|

| **Browser** | Chromium | Headless mode disabled for visibility |

| Type | Description | Example || **Timeout** | 30 seconds | Per test execution timeout |

|------|-------------|---------|| **Base URL** | https://qa-shop.vulcanmaterials.com | QA environment target |

| **Story** | Single Jira story | `ECM-123` || **Default Zip Code** | 37303 | Default test address location |

| **Epic** | Epic with all child stories | `ECM-79` || **Geolocation** | 39.8283, -98.5795 | Fixed US center coordinates |

| **Filter** | Jira filter ID or JQL | `12345` or `project = ECM AND sprint in openSprints()` || **Screenshots** | Enabled | Captured on failure and success |

| **Traces** | Enabled | Available for debugging |

### Epic Processing Flow

### Environment Variables

When you select an Epic, the system:

Configure test behavior using environment variables:

1. **Fetches Epic details** via Jira REST API

2. **Gets all child stories** via Jira Agile API (`/rest/agile/1.0/epic/{key}/issue`)```bash

3. **Extracts Acceptance Criteria** from each child (using `customfield_10474` or description)# Set browser type (default: chromium)

4. **Parses Given/When/Then** patterns from markdown/HTML content# Options: chromium, firefox, webkit

5. **Consolidates similar AC** across stories (70% similarity threshold)set BROWSER=chromium

6. **Generates scenarios** with source story tracking

7. **Matches against existing** test scenarios to avoid duplicates# Set application URL (default: https://qa-shop.vulcanmaterials.com)

set APP_URL=https://qa-shop.vulcanmaterials.com

### Using the AI Feature Generator

# Run tests with custom environment

1. Navigate to **AI Feature Generator** tab in the dashboardnpm test

2. Select input type: **Story**, **Epic**, or **Filter**```

3. Enter the Jira reference (e.g., `ECM-79`)

4. Click **Generate Scenarios**### Browser Launch Configuration

5. Review generated scenarios:

   - ✅ **New** - No similar existing scenario foundTests are configured with the following browser settings:

   - ⚠️ **Similar Exists** - Shows match percentage and matching scenario

6. Select scenarios using checkboxes- **Headless Mode:** Disabled (browser visible by default)

7. Click **Save Selected to Feature File**- **Sandbox:** Disabled for CI/CD compatibility

- **Geolocation:** Pre-configured to US center (39.8283, -98.5795)

### Generated Scenario Format- **Geolocation Permissions:** Pre-granted to prevent popups

- **Screenshots:** Automatic capture on failures and successes

```gherkin- **Traces:** Enabled for test debugging

@Regression @Search @ECM-79 @ECM-82 @ECM-83- **Timeout:** 120 seconds (scenario-level), 30 seconds (test-level)

Scenario: Verify user can search using keywords

  # Source: ECM-82 (Search Suggestions), ECM-83 (Search Results)

  Given the user is on the search page## Test Reports

  When the user enters "cement" in the search bar

  And the user clicks the search button### Playwright HTML Reports

  Then the search results page should be displayed

  And the results should contain products matching "cement"After running tests locally, view the multiple cucumber HTML report:

```

```bash

### Scenario Match Displaynode helper/reports.js

```

Each generated scenario shows:

- **Match Badge**: ✅ New or ⚠️ Similar (X%)Reports are generated in:

- **Source Stories**: Which Jira stories contributed to this scenario- **Location:** `playwright-report/`

- **Step Preview**: Given/When/Then steps- **Timestamped Results:** `test-results-YYYY-MM-DDTHH-MM-SS/`

- **Selection Checkbox**: Choose which to save

### Cucumber Reports

---

Cucumber reports are generated in:

## Project Structure- **Location:** `path-to-json-output/`

- **Format:** JSON (cucumber.json)

```

ecommerce-test-automation-framework/### Screenshots & Traces

│

├── 📁 Ecomm/                           # BDD Test SuiteTest artifacts are automatically captured:

│   └── features/- **Screenshots:** Stored in timestamped test result folders

│       ├── login-page-validation.feature- **Traces:** Available for debugging via Playwright Inspector

│       ├── search.feature

│       ├── product-listing-page-validation.feature---

│       ├── product-display-page-validation.feature

│       ├── quarry-selector-page-validation.feature## Feature Coverage

│       ├── step_definitions/           # Step implementations

│       │   ├── loginSteps.js> **🔒 LOCKED Scenarios:** Verified and stable - do not modify without approval  

│       │   ├── searchSteps.js> **Last Updated:** 12 January 2026  

│       │   ├── productListingSteps.js> **Total Scenarios:** 124 | **Locked:** 43 (Login: 5, PLP: 12, PDP: 10, Quarry: 3, Search: 10, Add to Cart: 3)

│       │   ├── productDisplaySteps.js

│       │   └── quarrySelectorSteps.js---

│       └── support/

│           └── hooks.js                # Browser setup & teardown### 1. Login Module (`login.feature`) 🔒 LOCKED

│**Purpose:** Validate Login/Logout functionality across all pages  

├── 📁 pageobjects/                     # Page Object Model**Status:** ✅ Verified | 5 scenarios, 49 steps

│   ├── LoginPage.js

│   ├── SearchPage.js| # | Scenario | Tags | Priority |

│   ├── ProductListingPage.js|---|----------|------|----------|

│   ├── ProductDisplayPage.js| 1 | Validate successful user login with all validations | `@Sanity @P1 @SignIn` | P1 |

│   └── QuarrySelectorPage.js| 2 | Validate successful user logout from Homepage | `@P1 @SignOut @SignOutFromHomepage` | P1 |

│| 3 | Validate successful user logout from PLP page | `@P2 @SignOut @SignOutFromPLP` | P2 |

├── 📁 dashboard/                       # Test Dashboard| 4 | Validate successful user logout from PDP page | `@P2 @SignOut @SignOutFromPDP` | P2 |

│   ├── server.js                       # Express server with APIs| 5 | Validate successful user logout from Cart page | `@P2 @SignOut @SignOutFromCart` | P2 |

│   ├── public/

│   │   └── index.html                  # React-based dashboard UI**Coverage:** Sign In validation, My Account dropdown, Profile verification, Sign Out from all pages

│   └── package.json

│---

├── 📁 utils/                           # Utilities

│   ├── test-base.js                    # Test configuration### 2. My Account Module (`my-account.feature`) 🔒 LOCKED

│   ├── jiraIntegration.js              # Jira API integration**Purpose:** Validate My Account sections after user login  

│   ├── APiUtils.js                     # API testing utilities**Status:** ✅ Verified | 12 scenarios

│   └── placeorderTestData.json         # Test data

│| # | Scenario | Tags | Priority |

├── 📁 helper/|---|----------|------|----------|

│   └── reports.js                      # Report generation| 1 | Validate My Profile page displays correct user information | `@Sanity @P1 @MyProfile` | P1 |

│| 2 | Validate Purchase History page displays all required elements | `@Sanity @P1 @PurchaseHistory` | P1 |

├── 📁 .github/workflows/| 3 | Validate View Details opens Order Details page | `@P1 @ViewDetails` | P1 |

│   └── vulcan-automation-tests.yml     # CI/CD pipeline| 4 | Validate Modify Quantity opens quantity input field | `@P2 @ModifyQuantity` | P2 |

│| 5 | Validate clicking X on Modify Quantity cancels without changes | `@P2 @CancelQuantityChange` | P2 |

├── 📁 reports/                         # Generated test reports| 6 | Validate saving quantity change shows Submit Changes button | `@P1 @SaveQuantityChange` | P1 |

│| 7 | Validate Submit Changes recalculates price and shows confirmation | `@P1 @SubmitQuantityChange` | P1 |

├── playwright.config.js                # Playwright configuration| 8 | Validate Pickup or Delivery Details section displays Modify link | `@P2 @PickupDetails` | P2 |

├── .cucumber.json                      # Cucumber configuration| 9 | Validate clicking Modify opens Details in edit mode | `@P2 @EditPickupDetails` | P2 |

├── package.json                        # Dependencies| 10 | Validate clicking X on Details cancels without changes | `@P2 @CancelPickupDetails` | P2 |

├── .env                                # Environment variables (create this)| 11 | Validate saving Details shows confirmation message | `@P1 @SavePickupDetails` | P1 |

└── README.md                           # This file| 12 | Validate Payment page displays saved cards or empty state | `@P2 @Payment` | P2 |

```

**Coverage:** My Profile, Purchase History, Modify Quantity, Pickup/Delivery Details, Payment

---

---

## Environment Configuration

### 3. Search Module (`search.feature`) 🔒 LOCKED

### Required Environment Variables**Purpose:** Validate search functionality and autocomplete  

**Status:** ✅ Verified | 10 scenarios

| Variable | Description | Required |

|----------|-------------|----------|| # | Scenario | Tags | Priority |

| `BASE_URL` | Target application URL | Yes ||---|----------|------|----------|

| `TEST_ENV` | Environment name (QA, STG, PROD) | Yes || 1 | Search functionality works correctly with different query types | `@Sanity @P1 @Smoke` | P1 |

| `JIRA_URL` | Jira instance URL | For AI Feature Generator || 2 | Autocomplete suggestions appear only after 3 characters | `@Sanity @P1 @Autocomplete` | P1 |

| `JIRA_EMAIL` | Jira account email | For AI Feature Generator || 3 | Search navigates to SRP with correct query display | `@P2 @SearchResultsPage` | P2 |

| `JIRA_API_TOKEN` | Jira API token | For AI Feature Generator || 4 | Select autocomplete suggestion navigates to relevant page | `@P2 @AutocompleteNavigation` | P2 |

| `JIRA_PROJECT_KEY` | Default Jira project | For AI Feature Generator || 5 | Search works from Product Listing Page | `@P2 @CrossPage @SearchFromPLP` | P2 |

| `OPENAI_API_KEY` | OpenAI API key | Optional || 6 | Search results load quickly | `@P3 @Performance` | P3 |

| 7 | No results message for invalid search term | `@P3 @InvalidSearch @NoResults` | P3 |

### Getting Jira API Token| 8-10 | Search handles special characters correctly | `@P3 @SpecialCharacters` | P3 |



1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)**Coverage:** Keyword search, Product name search, Autocomplete, Cross-page search, Special characters

2. Click **Create API token**

3. Give it a name (e.g., "Test Automation")---

4. Copy the token to your `.env` file

### 4. Quarry Selector Module (`quarry-selector-page-validation.feature`)

---**Purpose:** Validate Address Selector Modal functionality  

**Status:** ✅ Ready | 3 scenarios

## Jira Integration

| # | Scenario | Tags | Priority |

### Supported Jira Fields|---|----------|------|----------|

| 1 | Validate all components in the Address Selector modal | `@Sanity @quarry` | Sanity |

| Field | Custom Field ID | Description || 2 | Closing modal without confirming should NOT save address | `@Sanity @quarry @second` | Sanity |

|-------|-----------------|-------------|| 3 | Validate default placeholder when no zipcode is saved | `@Sanity @quarry` | Sanity |

| Acceptance Criteria | `customfield_10474` | Primary AC field |

| Description | Standard field | Fallback for AC |**Coverage:** Address Input Field, Google Map Component, Confirm/Close CTAs, Address persistence

| Epic Link | `customfield_10014` | Links stories to Epics |

---

### API Endpoints Used

### 5. Product Listing Page - PLP (`product-listing-page-validation.feature`) 🔒 LOCKED

| Endpoint | Purpose |**Purpose:** Validate PLP functionality for Delivery and Pickup modes  

|----------|---------|**Status:** ✅ Verified | 10 scenarios

| `GET /rest/api/3/issue/{key}` | Fetch issue details |

| `GET /rest/agile/1.0/epic/{key}/issue` | Get Epic child stories |#### Delivery Mode Scenarios (6)

| `POST /rest/api/3/search/jql` | Search issues by JQL |

| # | Scenario | Tags | Priority |

### JiraIntegration Class Methods|---|----------|------|----------|

| 1 | Complete product tile validation | `@Locked @Sanity @PLP @P1` | P1 |

```javascript| 2 | Display Quantity Selector Modal with Correct UI Components | `@Locked @Sanity @PLP @P1` | P1 |

const JiraIntegration = require('./utils/jiraIntegration');| 3 | Quantity Selector functionality | `@Locked @Sanity @PLP @P1` | P1 |

const jira = new JiraIntegration();| 4 | Verify product tile navigation and placeholder handling | `@Locked @Sanity @PLP @P2` | P2 |

| 5 | Verify navigation bar categories display | `@Locked @Sanity @PLP @P2` | P2 |

// Get single issue| 6 | Verify category selection and product display | `@Locked @Sanity @PLP @P2` | P2 |

const issue = await jira.getIssue('ECM-123');

#### Pickup Mode Scenarios (4)

// Get Epic children (uses Agile API)

const children = await jira.getEpicChildren('ECM-79');| # | Scenario | Tags | Priority |

|---|----------|------|----------|

// Search by JQL| 7 | Select Pickup option and verify facility list | `@Locked @Sanity @PLP @P1 @Pickup` | P1 |

const issues = await jira.searchIssues('project = ECM AND type = Story');| 8 | Verify distance filter changes facility count | `@Locked @Sanity @PLP @P2 @Pickup @DistanceFilter` | P2 |

```| 9 | Select a pickup facility and verify header update | `@Locked @Sanity @PLP @P1 @Pickup @FacilitySelection` | P1 |

| 10 | Verify no delivery charges displayed on PLP for Pickup | `@Locked @Sanity @PLP @P1 @Pickup @NoDeliveryCharges` | P1 |

---

**Coverage:** Product tiles, Quantity selector, Navigation, Pickup facility selection, Distance filter, Map markers

## Test Reports

---

### HTML Report Features

### 6. Product Display Page - PDP (`product-display-page-validation.feature`) 🔒 LOCKED

The framework generates beautiful themed HTML reports with:**Purpose:** Validate PDP functionality for Delivery and Pickup modes  

**Status:** ✅ Verified | 10 scenarios

- ✅ Executive summary with pass/fail metrics

- 📊 Visual progress indicators#### Delivery Mode Scenarios (7)

- 🖼️ Embedded screenshots for failures

- 📄 PDF export capability| # | Scenario | Tags | Priority |

- 🎨 Custom brand styling|---|----------|------|----------|

| 1 | Complete product details page validation | `@Locked @Sanity @PDP @P1` | P1 |

### Generating Reports| 2 | Verify price attributes on product tile with valid quantity | `@Locked @Sanity @PDP @P1` | P1 |

| 3 | Verify quantity calculator functionality (dimensions set 1) | `@Locked @Sanity @PDP @P1` | P1 |

```bash| 4 | Verify quantity calculator functionality (dimensions set 2 in feet) | `@Locked @Sanity @PDP @P2` | P2 |

# Run tests with JSON output| 5 | Verify max quantity validation message | `@Locked @Sanity @PDP @P2` | P2 |

npx cucumber-js --format json:reports/cucumber.json| 6 | Verify invalid text quantity validation message | `@Locked @Sanity @PDP @P2` | P2 |

| 7 | Verify delivery charges tooltip message | `@Locked @Sanity @PDP @P2` | P2 |

# Generate HTML report

node generate-report.js#### Pickup Mode Scenarios (3)

```

| # | Scenario | Tags | Priority |

### Report Location|---|----------|------|----------|

| 8 | Verify PDP does not show delivery charges in Pickup mode | `@Locked @Sanity @PDP @P1 @Pickup` | P1 |

Reports are saved to:| 9 | Verify PDP shows Pickup location in header | `@Locked @Sanity @PDP @P2 @Pickup` | P2 |

- `reports/test-report-YYYY-MM-DD-HH-mm.html`| 10 | Verify quantity changes in Pickup mode calculate correctly | `@Locked @Sanity @PDP @P2 @Pickup` | P2 |

- `reports/test-report-YYYY-MM-DD-HH-mm.pdf`

**Coverage:** Product attributes, Price calculations, Quantity calculator, Validation messages, Pickup mode pricing

---

---

## API Reference

### 7. Add to Cart Module (`add-to-cart.feature`) 🔄 IN PROGRESS

### Dashboard Server APIs**Purpose:** Validate Add to Cart functionality across all entry points and user types  

**Status:** 🔄 In Progress | 29 scenarios

| Endpoint | Method | Description |

|----------|--------|-------------|#### Entry Points

| `/api/modules` | GET | List available test modules |

| `/api/run` | POST | Execute test modules || Entry Point | Description |

| `/api/stream` | GET (SSE) | Real-time execution logs ||-------------|-------------|

| `/api/ai/generate-scenarios` | POST | Generate scenarios from Jira || **Shop by Project** | Navigate via Project menu → PLP → Add to Cart |

| `/api/ai/check-step-definitions` | POST | Check for existing step definitions || **Shop By Categories** | Navigate via Categories menu → PLP → Add to Cart |

| `/api/ai/save-feature` | POST | Save scenarios to feature file || **PDP** | Navigate to Product Display Page → Add to Cart |

| **Search** | Search for product → Add to Cart from results |

### Example: Generate Scenarios API

#### Guest User Scenarios (10)

**Request:**

```bash| # | Scenario | Tags | Priority |

curl -X POST http://localhost:3001/api/ai/generate-scenarios \|---|----------|------|----------|

  -H "Content-Type: application/json" \| 1 | Add product from PLP via Shop by Project - Delivery | `@Sanity @P1 @Guest @Delivery @ShopByProject` | P1 |

  -d '{| 2 | Add product from PLP via Shop by Project - Pickup | `@P1 @Guest @Pickup @ShopByProject` | P1 |

    "jiraInput": "ECM-79",| 3 | Add product from PLP via Shop By Categories - Delivery | `@Sanity @P1 @Guest @Delivery @ShopByCategories` | P1 |

    "inputType": "epic"| 4 | Add product from PLP via Shop By Categories - Pickup | `@P2 @Guest @Pickup @ShopByCategories` | P2 |

  }'| 5 | Add product from PDP with default quantity - Delivery | `@Sanity @P1 @Guest @Delivery @PDP` | P1 |

```| 6 | Add product from PDP with custom quantity - Delivery | `@P1 @Guest @Delivery @PDP @CustomQuantity` | P1 |

| 7 | Add product from PDP - Pickup | `@P1 @Guest @Pickup @PDP` | P1 |

**Response:**| 8 | Add product from Search results - Delivery | `@Sanity @P1 @Guest @Delivery @Search` | P1 |

```json| 9 | Add product from Search results - Pickup | `@P2 @Guest @Pickup @Search` | P2 |

{

  "success": true,#### Registered User Scenarios (5)

  "jiraDetails": {

    "key": "ECM-79",| # | Scenario | Tags | Priority |

    "summary": "Search - Results, Suggestions",|---|----------|------|----------|

    "type": "Epic",| 10 | Add product from PLP - Delivery (with cart cleanup) | `@Sanity @P1 @Registered @Delivery @PLP` | P1 |

    "childCount": 8,| 11 | Add product from PLP - Pickup (with cart cleanup) | `@P1 @Registered @Pickup @PLP` | P1 |

    "childStories": [| 12 | Add product from PDP - Delivery | `@P1 @Registered @Delivery @PDP` | P1 |

      {"key": "ECM-82", "summary": "Search Suggestions", "status": "Done"},| 13 | Add product from Search - Delivery | `@P2 @Registered @Search` | P2 |

      {"key": "ECM-83", "summary": "Search Results", "status": "Done"}

    ]#### Cart Behavior Scenarios (4)

  },

  "scenarios": [| # | Scenario | Tags | Priority |

    {|---|----------|------|----------|

      "name": "Verify search suggestions appear",| 14 | Same product multiple times increases quantity, not count | `@Sanity @P1 @CartBehavior @SameProduct` | P1 |

      "tags": ["@Regression", "@Search", "@ECM-79", "@ECM-82"],| 15 | Different products increases cart count | `@Sanity @P1 @CartBehavior @DifferentProducts` | P1 |

      "steps": [| 16 | Validate prices across all screens | `@P1 @CartBehavior @PriceValidation` | P1 |

        {"keyword": "Given", "text": "the user is on the search page"},

        {"keyword": "When", "text": "the user types in the search bar"},#### Remove from Cart Scenarios (3) 🔒 LOCKED

        {"keyword": "Then", "text": "autocomplete suggestions should appear"}

      ],| # | Scenario | Tags | Priority |

      "sourceStories": [|---|----------|------|----------|

        {"key": "ECM-82", "summary": "Search Suggestions"}| 17 | Remove single product from cart | `@Sanity @P1 @RemoveFromCart` | P1 |

      ]| 18 | Remove one product when multiple in cart | `@P1 @RemoveFromCart @MultipleProducts` | P1 |

    }| 19 | Remove all products one by one | `@P2 @RemoveFromCart @AllProducts` | P2 |

  ],

  "isEpic": true#### Cart Validation Scenarios (4)

}

```| # | Scenario | Tags | Priority |

|---|----------|------|----------|

---| 20 | Validate Order Summary section - Delivery | `@P1 @CartValidation @Delivery @OrderSummary` | P1 |

| 21 | Validate Order Summary section - Pickup | `@P1 @CartValidation @Pickup @OrderSummary` | P1 |

## Troubleshooting| 22 | Edit quantity in cart and verify price update | `@P1 @EditQuantity` | P1 |



### Common Issues#### Cart Navigation Scenarios (3)



#### Playwright Installation Fails| # | Scenario | Tags | Priority |

```bash|---|----------|------|----------|

# Clear npm cache and reinstall| 23 | Navigate to cart via header cart icon | `@P2 @CartNavigation @HeaderIcon` | P2 |

npm cache clean --force| 24 | Navigate to cart via View Cart button in slider | `@P2 @CartNavigation @ViewCart` | P2 |

rm -rf node_modules| 25 | Continue Shopping from empty cart | `@P2 @EmptyCart @ContinueShopping` | P2 |

npm install

npx playwright install --with-deps**Coverage:** All entry points, Guest/Registered users, Delivery/Pickup modes, Cart confirmation slider, Order Summary validation, Remove functionality, Quantity updates

```

**Test Status:** 14/29 scenarios passing

#### Jira Connection Issues

```bash---

# Test Jira connectivity

curl -u your-email@company.com:YOUR_API_TOKEN \### 8. Checkout Module (`checkout.feature`) 🆕 NEW

  https://your-company.atlassian.net/rest/api/3/myself**Purpose:** Validate complete checkout flow including address, schedule, payment, and order placement  

```**Status:** 🆕 New | 45 scenarios



#### Dashboard Won't Start#### Jira Epic References

```bash- ECM-827 - Checkout Main Epic

# Check if port 3001 is in use- ECM-612 - Delivery Flow

lsof -i :3001- ECM-597 - Payment Flow

- ECM-593 - Schedule/Time Slot Selection

# Kill existing process- ECM-589 - Order Review & Confirmation

pkill -f "node.*server.js"- ECM-583 - Guest Checkout Flow



# Start fresh#### Checkout Navigation Scenarios (2)

cd dashboard && node server.js

```| # | Scenario | Tags | Priority |

|---|----------|------|----------|

#### Tests Timeout| 1 | Guest user navigates to checkout page from cart | `@Sanity @P1 @CheckoutNavigation @Guest` | P1 |

```javascript| 2 | Registered user navigates to checkout page from cart | `@P1 @CheckoutNavigation @Registered` | P1 |

// Increase timeout in .cucumber.json

{#### Delivery Address Scenarios (4)

  "default": {

    "timeout": 60000| # | Scenario | Tags | Priority |

  }|---|----------|------|----------|

}| 3 | Guest user enters delivery address during checkout | `@Sanity @P1 @Delivery @DeliveryAddress @Guest` | P1 |

```| 4 | Registered user selects saved delivery address | `@P1 @Delivery @DeliveryAddress @Registered` | P1 |

| 5 | Registered user adds new delivery address during checkout | `@P2 @Delivery @DeliveryAddress @NewAddress` | P2 |

#### Epic Children Not Found| 6 | User edits delivery address during checkout | `@P2 @Delivery @DeliveryAddress @EditAddress` | P2 |

The framework uses the Jira Agile API (`/rest/agile/1.0/epic/{key}/issue`) which is the most reliable method. Ensure:

- The Epic exists and has linked stories#### Pickup Facility Scenarios (3)

- Your Jira account has access to the Agile board

- Stories are properly linked via "Epic Link" field| # | Scenario | Tags | Priority |

|---|----------|------|----------|

### Debug Mode| 7 | Guest user completes checkout with Pickup option | `@Sanity @P1 @Pickup @FacilitySelection @Guest` | P1 |

| 8 | Registered user completes checkout with Pickup at saved facility | `@P1 @Pickup @FacilitySelection @Registered` | P1 |

Run tests with debug logging:| 9 | User changes pickup facility during checkout | `@P2 @Pickup @ChangeFacility` | P2 |

```bash

DEBUG=pw:api npx cucumber-js --config .cucumber.json#### Schedule - Delivery Time Slot Scenarios (4)

```

| # | Scenario | Tags | Priority |

---|---|----------|------|----------|

| 10 | User selects delivery date and time slot | `@Sanity @P1 @Schedule @Delivery @TimeSlot` | P1 |

## CI/CD Integration| 11 | User selects same-day delivery | `@P1 @Schedule @Delivery @TodayDelivery` | P1 |

| 12 | User selects future delivery date | `@P2 @Schedule @Delivery @FutureDate` | P2 |

### GitHub Actions| 13 | User changes delivery schedule | `@P2 @Schedule @Delivery @ChangeSchedule` | P2 |



The project includes a GitHub Actions workflow (`.github/workflows/vulcan-automation-tests.yml`) that:#### Schedule - Pickup Time Slot Scenarios (2)



1. Installs dependencies| # | Scenario | Tags | Priority |

2. Installs Playwright browsers|---|----------|------|----------|

3. Runs all tests| 14 | User selects pickup date and time slot | `@Sanity @P1 @Schedule @Pickup @TimeSlot` | P1 |

4. Generates HTML report| 15 | Pickup time slots respect facility operating hours | `@P2 @Schedule @Pickup @FacilityHours` | P2 |

5. Uploads artifacts

#### Payment - Credit Card Scenarios (5)

### Running in CI

| # | Scenario | Tags | Priority |

```yaml|---|----------|------|----------|

- name: Run Tests| 16 | Guest user enters new credit card for payment | `@Sanity @P1 @Payment @CreditCard @Guest` | P1 |

  run: npx cucumber-js --config .cucumber.json| 17 | Registered user pays with saved credit card | `@P1 @Payment @CreditCard @Registered` | P1 |

| 18 | Guest user saves credit card for future use | `@P2 @Payment @CreditCard @SaveCard` | P2 |

- name: Generate Report| 19 | Registered user adds new credit card during checkout | `@P2 @Payment @CreditCard @AddNewCard` | P2 |

  run: node generate-report.js| 20 | User sees error for invalid credit card | `@P3 @Payment @CreditCard @InvalidCard` | P3 |

  if: always()

#### Payment - Pay on Delivery/Pickup Scenarios (2)

- name: Upload Report

  uses: actions/upload-artifact@v3| # | Scenario | Tags | Priority |

  with:|---|----------|------|----------|

    name: test-report| 21 | User selects Pay on Delivery option | `@P2 @Payment @PayOnDelivery` | P2 |

    path: reports/| 22 | User selects Pay on Pickup option | `@P2 @Payment @PayOnPickup` | P2 |

```

#### Order Summary Validation Scenarios (4)

---

| # | Scenario | Tags | Priority |

## Contributing|---|----------|------|----------|

| 23 | Validate Order Summary for Delivery order | `@Sanity @P1 @OrderSummary @Delivery` | P1 |

1. Fork the repository| 24 | Validate Order Summary for Pickup order | `@P1 @OrderSummary @Pickup` | P1 |

2. Create a feature branch (`git checkout -b feature/amazing-feature`)| 25 | Validate Order Summary with multiple products | `@P2 @OrderSummary @MultipleProducts` | P2 |

3. Commit your changes (`git commit -m 'Add amazing feature'`)| 26 | Edit quantity from checkout page updates Order Summary | `@P2 @OrderSummary @EditQuantity` | P2 |

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request#### Place Order - Success Scenarios (4)



---| # | Scenario | Tags | Priority |

|---|----------|------|----------|

## License| 27 | Guest user places order with Delivery successfully | `@Sanity @P1 @PlaceOrder @Delivery @Guest` | P1 |

| 28 | Guest user places order with Pickup successfully | `@Sanity @P1 @PlaceOrder @Pickup @Guest` | P1 |

This project is open source. Feel free to use and modify for your needs.| 29 | Registered user places order with Delivery successfully | `@Sanity @P1 @PlaceOrder @Delivery @Registered` | P1 |

| 30 | Registered user places order with Pickup successfully | `@P1 @PlaceOrder @Pickup @Registered` | P1 |

---

#### Order Confirmation Scenarios (3)

## Author

| # | Scenario | Tags | Priority |

**Vivek Pankaj**|---|----------|------|----------|

- GitHub: [@VivekPankaj](https://github.com/VivekPankaj)| 31 | Validate Order Confirmation page elements | `@Sanity @P1 @OrderConfirmation` | P1 |

| 32 | View Order Details from confirmation page | `@P2 @OrderConfirmation @ViewOrderDetails` | P2 |

---| 33 | Continue Shopping from confirmation page | `@P2 @OrderConfirmation @ContinueShopping` | P2 |



<p align="center">#### Checkout Validation & Error Handling Scenarios (4)

  Built with ❤️ using Playwright, Cucumber, and React

</p>| # | Scenario | Tags | Priority |

|---|----------|------|----------|
| 34 | User cannot place order with incomplete checkout | `@P2 @Validation @IncompleteCheckout` | P2 |
| 35 | User sees error when address is missing | `@P2 @Validation @MissingAddress` | P2 |
| 36 | User sees error when schedule is not selected | `@P2 @Validation @MissingSchedule` | P2 |
| 37 | User session timeout during checkout | `@P3 @Validation @SessionTimeout` | P3 |

#### Promo Code / Discount Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 38 | User applies valid promo code | `@P2 @PromoCode @ValidCode` | P2 |
| 39 | User sees error for invalid promo code | `@P3 @PromoCode @InvalidCode` | P3 |
| 40 | User removes applied promo code | `@P3 @PromoCode @RemoveCode` | P3 |

#### Guest Checkout to Registration Scenarios (2)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 41 | Guest user creates account after placing order | `@P2 @GuestCheckout @CreateAccount` | P2 |
| 42 | Guest user signs in during checkout | `@P3 @GuestCheckout @SignInDuringCheckout` | P3 |

**Coverage:** Complete checkout flow, Delivery/Pickup modes, Address management, Schedule selection, Payment methods (Credit Card, Pay on Delivery/Pickup), Order Summary, Order placement, Confirmation page, Promo codes, Guest to Registered conversion

---

## Coverage Summary

| Module | Feature File | Scenarios | P1 | P2 | P3 | Status |
|--------|--------------|-----------|----|----|----|----|
| **Login** | `login.feature` | 5 | 2 | 3 | - | 🔒 Locked |
| **My Account** | `my-account.feature` | 12 | 5 | 7 | - | 🔒 Locked |
| **Search** | `search.feature` | 9 | 2 | 4 | 3 | 🔒 Locked |
| **Quarry Selector** | `quarry-selector-page-validation.feature` | 3 | - | - | - | ✅ Ready |
| **PLP (Delivery)** | `product-listing-page-validation.feature` | 6 | 3 | 3 | - | 🔒 Locked |
| **PLP (Pickup)** | `product-listing-page-validation.feature` | 4 | 3 | 1 | - | 🔒 Locked |
| **PDP (Delivery)** | `product-display-page-validation.feature` | 7 | 3 | 4 | - | 🔒 Locked |
| **PDP (Pickup)** | `product-display-page-validation.feature` | 3 | 1 | 2 | - | 🔒 Locked |
| **Add to Cart** | `add-to-cart.feature` | 29 | 16 | 10 | - | 🔄 In Progress |
| **Checkout** | `checkout.feature` | 45 | 20 | 18 | 7 | 🆕 New |
| **TOTAL** | | **123** | **55** | **52** | **10** | **49 Locked** |

---

## Running Tests by Module

```bash
# Run all Locked scenarios
npx cucumber-js --config .cucumber.json --tags "@Locked"

# Run by Module
npx cucumber-js --config .cucumber.json --tags "@Login"
npx cucumber-js --config .cucumber.json --tags "@MyAccount"
npx cucumber-js --config .cucumber.json --tags "@Search"
npx cucumber-js --config .cucumber.json --tags "@PLP"
npx cucumber-js --config .cucumber.json --tags "@PDP"
npx cucumber-js --config .cucumber.json --tags "@Pickup"
npx cucumber-js --config .cucumber.json --tags "@AddToCart"
npx cucumber-js --config .cucumber.json --tags "@Checkout"

# Run Add to Cart scenarios by type
npx cucumber-js --config .cucumber.json --tags "@AddToCart and @Guest"
npx cucumber-js --config .cucumber.json --tags "@AddToCart and @Registered"
npx cucumber-js --config .cucumber.json --tags "@AddToCart and @RemoveFromCart"
npx cucumber-js --config .cucumber.json --tags "@AddToCart and @CartValidation"

# Run Checkout scenarios by type
npx cucumber-js --config .cucumber.json --tags "@Checkout and @Guest"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @Registered"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @Delivery"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @Pickup"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @Payment"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @PlaceOrder"
npx cucumber-js --config .cucumber.json --tags "@Checkout and @OrderConfirmation"

# Run by Priority
npx cucumber-js --config .cucumber.json --tags "@P1"
npx cucumber-js --config .cucumber.json --tags "@Sanity"
```

---
## Troubleshooting

### Issue: Tests timeout

**Solution:** Increase timeout in `.cucumber.json`:
```json
{
  "timeout": 60000
}
```



### Issue: Screenshots/Traces not generated

**Solution:** Ensure hooks.js has proper screenshot configuration and check file permissions in project directory.

### Issue: Geolocation permission denied

**Solution:** This is pre-configured in `hooks.js`. If issues persist, manually grant geolocation permissions in browser settings.

### Issue: App URL not accessible

**Solution:** Verify network connectivity and that the QA environment is running:
```bash
# Test connectivity
curl https://qa-shop.vulcanmaterials.com
```


## CI/CD Integration

### GitHub Actions Workflow

The project includes automated testing via GitHub Actions (`.github/workflows/vulcan-automation-tests.yml`):

- **Trigger:** Push to `main`/`master` or Pull Request
- **Runtime:** Ubuntu Linux with Xvfb display server
- **Browsers:** Chromium (headed mode)
- **Node Version:** v20
- **Timeout:** 60 minutes

Tests run automatically on code changes. Check status in the **Actions** tab.

---

## Additional Resources

- **Playwright Documentation:** https://playwright.dev/
- **Cucumber.js Guide:** https://cucumber.io/docs/cucumber/
- **Page Object Model:** https://playwright.dev/docs/pom
- **Reporting:** Check `playwright-report/` for detailed test reports

---

## Support & Contribution


**Last Updated:** 12 January 2026  
**Node Version Required:** v20+  
**Branch:** Vivek

**Test Framework:** Playwright + Cucumber BDD

