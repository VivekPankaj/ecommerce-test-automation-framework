# Vulcan E-Commerce Storefront Automation - Test Scenarios

## Overview
This document provides a comprehensive summary of all automated test scenarios across the Vulcan Shop E-Commerce platform.

**Last Updated:** 12 January 2026  
**Branch:** Vivek  
**Total Scenarios:** 45

---

## 📊 Summary by Module

| Module | Feature File | Total Scenarios | P1 | P2 | P3 | Status |
|--------|--------------|-----------------|----|----|----|----|
| Login | `login.feature` | 5 | 2 | 3 | - | 🔒 Locked |
| My Account | `my-account.feature` | 12 | 5 | 7 | - | ✅ Ready |
| Search | `search.feature` | 10 | 2 | 4 | 4 | ✅ Ready |
| Quarry Selector | `quarry-selector-page-validation.feature` | 3 | - | - | - | ✅ Ready |
| PLP (Delivery) | `product-listing-page-validation.feature` | 6 | 3 | 3 | - | 🔒 Locked |
| PLP (Pickup) | `product-listing-page-validation.feature` | 4 | 3 | 1 | - | 🔒 Locked |
| PDP (Delivery) | `product-display-page-validation.feature` | 7 | 3 | 4 | - | 🔒 Locked |
| PDP (Pickup) | `product-display-page-validation.feature` | 3 | 1 | 2 | - | 🔒 Locked |
| **TOTAL** | | **50** | **19** | **24** | **4** | |

---

## 🔐 LOGIN MODULE (`login.feature`)

**Status:** 🔒 LOCKED (5 scenarios, 49 steps)  
**Last Verified:** 11 January 2026

### Scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate successful user login with all validations | @Sanity @P1 @SignIn | P1 |
| 2 | Validate successful user logout from Homepage | @P1 @SignOut @SignOutFromHomepage | P1 |
| 3 | Validate successful user logout from PLP page | @P2 @SignOut @SignOutFromPLP | P2 |
| 4 | Validate successful user logout from PDP page | @P2 @SignOut @SignOutFromPDP | P2 |
| 5 | Validate successful user logout from Cart page | @P2 @SignOut @SignOutFromCart | P2 |

### Validations Covered
- ✅ Sign In button changes to My Account after login
- ✅ My Account dropdown shows greeting + menu items
- ✅ First name matches profile page
- ✅ Email matches profile page
- ✅ Sign Out redirects to Homepage from any page

---

## 👤 MY ACCOUNT MODULE (`my-account.feature`)

**Status:** ✅ Ready (12 scenarios)  
**Created:** 11 January 2026

### Scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate My Profile page displays correct user information | @Sanity @P1 @MyProfile | P1 |
| 2 | Validate Purchase History page displays all required elements | @Sanity @P1 @PurchaseHistory | P1 |
| 3 | Validate View Details opens Order Details page | @P1 @PurchaseHistory @ViewDetails | P1 |
| 4 | Validate Modify Quantity opens quantity input field | @P2 @ModifyQuantity | P2 |
| 5 | Validate clicking X on Modify Quantity cancels without changes | @P2 @CancelQuantityChange | P2 |
| 6 | Validate saving quantity change shows Submit Changes button | @P1 @SaveQuantityChange | P1 |
| 7 | Validate Submit Changes recalculates price and shows confirmation | @P1 @SubmitQuantityChange | P1 |
| 8 | Validate Pickup or Delivery Details section displays Modify link | @P2 @PickupDetails | P2 |
| 9 | Validate clicking Modify opens Details in edit mode | @P2 @EditPickupDetails | P2 |
| 10 | Validate clicking X on Details cancels without changes | @P2 @CancelPickupDetails | P2 |
| 11 | Validate saving Details shows confirmation message | @P1 @SavePickupDetails | P1 |
| 12 | Validate Payment page displays saved cards or empty state | @P2 @Payment | P2 |

### Sections Covered
- ✅ My Profile (Personal Info, Login Info)
- ✅ Purchase History (Order list, Order details)
- ✅ Modify Quantity flow (Cancel/Save/Submit)
- ✅ Pickup/Delivery Details (View/Edit/Cancel/Save)
- ✅ Payment (Saved cards, Add payment)

---

## 🔍 SEARCH MODULE (`search.feature`)

**Status:** ✅ Ready (10 scenarios)  
**Created:** 11 January 2026

### Scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Search functionality works correctly with different query types | @Sanity @P1 @Smoke | P1 |
| 2 | Autocomplete suggestions appear only after 3 characters | @Sanity @P1 @Autocomplete | P1 |
| 3 | Search navigates to SRP with correct query display | @P2 @SearchResultsPage | P2 |
| 4 | Select autocomplete suggestion navigates to relevant page | @P2 @AutocompleteNavigation | P2 |
| 5 | Search works from Product Listing Page | @P2 @CrossPage @SearchFromPLP | P2 |
| 6 | Search results load quickly | @P3 @Performance | P3 |
| 7 | No results message for invalid search term | @P3 @InvalidSearch @NoResults | P3 |
| 8 | Search handles special characters correctly | @P3 @SpecialCharacters | P3 |
| 9 | Search handles special characters (Fraction) | @P3 @SpecialCharacters | P3 |
| 10 | Search handles special characters (Multiple words) | @P3 @SpecialCharacters | P3 |

### Features Covered
- ✅ Keyword search (stone, base, etc.)
- ✅ Product name search (aggregate-base)
- ✅ Autocomplete suggestions (after 3 chars)
- ✅ Search from different pages
- ✅ Special character handling (#, /, spaces)
- ✅ No results handling

---

## 📍 QUARRY SELECTOR MODULE (`quarry-selector-page-validation.feature`)

**Status:** ✅ Ready (3 scenarios)

### Scenarios

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Validate all components in the Address Selector modal | @Sanity @quarry | Sanity |
| 2 | Closing modal without confirming should NOT save address | @Sanity @quarry @second | Sanity |
| 3 | Validate default placeholder when no zipcode is saved | @Sanity @quarry | Sanity |

### Features Covered
- ✅ Address Input Field
- ✅ Google Map Component with controls
- ✅ Confirm/Close CTAs
- ✅ Address persistence behavior

---

## 📦 PRODUCT LISTING PAGE - PLP (`product-listing-page-validation.feature`)

**Status:** 🔒 LOCKED (10 scenarios)

### Delivery Mode Scenarios (6)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Complete product tile validation | @Locked @Sanity @PLP @P1 | P1 |
| 2 | Display Quantity Selector Modal with Correct UI Components | @Locked @Sanity @PLP @P1 | P1 |
| 3 | Quantity Selector functionality | @Locked @Sanity @PLP @P1 | P1 |
| 4 | Verify product tile navigation and placeholder handling | @Locked @Sanity @PLP @P2 | P2 |
| 5 | Verify navigation bar categories display | @Locked @Sanity @PLP @P2 | P2 |
| 6 | Verify category selection and product display | @Locked @Sanity @PLP @P2 | P2 |

### Pickup Mode Scenarios (4)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 7 | Select Pickup option and verify facility list | @Locked @Sanity @PLP @P1 @Pickup | P1 |
| 8 | Verify distance filter changes facility count | @Locked @Sanity @PLP @P2 @Pickup @DistanceFilter | P2 |
| 9 | Select a pickup facility and verify header update | @Locked @Sanity @PLP @P1 @Pickup @FacilitySelection | P1 |
| 10 | Verify no delivery charges displayed on PLP for Pickup | @Locked @Sanity @PLP @P1 @Pickup @NoDeliveryCharges | P1 |

### Features Covered
- ✅ Product tile components (name, price, image, CTA)
- ✅ Quantity selector modal
- ✅ Navigation bar categories
- ✅ Pickup facility selection
- ✅ Distance filter (25/50/200 miles)
- ✅ Map marker validation
- ✅ Delivery vs Pickup mode switching

---

## 📄 PRODUCT DISPLAY PAGE - PDP (`product-display-page-validation.feature`)

**Status:** 🔒 LOCKED (10 scenarios)

### Delivery Mode Scenarios (7)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 1 | Complete product details page validation | @Locked @Sanity @PDP @P1 | P1 |
| 2 | Verify price attributes on product tile with valid quantity | @Locked @Sanity @PDP @P1 | P1 |
| 3 | Verify quantity calculator functionality (dimensions set 1) | @Locked @Sanity @PDP @P1 | P1 |
| 4 | Verify quantity calculator functionality (dimensions set 2 in feet) | @Locked @Sanity @PDP @P2 | P2 |
| 5 | Verify max quantity validation message | @Locked @Sanity @PDP @P2 | P2 |
| 6 | Verify invalid text quantity validation message | @Locked @Sanity @PDP @P2 | P2 |
| 7 | Verify delivery charges tooltip message | @Locked @Sanity @PDP @P2 | P2 |

### Pickup Mode Scenarios (3)

| # | Scenario | Tags | Priority |
|---|----------|------|----------|
| 8 | Verify PDP does not show delivery charges in Pickup mode | @Locked @Sanity @PDP @P1 @Pickup | P1 |
| 9 | Verify PDP shows Pickup location in header | @Locked @Sanity @PDP @P2 @Pickup | P2 |
| 10 | Verify quantity changes in Pickup mode calculate correctly | @Locked @Sanity @PDP @P2 @Pickup | P2 |

### Features Covered
- ✅ Product attributes (price, image, quantity, CTAs)
- ✅ Quantity calculator (length × width × depth)
- ✅ Unit conversion (feet/yards)
- ✅ Price calculations (unit × quantity)
- ✅ Validation messages
- ✅ Delivery charges tooltip
- ✅ Pickup mode pricing (no delivery charges)

---

## 🏷️ Tag Reference

| Tag | Description | Usage |
|-----|-------------|-------|
| `@Locked` | Verified and locked scenarios | Do not modify without approval |
| `@Sanity` | Core functionality tests | Must pass for build to proceed |
| `@Regression` | All tests for full suite | Full regression run |
| `@P1` | Priority 1 - Critical | Business critical flows |
| `@P2` | Priority 2 - Important | Important but secondary |
| `@P3` | Priority 3 - Extended | Nice to have coverage |
| `@Pickup` | Pickup mode scenarios | Facility pickup flow |
| `@skip` | Skipped scenarios | Not yet implemented |

---

## 🚀 Running Tests

### Run All Locked Scenarios
```bash
npx cucumber-js --config .cucumber.json --tags "@Locked"
```

### Run by Module
```bash
# Login
npx cucumber-js --config .cucumber.json --tags "@Login"

# My Account
npx cucumber-js --config .cucumber.json --tags "@MyAccount"

# Search
npx cucumber-js --config .cucumber.json --tags "@Search"

# PLP
npx cucumber-js --config .cucumber.json --tags "@PLP"

# PDP
npx cucumber-js --config .cucumber.json --tags "@PDP"

# Pickup only
npx cucumber-js --config .cucumber.json --tags "@Pickup"
```

### Run by Priority
```bash
# P1 Critical
npx cucumber-js --config .cucumber.json --tags "@P1"

# P1 + P2
npx cucumber-js --config .cucumber.json --tags "@P1 or @P2"

# Sanity Suite
npx cucumber-js --config .cucumber.json --tags "@Sanity"
```

---

## 📁 File Structure

```
Ecomm/features/
├── login.feature                           # 🔒 5 scenarios
├── my-account.feature                      # 12 scenarios
├── search.feature                          # 10 scenarios
├── quarry-selector-page-validation.feature # 3 scenarios
├── product-listing-page-validation.feature # 🔒 10 scenarios
├── product-display-page-validation.feature # 🔒 10 scenarios
└── step_definitions/
    ├── loginSteps.js
    ├── myAccountSteps.js
    ├── searchSteps.js
    ├── quarrySelectorSteps.js
    ├── productListingSteps.js
    └── productDisplaySteps.js
```

---

## ✅ Test Data

All test data is externalized in `utils/testData.json`:
- Login credentials
- Zip codes (primary: 37303, secondary: 30301)
- Quantity calculator dimensions
- Search queries

---

**Author:** Vivek  
**Repository:** https://github.com/Vulcan-Materials/vulcan_ecomm_storefront_automation
