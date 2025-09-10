@patient-order-creation
Feature: Patient Order Creation

  Background:
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I should be logged in successfully
    And I dismiss any popup if displayed
    When I enter the MRN in the MRN search field
    Then I should see the patient details displayed
    When I click on the first patient record
    Then I should be navigated to the patient details page
    And I dismiss any popup if displayed
    And I should see the same MRN value that was used in the search

  @smoke @create-order-modal
  Scenario: Open Create Order modal and validate basic elements
    When I click on the "Create New Order" button
    Then I should be navigated to the Create order Modal
    And I should see the order creation form

  @create-order-field-validation
  Scenario: Verify Create Order modal field validations
    When I click on the "Create New Order" button
    Then I should be navigated to the Create order Modal
    And I should see the Client Field pre-populated
    And I should see the Date Field pre-populated

  @create-order-dependencies
  Scenario: Verify provider dependency rules in Create Order modal
    When I click on the "Create New Order" button
    Then I should be navigated to the Create order Modal
    When I select the location
    And I select "Devin Dukes" as the Ordering Provider
    Then I should see "Daniel Del Gaizo" auto-selected as Supervising Provider

  @create-order-complete-workflow
  Scenario: Create order with dependencies and validations
    When I click on the "Create New Order" button
    Then I should be navigated to the Create order Modal
    And I should see the Client Field pre-populated
    And I should see the Date Field pre-populated
    When I select the location
    And I select "Devin Dukes" as the Ordering Provider
    Then I should see "Daniel Del Gaizo" auto-selected as Supervising Provider
    When I select "Ryan Bupp" as the Fitter
    And I fill the Notes field with dynamic content
    Then I should see the Notes field contains all field values
    When I click the "Save and Close" button
    Then I should see the new order in the Patient Order Summary
