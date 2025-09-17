@add-product-to-order
Feature: Add Product to Order
  As a healthcare provider
  I want to add products to patient orders
  So that I can complete the order with necessary medical equipment

  Background:
    Given I have an existing patient with an order
    And I am logged into the Rocket application
    And I am on the patient details page

  Scenario: Add a single product to an existing order
    When I click on the existing order
    Then the order details page should open
    When I click on "Add Product" button
    Then the "Add Product" modal should open
    When I search for a product by name or code
    And I select a product from the search results
    And I enter the quantity
    And I click "Add to Order"
    Then the product should be added to the order
    And the order total should be updated

  Scenario: Add multiple products to an existing order
    When I click on the existing order
    Then the order details page should open
    When I click on "Add Product" button
    Then the "Add Product" modal should open
    When I search for the first product
    And I select the first product from results
    And I enter quantity "2"
    And I click "Add to Order"
    Then the first product should be added to the order
    When I click on "Add Product" button again
    And I search for the second product
    And I select the second product from results
    And I enter quantity "1"
    And I click "Add to Order"
    Then the second product should be added to the order
    And the order should contain both products
    And the order total should reflect all products

  Scenario: Search and filter products by category
    When I click on the existing order
    Then the order details page should open
    When I click on "Add Product" button
    Then the "Add Product" modal should open
    When I select a product category from the dropdown
    Then the products should be filtered by the selected category
    When I select a product from the filtered results
    And I enter the quantity
    And I click "Add to Order"
    Then the product should be added to the order

  Scenario: Validate product quantity and pricing
    When I click on the existing order
    Then the order details page should open
    When I click on "Add Product" button
    Then the "Add Product" modal should open
    When I search for a product
    And I select a product from results
    And I enter quantity "0"
    Then I should see a validation error for quantity
    When I enter a valid quantity "3"
    And I click "Add to Order"
    Then the product should be added with correct quantity
    And the line total should be calculated correctly

  Scenario: Remove product from order
    Given the order already has products
    When I click on the existing order
    Then the order details page should open
    When I click on "Remove" button for a product
    Then a confirmation dialog should appear
    When I confirm the removal
    Then the product should be removed from the order
    And the order total should be updated accordingly

  Scenario: Edit product quantity in order
    Given the order already has products
    When I click on the existing order
    Then the order details page should open
    When I click on "Edit" button for a product
    Then the quantity field should become editable
    When I change the quantity to "5"
    And I click "Save"
    Then the product quantity should be updated
    And the order total should be recalculated


