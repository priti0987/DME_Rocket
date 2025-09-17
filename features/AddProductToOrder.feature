@add-product-to-order
Feature: Add Product to an Existing Order
  As a healthcare provider
  I want to add products to an existing patient order
  So that I can complete the order with necessary medical equipment

  Background:
    # Navigate to an existing patient with orders for debugging
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal
    When I navigate to Patient Search page
    And click on the Cancel button of set location modal
    And I click on Search Patients button
    # Use the MRN from your DOM reference (MRNQA3852) or search for any patient
    When I enter "MRNQA3852" in the MRN search field
    Then I should see the patient details displayed
    When I click on the patient record with MRN "MRNQA3852"
    Then I should be navigated to the patient details page
    And click on the Cancel button of set location modal

  Scenario: Add a product to the existing order
    # Skip order summary verification and go directly to adding products
    When I wait for the page to load completely
    And I try to expand any order section if needed
    When I click on "Add Product" button for product workflow
    Then the "Add Product" modal should be displayed
    When I select "A0621" in the Search HCPCS dropdown
    And I click on "Search Products" button for product workflow
    
    