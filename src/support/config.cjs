const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  BASE_URL: process.env.BASE_URL || 'https://example.com',
  HEADLESS: String(process.env.HEADLESS || 'true').toLowerCase() !== 'false',
};

module.exports = { config };
