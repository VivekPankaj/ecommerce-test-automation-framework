# Vulcan E-Commerce Storefront Automation

Automated testing framework for Vulcan Materials e-commerce storefront using **Playwright** and **Cucumber BDD**. This project implements behavior-driven development (BDD) testing for comprehensive validation of login,logout,product search, listing, and display, quarry selector functionality.

**Repository:** [vulcan_ecomm_storefront_automation](https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation)  
**Target Application:** https://qa-shop.vulcanmaterials.com

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [Test Reports](#test-reports)
- [Feature Coverage](#feature-coverage)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** v20 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** for version control
- **Windows/Mac/Linux** OS support via Playwright

### Verify Installation

```bash
node --version    # Should be v20.x or higher
npm --version     # Should be 9.x or higher
```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation.git
cd vulcan_ecomm_storefront_automation
```

### Step 2: Install Dependencies

Install all project dependencies including Playwright and Cucumber:

```bash
npm install @cucumber/cucumber
```
```bash
npm install multiple-cucumber-html-reporter --save-dev
```



### Step 3: Install Playwright Browsers

Download and install Playwright browser binaries (Chromium, Firefox, WebKit):

```bash
npx playwright install
```



### Step 4: Verify Setup

Verify that all dependencies are properly installed:

```bash
npx playwright --version
npx cucumber-js --version
```

---

## Running Tests

### Run All Tests Locally

Execute all Cucumber feature tests in headed mode (with browser visible):

```bash
npx cucumber-js --config .cucumber.json
```





### Run Specific Feature Tests

#### Search Tests Only
```bash
npx cucumber-js Ecomm/features/search.feature --exit --format json:./path-to-json-output/cucumber.json
```

#### Product Listing Tests Only
```bash
npx cucumber-js Ecomm/features/product-listing-page-validation.feature --exit --format json:./path-to-json-output/cucumber.json
```

#### Product Display Tests Only
```bash
npx cucumber-js Ecomm/features/product-display-page-validation.feature --exit --format json:./path-to-json-output/cucumber.json
```

### Run Tests by Tags

Run tests with specific tags:

```bash
# Sanity tests only
npx cucumber-js Ecomm/features --require Ecomm/features/step_definitions --require Ecomm/features/support --tags "@Sanity" --exit --format json:./path-to-json-output/cucumber.json

# Product tile validation tests
npx cucumber-js Ecomm/features --require Ecomm/features/step_definitions --require Ecomm/features/support --tags "@product-tile-validation" --exit --format json:./path-to-json-output/cucumber.json
```

## Project Structure

```
vulcan_ecomm_storefront_automation/
│
├── Ecomm/                              # BDD Test Suite (Cucumber)
│   └── features/
│       ├── Search.feature              # Search functionality tests
│       ├── ProductListing.feature      # Product listing page (PLP) tests
│       ├── ProductDisplay.feature      # Product display page (PDP) tests
|       ├── login.feature               # Login page tests
|       ├── QuarrySelector.feature     # Quarry address selector page tests
│       ├── step_definitions/           # Cucumber step implementations
│       │   ├── searchSteps.js
│       │   ├── productListingSteps.js
│       │   └── productDisplaySteps.js
│       │   ├── loginSteps.js
│       │   └── quarrySelectorSteps.js
│       └── support/
│           └── hooks.js                # Browser setup, screenshots, cleanup
│
├── pageobjects/                        # Page Object Model (POM) Pattern
│   ├── LoginPage.js                    # Login page interactions
│   ├── SearchPage.js                   # Search page interactions
│   ├── ProductListingPage.js           # Product listing page (PLP) interactions
│   └── ProductDisplayPage.js           # Product display page (PDP) interactions
│   ├── LoginPage.js                    # Login page (PLP) interactions
│   └── QuarrySelectorPage.js           # Quarry selector page (PDP) interactions
│
├── utils/                              # Utilities & Test Data
│   ├── test-base.js                    # Test configuration & base setup
│   ├── APiUtils.js                     # API testing utilities & helpers
│   └── placeorderTestData.json         # Test data for order scenarios
│
├── helper/                             # Helper Functions
│   └── reports.js                      # HTML report generation
│
├── .github/
│   └── workflows/
│       └── vulcan-automation-tests.yml # CI/CD GitHub Actions workflow
│
├── playwright-report/                  # Playwright HTML test reports
├── test-results-YYYY-MM-DD.../         # Timestamped test result folders
├── path-to-json-output/                # Cucumber JSON output
│   └── cucumber.json                   # Cucumber test results (JSON format)
│
├── playwright.config.js                # Playwright configuration
├── playwright.config1.js               # Alternative Playwright config
├── playwright.service.config.js        # Playwright service config
├── .cucumber.json                      # Cucumber configuration
├── package.json                        # Project dependencies & scripts
├── package-lock.json                   # Locked dependency versions
└── README.md                           # Project documentation (this file)
```

### Project Directory Details

**Ecomm/features/** - Cucumber BDD test scenarios
- Feature files written in Gherkin syntax
- Step definitions that implement the test scenarios
- Support/hooks for browser setup and teardown

**pageobjects/** - Page Object Model abstraction layer
- Encapsulates page interactions and locators
- Reduces code duplication and improves maintainability
- Follows Playwright POM best practices

**utils/** - Shared utilities and test data
- Configuration and base test setup
- API testing utilities for backend testing
- Test data files for data-driven testing

**helper/** - Helper modules
- Report generation functions
- Custom assertion and utility methods

**.github/workflows/** - CI/CD automation
- Automated test execution on push/PR
- GitHub Actions pipeline configuration

**Test Output Directories** - Auto-generated test artifacts
- Screenshots and trace files from test execution
- HTML reports for test result visualization
- JSON reports for CI/CD integration

---

## Environment Configuration

### Default Settings

The project uses default settings optimized for QA testing:

| Setting | Value | Description |
|---------|-------|-------------|
| **Browser** | Chromium | Headless mode disabled for visibility |
| **Timeout** | 30 seconds | Per test execution timeout |
| **Base URL** | https://qa-shop.vulcanmaterials.com | QA environment target |
| **Default Zip Code** | 37303 | Default test address location |
| **Geolocation** | 39.8283, -98.5795 | Fixed US center coordinates |
| **Screenshots** | Enabled | Captured on failure and success |
| **Traces** | Enabled | Available for debugging |

### Environment Variables

Configure test behavior using environment variables:

```bash
# Set browser type (default: chromium)
# Options: chromium, firefox, webkit
set BROWSER=chromium

# Set application URL (default: https://qa-shop.vulcanmaterials.com)
set APP_URL=https://qa-shop.vulcanmaterials.com

# Run tests with custom environment
npm test
```

### Browser Launch Configuration

Tests are configured with the following browser settings:

- **Headless Mode:** Disabled (browser visible by default)
- **Sandbox:** Disabled for CI/CD compatibility
- **Geolocation:** Pre-configured to US center (39.8283, -98.5795)
- **Geolocation Permissions:** Pre-granted to prevent popups
- **Screenshots:** Automatic capture on failures and successes
- **Traces:** Enabled for test debugging
- **Timeout:** 120 seconds (scenario-level), 30 seconds (test-level)


## Test Reports

### Playwright HTML Reports

After running tests locally, view the multiple cucumber HTML report:

```bash
node helper/reports.js
```

Reports are generated in:
- **Location:** `playwright-report/`
- **Timestamped Results:** `test-results-YYYY-MM-DDTHH-MM-SS/`

### Cucumber Reports

Cucumber reports are generated in:
- **Location:** `path-to-json-output/`
- **Format:** JSON (cucumber.json)

### Screenshots & Traces

Test artifacts are automatically captured:
- **Screenshots:** Stored in timestamped test result folders
- **Traces:** Available for debugging via Playwright Inspector

---

## Feature Coverage

### 1. Search.feature
**Purpose:** Validate search functionality and search suggestions

| Scenario | Description | Tags |
|----------|-------------|------|
| Search result page displays search input correctly | Verify search term appears in results page | `@Sanity`, `@Search`|
| Search suggestions appear for 3+ character terms | Validate suggestion dropdown for valid input | `@SearchSuggestions` |
| Search suggestions do not appear for 2-character terms | Verify no suggestions for short input | `@SearchSuggestions` |
| Verify category suggestions navigation | Test category selection from suggestions | `@SearchSuggestions` |
| No results message for invalid search terms | Validate "no results" handling | `@Search`, `@PLP` |

**Coverage:** Search input validation, suggestion system, result display, error handling

---

### 2. ProductListing.feature
**Purpose:** Validate Product Listing Page (PLP) functionality and product tiles

| Scenario | Description | Tags |
|----------|-------------|------|
| Complete product tile validation | Verify all elements: name, details, thumbnail, add to cart, info CTA | `@Sanity`, `@product-tile-validation` |
| Unit price, total price, delivery price display | Validate pricing information accuracy | `@PLP`, `@product-tile-validation` |
| Badge visibility on product tiles | Verify badges appear correctly | `@PLP`, `@product-tile-validation`|
| Quantity selector modal validation | Test quantity input modal UI and functionality | `@QuantitySelector` |
| Quantity selector custom quantity input | Verify custom quantity entry and validation | `@QuantitySelector` |
| Product navigation from product tiles | Test product tile click navigation to PDP | `@PLP`, `@Navigation`|
| Navigation bar and category selection | Verify category filter navigation | `@Navigation` |
| Category filtering with product counts | Validate filtering logic and count display | `@PLP` |

**Coverage:** Product tile components, pricing, badges, quantity selector, filtering, navigation

---

### 3. ProductDisplay.feature
**Purpose:** Validate Product Display Page (PDP) functionality and product details

| Scenario | Description | Tags |
|----------|-------------|------|
| Complete product details visibility | Verify all details: pricing, add to cart, images, etc. | `@Sanity`, `@product-tile-validation` |
| Price attribute validation | Test unit price and total material price accuracy | `@PDP`, `@product-tile-validation` |
| Quantity calculator functionality | Validate width/length/thickness calculations | `@QuantitySelector` |
| Quantity validation range (1-1000 tons) | Verify valid quantity range enforcement | `@QuantitySelector` |
| Input validation (numeric values only) | Test numeric-only input enforcement | `@QuantitySelector` |
| Delivery charges tooltip information | Verify delivery information display | `@PDP` |

**Coverage:** Product details display, price calculations, quantity validation, delivery information

---

### 4. LoginPage.feature
**Purpose:** Validate Login Page Sign in,Sign out functionality

| Scenario | Description | Tags |
|----------|-------------|------|
| Login Page Validation | Verify Sign in, Sign out functionality |  `@SignIn` ,`@SignOut`  |

**Coverage:** Sign in,Sign out

---

### 5. QuarrySelectorPage.feature
**Purpose:** Quarry Address Selector Modal Validation

| Scenario | Description | Tags |
|----------|-------------|------|
| Quarry Address Selector Modal Validation | select or change address to validate pricing and delivery availability |  `@Sanity` ,`@Quarry`  |

**Coverage:** Validate all components in the Address Selector modal and validate default placeholder when no zipcode is saved

---

## Coverage Summary

| Feature | Test Scenarios | Focus Areas | Tags |
|---------|----------------|------------|------|
| **Search.feature** | 5 | Search input, suggestions, results, no-results handling | `@Search`, `@SearchSuggestions`, `@PLP` |
| **ProductListing.feature** | 8 | Product tiles, pricing, badges, quantity selector, filtering, navigation | `@PLP`, `@product-tile-validation`, `@QuantitySelector`, `@Navigation` |
| **ProductDisplay.feature** | 6 | Product details, pricing, quantity calculation, validation, delivery info | `@PDP`, `@product-tile-validation`, `@QuantitySelector` |
| **Login.feature** | 2 | Validate successful user login,log out | `@SignIn`, `@SignOut` |
| **Quarry-selector-page-validation.feature** | 3 | Validate all components in the Address Selector modal and validate default placeholder when no zipcode is saved| `@Sanity`, `@Quarry` |
| **Total** | **24+** | Complete user journey from search to product details | `@Sanity`|


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


**Last Updated:** December 2, 2025  
**Node Version Required:** v20+  
**Test Framework:** Playwright + Cucumber BDD
