Feature: Inspect Cart Structure

  @InspectOnly
  Scenario: Add item and inspect cart structure
    Given I am logged in as a registered user
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I hover over the cart icon on the first product tile
    And I click Add to Cart on the first product tile
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    # At this point, manually inspect the cart page to find the Remove link structure
