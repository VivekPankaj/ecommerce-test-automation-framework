# ============================================================================
# 🔒 LOCKED FILE - DO NOT MODIFY WITHOUT APPROVAL
# ============================================================================
# Status: VERIFIED & LOCKED
# Last Verified: 11 January 2026
# All 5 scenarios (49 steps) passing
# 
# Scenarios:
#   1. Validate successful user login with all validations (9 steps)
#   2. Validate successful user logout from Homepage (10 steps)
#   3. Validate successful user logout from PLP page (10 steps)
#   4. Validate successful user logout from PDP page (10 steps)
#   5. Validate successful user logout from Cart page (10 steps)
#
# Sign In Validations:
#   - Sign In button changes to My Account
#   - My Account dropdown shows greeting + menu items
#   - First name matches profile page
#   - Email matches profile page
#
# Sign Out Validations:
#   - My Account button changes to Sign In
#   - User is redirected to Homepage (regardless of current page)
#
# ⚠️  Any modifications require re-running all @Login tests
# ============================================================================

@Sanity @Login
Feature: Login Page Validation
  As a Vulcan Shop user
  I want to validate login and logout flows
  So that I can securely access and exit my account

  Background:
    Given I navigate to the Vulcan Shop application

  @SignIn
  Scenario: Validate successful user login with all validations
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account
    And clicking on My Account should show the user greeting and menu items
    And the first name should match with the profile name in My Profile page
    And the email should match with the email in My Profile page

  @SignOut @SignOutFromHomepage
  Scenario: Validate successful user logout from Homepage
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account
    When I click on My Account
    And I click on Sign Out
    Then the My Account button should change to Sign In
    And I should be redirected to the Homepage

  @SignOut @SignOutFromPLP
  Scenario: Validate successful user logout from PLP page
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account
    When I navigate to the PLP page
    And I sign out from the current page
    Then the My Account button should change to Sign In
    And I should be redirected to the Homepage

  @SignOut @SignOutFromPDP
  Scenario: Validate successful user logout from PDP page
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account
    When I navigate to the PDP page
    And I sign out from the current page
    Then the My Account button should change to Sign In
    And I should be redirected to the Homepage

  @SignOut @SignOutFromCart
  Scenario: Validate successful user logout from Cart page
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account
    When I navigate to the Cart page
    And I sign out from the current page
    Then the My Account button should change to Sign In
    And I should be redirected to the Homepage
