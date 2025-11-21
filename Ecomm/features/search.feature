Feature: Search Page Validation
  As a shopper, I want to search using keywords, product names, or categories, 
  so that I can quickly find relevant products without browsing through multiple pages.

  Background:
    Given I am on the Product Listing Page

  @Sanity @PLP @Search @Sprint4
  Scenario: Search result page reflects input
    Given I enter a valid search term "BASE" and press Enter
    Then I should be navigated to the SRP
    And the header should display "Results for" and the search keyword "BASE"

    @Sanity @PLP @Search @Sprint4
  Scenario: Search result page reflects input
    Given I enter a valid search term "BAS" and press Enter
    Then I should be navigated to the SRP
    And the header should display "Results for" and the search keyword "BAS"

  @Sanity @PLP @SearchSuggestions1 @Sprint4
  Scenario: Search suggestions not appear for two letter search term
    When I enter a valid search term "BA" without pressing Enter
    Then I should not see search suggestions from products and categories

  @Sanity @PLP @SearchSuggestions @Sprint4
  Scenario: Search suggestions appear for valid search term
    When I enter a valid search term "BASE" without pressing Enter
    Then I should see search suggestions from products and categories
    When I click on the first category suggestions
    Then I should be navigated to the category page

  @Sanity @PLP @Search1 @Sprint4
  Scenario: No search results returned for invalid search term
    Given I enter a valid search term "xyzunknown" and press Enter
    Then no results found message should be displayed