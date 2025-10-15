@create-Product
Feature: Create New product


  Background:
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal

  @smoke @create-Product
  Scenario: Create a new Product successfully
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
    And I select "AFAC-Phoenix" as "Client Locations"
    And I click on "Save and Close" button
    And click on the Cancel button of set location modal
    Then I should see the newly created "Product"
    #link supplier

    When I click on "Add Supplier" button
    Then The "Link Supplier" modal should open
    When I enter dynamically generated supplier name in the search box
    


    
