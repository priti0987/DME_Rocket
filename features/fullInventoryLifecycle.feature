@fullInventoryLifecycle
Feature: Full Inventory Lifecycle

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

    
    #Create a new Product successfully
    Given I navigate to "Inventory" from the main menu
    When I select "Products List" from the dropdown
    And click on the Cancel button of set location modal
    When I click on "Add Product" button
    #I click on "Add" button of the product
    Then the "Add Product" modal should be displayed

    #Fill product details
    When I enter dynamically generated product "Name"
    And I enter dynamically generated product "SKU"
    And I enter dynamically generated product "Barcode"
    And I select "Service Product" as "Product Type"
    And I select "LG" as "size"
    And I enter "Black" as "color"
    And I select "LT" as "Laterality"
    And I select "A0622" as "HCPCS"
    And I select "AFAC-Phoenix" as "Client Location"
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly created "Product"
    
    #link supplier
    When I click on "Add Supplier" button
    Then The "Link Supplier" modal should open
    When I select dynamically generated supplier name in the search box
    And I enter Unit Cost per Dispense UoM as "10"
    And I enter Lead Time as "5"
    And I enter Min Ordering UoM Qty as "5"
    And I select Ordering UoM as "cc (CC)"
    And I enter Conversion to Dispense UoM as "12"
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly linked supplier in the product details page

    # Add client specific inventory
    When I click on Add Client Specific Inventory button
    Then The "Add Client Specific Inventory" modal should open
    When I select "AZI-Sun City" as "Client Location"