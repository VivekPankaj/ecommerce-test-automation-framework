Feature: Quarry Address Selector Modal Validation
  As a user
  I want to select or change my address
  So I can get accurate pricing and delivery availability

 @Sanity @Sprint5 @quarry
Scenario: Validate all components in the Address Selector modal
  Given I am on the Address Selector
  When the Modal is displayed

  And I enter "2720 TN-39, Athens, TN 37303, USA" in the Address Input Field
  And I select the first address suggestion
  And I click the Confirm CTA
  And I close the Address Selector modal
  And I reopen the Address Selector

  Then I should see the following components
  And I should see the Address Input Field with zipcode "2720 TN-39, Athens, TN 37303, USA"
  And I should see Google Map Component with controls
  And I should see the Confirm CTA
  And I should see the Close CTA


@Sanity @Sprint5 @quarry @second
Scenario: Closing the modal without confirming should NOT save the selected address

 Given I am on the Address Selector
  When the Modal is displayed

  And I enter "2720 TN-39, Athens, TN 37303, USA" in the Address Input Field
  And I select the first address suggestion
  And I click the Confirm CTA
  And I close the Address Selector modal
  And I reopen the Address Selector

  And I enter "1414 Jefferson St, Nashville, TN 37208, USA" in the Address Input Field
  And I select the first address suggestion
  And I close the Address Selector modal without saving

  Then the address should not be saved

    
