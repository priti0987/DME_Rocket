const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');

function resolveBaseUrl(world) {
  return process.env.ROCKET_BASE_URL || world?.baseUrl || credentials.baseUrl;
}

function resolveEmail() {
  return process.env.ROCKET_EMAIL || credentials.email;
}

function resolvePassword() {
  return process.env.ROCKET_PASSWORD || credentials.password;
}

Given('I launch the Rocket application', async function () {
  const baseUrl = resolveBaseUrl(this);
  await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
});

When('I enter valid login credentials', async function () {
  const email = resolveEmail();
  const password = resolvePassword();
  await this.page.fill(credentials.selectors.username, email);
  await this.page.fill(credentials.selectors.password, password);
});

When('I click on the Continue button', async function () {
  await this.page.click(credentials.selectors.continueButton);
  await this.page.waitForLoadState('networkidle');
});

Then('I should be logged in successfully', async function () {
  await this.page.waitForSelector(credentials.selectors.postLoginMenu, { state: 'visible', timeout: 45000 });
  await expect(this.page.locator(credentials.selectors.postLoginMenu)).toBeVisible({ timeout: 45000 });
  await expect(this.page).toHaveURL(/dmerocket/i);
});

module.exports = {};


