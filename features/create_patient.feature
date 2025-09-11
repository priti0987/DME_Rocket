@create-patient
Feature: Create New Patient

  Background:
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal

  @smoke @create-patient-success
  Scenario: Create a new patient successfully
    Given I click on the "New Patient" button
    Then the "Create Patient" modal should open
    When I enter a dynamically generated MRN
    And I select "Beaufort Orthopaedic Sports & Spine" as Client
    And I enter dynamically generated First Name
    And I enter dynamically generated Last Name
    And I enter "10/10/2000" as Date of Birth
    And I select "English" as Language
    And I click on "Save and Close"
    Then the patient should be created successfully and visible in the Patient Search grid
