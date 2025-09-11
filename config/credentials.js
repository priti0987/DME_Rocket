// Centralized credentials and selectors with environment overrides

const baseUrl = process.env.ROCKET_BASE_URL || 'https://staging.dmerocket.com/';
const email = process.env.ROCKET_EMAIL || 'arunkumar.b@hashroot.com';
const password = process.env.ROCKET_PASSWORD || 'Pacs@Merge11';

const selectors = {
  username: '#username',
  password: '#password',
  continueButton: 'button[type="submit"]',
  postLoginMenu: '#dme-sidebar-menu',
  // Popup/Modal selectors
  modalDialog: 'div.rocket-modal-dialog, div[role="dialog"], .modal-dialog',
  modalCancelButton: 'button:has-text("Cancel"), button[data-dismiss="modal"], .modal button:has-text("Cancel")',
  modalCloseButton: 'button.close, .modal-header button[aria-label="Close"], button[data-bs-dismiss="modal"]',
  // Set Location Modal specific selectors
  setLocationModal: {
    modal: 'div#rocket-modal[role="dialog"]',
    cancelButton: 'div#rocket-modal-btn-cancel.btn.btn-cancel.rocket-text-body.d-block',
    form: 'form[method="post"][action="/Config/Account/SetClientLocations"]'
  },
  // Patient Search selectors
  patientSearch: {
    mrnField: 'input[id="PatientSearchQuery_MRN"], input[name="PatientSearchQuery_MRN"], input.form-control[data-val-required*="MRN"]',
    firstNameField: 'input[name="PatientSearchQuery_FirstName"], input[placeholder*="First Name"]',
    lastNameField: 'input[name="PatientSearchQuery_LastName"], input[placeholder*="Last Name"]',
    searchButton: 'button:has-text("Search Patients"), button[type="submit"]:has-text("Search")',
    clearButton: 'button:has-text("Clear Search"), button[type="button"]:has-text("Clear")',
    resultsTable: 'table.table-responsive, table.table-striped, .patient-search-results table',
    patientRow: 'tbody tr, tr:has(td)',
    clickablePatientRow: 'tbody tr:has(td) a, tbody tr:has(td)[onclick], tbody tr:has(td)[data-href], tbody tr:has(td) td:first-child',
    firstPatientRecord: 'tbody tr:first-child, #patient-search-results tr:first-child',
    patientMrnCell: 'tbody tr td:first-child, tbody tr td:has-text("MRN")',
    noResultsMessage: '.no-results, .empty-state, :has-text("No patients found"), :has-text("Results 1-10")',
    loadingIndicator: '.loading, .spinner, [data-loading="true"]',
    paginationInfo: ':has-text("Results"), .pagination-info'
  },
  // Patient Details selectors (generic - no hardcoded values)
  patientDetails: {
    pageTitle: 'h1:has-text("Patient Details"), h1.page-title',
    mrnField: '#text, .patient-info .form-control[readonly], input[readonly], td',
    mrnValue: '.form-control[readonly], #text, input[readonly]',
    patientName: 'h1, .patient-name',
    patientInfo: '.patient-info, #Patient-Info',
    deactivateButton: 'button:has-text("Deactivate Patient")',
    backToPatients: 'button:has-text("Back to Patients"), a:has-text("Back to Patients")',
    createNewOrderButton: 'button:has-text("Create New Order"), .btn:has-text("Create New Order"), a:has-text("Create New Order")'
  },
  // Create Patient selectors
  createPatient: {
    // New Patient button and modal
    newPatientButton: 'a.btn.btn-add.btn-xs',
    modal: 'div.rocket-modal-content',
    modalContainer: '#rocket-modal',
    
    // Form fields with exact DOM selectors
    mrnField: 'input#MRN.form-control',
    clientField: 'select#ClientId.form-select',
    firstNameField: 'input#FirstName.form-control',
    lastNameField: 'input#LastName.form-control',
    dateOfBirthField: 'input#DateOfBirth.form-control.datepicker',
    languageField: 'select#LanguageId.form-select',
    
    // Action buttons
    saveAndCloseButton: 'div#rocket-modal-btn-submit.btn.btn-add.rocket-text-body.d-block',
    cancelButton: 'button:has-text("Cancel"), .btn-secondary',
    
    // Validation and confirmation
    successMessage: '.alert-success, .success-message, :has-text("Patient created successfully")',
    errorMessage: '.alert-danger, .error-message, .validation-error',
    
    // Patient search grid for verification
    patientSearchGrid: 'table.table-responsive, table.table-striped, .patient-search-results table',
    patientRow: 'tbody tr, tr:has(td)',
    firstPatientRecord: 'tbody tr:first-child'
  },
  // Create Primary Insurance selectors
  createPrimaryInsurance: {
    // Modal and container
    modal: 'div.rocket-modal-content',
    modalContainer: '#rocket-modal',
    
    // Primary Insurance fields
    insuranceProviderField: 'span#select2-InsuranceId-container',
    insuranceProviderDropdown: '#select2-InsuranceId-results',
    policyNumberField: 'input#InsuranceNumber.form-control',
    groupNumberField: 'input#Group.form-control',
    isPatientPolicyOwnerCheckbox: 'input#IsPatientPolicyOwner.form-check-input',
    
    // Manual Verification section
    manuallyVerifyButton: 'a#manuallyverify-button.btn.btn-secondary.btn-xs',
    manualVerificationSection: '#ManualInsuranceVerification',
    
    // Deductible fields
    individualDeductibleInNet: '#ManualInsuranceVerification_IndividualDeductibleInNet',
    individualDeductibleRemainingInNet: '#ManualInsuranceVerification_IndividualDeductibleRemainingInNet',
    familyDeductibleInNet: '#ManualInsuranceVerification_FamilyDeductibleInNet',
    familyDeductibleRemainingInNet: '#ManualInsuranceVerification_FamilyDeductibleRemainingInNet',
    
    // Out of Pocket fields
    individualOOPInNet: '#ManualInsuranceVerification_IndividualOOPInNet',
    individualOOPRemainingInNet: '#ManualInsuranceVerification_IndividualOOPRemainingInNet',
    familyOOPInNet: '#ManualInsuranceVerification_FamilyOOPInNet',
    familyOOPRemainingInNet: '#ManualInsuranceVerification_FamilyOOPRemainingInNet',
    
    // Coinsurance field
    coinsuranceField: 'input[name="ManualInsuranceVerification.CoInsuranceInNet"]',
    
    // Action buttons
    saveManualVerificationButton: 'a#manuallyverifysave-button.btn.btn-success.btn-xs',
    saveAndCloseButton: 'div#rocket-modal-btn-submit.btn.btn-add.rocket-text-body.d-block',
    cancelButton: 'button:has-text("Cancel"), .btn-secondary',
    
    // Validation and confirmation
    successMessage: '.alert-success, .success-message, :has-text("Insurance created successfully")',
    errorMessage: '.alert-danger, .error-message, .validation-error'
  },
  // Order Creation selectors (specific DOM references)
  orderCreation: {
    // Modal and form
    modal: '#rocket-modal, .rocket-modal-dialog',
    pageTitle: 'h1:has-text("Create Order"), h1:has-text("New Order"), .page-title',
    orderForm: 'form[id*="order"], form.order-form, .order-creation-form, #rocket-modal form',
    
    // Specific form fields with exact DOM selectors
    clientField: 'select#ClientId.form-select',
    locationField: 'select#ClientLocationId.form-select', 
    dateOfServiceField: 'input#DateOfService.form-control.datepicker',
    orderingProviderField: 'select#OrderingProviderId.form-select',
    supervisingProviderField: 'select#SupervisingProviderId.form-select',
    fitterField: 'select#FitterAccountId.form-select',
    notesField: 'textarea#OrderNotes.form-control',
    
    // Action buttons with specific DOM
    saveAndCloseButton: 'div#rocket-modal-btn-submit.btn.btn-add.rocket-text-body.d-block',
    cancelButton: 'button:has-text("Cancel"), .btn-secondary',
    
    // Validation and confirmation
    successMessage: '.alert-success, .success-message, :has-text("Order created successfully")',
    errorMessage: '.alert-danger, .error-message, .validation-error',
    
    // Order list/history
    ordersList: '.orders-list, .patient-orders, #orders-table, .order-summary',
    newOrderRow: 'tr:first-child, .order-item:first-child',
    orderStatus: '.order-status, .status-badge',
    patientOrderSummary: '.patient-order-summary, #patient-orders'
  }
};

module.exports = {
  baseUrl,
  email,
  password,
  selectors,
};


