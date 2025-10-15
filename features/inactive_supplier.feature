@inactive-Supplier
Feature: Inactive Supplier

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

    # Set supplier to Inactive status
    When I select edit supplier
    Then The Edit Supplier modal should open
    When I change status as Inactive
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal

    Given I navigate to "Inventory" from the main menu
    When I select "Purchase Order" from the dropdown
    And click on the Cancel button of set location modal
    When I click on "Add Purchase Order" button
    Then the "Add Purchase Order" modal should be displayed
    When I enter supplier details
    Then I should not see the Inactive supplier in the supplier dropdown