@e2e-patient-order
Feature: End-to-End Patient Order Creation Flow
  Complete workflow from login to order creation including patient creation, insurance setup, patient search, and order creation

  Scenario: Login, create primary insurance, search MRN, open patient, and create new order
    # Login Flow
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal

    # Create New Patient Flow
    Given I click on the "New Patient" button
    Then the "Create Patient" modal should open
    When I generate and store patient data for the session
    And I enter the generated MRN
    And I select "Beaufort Orthopaedic Sports & Spine" as Client
    And I enter the generated First Name
    And I enter the generated Last Name
    And I enter "10/10/2000" as Date of Birth
    And I select "English" as Language
    And I click on "Save and Close"

    # Create Primary Insurance Flow
    Then the "Create Primary Insurance" modal should open
    When I select "Medicare Part A and B" as the primary insurance provider
    And I enter a dynamic Policy Number as "POLQA####"
    And I enter a dynamic Group Number as "GRPQA####"
    And I set "Is the patient the policy owner?" to "Yes"
    And I click "Manually Verify"
    When I enter "100" into "Individual Deductible InNet" (#ManualInsuranceVerification_IndividualDeductibleInNet)
    And I enter "100" into "Individual Deductible Remaining InNet" (#ManualInsuranceVerification_IndividualDeductibleRemainingInNet)
    And I enter "100" into "Family Deductible InNet" (#ManualInsuranceVerification_FamilyDeductibleInNet)
    And I enter "100" into "Family Deductible Remaining InNet" (#ManualInsuranceVerification_FamilyDeductibleRemainingInNet)
    And I enter "100" into "Individual OOP InNet" (#ManualInsuranceVerification_IndividualOOPInNet)
    And I enter "100" into "Individual OOP Remaining InNet" (#ManualInsuranceVerification_IndividualOOPRemainingInNet)
    And I enter "100" into "Family OOP InNet" (#ManualInsuranceVerification_FamilyOOPInNet)
    And I enter "100" into "Family OOP Remaining InNet" (#ManualInsuranceVerification_FamilyOOPRemainingInNet)
    And I enter "100" into "CoInsurance InNet" field
    And I click on "Save Manual Verifications" (a#manuallyverifysave-button)
    And I accept the browser confirmation dialog
    And I click on "Save and Close" (div#rocket-modal-btn-submit)

    # Patient Search Flow
    When I navigate to Patient Search page
    And click on the Cancel button of set location modal
    And I click on Search Patients button
    
    When I enter the MRN in the MRN search field
    Then I should see the patient details displayed
    When I click on the first patient record
    Then I should be navigated to the patient details page
    And click on the Cancel button of set location modal

    # Create New Order Flow
    When I click on "Create New Order" button
    Then the "Create Order" modal should open
    When I select a Location from the dropdown
    And I set Date of Service to today's date
    And I select an Ordering Provider from the dropdown
    And I select a Supervising Provider from the dropdown
    And I select a Fitter from the dropdown
    And I enter order notes with dynamic content
    And I click "Save and Close" to create the order
    Then the order should appear in Patient Order Summary
    And the order should be created successfully

  Scenario: Add a product to the latest created order
    # Continue from the previous scenario - order should already exist
    When I verify the order is displayed in the "Patient Order Summary"
    Then the order summary should be visible
    When I click on the expand icon of the order
    Then the order details should expand
    When I click on "Add Product" button
    Then the "Add Product" modal should be displayed
    When I select "A0621" in the Search HCPCS dropdown
    And I click on "Search Products" button
    Then the product details should be listed
    When I click on "Add" button of the product
    Then the Line Items should be added in the cart
    When I click on "Product Details" button
    Then the "Add Order Item Details" modal should be displayed
    When I enter "200" in the "Charge Out" field
    And I enter "100" in the "Allowable" field
    And I enter "100" in the "Patient Cost Estimate" field
    And I enter "50" in the "Patient Payment" field
    And I generate and enter a dynamic "Rental Unit Serial Number"
    And I select the rental start date as 3 days from today
    And I enter "50" in the "Length of Rental" field
    And I scroll down the page
    And I select "No" for the first product question
    And I select "option 1" for the second product question
    And I click on "Save and Close" button
