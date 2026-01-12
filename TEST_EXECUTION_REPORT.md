# Test Execution Report
**Date:** 12 January 2026  
**Branch:** Vivek  
**Environment:** QA (https://qa-shop.vulcanmaterials.com)

---

## Summary

| Module | Total Scenarios | Passed | Failed | Status |
|--------|----------------|--------|--------|--------|
| **PLP (Locked)** | 10 | 10 | 0 | ✅ Stable |
| **PDP (Locked)** | 10 | 9 | 1* | ✅ Mostly Stable |
| **Login** | 5 | 5 | 0 | ✅ Stable |
| **My Account** | 12 | 12 | 0 | ✅ Stable |
| **Search** | 9 | 9 | 0 | ✅ Stable |
| **Quarry Selector** | 3 | 3 | 0 | ✅ Stable |
| **Add to Cart** | 29 | - | - | 🔄 In Progress |
| **TOTAL** | **78** | **48+** | **1*** | - |

*Note: 1 intermittent failure in Pickup scenario (timing issue)

---

## Module Details

### 1. Product Listing Page (PLP) - 10 Scenarios @Locked
- ✅ Verify navigation to PLP via categories
- ✅ Verify product tiles display with all components
- ✅ Verify category navigation bar
- ✅ Verify quantity selector functionality
- ✅ Verify custom quantity input
- ✅ Verify PLP header shows location info
- ✅ Verify product pricing components (Delivery)
- ✅ Verify Pickup flow - facility selection
- ✅ Verify Pickup flow - no delivery charges
- ✅ Verify map markers match facility count

### 2. Product Display Page (PDP) - 10 Scenarios @Locked
- ✅ Verify PDP navigation from PLP
- ✅ Verify product name display
- ✅ Verify product pricing
- ✅ Verify Add to Cart button
- ✅ Verify Buy Now button
- ✅ Verify product image
- ✅ Verify custom quantity field
- ✅ Verify quantity calculator
- ✅ Verify delivery info tooltip
- ✅ Verify PDP header shows address

### 3. Login - 5 Scenarios
- ✅ Valid login
- ✅ Invalid password
- ✅ Invalid email format
- ✅ Empty credentials
- ✅ Logout functionality

### 4. My Account - 12 Scenarios
- ✅ My Account menu display
- ✅ My Profile access
- ✅ Payment methods
- ✅ Purchase history
- ✅ Cart access from account
- ✅ Address management
- + 6 more scenarios

### 5. Search - 9 Scenarios
- ✅ Full keyword search
- ✅ Partial keyword search
- ✅ Invalid search
- ✅ Search from various pages
- ✅ Search result navigation

### 6. Add to Cart - 29 Scenarios (In Progress)
- Entry Points: PLP (Shop by Project/Categories), PDP, Search
- User Types: Guest, Registered
- Delivery Modes: Delivery, Pickup
- Cart Actions: Add, Remove, Update Quantity, Clear
- Validations: Price, Quantity, Order Summary

**Known Issues:**
- Remove from cart modal click needs refinement
- Continue Shopping flow validated

---

## Test Execution Command

```bash
# Run all locked scenarios
npx cucumber-js --config .cucumber.json --tags "@Locked"

# Run by module
npx cucumber-js --config .cucumber.json --tags "@Login"
npx cucumber-js --config .cucumber.json --tags "@PLP"
npx cucumber-js --config .cucumber.json --tags "@PDP"
npx cucumber-js --config .cucumber.json --tags "@Search"
npx cucumber-js --config .cucumber.json --tags "@AddToCart"

# Run with HTML report
npx cucumber-js --config .cucumber.json --format html:test-report.html
```

---

## Files Changed in This Update

### New Files:
- `Ecomm/features/add-to-cart.feature` - 29 cart scenarios
- `Ecomm/features/step_definitions/addToCartSteps.js` - Cart step definitions
- `pageobjects/CartPage.js` - Cart page object

### Modified Files:
- `pageobjects/ProductListingPage.js` - Added Add to Cart methods
- `pageobjects/ProductDisplayPage.js` - Added Add to Cart methods
- `Ecomm/features/step_definitions/loginSteps.js` - Minor fixes

---

## Next Steps
1. Fix Remove from Cart modal interaction
2. Complete remaining Cart scenario validations
3. Add Checkout flow scenarios
4. Lock Cart scenarios once stable

