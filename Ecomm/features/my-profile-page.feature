@Sanity @MyProfile
Feature: Update My Profile Information
  As a logged-in Vulcan Shop user
  I want to update my personal profile details
  So that my information remains accurate

  Background:
    Given I navigate to the Vulcan Shop application
    And I click on the Sign In button
    And I enter email "vivekpankaj@gmail.com"
    And I enter password "S@p1ent2014"
    And I submit the Sign In form
    

  @EditProfile
  Scenario: Update profile personal info
    When I click on My Account
    And I click on My Profile
    And I click the Edit button in Personal Info section
    And I update First Name "Ataf"
    And I update Last Name "Ali"
    And I update Mobile "9876543210"
    And I save the profile
    Then I should see profile updated successfully
