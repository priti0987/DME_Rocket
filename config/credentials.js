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
  // Patient Details selectors
  patientDetails: {
    pageTitle: 'h1:has-text("Patient Details"), h1.page-title',
    mrnField: '#text, .patient-info .form-control[readonly], input[value*="T4561"], td:has-text("T4561")',
    mrnValue: 'td:has-text("T4561"), .form-control[readonly], #text',
    patientName: 'h1:has-text("Dragon Breath"), .patient-name',
    patientInfo: '.patient-info, #Patient-Info',
    deactivateButton: 'button:has-text("Deactivate Patient")',
    backToPatients: 'button:has-text("Back to Patients"), a:has-text("Back to Patients")'
  }
};

module.exports = {
  baseUrl,
  email,
  password,
  selectors,
};


