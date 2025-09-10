// Centralized credentials and selectors with environment overrides

const baseUrl = process.env.ROCKET_BASE_URL || 'https://staging.dmerocket.com/';
const email = process.env.ROCKET_EMAIL || 'arunkumar.b@hashroot.com';
const password = process.env.ROCKET_PASSWORD || 'Pacs@Merge11';

const selectors = {
  username: '#username',
  password: '#password',
  continueButton: 'button[type="submit"]',
  postLoginMenu: '#dme-sidebar-menu',
};

module.exports = {
  baseUrl,
  email,
  password,
  selectors,
};


