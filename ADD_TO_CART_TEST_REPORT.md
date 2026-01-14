# Add to Cart - Comprehensive Test Coverage Report

**Generated:** January 14, 2026 at 07:39 AM

---

## Executive Summary

### Overall Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Scenarios** | 29 | 100% |
| **✓ Passed Scenarios** | 9 | 31.0% |
| **✗ Failed Scenarios** | 20 | 69.0% |
| **Total Steps Executed** | 375 | - |
| **✓ Passed Steps** | 122 | 32.5% |
| **✗ Failed Steps** | 20 | 5.3% |
| **⊘ Skipped Steps** | 233 | 62.1% |

### Pass Rate: **31.0%**

```
███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 31.0%
```

---

## Detailed Test Coverage


### ✓ Passed Scenarios (9)

1. **Guest adds product from PLP via Shop by Project - Delivery mode**
   - Feature: Add to Cart Functionality
   - Steps: 13

2. **Guest adds product from PLP via Shop by Project - Pickup mode**
   - Feature: Add to Cart Functionality
   - Steps: 11

3. **Guest adds product from PLP via Shop By Categories - Delivery mode**
   - Feature: Add to Cart Functionality
   - Steps: 13

4. **Guest adds product from PLP via Shop By Categories - Pickup mode**
   - Feature: Add to Cart Functionality
   - Steps: 12

5. **Guest adds product from PDP with default quantity - Delivery mode**
   - Feature: Add to Cart Functionality
   - Steps: 11

6. **Guest adds product from PDP with custom quantity - Delivery mode**
   - Feature: Add to Cart Functionality
   - Steps: 10

7. **Guest adds product from PDP - Pickup mode**
   - Feature: Add to Cart Functionality
   - Steps: 9

8. **Guest adds product from Search results - Pickup mode**
   - Feature: Add to Cart Functionality
   - Steps: 9

9. **Remove single product from cart**
   - Feature: Add to Cart Functionality
   - Steps: 14


### ✗ Failed Scenarios (20)

1. **Guest adds product from Search results - Delivery mode** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `WhenI search for "BASE"`
   - Error: `page.waitForSelector: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('input[placeholder*="Search"]') to be visible[22m

    at SearchPage.enterSearchTerm (/Users/vivpanka/Documents/V...`
   - Steps Executed: 10

2. **Registered user adds product from PLP - Delivery mode (with cart cleanup)** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

3. **Registered user adds product from PLP - Pickup mode (with cart cleanup)** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

4. **Registered user adds product from PDP - Delivery mode** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 11

5. **Registered user adds product from Search - Delivery mode** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

6. **Adding same product multiple times increases quantity, not cart count** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 16

7. **Adding different products increases cart count** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 17

8. **Validate prices across all screens when adding multiple products** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 12

9. **Remove one product when multiple products in cart** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 18

10. **Remove all products from cart one by one** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 16

11. **Edit quantity in cart via quantity slider and verify price update** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 20

12. **Edit quantity using preset options in cart** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 14

13. **Validate cart page elements for Delivery mode** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 20

14. **Validate cart page elements for Pickup mode** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 22

15. **Validate cart with multiple products shows correct totals** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 14

16. **Navigate to cart via header cart icon** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

17. **Navigate to cart via View Cart button in slider** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

18. **Navigate back to PLP via Add Items link in cart** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 10

19. **Navigate to PLP via Continue Shopping button from empty cart** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 9

20. **Add product after clicking Continue Shopping from empty cart** ❌
   - Feature: Add to Cart Functionality
   - Failed Step: `AndI clear all items from the cart`
   - Error: `ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/ad...`
   - Steps Executed: 14


---

## Complete Test Scenarios with Step-by-Step Details


### 1. Guest adds product from PLP via Shop by Project - Delivery mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 39

**Steps (13):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 5001.88ms

2. ✓ **When** I hover on "Shop by Project" menu
   - Status: `passed`
   - Duration: 1088.77ms

3. ✓ **And** I click on "Driveways" project
   - Status: `passed`
   - Duration: 3266.64ms

4. ✓ **Then** I should be on the PLP page for "Driveways"
   - Status: `passed`
   - Duration: 2017.88ms

5. ✓ **When** I set delivery address using primary zipcode
   - Status: `passed`
   - Duration: 12881.16ms

6. ✓ **And** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 560.89ms

7. ✓ **Then** the cart icon should change to "Add to Cart" text
   - Status: `passed`
   - Duration: 5.10ms

8. ✓ **When** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 3333.77ms

9. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2011.57ms

10. ✓ **And** I should see the product name in the slider
   - Status: `passed`
   - Duration: 1.90ms

11. ✓ **And** I should see the price in the slider
   - Status: `passed`
   - Duration: 3.71ms

12. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 615.74ms

13. ✓ **Then** the cart icon in header should show count 1
   - Status: `passed`
   - Duration: 511.44ms


---

### 2. Guest adds product from PLP via Shop by Project - Pickup mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 55

**Steps (11):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 3650.40ms

2. ✓ **When** I hover on "Shop by Project" menu
   - Status: `passed`
   - Duration: 1062.26ms

3. ✓ **And** I click on "Road Base" project
   - Status: `passed`
   - Duration: 3398.60ms

4. ✓ **Then** I should be on the PLP page for "Road Base"
   - Status: `passed`
   - Duration: 2014.91ms

5. ✓ **When** I switch to Pickup mode with primary zipcode
   - Status: `passed`
   - Duration: 12100.38ms

6. ✓ **And** I select a pickup facility
   - Status: `passed`
   - Duration: 3.61ms

7. ✓ **And** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 860.52ms

8. ✓ **And** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 4453.31ms

9. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2013.87ms

10. ✓ **And** the slider should NOT show delivery charges
   - Status: `passed`
   - Duration: 2.69ms

11. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 532.78ms


---

### 3. Guest adds product from PLP via Shop By Categories - Delivery mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 73

**Steps (13):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 3721.58ms

2. ✓ **When** I hover on "Shop By Categories" menu
   - Status: `passed`
   - Duration: 1051.19ms

3. ✓ **And** I click on a category from the menu
   - Status: `passed`
   - Duration: 1669.51ms

4. ✓ **Then** I should be on the PLP page
   - Status: `passed`
   - Duration: 2003.95ms

5. ✓ **When** I set delivery address using primary zipcode
   - Status: `passed`
   - Duration: 12727.91ms

6. ✓ **And** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 596.23ms

7. ✓ **And** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 2840.96ms

8. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2013.95ms

9. ✓ **And** I should see the product name in the slider
   - Status: `passed`
   - Duration: 2.24ms

10. ✓ **And** I should see the price in the slider
   - Status: `passed`
   - Duration: 3.48ms

11. ✓ **When** I click "View Cart" button in the slider
   - Status: `passed`
   - Duration: 547.29ms

12. ✓ **Then** I should be on the Cart page
   - Status: `passed`
   - Duration: 2004.76ms

13. ✓ **And** I should see the product in the cart with correct price
   - Status: `passed`
   - Duration: 8.17ms


---

### 4. Guest adds product from PLP via Shop By Categories - Pickup mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 89

**Steps (12):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 3411.95ms

2. ✓ **When** I hover on "Shop By Categories" menu
   - Status: `passed`
   - Duration: 1041.44ms

3. ✓ **And** I click on a category from the menu
   - Status: `passed`
   - Duration: 1953.68ms

4. ✓ **Then** I should be on the PLP page
   - Status: `passed`
   - Duration: 2002.72ms

5. ✓ **When** I switch to Pickup mode with primary zipcode
   - Status: `passed`
   - Duration: 12095.32ms

6. ✓ **And** I select a pickup facility
   - Status: `passed`
   - Duration: 4.48ms

7. ✓ **And** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 552.47ms

8. ✓ **And** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 2344.57ms

9. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2010.68ms

10. ✓ **When** I click "View Cart" button in the slider
   - Status: `passed`
   - Duration: 602.38ms

11. ✓ **Then** I should be on the Cart page
   - Status: `passed`
   - Duration: 2002.88ms

12. ✓ **And** the cart should show pickup facility info
   - Status: `passed`
   - Duration: 8.57ms


---

### 5. Guest adds product from PDP with default quantity - Delivery mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 108

**Steps (11):**

1. ✓ **Given** I am on the Product Listing Page as a Guest user
   - Status: `passed`
   - Duration: 3010.98ms

2. ✓ **And** I set delivery address using primary zipcode
   - Status: `passed`
   - Duration: 12933.75ms

3. ✓ **When** I click on the first product tile
   - Status: `passed`
   - Duration: 2620.49ms

4. ✓ **Then** I should be on the Product Display Page
   - Status: `passed`
   - Duration: 2007.00ms

5. ✓ **When** I click Add to Cart button on PDP
   - Status: `passed`
   - Duration: 4575.99ms

6. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2006.10ms

7. ✓ **And** I should see the product name in the slider
   - Status: `passed`
   - Duration: 1.30ms

8. ✓ **And** I should see the quantity "22 Tons" in the slider
   - Status: `passed`
   - Duration: 1.89ms

9. ✓ **And** I should see the total price in the slider
   - Status: `passed`
   - Duration: 1.37ms

10. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 617.91ms

11. ✓ **Then** the cart icon in header should show count 1
   - Status: `passed`
   - Duration: 510.11ms


---

### 6. Guest adds product from PDP with custom quantity - Delivery mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 122

**Steps (10):**

1. ✓ **Given** I am on the Product Listing Page as a Guest user
   - Status: `passed`
   - Duration: 3062.08ms

2. ✓ **And** I set delivery address using primary zipcode
   - Status: `passed`
   - Duration: 12933.22ms

3. ✓ **When** I click on the first product tile
   - Status: `passed`
   - Duration: 2574.50ms

4. ✓ **Then** I should be on the Product Display Page
   - Status: `passed`
   - Duration: 2002.34ms

5. ✓ **When** I enter custom quantity "50" in the quantity field on PDP
   - Status: `passed`
   - Duration: 1560.45ms

6. ✓ **And** I click Add to Cart button on PDP
   - Status: `passed`
   - Duration: 4568.27ms

7. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2006.36ms

8. ✓ **And** I should see the quantity "50 Tons" in the slider
   - Status: `passed`
   - Duration: 1.54ms

9. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 610.60ms

10. ✓ **Then** the cart icon in header should show count 1
   - Status: `passed`
   - Duration: 509.27ms


---

### 7. Guest adds product from PDP - Pickup mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 135

**Steps (9):**

1. ✓ **Given** I am on the Product Listing Page as a Guest user
   - Status: `passed`
   - Duration: 3523.79ms

2. ✓ **When** I switch to Pickup mode with primary zipcode
   - Status: `passed`
   - Duration: 12195.88ms

3. ✓ **And** I select a pickup facility
   - Status: `passed`
   - Duration: 4.88ms

4. ✓ **And** I click on the first product tile
   - Status: `passed`
   - Duration: 2527.53ms

5. ✓ **Then** I should be on the Product Display Page
   - Status: `passed`
   - Duration: 2004.30ms

6. ✓ **When** I click Add to Cart button on PDP
   - Status: `passed`
   - Duration: 4577.13ms

7. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2005.83ms

8. ✓ **And** the slider should NOT show delivery charges
   - Status: `passed`
   - Duration: 1.08ms

9. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 607.74ms


---

### 8. Guest adds product from Search results - Delivery mode ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 151

**Steps (10):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 3987.41ms

2. ✗ **When** I search for "BASE"
   - Status: `failed`
   - Duration: 10368.21ms

3. ⊘ **Then** I should see search results
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **When** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **And** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **And** I should see the product name in the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
page.waitForSelector: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('input[placeholder*="Search"]') to be visible[22m

    at SearchPage.enterSearchTerm (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/pageobjects/SearchPage.js:90:25)
    at async World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/searchSteps.js:20:5)
```

---

### 9. Guest adds product from Search results - Pickup mode ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 164

**Steps (9):**

1. ✓ **Given** I am on the home page as a Guest user
   - Status: `passed`
   - Duration: 3588.63ms

2. ✓ **When** I search for "GRAVEL"
   - Status: `passed`
   - Duration: 4429.21ms

3. ✓ **Then** I should see search results
   - Status: `passed`
   - Duration: 10.61ms

4. ✓ **When** I switch to Pickup mode with primary zipcode
   - Status: `passed`
   - Duration: 12060.54ms

5. ✓ **And** I select a pickup facility
   - Status: `passed`
   - Duration: 4.36ms

6. ✓ **And** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 551.43ms

7. ✓ **And** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 2353.49ms

8. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2010.02ms

9. ✓ **When** I click the close button on the slider
   - Status: `passed`
   - Duration: 609.75ms


---

### 10. Registered user adds product from PLP - Delivery mode (with cart cleanup) ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 180

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8878.04ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4325.77ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **And** I should see the product name in the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 11. Registered user adds product from PLP - Pickup mode (with cart cleanup) ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 193

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8496.92ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4411.07ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **When** I switch to Pickup mode with primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **And** I select a pickup facility
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 12. Registered user adds product from PDP - Delivery mode ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 206

**Steps (11):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 9097.43ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4917.91ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I click on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **Then** I should be on the Product Display Page
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **When** I click Add to Cart button on PDP
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **And** I should see the product in the cart
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 13. Registered user adds product from Search - Delivery mode ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 220

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8814.00ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3892.69ms

3. ⊘ **When** I search for "STONE"
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **Then** I should see search results
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 14. Adding same product multiple times increases quantity, not cart count ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 237

**Steps (16):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8676.93ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3947.22ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **And** I should see the quantity "22 Tons" in the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see the quantity "44 Tons" in the slider
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 15. Adding different products increases cart count ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 256

**Steps (17):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8524.46ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3608.23ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **Then** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **When** I hover over the cart icon on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **And** I click Add to Cart on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **When** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **Then** the cart icon in header should show count 2
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **When** I click on the cart icon in header
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

17. ⊘ **And** I should see 2 different products in the cart
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 16. Validate prices across all screens when adding multiple products ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 276

**Steps (12):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8306.76ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4022.02ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I note the price of the first product on PLP
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** the slider price should match the PLP price
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **When** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** the cart price should match the PLP price
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 17. Remove single product from cart ✓

**Status:** PASSED

**Feature:** Add to Cart Functionality

**Line:** 295

**Steps (14):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8585.24ms

2. ✓ **And** I clear all items from the cart
   - Status: `passed`
   - Duration: 2129.42ms

3. ✓ **And** I navigate to the Product Listing Page
   - Status: `passed`
   - Duration: 2595.07ms

4. ✓ **And** I set delivery address using primary zipcode
   - Status: `passed`
   - Duration: 12844.11ms

5. ✓ **When** I hover over the cart icon on the first product tile
   - Status: `passed`
   - Duration: 576.27ms

6. ✓ **And** I click Add to Cart on the first product tile
   - Status: `passed`
   - Duration: 1868.10ms

7. ✓ **Then** the cart confirmation slider should open
   - Status: `passed`
   - Duration: 2019.81ms

8. ✓ **When** I click "View Cart" button in the slider
   - Status: `passed`
   - Duration: 599.03ms

9. ✓ **Then** I should be on the Cart page
   - Status: `passed`
   - Duration: 2015.21ms

10. ✓ **And** I should see 1 product in the cart
   - Status: `passed`
   - Duration: 3.15ms

11. ✓ **When** I click Remove for the first product
   - Status: `passed`
   - Duration: 4572.83ms

12. ✓ **Then** the product should be removed from the cart
   - Status: `passed`
   - Duration: 1503.15ms

13. ✓ **And** I should see the empty cart message
   - Status: `passed`
   - Duration: 7.25ms

14. ✓ **And** the cart icon in header should show count 0
   - Status: `passed`
   - Duration: 3056.73ms


---

### 18. Remove one product when multiple products in cart ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 312

**Steps (18):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8914.04ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4219.74ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I hover over the cart icon on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I click Add to Cart on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **Then** the cart icon in header should show count 2
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **When** I click on the cart icon in header
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see 2 different products in the cart
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **When** I click Remove for the first product
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **Then** I should see 1 product in the cart
   - Status: `skipped`
   - Duration: 0.00ms

17. ⊘ **And** the cart icon in header should show count 1
   - Status: `skipped`
   - Duration: 0.00ms

18. ⊘ **And** the cart total should be recalculated
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 19. Remove all products from cart one by one ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 333

**Steps (16):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8838.72ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3709.95ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I hover over the cart icon on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I click Add to Cart on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **When** I click on the cart icon in header
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **When** I click Remove for the first product
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I click Remove for the first product
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **Then** I should see the empty cart message
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **And** the cart icon in header should show count 0
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 20. Edit quantity in cart via quantity slider and verify price update ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 356

**Steps (20):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8599.19ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3924.50ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I should see the Order Summary section
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I should see the Subtotal in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **And** I should see the Estimated Total in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **When** I click on the quantity for the first product
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **Then** the quantity selector slider should open
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see preset quantity options "0 Tons" "5 Tons" "10 Tons" "100 Tons"
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **And** I should see "Enter Custom Quantity" field
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **When** I enter "50" in the custom quantity field
   - Status: `skipped`
   - Duration: 0.00ms

17. ⊘ **And** I click Save button in the quantity slider
   - Status: `skipped`
   - Duration: 0.00ms

18. ⊘ **Then** the quantity should be updated to "50 Tons"
   - Status: `skipped`
   - Duration: 0.00ms

19. ⊘ **And** the Subtotal should be recalculated
   - Status: `skipped`
   - Duration: 0.00ms

20. ⊘ **And** the Estimated Total should be recalculated
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 21. Edit quantity using preset options in cart ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 379

**Steps (14):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8803.82ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3748.82ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click on the quantity for the first product
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the quantity selector slider should open
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **When** I click on "10 Tons" preset option
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** I click Save button in the quantity slider
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **Then** the quantity should be updated to "10 Tons"
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** the Estimated Total should be recalculated
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 22. Validate cart page elements for Delivery mode ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 400

**Steps (20):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8371.73ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3863.42ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I should see the product image
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I should see the product name
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **And** I should see the quantity with expand arrow
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** I should see the product price
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **And** I should see the Remove link
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see the Order Summary section
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **And** I should see the Subtotal in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **And** I should see the Delivery Charges in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

17. ⊘ **And** I should see the Tax in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

18. ⊘ **And** I should see the Estimated Total in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

19. ⊘ **And** I should see the Checkout button
   - Status: `skipped`
   - Duration: 0.00ms

20. ⊘ **And** I should see the "+ Add Items" link
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 23. Validate cart page elements for Pickup mode ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 423

**Steps (22):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8538.88ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4000.40ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **When** I switch to Pickup mode with primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **And** I select a pickup facility
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I should see the pickup facility name in header
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **And** I should see the product image
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** I should see the product name
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **And** I should see the quantity with expand arrow
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see the product price
   - Status: `skipped`
   - Duration: 0.00ms

15. ⊘ **And** I should see the Remove link
   - Status: `skipped`
   - Duration: 0.00ms

16. ⊘ **And** I should see the Order Summary section
   - Status: `skipped`
   - Duration: 0.00ms

17. ⊘ **And** I should see the Subtotal in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

18. ⊘ **And** I should see the Pickup Charges in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

19. ⊘ **And** I should see "Select pickup slot in checkout" message
   - Status: `skipped`
   - Duration: 0.00ms

20. ⊘ **And** I should see the Tax in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

21. ⊘ **And** I should see the Estimated Total in Order Summary
   - Status: `skipped`
   - Duration: 0.00ms

22. ⊘ **And** I should see the Checkout button
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 24. Validate cart with multiple products shows correct totals ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 448

**Steps (14):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8552.25ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3618.25ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I hover over the cart icon on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I click Add to Cart on the second product tile
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **And** I should see 2 products in the cart
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **And** the Subtotal should be sum of all product prices
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** the Estimated Total should include Subtotal plus charges
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 25. Navigate to cart via header cart icon ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 469

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 9608.63ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4441.96ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click the close button on the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I click on the cart icon in header
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I should see the product in the cart
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 26. Navigate to cart via View Cart button in slider ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 482

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 9044.78ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 4023.45ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **When** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **And** I should see the product in the cart
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 27. Navigate back to PLP via Add Items link in cart ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 495

**Steps (10):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 13679.91ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3825.25ms

3. ⊘ **And** I navigate to the Product Listing Page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **And** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **And** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **When** I click on "+ Add Items" link
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** I should be on the PLP page
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 28. Navigate to PLP via Continue Shopping button from empty cart ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 512

**Steps (9):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8748.60ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3633.26ms

3. ⊘ **When** I navigate to the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **Then** I should see the empty cart message
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **And** I should see "Your cart is empty" text
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **And** I should see "Continue Shopping" button
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **When** I click on "Continue Shopping" button
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **Then** I should be on the PLP page
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I should see product tiles
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

### 29. Add product after clicking Continue Shopping from empty cart ✗

**Status:** FAILED

**Feature:** Add to Cart Functionality

**Line:** 524

**Steps (14):**

1. ✓ **Given** I am logged in as a registered user
   - Status: `passed`
   - Duration: 8557.04ms

2. ✗ **And** I clear all items from the cart
   - Status: `failed`
   - Duration: 3691.38ms

3. ⊘ **When** I navigate to the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

4. ⊘ **Then** I should see the empty cart message
   - Status: `skipped`
   - Duration: 0.00ms

5. ⊘ **When** I click on "Continue Shopping" button
   - Status: `skipped`
   - Duration: 0.00ms

6. ⊘ **Then** I should be on the PLP page
   - Status: `skipped`
   - Duration: 0.00ms

7. ⊘ **When** I set delivery address using primary zipcode
   - Status: `skipped`
   - Duration: 0.00ms

8. ⊘ **And** I hover over the cart icon on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

9. ⊘ **And** I click Add to Cart on the first product tile
   - Status: `skipped`
   - Duration: 0.00ms

10. ⊘ **Then** the cart confirmation slider should open
   - Status: `skipped`
   - Duration: 0.00ms

11. ⊘ **When** I click "View Cart" button in the slider
   - Status: `skipped`
   - Duration: 0.00ms

12. ⊘ **Then** I should be on the Cart page
   - Status: `skipped`
   - Duration: 0.00ms

13. ⊘ **And** I should see the product in the cart
   - Status: `skipped`
   - Duration: 0.00ms

14. ⊘ **And** I should see the Order Summary section
   - Status: `skipped`
   - Duration: 0.00ms


**Error Details:**
```
ReferenceError: clickConfirmationRemoveButton is not defined
    at World.<anonymous> (/Users/vivpanka/Documents/Vulcan/Automation/vulcan_ecomm_storefront_automation/Ecomm/features/step_definitions/addToCartSteps.js:282:13)
```

---

## Test Coverage Breakdown

### Features Tested:

- **Add to Cart Functionality**
  - Total: 29, Passed: 9, Failed: 20
  - Pass Rate: 31.0%

