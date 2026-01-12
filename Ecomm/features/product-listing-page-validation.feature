Feature: Product Listing Page (PLP) Validation
  As a customer
  I want to view product information on the PLP
  So that I can make informed purchasing decisions

  Background:
    Given I am on the Product Listing Page

  @Locked @Sanity @PLP @P1 @product-tile-validation
  Scenario: Complete product tile validation
    Then I should see the following components for first product:
      | component         |
      | product name      |
      | product details   |
      | product thumbnail |
      | add to cart       |
      | information CTA   |
    Then I should see unit price displayed
    Then I should see price displayed
    Then I should see delivery price displayed
    Then if badges are applicable they should be visible on the product tile

  @Locked @Sanity @PLP @P1 @QuantitySelectorModalValidation
  Scenario: Display Quantity Selector Modal with Correct UI Components
    When I click on the Qty Selector on the PLP
    Then I should see the quantity selector header
    And I should see the quantity selector subtext
    And I should see swatches for 22, 5, 10, 100 tons
    And I should see a field labeled "Enter Custom Quantity"
    And an information tooltip icon should be displayed
    And I should see a Save button and an X button

  @Locked @Sanity @PLP @P1 @QuantitySelectorFunctionality
  Scenario: Quantity Selector functionality
    When I click on the Qty Selector on the PLP
    Then I update the quantity to custom quantity from test data
    And I click on Save button
    Then the prices for products should be updated for custom quantity
    Then I should see the following PRICE attributes for each product on PLP:
      | attribute   | description               |
      | Unit Price  | Unit Price                |
      | Total Price | Qty selected * Unit Price |

  @Locked @Sanity @PLP @P2 @Navigation
  Scenario: Verify product tile navigation and placeholder handling
    When I click on a first product
    Then I should be redirected to the corresponding Product Detail Page

  @Locked @Sanity @PLP @P2 @NavigationBar
  Scenario: Verify navigation bar categories display
    When I view the navigation bar
    Then all the categories should be displayed
    And I should see the default category selection

  @Locked @Sanity @PLP @P2 @CategorySelection
  Scenario: Verify category selection and product display
    When I click a category in the navigation bar
    Then the clicked category should be highlighted
    Then the total count of products in the category should be displayed

  # ========== PICKUP SCENARIOS ==========
  # Note: Pickup scenarios use their own Given step to skip delivery address setup

  @Locked @Sanity @PLP @P1 @Pickup
  Scenario: Select Pickup option and verify facility list with default distance
    Given I am on the Product Listing Page for Pickup
    When I click on Pickup Instead button
    Then I should see the Pickup modal with "Facilities Near You" header
    When I enter zip code in the pickup search field
    And I select the first location suggestion
    Then I should see the distance dropdown defaulted to "25 Miles"
    And I should see a list of nearby facilities sorted by distance
    And each facility should show the distance in miles

  @Locked @Sanity @PLP @P2 @Pickup @DistanceFilter
  Scenario: Verify distance filter changes facility count
    Given I am on the Product Listing Page for Pickup
    When I click on Pickup Instead button
    And I enter zip code in the pickup search field
    And I select the first location suggestion
    Then I should see facilities within "25 Miles"
    And the map markers should match the facility count
    When I change the distance filter to "50 Miles"
    Then I should see more facilities than with "25 Miles"
    And the map markers should match the facility count
    When I change the distance filter to "200 Miles"
    Then I should see all available facilities
    And the map markers should match the facility count

  @Locked @Sanity @PLP @P1 @Pickup @FacilitySelection
  Scenario: Select a pickup facility and verify header update
    Given I am on the Product Listing Page for Pickup
    When I click on Pickup Instead button
    And I enter zip code in the pickup search field
    And I select the first location suggestion
    And I select the first facility from the list
    Then I should see the store pickup time for the selected facility
    When I click the Confirm button
    Then the header should show "Pickup at" with the selected facility name
    And I should NOT see the "Delivery Instead?" button replaced with "Pickup Instead?"

  @Locked @Sanity @PLP @P1 @Pickup @NoDeliveryCharges
  Scenario: Verify no delivery charges displayed on PLP for Pickup orders
    Given I am on the Product Listing Page for Pickup
    When I click on Pickup Instead button
    And I enter zip code in the pickup search field
    And I select the first location suggestion
    And I select the first facility from the list
    And I click the Confirm button
    Then the product tiles should NOT display delivery charges
    And I should see only the material price on product tiles
