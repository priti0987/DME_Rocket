@authorization-queue
Feature: Authorization Queue Management
  As a healthcare provider
  I want to access and manage authorization requests in the Authorization Queue
  So that I can process patient order authorizations efficiently

  Background:
    Given I navigate to the patient with the latest created order

  Scenario: Navigate to Authorization Queue and process authorization
    When I extract and store the order number from the patient details page
    And I navigate to the Authorization Queue
    Then I should be on the Authorization Queue page
    And click on the Cancel button of set location modal
    When I enter the patient MRN in the MRN search box
    And I click on the result row for the patient
    And I click on "Edit Authorization" button
    Then the "Edit Authorization" modal should open
    When I select "Approved" for the Status field
    And I select 5 days before today for "Date of Inquiry" field
    And I select today's date for "Initiated Date" field
    And I select 5 days from today for "Follow up Date" field
    And I scroll down the Edit auth info page
