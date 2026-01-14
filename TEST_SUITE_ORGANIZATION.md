# 🧪 Test Suite Organization - Vulcan E-Commerce

**Last Updated:** January 14, 2026  
**Status:** Production Ready ✅

---

## 📊 Test Suite Overview

### Suite Statistics

| Suite | Scenarios | Steps | Purpose | Estimated Time |
|-------|-----------|-------|---------|----------------|
| **@Sanity** | 33 | 292 | Quick smoke tests | ~10-15 min |
| **@Regression** | 135 | 1238 | Complete coverage | ~40-60 min |

---

## 🎯 @Sanity Suite (Quick Smoke Tests)

**Purpose:** Critical P1 flows that must pass before any release  
**Run Command:** `npx cucumber-js --tags "@Sanity"`  
**When to Run:** Before commits, pull requests, deployments

### Module Breakdown:

#### 🛒 Add to Cart (2 scenarios)
- Guest adds product from PLP via Shop by Project - Delivery
- Remove single product from cart

#### 🔍 Search (2 scenarios)
- Search functionality with different query types
- Autocomplete suggestions validation

#### 📄 PDP - Product Display Page (3 scenarios)
- Complete product details validation
- Quantity calculator functionality
- Pickup mode - no delivery charges validation

#### 📋 PLP - Product Listing Page (5 scenarios)
- Complete product tile validation
- Quantity Selector modal validation
- Quantity Selector functionality
- Pickup facility selection
- Pickup - no delivery charges

#### 🏢 Quarry Selector (3 scenarios)
- Address Selector modal validation
- Address selection and confirmation
- Address edit functionality

#### 🔐 Login (1 scenario)
- Validate successful user login

#### 👤 My Account (2 scenarios)
- Profile section validation
- Purchase History elements validation

#### ✏️ My Profile (1 scenario)
- Update profile personal info

#### 🛒 Checkout (5 scenarios)
- Delivery address entry (Guest)
- Pickup facility selection (Guest)
- Credit card payment entry
- Place order - Delivery (Guest)
- Place order - Pickup (Guest)
- Place order - Delivery (Registered)
- Order confirmation page validation

### Module-Specific Sanity Commands:

```bash
# Run Sanity for specific modules
npx cucumber-js --tags "@Sanity and @Search"
npx cucumber-js --tags "@Sanity and @PDP"
npx cucumber-js --tags "@Sanity and @PLP"
npx cucumber-js --tags "@Sanity and @AddToCart"
npx cucumber-js --tags "@Sanity and @Login"
npx cucumber-js --tags "@Sanity and @Checkout"
```

---

## 🔄 @Regression Suite (Complete Coverage)

**Purpose:** Comprehensive testing of all features  
**Run Command:** `npx cucumber-js --tags "@Regression"`  
**When to Run:** Nightly builds, before major releases, weekly regression

### Module Breakdown:

#### 🛒 Add to Cart (29 scenarios)
**Purpose:** Complete add-to-cart flow validation

**Coverage:**
- PLP via Shop by Project (Delivery + Pickup)
- PLP via Shop by Categories (Delivery + Pickup)
- PDP with default/custom quantity (Delivery + Pickup)
- Search results (Delivery + Pickup)
- Registered user flows (Delivery + Pickup)
- Multiple products behavior
- Cart quantity management
- Remove from cart
- Edit quantity in cart
- Cart page validations (Delivery + Pickup)
- Price validation across screens

#### 🔍 Search (2 scenarios)
- Search functionality with query types
- Autocomplete validation
- Search Results Page (SRP) validation
- URL and keyword display

#### 📄 PDP - Product Display Page (10 scenarios)
- Product details validation
- Price attributes validation
- Quantity calculator (2 dimension sets)
- Quantity selector validation
- Delivery charges tooltip
- Pickup mode validations (3 scenarios)

#### 📋 PLP - Product Listing Page (12 scenarios)
- Product tile validation
- Quantity Selector modal UI
- Quantity Selector functionality
- Navigation validation
- Category selection
- Pickup mode scenarios (4 scenarios)
  - Facility list and distance
  - Distance filter changes
  - Facility selection
  - No delivery charges

#### 🏢 Quarry Selector (3 scenarios)
- Address modal validation
- Address selection flow
- Address change functionality

#### 🔐 Login (5 scenarios)
- Successful sign in
- Sign out from Homepage
- Sign out from PLP
- Sign out from PDP
- Sign out from Cart

#### 👤 My Account (2 scenarios)
- Profile section validation
- Purchase History validation

#### ✏️ My Profile (1 scenario)
- Edit profile information

#### 🛒 Checkout (51 scenarios)
**Purpose:** Complete checkout flow validation

**Coverage:**
- **Navigation** (2 scenarios): Guest + Registered
- **Delivery Address** (5 scenarios): Guest entry, Registered selection, New address, Edit address, Validation
- **Pickup Facility** (4 scenarios): Selection, Change facility, Distance filter, Validation
- **Schedule - Delivery** (5 scenarios): Time slot selection, Same-day, Future date, Change schedule, Validation
- **Schedule - Pickup** (2 scenarios): Time slot selection, Facility hours validation
- **Payment** (10 scenarios): Credit card, Saved cards, New card, Edit card, Validation, Pay on Delivery/Pickup
- **Order Summary** (5 scenarios): Delivery validation, Pickup validation, Multiple products, Edit quantity, Charges breakdown
- **Place Order** (10 scenarios): Delivery (Guest/Registered), Pickup (Guest/Registered), Multiple payment methods, Validation
- **Order Confirmation** (3 scenarios): Page validation, Email confirmation, Order tracking
- **Edge Cases** (5 scenarios): Out of stock, Address validation errors, Payment failures

### Module-Specific Regression Commands:

```bash
# Run Regression for specific modules
npx cucumber-js --tags "@Regression and @AddToCart"
npx cucumber-js --tags "@Regression and @Search"
npx cucumber-js --tags "@Regression and @PDP"
npx cucumber-js --tags "@Regression and @PLP"
npx cucumber-js --tags "@Regression and @QuarrySelector"
npx cucumber-js --tags "@Regression and @Login"
npx cucumber-js --tags "@Regression and @MyAccount"
npx cucumber-js --tags "@Regression and @MyProfile"
npx cucumber-js --tags "@Regression and @Checkout"
```

---

## 🏷️ Tag Structure

### Feature-Level Tags
```gherkin
@Regression @AddToCart
Feature: Add to Cart Functionality
```

### Scenario-Level Tags
```gherkin
@Sanity @P1 @Guest @Delivery @PLP @ShopByProject
Scenario: Guest adds product from PLP
```

### Tag Hierarchy

1. **Suite Level:**
   - `@Regression` - All comprehensive tests
   - `@Sanity` - Quick smoke tests

2. **Priority Level:**
   - `@P1` - Critical functionality
   - `@P2` - Important but not critical

3. **User Type:**
   - `@Guest` - Guest user flows
   - `@Registered` - Logged-in user flows

4. **Mode:**
   - `@Delivery` - Delivery mode tests
   - `@Pickup` - Pickup mode tests

5. **Source:**
   - `@PLP` - Product Listing Page
   - `@PDP` - Product Display Page
   - `@Search` - Search Results Page

6. **Feature:**
   - `@ShopByProject`
   - `@ShopByCategories`
   - `@CartBehavior`
   - `@RemoveFromCart`
   - etc.

---

## 📈 Execution Time Guidelines

### Expected Duration

| Suite | Min | Max | Average | Scenarios/Min |
|-------|-----|-----|---------|---------------|
| @Sanity | 10m | 15m | 12m | ~2.75 |
| @Regression | 40m | 60m | 50m | ~2.7 |

**Note:** Times vary based on:
- Network speed
- QA environment performance
- Browser rendering speed
- Test data availability

---

## 🎯 CI/CD Integration

### Pipeline Stages

```yaml
stages:
  - unit-tests
  - sanity
  - regression
  - deploy

sanity-tests:
  stage: sanity
  script:
    - npx cucumber-js --tags "@Sanity"
  only:
    - merge_requests
    - develop
    - main

regression-tests:
  stage: regression
  script:
    - npx cucumber-js --tags "@Regression"
  only:
    - develop
    - main
  schedule:
    - cron: "0 2 * * *"  # Daily at 2 AM
```

### Build Gates

| Stage | Gate | Action if Fail |
|-------|------|----------------|
| PR Merge | @Sanity passes | Block merge |
| Develop Deploy | @Sanity passes | Block deployment |
| Production Deploy | @Regression passes | Block deployment |
| Nightly Build | @Regression passes | Alert QA team |

---

## 📊 Reporting

### Report Features

1. **Executive Summary Dashboard**
   - Module cards with pass/fail status
   - Click-to-navigate to module details
   - Module-level execution time
   - Visual progress bars

2. **Module Organization**
   - Tests grouped by functional modules
   - Expandable scenario details
   - Step-by-step visibility

3. **PDF Export**
   - Concise executive-level output
   - Scenarios remain collapsed
   - Perfect for stakeholder presentations

4. **Console Output**
   - Module-level statistics
   - Execution time per module
   - Pass/fail breakdown

### Generate Report

```bash
# After test execution
node generate-report.js

# Open report
open test-report.html
```

---

## 🔧 Maintenance

### Adding New Tests

1. **Choose appropriate tags:**
   ```gherkin
   @Regression @NewFeature @P1
   Scenario: New feature test
   ```

2. **Add @Sanity only if:**
   - Critical P1 functionality
   - Must-pass before any release
   - Takes < 30 seconds to execute

3. **Update documentation:**
   - Add to this document
   - Update scenario counts
   - Adjust time estimates

### Updating Existing Tests

1. **Check current tags:**
   ```bash
   grep -n "@Sanity" feature-file.feature
   ```

2. **Verify @Regression is present**

3. **Test before committing:**
   ```bash
   npx cucumber-js --tags "@Sanity" --dry-run
   npx cucumber-js --tags "@Regression" --dry-run
   ```

### Tag Review Schedule

| Frequency | Review | Action |
|-----------|--------|--------|
| Weekly | @Sanity execution time | Remove slow tests |
| Monthly | @Sanity scenario count | Keep < 35 scenarios |
| Quarterly | @Regression coverage | Add missing scenarios |
| Release | All tags | Validate organization |

---

## 📞 Support & Questions

### Quick Reference

- **Too many @Sanity tests?** Keep only critical P1 flows
- **Need module-specific tests?** Use: `@Regression and @ModuleName`
- **Tests running too long?** Check for waits, optimize selectors
- **Flaky tests?** Review LOCKED_CODE_DO_NOT_MODIFY.md

### Documentation

- **Code Protection:** `LOCKED_CODE_DO_NOT_MODIFY.md`
- **Quick Reference:** `QUICK_REFERENCE_CODE_PROTECTION.md`
- **Root Cause Analysis:** `ROOT_CAUSE_ANALYSIS_CART_FAILURES.md`
- **Code Lock Summary:** `CODE_LOCK_SUMMARY.md`

### Commands Cheat Sheet

```bash
# Sanity suite
npx cucumber-js --tags "@Sanity"

# Full regression
npx cucumber-js --tags "@Regression"

# Specific module
npx cucumber-js --tags "@Search"
npx cucumber-js --tags "@AddToCart"
npx cucumber-js --tags "@Checkout"

# Priority-based
npx cucumber-js --tags "@P1"
npx cucumber-js --tags "@P2"

# User-type based
npx cucumber-js --tags "@Guest"
npx cucumber-js --tags "@Registered"

# Mode-based
npx cucumber-js --tags "@Delivery"
npx cucumber-js --tags "@Pickup"

# Combined tags
npx cucumber-js --tags "@Sanity and @Search"
npx cucumber-js --tags "@Regression and @P1 and @Delivery"

# Generate report
node generate-report.js && open test-report.html
```

---

## ✅ Quality Gates

### Before Commit
- ✅ Run affected @Sanity tests
- ✅ All tests passing
- ✅ No new flaky tests introduced

### Before PR
- ✅ Full @Sanity suite passing
- ✅ Module-specific @Regression passing
- ✅ Code reviewed

### Before Deployment
- ✅ Full @Regression suite passing
- ✅ Report generated and reviewed
- ✅ No critical failures

---

**Last Review:** January 14, 2026  
**Next Review:** February 14, 2026  
**Owner:** Vulcan Materials QA Team  
**Status:** 🟢 Active and Maintained
