# ============================================================================
# Add to Cart Feature - All Combinations
# ============================================================================
# Created: 12 January 2026
# 
# Entry Points:
#   - PLP via "Shop by Project" menu
#   - PLP via "Shop By Categories" menu
#   - PDP (Product Display Page)
#   - Search Results
#
# Test Matrix:
#   User Type: Guest (not logged in) | Registered (logged in)
#   Entry Point: PLP (Project) | PLP (Category) | PDP | Search
#   Delivery Mode: Delivery | Pickup
#   Quantity: Default (22 tons) | Custom
#
# Cart Behavior:
#   - Same product added again = Quantity increases (cart count stays same)
#   - Different product added = Cart count increases
#   - Cart confirmation slider opens on add
#   - Price validation at each step
#
# Pre-Test: Clear cart before starting to avoid stale data
# ============================================================================

@Regression @AddToCart
Feature: Add to Cart Functionality
  As a customer (Guest or Registered)
  I want to add products to my cart from PLP, PDP or Search
  With different quantities and delivery modes (Delivery/Pickup)
  So that I can proceed to checkout

  # ============================================================================
  # PART A: PLP VIA SHOP BY PROJECT
  # ============================================================================

  @Sanity @P1 @Guest @Delivery @PLP @ShopByProject
  Scenario: Guest adds product from PLP via Shop by Project - Delivery mode
    Given I am on the home page as a Guest user
    When I hover on "Shop by Project" menu
    And I click on "Driveways" project
    Then I should be on the PLP page for "Driveways"
    When I set delivery address using primary zipcode
    And I hover over the cart icon on the first product tile
    Then the cart icon should change to "Add to Cart" text
    When I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the product name in the slider
    And I should see the price in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P1 @Guest @Pickup @PLP @ShopByProject
  Scenario: Guest adds product from PLP via Shop by Project - Pickup mode
    Given I am on the home page as a Guest user
    When I hover on "Shop by Project" menu
    And I click on "Road Base" project
    Then I should be on the PLP page for "Road Base"
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And the slider should NOT show delivery charges
    When I click the close button on the slider

  # ============================================================================
  # PART B: PLP VIA SHOP BY CATEGORIES
  # ============================================================================

  @Sanity @P1 @Guest @Delivery @PLP @ShopByCategories
  Scenario: Guest adds product from PLP via Shop By Categories - Delivery mode
    Given I am on the home page as a Guest user
    When I hover on "Shop By Categories" menu
    And I click on a category from the menu
    Then I should be on the PLP page
    When I set delivery address using primary zipcode
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the product name in the slider
    And I should see the price in the slider
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the product in the cart with correct price

  @P2 @Guest @Pickup @PLP @ShopByCategories
  Scenario: Guest adds product from PLP via Shop By Categories - Pickup mode
    Given I am on the home page as a Guest user
    When I hover on "Shop By Categories" menu
    And I click on a category from the menu
    Then I should be on the PLP page
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And the cart should show pickup facility info

  # ============================================================================
  # PART C: PDP SCENARIOS
  # ============================================================================

  @Sanity @P1 @Guest @Delivery @PDP
  Scenario: Guest adds product from PDP with default quantity - Delivery mode
    Given I am on the Product Listing Page as a Guest user
    And I set delivery address using primary zipcode
    When I click on the first product tile
    Then I should be on the Product Display Page
    When I click Add to Cart button on PDP
    Then the cart confirmation slider should open
    And I should see the product name in the slider
    And I should see the quantity "22 Tons" in the slider
    And I should see the total price in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P1 @Guest @Delivery @PDP @CustomQuantity
  Scenario: Guest adds product from PDP with custom quantity - Delivery mode
    Given I am on the Product Listing Page as a Guest user
    And I set delivery address using primary zipcode
    When I click on the first product tile
    Then I should be on the Product Display Page
    When I enter custom quantity "50" in the quantity field on PDP
    And I click Add to Cart button on PDP
    Then the cart confirmation slider should open
    And I should see the quantity "50 Tons" in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P1 @Guest @Pickup @PDP
  Scenario: Guest adds product from PDP - Pickup mode
    Given I am on the Product Listing Page as a Guest user
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I click on the first product tile
    Then I should be on the Product Display Page
    When I click Add to Cart button on PDP
    Then the cart confirmation slider should open
    And the slider should NOT show delivery charges
    When I click the close button on the slider

  # ============================================================================
  # PART D: SEARCH RESULTS SCENARIOS
  # ============================================================================

  @Sanity @P1 @Guest @Delivery @Search
  Scenario: Guest adds product from Search results - Delivery mode
    Given I am on the home page as a Guest user
    When I search for "BASE"
    Then I should see search results
    When I set delivery address using primary zipcode
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the product name in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P2 @Guest @Pickup @Search
  Scenario: Guest adds product from Search results - Pickup mode
    Given I am on the home page as a Guest user
    When I search for "GRAVEL"
    Then I should see search results
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click the close button on the slider

  # ============================================================================
  # PART E: REGISTERED USER SCENARIOS
  # ============================================================================

  @Sanity @P1 @Registered @Delivery @PLP
  Scenario: Registered user adds product from PLP - Delivery mode (with cart cleanup)
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the product name in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P1 @Registered @Pickup @PLP
  Scenario: Registered user adds product from PLP - Pickup mode (with cart cleanup)
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @P1 @Registered @Delivery @PDP
  Scenario: Registered user adds product from PDP - Delivery mode
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I click on the first product tile
    Then I should be on the Product Display Page
    When I click Add to Cart button on PDP
    Then the cart confirmation slider should open
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the product in the cart

  @P2 @Registered @Search
  Scenario: Registered user adds product from Search - Delivery mode
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I search for "STONE"
    Then I should see search results
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  # ============================================================================
  # PART F: MULTIPLE PRODUCTS & QUANTITY BEHAVIOR
  # ============================================================================

  @Sanity @P1 @CartBehavior @SameProduct
  Scenario: Adding same product multiple times increases quantity, not cart count
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the quantity "22 Tons" in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And I should see the quantity "44 Tons" in the slider
    When I click the close button on the slider
    Then the cart icon in header should show count 1

  @Sanity @P1 @CartBehavior @DifferentProducts
  Scenario: Adding different products increases cart count
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click the close button on the slider
    Then the cart icon in header should show count 1
    When I hover over the cart icon on the second product tile
    And I click Add to Cart on the second product tile
    Then the cart confirmation slider should open
    When I click the close button on the slider
    Then the cart icon in header should show count 2
    When I click on the cart icon in header
    Then I should be on the Cart page
    And I should see 2 different products in the cart

  @P1 @CartBehavior @PriceValidation
  Scenario: Validate prices across all screens when adding multiple products
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I note the price of the first product on PLP
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    And the slider price should match the PLP price
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And the cart price should match the PLP price

  # ============================================================================
  # PART G: REMOVE FROM CART SCENARIOS
  # ============================================================================

  @Sanity @P1 @RemoveFromCart
  Scenario: Remove single product from cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see 1 product in the cart
    When I click Remove for the first product
    Then the product should be removed from the cart
    And I should see the empty cart message
    And the cart icon in header should show count 0

  @P1 @RemoveFromCart @MultipleProducts
  Scenario: Remove one product when multiple products in cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click the close button on the slider
    When I hover over the cart icon on the second product tile
    And I click Add to Cart on the second product tile
    And I click the close button on the slider
    Then the cart icon in header should show count 2
    When I click on the cart icon in header
    Then I should be on the Cart page
    And I should see 2 different products in the cart
    When I click Remove for the first product
    Then I should see 1 product in the cart
    And the cart icon in header should show count 1
    And the cart total should be recalculated

  @P2 @RemoveFromCart @AllProducts
  Scenario: Remove all products from cart one by one
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click the close button on the slider
    When I hover over the cart icon on the second product tile
    And I click Add to Cart on the second product tile
    And I click the close button on the slider
    When I click on the cart icon in header
    Then I should be on the Cart page
    When I click Remove for the first product
    And I click Remove for the first product
    Then I should see the empty cart message
    And the cart icon in header should show count 0

  # ============================================================================
  # PART H: EDIT QUANTITY IN CART
  # ============================================================================

  @P1 @EditQuantity @CartSlider
  Scenario: Edit quantity in cart via quantity slider and verify price update
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the Order Summary section
    And I should see the Subtotal in Order Summary
    And I should see the Estimated Total in Order Summary
    When I click on the quantity for the first product
    Then the quantity selector slider should open
    And I should see preset quantity options "0 Tons" "5 Tons" "10 Tons" "100 Tons"
    And I should see "Enter Custom Quantity" field
    When I enter "50" in the custom quantity field
    And I click Save button in the quantity slider
    Then the quantity should be updated to "50 Tons"
    And the Subtotal should be recalculated
    And the Estimated Total should be recalculated

  @P2 @EditQuantity @PresetQuantity
  Scenario: Edit quantity using preset options in cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    When I click on the quantity for the first product
    Then the quantity selector slider should open
    When I click on "10 Tons" preset option
    And I click Save button in the quantity slider
    Then the quantity should be updated to "10 Tons"
    And the Estimated Total should be recalculated

  # ============================================================================
  # PART I: CART PAGE VALIDATIONS
  # ============================================================================

  @Sanity @P1 @CartValidation @Delivery
  Scenario: Validate cart page elements for Delivery mode
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the product image
    And I should see the product name
    And I should see the quantity with expand arrow
    And I should see the product price
    And I should see the Remove link
    And I should see the Order Summary section
    And I should see the Subtotal in Order Summary
    And I should see the Delivery Charges in Order Summary
    And I should see the Tax in Order Summary
    And I should see the Estimated Total in Order Summary
    And I should see the Checkout button
    And I should see the "+ Add Items" link

  @Sanity @P1 @CartValidation @Pickup
  Scenario: Validate cart page elements for Pickup mode
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the pickup facility name in header
    And I should see the product image
    And I should see the product name
    And I should see the quantity with expand arrow
    And I should see the product price
    And I should see the Remove link
    And I should see the Order Summary section
    And I should see the Subtotal in Order Summary
    And I should see the Pickup Charges in Order Summary
    And I should see "Select pickup slot in checkout" message
    And I should see the Tax in Order Summary
    And I should see the Estimated Total in Order Summary
    And I should see the Checkout button

  @P1 @CartValidation @MultipleProducts
  Scenario: Validate cart with multiple products shows correct totals
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click the close button on the slider
    When I hover over the cart icon on the second product tile
    And I click Add to Cart on the second product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see 2 products in the cart
    And the Subtotal should be sum of all product prices
    And the Estimated Total should include Subtotal plus charges

  # ============================================================================
  # PART J: NAVIGATION TO CART
  # ============================================================================

  @P2 @CartNavigation @HeaderIcon
  Scenario: Navigate to cart via header cart icon
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click the close button on the slider
    When I click on the cart icon in header
    Then I should be on the Cart page
    And I should see the product in the cart

  @P2 @CartNavigation @ViewCart
  Scenario: Navigate to cart via View Cart button in slider
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the product in the cart

  @P2 @CartNavigation @AddItems
  Scenario: Navigate back to PLP via Add Items link in cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    When I click on "+ Add Items" link
    Then I should be on the PLP page

  # ============================================================================
  # PART K: EMPTY CART - CONTINUE SHOPPING FLOW
  # ============================================================================

  @P1 @EmptyCart @ContinueShopping
  Scenario: Navigate to PLP via Continue Shopping button from empty cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I navigate to the Cart page
    Then I should see the empty cart message
    And I should see "Your cart is empty" text
    And I should see "Continue Shopping" button
    When I click on "Continue Shopping" button
    Then I should be on the PLP page
    And I should see product tiles

  @P1 @EmptyCart @ContinueShopping @AddProduct
  Scenario: Add product after clicking Continue Shopping from empty cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I navigate to the Cart page
    Then I should see the empty cart message
    When I click on "Continue Shopping" button
    Then I should be on the PLP page
    When I set delivery address using primary zipcode
    And I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    Then the cart confirmation slider should open
    When I click "View Cart" button in the slider
    Then I should be on the Cart page
    And I should see the product in the cart
    And I should see the Order Summary section
