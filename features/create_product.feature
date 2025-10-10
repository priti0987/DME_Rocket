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
    Given I navigate to "Inventory"
    When I select "Supplier" from the dropdown
    And click on the Cancel button of set location modal
    Then I should be on the "Supplier" page
    When I click on new Supplier button
    Then The "Create Supplier" modal should open
    When I enter dynamically generated company name
    And I enter dynamically generated Address Line
    And I enter "New York" as City
    And I select "Alabama" as State
    And I enter dynamically generated zip code
    And I enter dynamically generated Shipping Terms
    And I select "Net 15" as Payment Terms
    And I enter dynamically generated SendOrderToEmail
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly created supplier in the supplier list
