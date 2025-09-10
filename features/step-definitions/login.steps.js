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

When('I dismiss any popup if displayed', async function () {
  try {
    // Wait briefly for any popup to appear
    await this.page.waitForTimeout(2000);
    
    // Check if modal dialog is visible
    const modalDialog = this.page.locator(credentials.selectors.modalDialog);
    const isModalVisible = await modalDialog.isVisible();
    
    if (isModalVisible) {
      console.log('Modal popup detected, attempting to dismiss...');
      
      // Try clicking Cancel button first
      const cancelButton = this.page.locator(credentials.selectors.modalCancelButton);
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        console.log('Clicked Cancel button to dismiss popup');
      } else {
        // Try close button as fallback
        const closeButton = this.page.locator(credentials.selectors.modalCloseButton);
        if (await closeButton.isVisible()) {
          await closeButton.click();
          console.log('Clicked Close button to dismiss popup');
        } else {
          // Press ESC key as final fallback
          await this.page.keyboard.press('Escape');
          console.log('Pressed ESC key to dismiss popup');
        }
      }
      
      // Wait for modal to disappear
      await modalDialog.waitFor({ state: 'hidden', timeout: 5000 });
      console.log('Popup dismissed successfully');
    } else {
      console.log('No popup detected, continuing...');
    }
  } catch (error) {
    console.log('Popup handling completed (with potential timeout - this is normal)');
  }
});

When('I click Cancel on the popup', async function () {
  const cancelButton = this.page.locator(credentials.selectors.modalCancelButton);
  await expect(cancelButton).toBeVisible({ timeout: 10000 });
  await cancelButton.click();
  console.log('Clicked Cancel button on popup');
  
  // Wait for modal to disappear
  const modalDialog = this.page.locator(credentials.selectors.modalDialog);
  await modalDialog.waitFor({ state: 'hidden', timeout: 5000 });
});

When('I press ESC to dismiss popup', async function () {
  await this.page.keyboard.press('Escape');
  console.log('Pressed ESC key to dismiss popup');
  
  // Wait for modal to disappear
  const modalDialog = this.page.locator(credentials.selectors.modalDialog);
  await modalDialog.waitFor({ state: 'hidden', timeout: 5000 });
});

Then('I should be logged in successfully', async function () {
  await this.page.waitForSelector(credentials.selectors.postLoginMenu, { state: 'visible', timeout: 45000 });
  await expect(this.page.locator(credentials.selectors.postLoginMenu)).toBeVisible({ timeout: 45000 });
  await expect(this.page).toHaveURL(/dmerocket/i);
});

module.exports = {};


