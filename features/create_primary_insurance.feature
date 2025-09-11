@create-primary-insurance
Feature: Create Primary Insurance

  Background:
    Given I launch the Rocket application
    When I enter valid login credentials
    And I click on the Continue button
    And I dismiss any popup if displayed
    Then I should be logged in successfully
    And click on the Cancel button of set location modal

  @smoke @create-primary-insurance-manual-verification
  Scenario: Create primary insurance with manual verification and save
    Given I click on the "New Patient" button
    Then the "Create Patient" modal should open
    When I enter a dynamically generated MRN
    And I select "Beaufort Orthopaedic Sports & Spine" as Client
    And I enter dynamically generated First Name
    And I enter dynamically generated Last Name
    And I enter "10/10/2000" as Date of Birth
    And I select "English" as Language
    And I click on "Save and Close"
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
     Then I should see a verification record in Verification History (#insuranceEligibilityVerifyHistory)
