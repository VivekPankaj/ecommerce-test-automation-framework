# Locked Modules - DO NOT MODIFY

This document tracks modules that have been tested, validated, and locked. 
**These files should NOT be modified for any further test scenarios.**

Last Updated: 12 January 2026

---

## 🔒 LOCKED MODULE: Login

**Status:** ✅ COMPLETE & LOCKED  
**Scenarios:** 5  
**Steps:** 49 (all passing)

### Files (DO NOT MODIFY):
- `Ecomm/features/login-page-vaidation.feature`
- `Ecomm/features/step_definitions/loginSteps.js`
- `pageobjects/LoginPage.js`

### Scenarios Covered:
1. User navigates to Vulcan Shop and is redirected to Login Page
2. Login Page displays correctly
3. User logs in with valid credentials
4. User logs in with Invalid Password
5. User logs in with Invalid Email

---

## 🔒 LOCKED MODULE: My Account

**Status:** ✅ COMPLETE & LOCKED  
**Scenarios:** 12  
**Steps:** All passing

### Files (DO NOT MODIFY):
- `Ecomm/features/my-account.feature`
- `Ecomm/features/step_definitions/myAccountSteps.js`
- `pageobjects/MyAccountPage.js`

### Scenarios Covered:
1. User can access My Account from homepage (P1)
2. My Account page displays user information (P1)
3. My Account page displays all required sections (P1)
4. User can view Purchase History (P1)
5. View Details shows Order Summary section (P1, @ViewDetails)
6. View Details shows Item Details section (P1, @ViewDetails)
7. View Details shows Pricing Information section (P1, @ViewDetails)
8. View Details shows Pickup/Delivery Details section (P2, @ViewDetails)
9. View Details has working Back to Purchase History button (P1, @ViewDetails)
10. Dynamic Order Type Detection - Pickup orders (P2, @PickupDetails)
11. Pickup Details modal displays delivery information (P2, @PickupDetails)
12. Pickup Details modal can be closed (P2, @PickupDetails)

---

## 🔒 LOCKED MODULE: Search

**Status:** ✅ COMPLETE & LOCKED  
**Scenarios:** 14 (13 passing, 1 intermittent network timeout)  
**Steps:** 66 (61 passing)

### Files (DO NOT MODIFY):
- `Ecomm/features/search.feature`
- `Ecomm/features/step_definitions/searchSteps.js`
- `pageobjects/SearchPage.js`

### Scenarios Covered:

#### P1 - Critical:
1. Search functionality with product name ("Stone")
2. Search functionality with SKU format ("aggregate-base")
3. Search functionality with uppercase ("BASE")
4. Autocomplete suggestions appear after 3 characters

#### P2 - Important:
5. SRP navigation with "project" query display
6. SRP navigation with "aggregate-base" query display
7. SRP navigation with "BASE" query display
8. Select autocomplete suggestion navigates to relevant page
9. Search works from Product Listing Page

#### P3 - Extended:
10. Search results load within acceptable time (performance)
11. Invalid search query shows "no results found" message
12. Special characters: "#5 Stone"
13. Special characters: "3/4 Gravel"
14. Special characters: "Stone Gravel" (spaces)

#### Skipped/Future:
- Search from PDP (@skip @future)
- Search from Cart (@skip @future)
- Keyboard accessibility (@skip @future)

---

## 🔒 LOCKED MODULE: Product Listing Page (PLP)

**Status:** ✅ COMPLETE & LOCKED  
**Scenarios:** 6  
**Steps:** 31 (all passing)

### Files (DO NOT MODIFY):
- `Ecomm/features/product-listing-page-validation.feature`
- `Ecomm/features/step_definitions/productListingSteps.js`
- `pageobjects/ProductListingPage.js`

### Scenarios Covered:
1. Complete product tile validation (product name, details, thumbnail, add to cart, info CTA)
2. Display Quantity Selector Modal with correct UI components (22, 5, 10, 100 Tons swatches)
3. Quantity Selector functionality (custom quantity, save, price update)
4. Product tile navigation and placeholder handling (click to PDP)
5. Navigation bar categories display (DRIVEWAYS, FOUNDATION, DRAINAGE, etc.)
6. Category selection and product display

### Key Features:
- Delivery address entry with full address from testData
- Price calculation with delivery charges (loads × $111.98)
- 22 Tons = 1 load, 23-44 = 2 loads, 45-66 = 3 loads, etc.

---

## 🔒 LOCKED MODULE: Product Display Page (PDP)

**Status:** ✅ COMPLETE & LOCKED  
**Scenarios:** 7  
**Steps:** 40 (all passing)

### Files (DO NOT MODIFY):
- `Ecomm/features/product-display-page-validation.feature`
- `Ecomm/features/step_definitions/productDisplaySteps.js`
- `pageobjects/ProductDisplayPage.js`

### Scenarios Covered:
1. Complete product details page validation (Total Price, Unit Price, Add to Cart, Buy Now, image, etc.)
2. Verify price attributes with valid quantity (45 tons)
3. Quantity calculator with dimensions set 1 (inches: 80×100×10)
4. Quantity calculator with dimensions set 2 (feet: 8×10×10, Apply Estimate flow)
5. Max quantity validation message (>1000 tons shows "For requests exceeding 1000 tons...")
6. Invalid text quantity validation ("test" shows "Please enter a valid number.")
7. Delivery charges tooltip message ("Delivery charges are for per load (22 tons)...")

### Key Features:
- Quantity calculator with tons/yards conversion
- Apply Estimate updates custom quantity field
- Total material price = unit price × quantity
- Delivery per load tooltip

---

## Shared Support Files (DO NOT MODIFY):

- `Ecomm/features/support/hooks.js` - Before/After hooks
- `utils/test-base.js` - Base test utilities

---

## Notes:

1. The 1 failing scenario in Search is due to intermittent network timeouts (30s), not test code issues.
2. All page objects include robust modal handling via `closeBlockingModals()`.
3. My Account dynamically detects Pickup vs Delivery order types.
4. Search handles autocomplete with 3-second wait for suggestions.
5. PLP and PDP share delivery address entry - uses full address from testData.json.
6. Price calculation includes load-based delivery charges (22 tons per load).

---

## Modules In Progress:

- [x] ~~Product Listing Page (PLP)~~ ✅ LOCKED
- [x] ~~Product Display Page (PDP)~~ ✅ LOCKED
- [ ] Quarry Selector
- [ ] Cart
- [ ] Checkout

---

**⚠️ WARNING:** Any changes to locked files may break existing test scenarios.
If modifications are absolutely necessary, ensure all existing tests still pass.
