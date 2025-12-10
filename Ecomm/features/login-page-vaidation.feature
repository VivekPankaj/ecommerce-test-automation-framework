@Sanity @Login
Feature: Login Page Validation
  As a Vulcan Shop user
  I want to validate login and logout flows
  So that I can securely access and exit my account

  Background:
    Given I navigate to the Vulcan Shop application

  @SignIn @Sanity
  Scenario: Validate successful user login
    When I click on the Sign In button
    And I enter email "abcd@gmail.com"
    And I enter password "abcdABCD@1"
    And I submit the Sign In form
    Then I should be logged in succesfully

  @SignOut @Sanity
  Scenario: Validate successful user logout
    When I click on the Sign In button
    And I enter email "abcd@gmail.com"
    And I enter password "abcdABCD@1"
    And I submit the Sign In form
    And I click on My Account
    And I click on Sign Out
    Then I should be signed out successfully
