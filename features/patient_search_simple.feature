@patient-search-simple
Feature: Patient Search - Simple

  @smoke @patient-search-mrn-simple
  Scenario: Search patient by MRN and click on record
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    When I enter the MRN in the MRN search field
    Then I should see the patient details displayed
    When I click on the first patient record
    Then I should be navigated to the patient details page
