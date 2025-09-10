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
};

module.exports = {
  baseUrl,
  email,
  password,
  selectors,
};


