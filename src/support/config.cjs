const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  BASE_URL: process.env.ROCKET_BASE_URL || process.env.BASE_URL || 'https://staging.dmerocket.com/',
  HEADLESS: String(process.env.HEADLESS || 'true').toLowerCase() !== 'false',
  IGNORE_HTTPS_ERRORS: String(process.env.IGNORE_HTTPS_ERRORS || 'false').toLowerCase() === 'true',
};

module.exports = { config };
