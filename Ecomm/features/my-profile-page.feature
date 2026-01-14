@Regression @Sanity @MyProfile
Feature: Update My Profile Information
  As a logged-in Vulcan Shop user
  I want to update my personal profile details
  So that my information remains accurate

  Background:
    Given I am on My Profile page
    
    
  @EditProfile
  Scenario: Update profile personal info
    When I click the Edit button in Personal Info section
    And I update First Name "Ataf"
    And I update Last Name "Ali"
    And I update Mobile "9876543210"
    And I save the profile
    Then I should see profile updated successfully

    When I click the Edit button in Company Info section
    And I update Company Name "ABCDEFG"
    And I update Company Phone "8787879090"
    And I update Company Address "California 6th Street"
    And I save the company info
    Then I should see company info updated successfully

    When I click on Edit Login Info
    And I fill current password "vdvkdk878"
    And I fill new password "bacdefghhi"
    And I click the Cancel button
