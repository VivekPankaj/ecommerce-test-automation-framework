Feature: Product Listing Page (PLP) Validation
  As a customer
  I want to view product information on the PLP
  So that I can make informed purchasing decisions

  @Sanity @PLP @product-tile-validation
  Scenario: Complete product tile validation
    Given I am on the Product Listing Page
    Given I am on the Product Listing Page
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


  @Sanity @PLP @QuantitySelectorModalValidation @Sprint4
  Scenario: Display Quantity Selector Modal with Correct UI Components
  Given I am on the Product Listing Page
    When I click on the Qty Selector on the PLP
    Then I should see a header with value "Select Quantity"
    And I should see a subtext "Select an option or enter a custom amount"
    And I should see swatches for 5, 10, 15 tons
    And I should see a field labeled "Enter Custom Quantity"
    And an information tooltip icon should be displayed
    And I should see a Save button and an X button

  @Sanity @PLP @QuantitySelectorFunctionality @Sprint4
  Scenario: Quantity Selector functionality
  Given I am on the Product Listing Page
    When I click on the Qty Selector on the PLP
    Then I update the quantity in Enter Custom Quantity field to 40
    And I click on Save button
    Then the prices for products should be updated for 40 tons
    Then I should see the following PRICE attributes for each product on PLP:
      | attribute   | description               |
      | Unit Price  | Unit Price                |
      | Total Price | Qty selected * Unit Price |

  @Sanity @PLP @Navigation
  Scenario: Verify product tile navigation and placeholder handling
  Given I am on the Product Listing Page
    When I click on a first product
    Then I should be redirected to the corresponding Product Detail Page

  @Sanity @PLP @NavigationBar
  Scenario: Verify navigation bar categories display
    When I view the navigation bar
    Then all the categories should be displayed
    And the default selection should be "All products"

  @Sanity @PLP @CategorySelection
  Scenario: Verify category selection and product display
    When I click a category in the navigation bar
    Then the clicked category should be highlighted
    Then the total count of products in the category should be displayed
