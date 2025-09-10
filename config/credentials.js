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
    noResultsMessage: '.no-results, .empty-state, :has-text("No patients found"), :has-text("Results 1-10")',
    loadingIndicator: '.loading, .spinner, [data-loading="true"]',
    paginationInfo: ':has-text("Results"), .pagination-info'
  }
};

module.exports = {
  baseUrl,
  email,
  password,
  selectors,
};


