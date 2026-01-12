# ============================================================================
# Checkout Feature - Complete Checkout Flow
# ============================================================================
# Created: 12 January 2026
# 
# Jira Epics Reference:
#   ECM-827 - Checkout Main Epic
#   ECM-612 - Delivery Flow
#   ECM-597 - Payment Flow
#   ECM-593 - Schedule/Time Slot Selection
#   ECM-589 - Order Review & Confirmation
#   ECM-583 - Guest Checkout Flow
#
# Prerequisites:
#   - Cart must have at least one product
#   - Reuses existing Add to Cart flow
#
# Test Matrix:
#   User Type: Guest | Registered
#   Delivery Mode: Delivery | Pickup
#   Payment Method: Credit Card | Saved Card | Pay on Delivery
#   Schedule: Today | Future Date
# ============================================================================

@Regression @Checkout
Feature: Checkout Flow
  As a customer (Guest or Registered)
  I want to complete the checkout process
  With delivery/pickup options and payment
  So that I can place my order successfully

  # ============================================================================
  # BACKGROUND - Common setup for all checkout scenarios
  # ============================================================================

  Background:
    Given I navigate to the Vulcan Shop application

  # ============================================================================
  # PART A: CHECKOUT PAGE NAVIGATION & VALIDATION
  # ============================================================================

  @Sanity @P1 @CheckoutNavigation @Guest
  Scenario: Guest user navigates to checkout page from cart
    Given I am on the Product Listing Page as a Guest user
    And I set delivery address using primary zipcode
    When I add a product to cart from PLP
    And I click on the cart icon in header
    Then I should be on the Cart page
    When I click on the Checkout button
    Then I should be on the Checkout page
    And I should see the Order Summary on checkout page
    And I should see the Delivery/Pickup section
    And I should see the Schedule section
    And I should see the Payment section

  @P1 @CheckoutNavigation @Registered
  Scenario: Registered user navigates to checkout page from cart
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    And I set delivery address using primary zipcode
    When I add a product to cart from PLP
    And I click "View Cart" button in the slider
    Then I should be on the Cart page
    When I click on the Checkout button
    Then I should be on the Checkout page
    And I should see pre-filled delivery address
    And I should see the saved payment methods section

  # ============================================================================
  # PART B: DELIVERY MODE - DELIVERY ADDRESS FLOW
  # ============================================================================

  @Sanity @P1 @Delivery @DeliveryAddress @Guest
  Scenario: Guest user enters delivery address during checkout
    Given I am on the Product Listing Page as a Guest user
    And I set delivery address using primary zipcode
    When I add a product to cart and proceed to checkout
    Then I should be on the Checkout page
    And I should see the Delivery Address section
    When I enter delivery address details
      | field         | value                    |
      | addressLine1  | 123 Main Street          |
      | addressLine2  | Suite 100                |
      | city          | Birmingham               |
      | state         | Alabama                  |
      | zipCode       | 35203                    |
    And I click Save Address
    Then the delivery address should be saved
    And I should see the delivery charges updated

  @P1 @Delivery @DeliveryAddress @Registered
  Scenario: Registered user selects saved delivery address
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I add a product to cart and proceed to checkout
    Then I should be on the Checkout page
    And I should see my saved addresses
    When I select the first saved address
    Then the delivery address should be applied
    And the Order Summary should update with delivery charges

  @P2 @Delivery @DeliveryAddress @NewAddress
  Scenario: Registered user adds new delivery address during checkout
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I add a product to cart and proceed to checkout
    Then I should be on the Checkout page
    When I click on "Add New Address"
    And I enter new delivery address details
    And I click Save Address
    Then the new address should be saved to my account
    And the delivery address should be applied

  @P2 @Delivery @DeliveryAddress @EditAddress
  Scenario: User edits delivery address during checkout
    Given I am logged in as a registered user
    And I clear all items from the cart
    When I add a product to cart and proceed to checkout
    And I select the first saved address
    When I click on Edit Address
    And I modify the address details
    And I click Save Address
    Then the updated address should be applied
    And the delivery charges should be recalculated

  # ============================================================================
  # PART C: PICKUP MODE - FACILITY SELECTION FLOW
  # ============================================================================

  @Sanity @P1 @Pickup @FacilitySelection @Guest
  Scenario: Guest user completes checkout with Pickup option
    Given I am on the Product Listing Page as a Guest user
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I add a product to cart from PLP
    And I click on the cart icon in header
    And I click on the Checkout button
    Then I should be on the Checkout page
    And I should see the Pickup Location section
    And the selected facility should be displayed
    And there should be no delivery charges in Order Summary

  @P1 @Pickup @FacilitySelection @Registered
  Scenario: Registered user completes checkout with Pickup at saved facility
    Given I am logged in as a registered user
    And I clear all items from the cart
    And I navigate to the Product Listing Page
    When I switch to Pickup mode with primary zipcode
    And I select a pickup facility
    And I add a product to cart from PLP
    And I proceed to checkout
    Then I should be on the Checkout page
    And I should see the Pickup Location section
    And there should be no delivery charges

  @P2 @Pickup @ChangeFacility
  Scenario: User changes pickup facility during checkout
    Given I am on the checkout page with Pickup mode
    When I click on "Change Facility"
    Then I should see the facility selection modal
    When I select a different facility
    And I confirm the facility selection
    Then the new facility should be displayed
    And the pickup location should be updated

  # ============================================================================
  # PART D: SCHEDULE SELECTION - DELIVERY TIME SLOTS
  # ============================================================================

  @Sanity @P1 @Schedule @Delivery @TimeSlot
  Scenario: User selects delivery date and time slot
    Given I am on the checkout page with Delivery mode
    When I navigate to the Schedule section
    Then I should see available delivery dates
    And I should see available time slots
    When I select a delivery date
    And I select a time slot
    Then the delivery schedule should be confirmed
    And the Order Summary should show the selected date

  @P1 @Schedule @Delivery @TodayDelivery
  Scenario: User selects same-day delivery
    Given I am on the checkout page with Delivery mode
    When I navigate to the Schedule section
    And I select today's date if available
    And I select the earliest available time slot
    Then the same-day delivery should be confirmed
    And I should see the delivery time in Order Summary

  @P2 @Schedule @Delivery @FutureDate
  Scenario: User selects future delivery date
    Given I am on the checkout page with Delivery mode
    When I navigate to the Schedule section
    And I select a date 7 days from today
    And I select a time slot
    Then the future delivery should be scheduled
    And the Order Summary should show the future date

  @P2 @Schedule @Delivery @ChangeSchedule
  Scenario: User changes delivery schedule
    Given I am on the checkout page with a schedule selected
    When I click on "Change Schedule"
    And I select a different date
    And I select a different time slot
    Then the schedule should be updated
    And the Order Summary should reflect the new schedule

  # ============================================================================
  # PART E: SCHEDULE SELECTION - PICKUP TIME SLOTS
  # ============================================================================

  @Sanity @P1 @Schedule @Pickup @TimeSlot
  Scenario: User selects pickup date and time slot
    Given I am on the checkout page with Pickup mode
    When I navigate to the Schedule section
    Then I should see available pickup dates
    And I should see available pickup time slots for the facility
    When I select a pickup date
    And I select a pickup time slot
    Then the pickup schedule should be confirmed
    And the Order Summary should show the pickup date and time

  @P2 @Schedule @Pickup @FacilityHours
  Scenario: Pickup time slots respect facility operating hours
    Given I am on the checkout page with Pickup mode
    When I navigate to the Schedule section
    And I select a pickup date
    Then the available time slots should be within facility hours
    And unavailable slots should be grayed out

  # ============================================================================
  # PART F: PAYMENT - CREDIT CARD FLOW
  # ============================================================================

  @Sanity @P1 @Payment @CreditCard @Guest
  Scenario: Guest user enters new credit card for payment
    Given I am on the checkout page as a Guest user
    And I have completed delivery address and schedule
    When I navigate to the Payment section
    Then I should see the payment options
    When I select "Credit Card" payment method
    And I enter credit card details
      | field       | value            |
      | cardNumber  | 4111111111111111 |
      | expiryDate  | 12/28            |
      | cvv         | 123              |
      | cardName    | Test User        |
    Then the card should be validated
    And I should see the "Place Order" button enabled

  @P1 @Payment @CreditCard @Registered
  Scenario: Registered user pays with saved credit card
    Given I am on the checkout page as a Registered user
    And I have completed delivery address and schedule
    When I navigate to the Payment section
    Then I should see my saved payment methods
    When I select the first saved card
    And I enter the CVV for the saved card
    Then the card should be validated
    And I should see the "Place Order" button enabled

  @P2 @Payment @CreditCard @SaveCard
  Scenario: Guest user saves credit card for future use during checkout
    Given I am on the checkout page as a Guest user who signed in
    And I have completed delivery address and schedule
    When I enter new credit card details
    And I check "Save this card for future purchases"
    And I place the order
    Then the order should be placed successfully
    And the card should be saved to my account

  @P2 @Payment @CreditCard @AddNewCard
  Scenario: Registered user adds new credit card during checkout
    Given I am on the checkout page as a Registered user
    And I have saved cards in my account
    When I click on "Add New Card"
    And I enter new credit card details
    And I check "Save this card for future purchases"
    Then the new card should be available for selection
    When I select the new card
    Then the payment should be ready

  @P3 @Payment @CreditCard @InvalidCard
  Scenario: User sees error for invalid credit card
    Given I am on the checkout page
    And I have completed delivery address and schedule
    When I enter invalid credit card details
      | field       | value            |
      | cardNumber  | 1234567890123456 |
      | expiryDate  | 01/20            |
      | cvv         | 12               |
    Then I should see card validation error
    And the "Place Order" button should be disabled

  # ============================================================================
  # PART G: PAYMENT - PAY ON DELIVERY/PICKUP
  # ============================================================================

  @P2 @Payment @PayOnDelivery
  Scenario: User selects Pay on Delivery option
    Given I am on the checkout page with Delivery mode
    And I have completed delivery address and schedule
    When I navigate to the Payment section
    And I select "Pay on Delivery" payment method
    Then the Pay on Delivery option should be selected
    And I should see the "Place Order" button enabled
    And the Order Summary should show "Pay on Delivery"

  @P2 @Payment @PayOnPickup
  Scenario: User selects Pay on Pickup option
    Given I am on the checkout page with Pickup mode
    And I have completed pickup facility and schedule
    When I navigate to the Payment section
    And I select "Pay on Pickup" payment method
    Then the Pay on Pickup option should be selected
    And I should see the "Place Order" button enabled

  # ============================================================================
  # PART H: ORDER SUMMARY VALIDATION
  # ============================================================================

  @Sanity @P1 @OrderSummary @Delivery
  Scenario: Validate Order Summary for Delivery order
    Given I am on the checkout page with Delivery mode
    And I have a product in cart
    Then the Order Summary should display:
      | field            | validation                    |
      | Product Name     | matches cart product          |
      | Quantity         | matches cart quantity         |
      | Unit Price       | matches product price         |
      | Subtotal         | quantity x unit price         |
      | Delivery Charges | displayed with amount         |
      | Tax              | calculated or "At Checkout"   |
      | Estimated Total  | subtotal + delivery + tax     |

  @P1 @OrderSummary @Pickup
  Scenario: Validate Order Summary for Pickup order
    Given I am on the checkout page with Pickup mode
    And I have a product in cart
    Then the Order Summary should display:
      | field            | validation                    |
      | Product Name     | matches cart product          |
      | Quantity         | matches cart quantity         |
      | Unit Price       | matches product price         |
      | Subtotal         | quantity x unit price         |
      | Pickup Charges   | displayed (may be $0)         |
      | Tax              | calculated or "At Checkout"   |
      | Estimated Total  | subtotal + pickup + tax       |
    And Delivery Charges should NOT be displayed

  @P2 @OrderSummary @MultipleProducts
  Scenario: Validate Order Summary with multiple products
    Given I am on the checkout page
    And I have multiple products in cart
    Then the Order Summary should list all products
    And each product should show name, quantity, and price
    And the Subtotal should be sum of all product prices
    And the Estimated Total should include all charges

  @P2 @OrderSummary @EditQuantity
  Scenario: Edit quantity from checkout page updates Order Summary
    Given I am on the checkout page
    When I click on Edit for a product
    And I update the quantity to "50"
    And I save the changes
    Then the Order Summary should be recalculated
    And the new quantity should be reflected
    And the Estimated Total should be updated

  # ============================================================================
  # PART I: PLACE ORDER - SUCCESS FLOW
  # ============================================================================

  @Sanity @P1 @PlaceOrder @Delivery @Guest
  Scenario: Guest user places order with Delivery successfully
    Given I am on the checkout page as a Guest user
    And I have completed all checkout steps for Delivery
      | step     | status    |
      | Address  | completed |
      | Schedule | completed |
      | Payment  | completed |
    When I click on "Place Order"
    Then the order should be placed successfully
    And I should see the Order Confirmation page
    And I should see the Order Number
    And I should see the order details summary
    And I should receive order confirmation email

  @Sanity @P1 @PlaceOrder @Pickup @Guest
  Scenario: Guest user places order with Pickup successfully
    Given I am on the checkout page as a Guest user
    And I have completed all checkout steps for Pickup
      | step     | status    |
      | Facility | completed |
      | Schedule | completed |
      | Payment  | completed |
    When I click on "Place Order"
    Then the order should be placed successfully
    And I should see the Order Confirmation page
    And I should see the Pickup Location details
    And I should see the scheduled pickup time

  @Sanity @P1 @PlaceOrder @Delivery @Registered
  Scenario: Registered user places order with Delivery successfully
    Given I am logged in as a registered user
    And I have completed all checkout steps for Delivery
    When I click on "Place Order"
    Then the order should be placed successfully
    And I should see the Order Confirmation page
    And the order should appear in My Purchase History

  @P1 @PlaceOrder @Pickup @Registered
  Scenario: Registered user places order with Pickup successfully
    Given I am logged in as a registered user
    And I have completed all checkout steps for Pickup
    When I click on "Place Order"
    Then the order should be placed successfully
    And I should see the Order Confirmation page
    And the order should appear in My Purchase History
    And I should see Pickup instructions

  # ============================================================================
  # PART J: ORDER CONFIRMATION PAGE VALIDATION
  # ============================================================================

  @Sanity @P1 @OrderConfirmation
  Scenario: Validate Order Confirmation page elements
    Given I have successfully placed an order
    Then I should be on the Order Confirmation page
    And I should see the following elements:
      | element                  |
      | Order Number             |
      | Thank You message        |
      | Order Summary            |
      | Delivery/Pickup Address  |
      | Scheduled Date and Time  |
      | Payment Method Used      |
      | Estimated Total          |
      | Continue Shopping button |
      | View Order Details link  |

  @P2 @OrderConfirmation @ViewOrderDetails
  Scenario: View Order Details from confirmation page
    Given I am on the Order Confirmation page
    When I click on "View Order Details"
    Then I should see the complete order details
    And I should see the order status
    And I should see the delivery/pickup tracking info

  @P2 @OrderConfirmation @ContinueShopping
  Scenario: Continue Shopping from confirmation page
    Given I am on the Order Confirmation page
    When I click on "Continue Shopping"
    Then I should be redirected to the Product Listing Page
    And the cart should be empty

  # ============================================================================
  # PART K: CHECKOUT VALIDATION & ERROR HANDLING
  # ============================================================================

  @P2 @Validation @IncompleteCheckout
  Scenario: User cannot place order with incomplete checkout
    Given I am on the checkout page
    And I have not completed all required steps
    Then the "Place Order" button should be disabled
    And I should see indicators for incomplete sections

  @P2 @Validation @MissingAddress
  Scenario: User sees error when address is missing
    Given I am on the checkout page with Delivery mode
    And I have not entered delivery address
    When I try to proceed to Payment
    Then I should see an error message for missing address
    And I should be prompted to enter address

  @P2 @Validation @MissingSchedule
  Scenario: User sees error when schedule is not selected
    Given I am on the checkout page
    And I have completed address but not schedule
    When I try to proceed to Payment
    Then I should see an error message for missing schedule
    And I should be prompted to select schedule

  @P3 @Validation @SessionTimeout
  Scenario: User session timeout during checkout
    Given I am on the checkout page
    And my session has expired
    When I try to place the order
    Then I should see a session timeout message
    And I should be prompted to sign in again
    And my cart should be preserved

  # ============================================================================
  # PART L: PROMO CODE / DISCOUNT
  # ============================================================================

  @P2 @PromoCode @ValidCode
  Scenario: User applies valid promo code
    Given I am on the checkout page
    When I enter a valid promo code "SAVE10"
    And I click Apply
    Then the promo code should be applied
    And I should see the discount in Order Summary
    And the Estimated Total should be reduced

  @P3 @PromoCode @InvalidCode
  Scenario: User sees error for invalid promo code
    Given I am on the checkout page
    When I enter an invalid promo code "INVALID123"
    And I click Apply
    Then I should see an error message "Invalid promo code"
    And the Order Summary should remain unchanged

  @P3 @PromoCode @RemoveCode
  Scenario: User removes applied promo code
    Given I am on the checkout page with a promo code applied
    When I click Remove on the promo code
    Then the promo code should be removed
    And the discount should be removed from Order Summary
    And the Estimated Total should be recalculated

  # ============================================================================
  # PART M: GUEST CHECKOUT TO REGISTRATION
  # ============================================================================

  @P2 @GuestCheckout @CreateAccount
  Scenario: Guest user creates account after placing order
    Given I have placed an order as a Guest user
    And I am on the Order Confirmation page
    When I see the "Create Account" prompt
    And I enter a password to create account
    And I click "Create Account"
    Then my account should be created
    And the order should be linked to my new account
    And I should be logged in automatically

  @P3 @GuestCheckout @SignInDuringCheckout
  Scenario: Guest user signs in during checkout
    Given I am on the checkout page as a Guest user
    When I click on "Already have an account? Sign In"
    And I enter my login credentials
    Then I should be signed in
    And my cart should be preserved
    And I should see my saved addresses and payment methods
