# ============================================================================
# My Account Feature - Validates My Account sections after user login
# ============================================================================
# Created: 11 January 2026
# Updated: 11 January 2026 - Added Purchase History detailed scenarios
# 
# Scenarios:
#   1. Validate My Profile page and user details (@MyProfile)
#   2. Validate Purchase History page elements (@PurchaseHistory)
#   3. Validate Order Details via View Details CTA (@ViewDetails)
#   4. Validate Modify Quantity flow - Cancel (@ModifyQuantity)
#   5. Validate Modify Quantity flow - Save and Submit (@ModifyQuantity)
#   6. Validate Pickup/Delivery Details - Cancel (@PickupDetails)
#   7. Validate Pickup/Delivery Details - Save (@PickupDetails)
#   8. Validate Payment page (@Payment)
#
# Precondition: User must be logged in (uses login steps)
# ============================================================================

@Regression @MyAccount
Feature: My Account Validation
  As a logged in Vulcan Shop user
  I want to validate my account sections
  So that I can verify my profile, purchase history, and payment information

  Background:
    Given I navigate to the Vulcan Shop application
    When I click on the Sign In button
    And I enter valid user email
    And I enter valid user password
    And I submit the Sign In form
    Then the Sign In button should change to My Account

  @Sanity @P1 @MyProfile
  Scenario: Validate My Profile page displays correct user information
    When I click on My Account
    And I click on My Profile from the dropdown
    Then I should see the My Profile page header
    And the Personal Info section should display correct first name
    And the Personal Info section should display correct last name
    And the Login Info section should display the correct email

  # ============================================================================
  # PURCHASE HISTORY SCENARIOS
  # ============================================================================

  @Sanity @P1 @PurchaseHistory @PurchaseHistoryElements
  Scenario: Validate Purchase History page displays all required elements
    When I click on My Account
    And I click on Purchase History from the dropdown
    Then I should see the Purchase History page header
    And I should see at least one order in the history
    # Note: If no orders exist, the following steps will be skipped
    # and a "No existing orders" message should be displayed instead
    And each order should display order number and date
    And each order should display product details with quantity
    And each order should display the Order Total
    And each order should display View Details button
    And each order should display Re-order button

  @P1 @PurchaseHistory @ViewDetails
  Scenario: Validate View Details opens Order Details page with correct information
    When I click on My Account
    And I click on Purchase History from the dropdown
    Then I should see at least one order in the history
    When I note the first order number and date
    And I click on View Details for the first order
    Then I should see the Order Details page
    And the Order number should match the noted order number
    And the Order date should match the noted order date
    And I should see Modify Quantity link for each product
    And I should see the Order Summary section
    And I should see Pickup Details or Delivery Details section

  @P2 @PurchaseHistory @ViewDetails @ModifyQuantity
  Scenario: Validate Modify Quantity opens quantity input field
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I click on View Details for the first order
    Then I should see the Order Details page
    When I click on Modify Quantity for the first product
    Then I should see the quantity input field
    And I should see the Save button
    And I should see the close X button for quantity edit

  @P2 @PurchaseHistory @ViewDetails @ModifyQuantity @CancelQuantityChange
  Scenario: Validate clicking X on Modify Quantity cancels without changes
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I click on View Details for the first order
    Then I should see the Order Details page
    When I note the current quantity for the first product
    And I click on Modify Quantity for the first product
    And I enter a new quantity value
    And I click on the X button to cancel quantity change
    Then the quantity should remain unchanged from the original

  @P1 @PurchaseHistory @ViewDetails @ModifyQuantity @SaveQuantityChange
  Scenario: Validate saving quantity change shows Submit Changes button
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I click on View Details for the first order
    Then I should see the Order Details page
    When I note the original Order Total
    And I click on Modify Quantity for the first product
    And I enter a new quantity value
    And I click on Save button for quantity change
    Then I should see the Submit Changes button
    And I should see a message to review changes

  @P1 @PurchaseHistory @ViewDetails @ModifyQuantity @SubmitQuantityChange
  Scenario: Validate Submit Changes recalculates price and shows confirmation
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I click on View Details for the first order
    Then I should see the Order Details page
    When I note the original Order Total
    And I click on Modify Quantity for the first product
    And I enter a new quantity value
    And I click on Save button for quantity change
    And I click on Submit Changes button
    Then the Order Total should be recalculated
    And I should see a confirmation popup message

  @P2 @PurchaseHistory @ViewDetails @PickupDetails
  Scenario: Validate Pickup or Delivery Details section displays Modify link
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I note if the first order is Pickup or Delivery
    And I click on View Details for the first order
    Then I should see the Order Details page
    When I scroll down to Pickup Details or Delivery Details section
    Then I should see the correct Address section based on order type
    And I should see the correct Details section with Modify link based on order type

  @P2 @PurchaseHistory @ViewDetails @PickupDetails @EditPickupDetails
  Scenario: Validate clicking Modify opens Pickup or Delivery Details in edit mode
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I note if the first order is Pickup or Delivery
    And I click on View Details for the first order
    And I scroll down to Pickup Details or Delivery Details section
    And I click on Modify link for Pickup or Delivery Details
    Then I should see the Details modal in edit mode
    And I should see First Name input field
    And I should see Last Name input field
    And I should see Mobile input field
    And I should see Email input field
    And I should see date and time selectors if order is Pickup
    And I should see the Save button for Details
    And I should see the X close button for Details modal

  @P2 @PurchaseHistory @ViewDetails @PickupDetails @CancelPickupDetails
  Scenario: Validate clicking X on Pickup or Delivery Details cancels without changes
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I note if the first order is Pickup or Delivery
    And I click on View Details for the first order
    And I scroll down to Pickup Details or Delivery Details section
    When I note the current Contact Info details
    And I click on Modify link for Pickup or Delivery Details
    And I update the First Name field
    And I click on X button to close Details modal
    Then the Contact Info should remain unchanged

  @P1 @PurchaseHistory @ViewDetails @PickupDetails @SavePickupDetails
  Scenario: Validate saving Pickup or Delivery Details shows confirmation message
    When I click on My Account
    And I click on Purchase History from the dropdown
    And I note if the first order is Pickup or Delivery
    And I click on View Details for the first order
    And I scroll down to Pickup Details or Delivery Details section
    And I click on Modify link for Pickup or Delivery Details
    And I update the First Name field
    And I click on Save button for Details
    Then I should see a confirmation popup message for Details update

  @P2 @Payment
  Scenario: Validate Payment page displays saved cards or empty state
    When I click on My Account
    And I click on Payment from the dropdown
    Then I should see the Payment page header
    And I should see either saved payment cards or empty state message
    And if no cards exist I should see the Add Payment button
