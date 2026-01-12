# Vulcan E-Commerce Storefront Automation


Automated testing framework for Vulcan Materials e-commerce storefront using **Playwright** and **Cucumber BDD**. This project implements behavior-driven development (BDD) testing for comprehensive validation of login, logout, product search, listing, display and quarry selector functionality.


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

> **🔒 LOCKED Scenarios:** Verified and stable - do not modify without approval  
> **Last Updated:** 12 January 2026  
> **Total Scenarios:** 124 | **Locked:** 43 (Login: 5, PLP: 12, PDP: 10, Quarry: 3, Search: 10, Add to Cart: 3)

---

### 1. Login Module (`login.feature`) 🔒 LOCKED
**Purpose:** Validate Login/Logout functionality across all pages  
**Status:** ✅ Verified | 5 scenarios, 49 steps

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate successful user login with all validations | `@Sanity @P1 @SignIn` | P1 |
| 2 | Validate successful user logout from Homepage | `@P1 @SignOut @SignOutFromHomepage` | P1 |
| 3 | Validate successful user logout from PLP page | `@P2 @SignOut @SignOutFromPLP` | P2 |
| 4 | Validate successful user logout from PDP page | `@P2 @SignOut @SignOutFromPDP` | P2 |
| 5 | Validate successful user logout from Cart page | `@P2 @SignOut @SignOutFromCart` | P2 |

**Coverage:** Sign In validation, My Account dropdown, Profile verification, Sign Out from all pages

---

### 2. My Account Module (`my-account.feature`) 🔒 LOCKED
**Purpose:** Validate My Account sections after user login  
**Status:** ✅ Verified | 12 scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate My Profile page displays correct user information | `@Sanity @P1 @MyProfile` | P1 |
| 2 | Validate Purchase History page displays all required elements | `@Sanity @P1 @PurchaseHistory` | P1 |
| 3 | Validate View Details opens Order Details page | `@P1 @ViewDetails` | P1 |
| 4 | Validate Modify Quantity opens quantity input field | `@P2 @ModifyQuantity` | P2 |
| 5 | Validate clicking X on Modify Quantity cancels without changes | `@P2 @CancelQuantityChange` | P2 |
| 6 | Validate saving quantity change shows Submit Changes button | `@P1 @SaveQuantityChange` | P1 |
| 7 | Validate Submit Changes recalculates price and shows confirmation | `@P1 @SubmitQuantityChange` | P1 |
| 8 | Validate Pickup or Delivery Details section displays Modify link | `@P2 @PickupDetails` | P2 |
| 9 | Validate clicking Modify opens Details in edit mode | `@P2 @EditPickupDetails` | P2 |
| 10 | Validate clicking X on Details cancels without changes | `@P2 @CancelPickupDetails` | P2 |
| 11 | Validate saving Details shows confirmation message | `@P1 @SavePickupDetails` | P1 |
| 12 | Validate Payment page displays saved cards or empty state | `@P2 @Payment` | P2 |

**Coverage:** My Profile, Purchase History, Modify Quantity, Pickup/Delivery Details, Payment

---

### 3. Search Module (`search.feature`) 🔒 LOCKED
**Purpose:** Validate search functionality and autocomplete  
**Status:** ✅ Verified | 10 scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Search functionality works correctly with different query types | `@Sanity @P1 @Smoke` | P1 |
| 2 | Autocomplete suggestions appear only after 3 characters | `@Sanity @P1 @Autocomplete` | P1 |
| 3 | Search navigates to SRP with correct query display | `@P2 @SearchResultsPage` | P2 |
| 4 | Select autocomplete suggestion navigates to relevant page | `@P2 @AutocompleteNavigation` | P2 |
| 5 | Search works from Product Listing Page | `@P2 @CrossPage @SearchFromPLP` | P2 |
| 6 | Search results load quickly | `@P3 @Performance` | P3 |
| 7 | No results message for invalid search term | `@P3 @InvalidSearch @NoResults` | P3 |
| 8-10 | Search handles special characters correctly | `@P3 @SpecialCharacters` | P3 |

**Coverage:** Keyword search, Product name search, Autocomplete, Cross-page search, Special characters

---

### 4. Quarry Selector Module (`quarry-selector-page-validation.feature`)
**Purpose:** Validate Address Selector Modal functionality  
**Status:** ✅ Ready | 3 scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate all components in the Address Selector modal | `@Sanity @quarry` | Sanity |
| 2 | Closing modal without confirming should NOT save address | `@Sanity @quarry @second` | Sanity |
| 3 | Validate default placeholder when no zipcode is saved | `@Sanity @quarry` | Sanity |

**Coverage:** Address Input Field, Google Map Component, Confirm/Close CTAs, Address persistence

---

### 5. Product Listing Page - PLP (`product-listing-page-validation.feature`) 🔒 LOCKED
**Purpose:** Validate PLP functionality for Delivery and Pickup modes  
**Status:** ✅ Verified | 10 scenarios

#### Delivery Mode Scenarios (6)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Complete product tile validation | `@Locked @Sanity @PLP @P1` | P1 |
| 2 | Display Quantity Selector Modal with Correct UI Components | `@Locked @Sanity @PLP @P1` | P1 |
| 3 | Quantity Selector functionality | `@Locked @Sanity @PLP @P1` | P1 |
| 4 | Verify product tile navigation and placeholder handling | `@Locked @Sanity @PLP @P2` | P2 |
| 5 | Verify navigation bar categories display | `@Locked @Sanity @PLP @P2` | P2 |
| 6 | Verify category selection and product display | `@Locked @Sanity @PLP @P2` | P2 |

#### Pickup Mode Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 7 | Select Pickup option and verify facility list | `@Locked @Sanity @PLP @P1 @Pickup` | P1 |
| 8 | Verify distance filter changes facility count | `@Locked @Sanity @PLP @P2 @Pickup @DistanceFilter` | P2 |
| 9 | Select a pickup facility and verify header update | `@Locked @Sanity @PLP @P1 @Pickup @FacilitySelection` | P1 |
| 10 | Verify no delivery charges displayed on PLP for Pickup | `@Locked @Sanity @PLP @P1 @Pickup @NoDeliveryCharges` | P1 |

**Coverage:** Product tiles, Quantity selector, Navigation, Pickup facility selection, Distance filter, Map markers

---

### 6. Product Display Page - PDP (`product-display-page-validation.feature`) 🔒 LOCKED
**Purpose:** Validate PDP functionality for Delivery and Pickup modes  
**Status:** ✅ Verified | 10 scenarios

#### Delivery Mode Scenarios (7)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Complete product details page validation | `@Locked @Sanity @PDP @P1` | P1 |
| 2 | Verify price attributes on product tile with valid quantity | `@Locked @Sanity @PDP @P1` | P1 |
| 3 | Verify quantity calculator functionality (dimensions set 1) | `@Locked @Sanity @PDP @P1` | P1 |
| 4 | Verify quantity calculator functionality (dimensions set 2 in feet) | `@Locked @Sanity @PDP @P2` | P2 |
| 5 | Verify max quantity validation message | `@Locked @Sanity @PDP @P2` | P2 |
| 6 | Verify invalid text quantity validation message | `@Locked @Sanity @PDP @P2` | P2 |
| 7 | Verify delivery charges tooltip message | `@Locked @Sanity @PDP @P2` | P2 |

#### Pickup Mode Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 8 | Verify PDP does not show delivery charges in Pickup mode | `@Locked @Sanity @PDP @P1 @Pickup` | P1 |
| 9 | Verify PDP shows Pickup location in header | `@Locked @Sanity @PDP @P2 @Pickup` | P2 |
| 10 | Verify quantity changes in Pickup mode calculate correctly | `@Locked @Sanity @PDP @P2 @Pickup` | P2 |

**Coverage:** Product attributes, Price calculations, Quantity calculator, Validation messages, Pickup mode pricing

---

### 7. Add to Cart Module (`add-to-cart.feature`) 🔄 IN PROGRESS
**Purpose:** Validate Add to Cart functionality across all entry points and user types  
**Status:** 🔄 In Progress | 29 scenarios

#### Entry Points

| Entry Point | Description |
|-------------|-------------|
| **Shop by Project** | Navigate via Project menu → PLP → Add to Cart |
| **Shop By Categories** | Navigate via Categories menu → PLP → Add to Cart |
| **PDP** | Navigate to Product Display Page → Add to Cart |
| **Search** | Search for product → Add to Cart from results |

#### Guest User Scenarios (10)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Add product from PLP via Shop by Project - Delivery | `@Sanity @P1 @Guest @Delivery @ShopByProject` | P1 |
| 2 | Add product from PLP via Shop by Project - Pickup | `@P1 @Guest @Pickup @ShopByProject` | P1 |
| 3 | Add product from PLP via Shop By Categories - Delivery | `@Sanity @P1 @Guest @Delivery @ShopByCategories` | P1 |
| 4 | Add product from PLP via Shop By Categories - Pickup | `@P2 @Guest @Pickup @ShopByCategories` | P2 |
| 5 | Add product from PDP with default quantity - Delivery | `@Sanity @P1 @Guest @Delivery @PDP` | P1 |
| 6 | Add product from PDP with custom quantity - Delivery | `@P1 @Guest @Delivery @PDP @CustomQuantity` | P1 |
| 7 | Add product from PDP - Pickup | `@P1 @Guest @Pickup @PDP` | P1 |
| 8 | Add product from Search results - Delivery | `@Sanity @P1 @Guest @Delivery @Search` | P1 |
| 9 | Add product from Search results - Pickup | `@P2 @Guest @Pickup @Search` | P2 |

#### Registered User Scenarios (5)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 10 | Add product from PLP - Delivery (with cart cleanup) | `@Sanity @P1 @Registered @Delivery @PLP` | P1 |
| 11 | Add product from PLP - Pickup (with cart cleanup) | `@P1 @Registered @Pickup @PLP` | P1 |
| 12 | Add product from PDP - Delivery | `@P1 @Registered @Delivery @PDP` | P1 |
| 13 | Add product from Search - Delivery | `@P2 @Registered @Search` | P2 |

#### Cart Behavior Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 14 | Same product multiple times increases quantity, not count | `@Sanity @P1 @CartBehavior @SameProduct` | P1 |
| 15 | Different products increases cart count | `@Sanity @P1 @CartBehavior @DifferentProducts` | P1 |
| 16 | Validate prices across all screens | `@P1 @CartBehavior @PriceValidation` | P1 |

#### Remove from Cart Scenarios (3) 🔒 LOCKED

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 17 | Remove single product from cart | `@Sanity @P1 @RemoveFromCart` | P1 |
| 18 | Remove one product when multiple in cart | `@P1 @RemoveFromCart @MultipleProducts` | P1 |
| 19 | Remove all products one by one | `@P2 @RemoveFromCart @AllProducts` | P2 |

#### Cart Validation Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 20 | Validate Order Summary section - Delivery | `@P1 @CartValidation @Delivery @OrderSummary` | P1 |
| 21 | Validate Order Summary section - Pickup | `@P1 @CartValidation @Pickup @OrderSummary` | P1 |
| 22 | Edit quantity in cart and verify price update | `@P1 @EditQuantity` | P1 |

#### Cart Navigation Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 23 | Navigate to cart via header cart icon | `@P2 @CartNavigation @HeaderIcon` | P2 |
| 24 | Navigate to cart via View Cart button in slider | `@P2 @CartNavigation @ViewCart` | P2 |
| 25 | Continue Shopping from empty cart | `@P2 @EmptyCart @ContinueShopping` | P2 |

**Coverage:** All entry points, Guest/Registered users, Delivery/Pickup modes, Cart confirmation slider, Order Summary validation, Remove functionality, Quantity updates

**Test Status:** 14/29 scenarios passing

---

### 8. Checkout Module (`checkout.feature`) 🆕 NEW
**Purpose:** Validate complete checkout flow including address, schedule, payment, and order placement  
**Status:** 🆕 New | 45 scenarios

#### Jira Epic References
- ECM-827 - Checkout Main Epic
- ECM-612 - Delivery Flow
- ECM-597 - Payment Flow
- ECM-593 - Schedule/Time Slot Selection
- ECM-589 - Order Review & Confirmation
- ECM-583 - Guest Checkout Flow

#### Checkout Navigation Scenarios (2)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Guest user navigates to checkout page from cart | `@Sanity @P1 @CheckoutNavigation @Guest` | P1 |
| 2 | Registered user navigates to checkout page from cart | `@P1 @CheckoutNavigation @Registered` | P1 |

#### Delivery Address Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 3 | Guest user enters delivery address during checkout | `@Sanity @P1 @Delivery @DeliveryAddress @Guest` | P1 |
| 4 | Registered user selects saved delivery address | `@P1 @Delivery @DeliveryAddress @Registered` | P1 |
| 5 | Registered user adds new delivery address during checkout | `@P2 @Delivery @DeliveryAddress @NewAddress` | P2 |
| 6 | User edits delivery address during checkout | `@P2 @Delivery @DeliveryAddress @EditAddress` | P2 |

#### Pickup Facility Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 7 | Guest user completes checkout with Pickup option | `@Sanity @P1 @Pickup @FacilitySelection @Guest` | P1 |
| 8 | Registered user completes checkout with Pickup at saved facility | `@P1 @Pickup @FacilitySelection @Registered` | P1 |
| 9 | User changes pickup facility during checkout | `@P2 @Pickup @ChangeFacility` | P2 |

#### Schedule - Delivery Time Slot Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 10 | User selects delivery date and time slot | `@Sanity @P1 @Schedule @Delivery @TimeSlot` | P1 |
| 11 | User selects same-day delivery | `@P1 @Schedule @Delivery @TodayDelivery` | P1 |
| 12 | User selects future delivery date | `@P2 @Schedule @Delivery @FutureDate` | P2 |
| 13 | User changes delivery schedule | `@P2 @Schedule @Delivery @ChangeSchedule` | P2 |

#### Schedule - Pickup Time Slot Scenarios (2)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 14 | User selects pickup date and time slot | `@Sanity @P1 @Schedule @Pickup @TimeSlot` | P1 |
| 15 | Pickup time slots respect facility operating hours | `@P2 @Schedule @Pickup @FacilityHours` | P2 |

#### Payment - Credit Card Scenarios (5)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 16 | Guest user enters new credit card for payment | `@Sanity @P1 @Payment @CreditCard @Guest` | P1 |
| 17 | Registered user pays with saved credit card | `@P1 @Payment @CreditCard @Registered` | P1 |
| 18 | Guest user saves credit card for future use | `@P2 @Payment @CreditCard @SaveCard` | P2 |
| 19 | Registered user adds new credit card during checkout | `@P2 @Payment @CreditCard @AddNewCard` | P2 |
| 20 | User sees error for invalid credit card | `@P3 @Payment @CreditCard @InvalidCard` | P3 |

#### Payment - Pay on Delivery/Pickup Scenarios (2)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 21 | User selects Pay on Delivery option | `@P2 @Payment @PayOnDelivery` | P2 |
| 22 | User selects Pay on Pickup option | `@P2 @Payment @PayOnPickup` | P2 |

#### Order Summary Validation Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 23 | Validate Order Summary for Delivery order | `@Sanity @P1 @OrderSummary @Delivery` | P1 |
| 24 | Validate Order Summary for Pickup order | `@P1 @OrderSummary @Pickup` | P1 |
| 25 | Validate Order Summary with multiple products | `@P2 @OrderSummary @MultipleProducts` | P2 |
| 26 | Edit quantity from checkout page updates Order Summary | `@P2 @OrderSummary @EditQuantity` | P2 |

#### Place Order - Success Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 27 | Guest user places order with Delivery successfully | `@Sanity @P1 @PlaceOrder @Delivery @Guest` | P1 |
| 28 | Guest user places order with Pickup successfully | `@Sanity @P1 @PlaceOrder @Pickup @Guest` | P1 |
| 29 | Registered user places order with Delivery successfully | `@Sanity @P1 @PlaceOrder @Delivery @Registered` | P1 |
| 30 | Registered user places order with Pickup successfully | `@P1 @PlaceOrder @Pickup @Registered` | P1 |

#### Order Confirmation Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 31 | Validate Order Confirmation page elements | `@Sanity @P1 @OrderConfirmation` | P1 |
| 32 | View Order Details from confirmation page | `@P2 @OrderConfirmation @ViewOrderDetails` | P2 |
| 33 | Continue Shopping from confirmation page | `@P2 @OrderConfirmation @ContinueShopping` | P2 |

#### Checkout Validation & Error Handling Scenarios (4)

| # | Scenario | Tags | Priority |
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

