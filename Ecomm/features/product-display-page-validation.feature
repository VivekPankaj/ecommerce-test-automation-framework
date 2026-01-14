@Regression @PDP
Feature: Product Display Page (PDP) Validation
  As a customer
  I want to view product information on the PDP
  So that I can make informed purchasing decisions

  Background:
    Given I am on the Product Listing Page

  @Locked @Sanity @PDP @P1 @product-tile-validation
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

  @Locked @Regression @PDP @P1 @product-tile-price-validation
  Scenario: Verify price attributes on product tile with valid quantity
    When I click on a first product
    When I set valid quantity on PDP
    Then I should see the following PRICE attributes for each product title:
      | attribute            | description               |
      | Unit Price           | Unit Price                |
      | Total Material Price | Qty selected * Unit Price |

  @Locked @Sanity @PDP @P1 @quantityCalculatorValidation
  Scenario: Verify quantity calculator functionality with dimensions set 1
    When I click on a first product
    And I click on Estimate quantity link
    And I enter calculator dimensions set 1
    And i click on calculate button
    Then I see the estimated materials needed text
    And i see the calulated material needed in tons
    And calculated value matches with calculated material needed in yards

  @Locked @Regression @PDP @P2 @quantityCalculatorValidation1
  Scenario: Verify quantity calculator functionality with dimensions set 2 in feet
    When I click on a first product
    And I click on Estimate quantity link
    And I enter calculator dimensions set 2 in feet
    And i click on calculate button
    Then I see the estimated materials needed text
    And i see the calulated material needed in tons
    And calculated value matches with calculated material needed in yards
    Then calculated tons value should be updated with custom quantity field
    And i click on Apply Estimate
    Then custom quantity field should be updated with apply estimate tons value
    Then total material price should be unit price times custom quantity field value

  @Locked @Regression @PDP @P2 @QuantitySelector
  Scenario: Verify max quantity validation message
    When I click on a first product
    When I set max exceeded quantity on PDP
    Then I should see quantity range validation message

  @Locked @Regression @PDP @P2 @QuantitySelector
  Scenario: Verify invalid text quantity validation message
    When I click on a first product
    When I set invalid text quantity on PDP
    Then I should see invalid number validation message

  @Locked @Regression @PDP @P2 @DeliveryInfoTooltip
  Scenario: Verify delivery charges tooltip message
    When I click on a first product
    When i click on delivery charges Info
    Then I should see the delivery charges tooltip message

  # Pickup Mode Scenarios for PDP
  # Note: Pickup scenarios use their own Given step to skip delivery address setup

  @Locked @Sanity @PDP @P1 @Pickup
  Scenario: Verify PDP does not show delivery charges when Pickup mode is selected
    Given I am on the Product Listing Page for Pickup
    When I switch to Pickup mode
    And I click on a first product
    Then I should not see delivery charges section on PDP
    And the price should show only material cost without delivery

  @Locked @Regression @PDP @P2 @Pickup
  Scenario: Verify PDP shows Pickup location in header
    Given I am on the Product Listing Page for Pickup
    When I switch to Pickup mode
    And I click on a first product
    Then the header should display Pickup with facility address

  @Locked @Regression @PDP @P2 @Pickup
  Scenario: Verify quantity changes in Pickup mode calculate correctly
    Given I am on the Product Listing Page for Pickup
    When I switch to Pickup mode
    And I click on a first product
    And I adjust the quantity using plus icon
    Then the total price should reflect material cost only