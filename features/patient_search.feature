@patient-search
Feature: Patient Search

  Background:
    Given I launch the Rocket application
    And I dismiss any popup if displayed
    And I should be logged in successfully

  @smoke @patient-search-mrn
  Scenario: Search patient by MRN
    When I enter the MRN in the MRN search field
    Then I should see the patient details displayed

  @patient-search-validation
  Scenario: Search patient with invalid MRN
    When I enter an invalid MRN in the MRN search field
    Then I should see no patient results

  @patient-search-partial
  Scenario: Search patient with partial MRN
    When I enter a partial MRN in the MRN search field
    Then I should see matching patient results

  @patient-search-alternative
  Scenario: Search patient using alternative MRN
    When I enter an alternative MRN in the MRN search field
    Then I should see the patient details displayed
