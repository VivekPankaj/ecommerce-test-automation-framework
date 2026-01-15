# ============================================================================
# Search Feature - Validates search functionality across the application
# ============================================================================
# Created: 11 January 2026
# Background: User starts on Homepage
# ============================================================================

@Regression @Search
Feature: Search Functionality Validation
  As a Vulcan Shop visitor
  I want to search for products using keywords, SKUs, or product names
  So that I can quickly find relevant products without browsing multiple pages

  Background:
    Given I navigate to the Vulcan Shop application

  # P1 CRITICAL TESTS
  @Sanity @P1 @Smoke
  Scenario Outline: Search functionality works correctly with different query types
    When I search for "<query>"
    Then I should see search results
    And the results should contain products related to "<expected_keyword>"
    And I should see the result count displayed

    Examples:
      | query          | expected_keyword | description         |
      | Stone          | stone            | Keyword search      |
      | aggregate-base | aggregate        | Product name search |
      | BASE           | base             | Uppercase search    |

  @Sanity @P1 @Autocomplete
  Scenario: Autocomplete suggestions appear only after 3 characters
    When I start typing "BA" in the search box
    Then I should not see autocomplete suggestions
    When I continue typing to "BAS"
    Then I should see autocomplete suggestions
    And suggestions should include product matches
    And suggestions should include category matches

  # P2 IMPORTANT TESTS
  @P2 @SearchResultsPage
  Scenario Outline: Search navigates to SRP with correct query display
    When I search for "<query>"
    Then I should see search results
    And the URL should contain "/search"
    And the header should display "Results for" and the search keyword "<query>"
    And I should see the following components similar to PLP in line with ECM -54  # Added from ECM-83

    Examples:
      | query          | description                     |
      | project        | Category search                 |
      | aggregate-base | Product name search with hyphen |
      | BASE           | Uppercase search term           |

  @P2 @Autocomplete @AutocompleteNavigation
  Scenario: Select autocomplete suggestion navigates to relevant page
    When I start typing "Sto" in the search box
    Then I should see autocomplete suggestions
    When I click the first autocomplete suggestion
    Then I should be redirected to a relevant page
    And I am displayed product suggestions  # Added from ECM-83
    And I should be taken directly to that product’s PDP  # Added from ECM-83
    And I am displayed category suggestions  # Added from ECM-83
    And I should be taken to the category PLP.  # Added from ECM-83

  @P2 @CrossPage @SearchFromPLP
  Scenario: Search works from Product Listing Page
    Given I am on the Product Listing Page
    When I search for "stone"
    Then I should see search results
    And the URL should contain "/search"

  # P3 EXTENDED TESTS
  @P3 @Performance
  Scenario: Search results load quickly
    When I search for "concrete"
    Then search results should load within 3 seconds

  @P3 @InvalidSearch @NoResults
  Scenario: No results message for invalid search term
    When I search for "xyzunknown"
    Then I should be navigated to the SRP
    And I should see a "No results found" message

  @P3 @SpecialCharacters
  Scenario Outline: Search handles special characters correctly
    When I search for "<search_term>"
    Then I should see search results or appropriate message
    And the page should not show an error

    Examples:
      | search_term    | description          |
      | #5 Stone       | Hash/pound symbol    |
      | 3/4 Gravel     | Fraction             |
      | Stone Gravel   | Multiple words       |

  # SKIPPED/FUTURE SCENARIOS
  @P2 @PDPNavigation @skip @future
  Scenario: Search results navigate to product detail page
    When I search for "stone"
    Then I should see search results
    When I click on the first search result
    Then I should be redirected to the product detail page
    And the URL should contain "/product/"

  @P3 @Accessibility @skip @future
  Scenario: Search box is keyboard accessible
    When I press "Tab" key multiple times to focus search
    Then I should be able to focus the search icon
    When I press "Enter" key on the search icon
    Then the search input should be visible and focused
    And it should trigger a full search and display the SRP.  # Added from ECM-83

  @P2 @CrossPage @SearchFromPDP @skip @future
  Scenario: Search works from Product Detail Page
    Given I am on a Product Detail Page
    When I search for "aggregate"
    Then I should see search results
    And the URL should contain "/search"

  @P2 @CrossPage @SearchFromCart @skip @future
  Scenario: Search works from Cart Page
    Given I am on the Cart Page
    When I search for "gravel"
    Then I should see search results
    And the URL should contain "/search"

  # ========== New Scenarios from ECM-83 ==========
  @Regression @Search @P2 @ECM-83
  Scenario: Verify Am on SRP
    # Source: ECM-83
    Given I entered a search term in the Search Box
    When I am on SRP
    Then I should see a Header with the title
