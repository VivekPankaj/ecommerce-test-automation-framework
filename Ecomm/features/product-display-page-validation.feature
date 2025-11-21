Feature: Product Display Page (PDP) Validation
  As a customer
  I want to view product information on the PDP
  So that I can make informed purchasing decisions

  Background:
    Given I am on the Product Listing Page

  @Sanity @PDP @product-tile-validation @Sprint4
  Scenario: Complete product details page validation
    When I click on a first product
    Then I should be redirected to the corresponding Product Detail Page
    Then I should see the following attributes for product:
      | attribute                   |
      | Total Material Price        |
      | Unit Price                  |
      | Add to cart                 |
      | Buy Now                     |
      | product image               |
      | estimate quantity link      |
      | enter custom quantity field |
      | Product overview            |

  @Sanity @PDP @product-tile-price-validation @Sprint4
  Scenario: Verify price attributes on product tile
    When I click on a first product
    When I set quantity to 45 tons on PDP
    Then I should see the following PRICE attributes for each product title:
      | attribute            | description               |
      | Unit Price           | Unit Price                |
      | Total Material Price | Qty selected * Unit Price |

  @Sanity @PDP @quantityCalculatorValidation @Sprint4
  Scenario: Verify quantity calculator functionality
    When I click on a first product
    And I click on Estimate quantity link
    And i enter width,length,thickness as 80,100,10
    And i click on calculate button
    Then i see the text "Estimated materials needed"
    And i see the calulated material needed in tons
    And calculated value matches with calculated material needed in yards


  @Sanity @PDP @quantityCalculatorValidation1 @Sprint4
  Scenario: Verify quantity calculator functionality
    When I click on a first product
    And I click on Estimate quantity link
    And i enter width,length,thickness as 8,10,10 all in feet
    And i click on calculate button
    Then i see the text "Estimated materials needed"
    And i see the calulated material needed in tons
    And calculated value matches with calculated material needed in yards
    Then calculated tons value should be updated with custom quantity field
    And i click on Apply Estimate
    Then custom quantity field should be updated with apply estimate tons value
    Then total material price should be unit price times custom quantity field value


  @Sanity @PDP @QuantitySelector @Sprint4
  Scenario: Verify price attributes on product tile
    When I click on a first product
    When I set quantity to 1001 tons on PDP
    Then I should see a validation message "Quantity must be between 1 and 1000"

  @Sanity @PDP @QuantitySelector @Sprint4
  Scenario: Verify price attributes on product tile
    When I click on a first product
    When I set quantity to "test" tons on PDP
    Then I should see a validation message "Please enter a valid number."

  @Sanity @PDP @DeliveryInfoTooltip @Sprint4
  Scenario: Verify price attributes on product tile
    When I click on a first product
    When i click on delivery charges Info
    Then i should see tooltip message "Delivery charges are for per load (22 tons). Charges are same for up to 22 tons"