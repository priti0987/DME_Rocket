@create-Supplier
Feature: Create New Supplier

  Background:
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal

  @smoke @create-Supplier
  Scenario: Create a new supplier successfully
    Given I navigate to "Inventory" from the main menu
    When I select "Supplier" from the dropdown
    And click on the Cancel button of set location modal
    Then I should be on the "Supplier" page
    When I click on new Supplier button
    Then The "Create Supplier" modal should open
    When I enter dynamically generated company name
    And I enter website
    And I enter dynamically generated Street Line
    And I enter dynamically generated Street Line 2
    And I enter "New York" as City
    And I select "Alabama" as State Territory
    And I enter dynamically generated zip code
    And I enter dynamically generated Shipping Terms
    And I select "Net 15" as Payment Terms
    And I enter dynamically generated SendOrderToEmail
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly created "Supplier"

  #Add Supplier notes
    When I click on Add Notes button
    Then The Add Notes modal should open
    When I enter notes in supplier notes
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly added notes in the supplier details page

    #Add Contact Details
    When I click on Add Contact Details button
    Then The Add Contact Details modal should open
    When I enter dynamically generated contact details
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly added contact details in the supplier details page
  
    #Add account number for supplier
    When I click on account number for supplier 
    Then The Edit Account Number modal should open
    When I enter dynamically generated account number
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly added account number in the supplier details page

  #Create Product 

  #Add supplied products for supplier
  #link supplier to product

