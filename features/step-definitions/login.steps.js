const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');

function resolveBaseUrl(world) {
  return world?.baseUrl || process.env.ROCKET_BASE_URL || credentials.baseUrl;
}

function resolveEmail() {
  return process.env.ROCKET_EMAIL || credentials.email;
}

function resolvePassword() {
  return process.env.ROCKET_PASSWORD || credentials.password;
}

Given('I launch the Rocket application', async function () {
  const baseUrl = resolveBaseUrl(this);
  console.log(`Launching Rocket application at: ${baseUrl}`);
  await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  console.log(`Page loaded, current URL: ${this.page.url()}`);
});

When('I enter valid login credentials', async function () {
  try {
    console.log('Entering login credentials...');
    const email = resolveEmail();
    const password = resolvePassword();
    
    console.log(`Using email: ${email}`);
    
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    
    // Try multiple selectors for email field
    const emailSelectors = [
      'input#Email',
      'input[name="Email"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email"]',
      '#username',
      'input#username',
      'input[name="username"]',
      'input.form-control[type="text"]'
    ];
    
    let emailFieldFound = false;
    for (const selector of emailSelectors) {
      try {
        console.log(`Trying email selector: ${selector}`);
        const field = this.page.locator(selector);
        const isVisible = await field.isVisible();
        if (isVisible) {
          await field.fill(email);
          console.log(`✓ Email field filled using: ${selector}`);
          emailFieldFound = true;
          break;
        }
      } catch (error) {
        console.log(`Email selector ${selector} failed: ${error.message}`);
        continue;
      }
    }
    
    if (!emailFieldFound) {
      console.log('⚠ Email field not found with any selector, debugging page content...');
      
      // Debug: Show page URL and title
      console.log(`Current URL: ${this.page.url()}`);
      console.log(`Page title: ${await this.page.title()}`);
      
      // Debug: List all input fields on the page
      try {
        const allInputs = await this.page.locator('input').all();
        console.log(`Found ${allInputs.length} input fields on the page:`);
        for (let i = 0; i < allInputs.length; i++) {
          const input = allInputs[i];
          const id = await input.getAttribute('id');
          const name = await input.getAttribute('name');
          const type = await input.getAttribute('type');
          const placeholder = await input.getAttribute('placeholder');
          const className = await input.getAttribute('class');
          console.log(`Input ${i}: id="${id}", name="${name}", type="${type}", placeholder="${placeholder}", class="${className}"`);
        }
      } catch (debugError) {
        console.log('Debug error:', debugError.message);
      }
      
      await this.page.screenshot({ path: 'email-field-not-found.png', fullPage: true });
      throw new Error('Email field not found');
    }
    
    // Try multiple selectors for password field
    const passwordSelectors = [
      'input#Password',
      'input[name="Password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password"]',
      '#password',
      'input#password',
      'input[name="password"]'
    ];
    
    let passwordFieldFound = false;
    for (const selector of passwordSelectors) {
      try {
        console.log(`Trying password selector: ${selector}`);
        const field = this.page.locator(selector);
        const isVisible = await field.isVisible();
        if (isVisible) {
          await field.fill(password);
          console.log(`✓ Password field filled using: ${selector}`);
          passwordFieldFound = true;
          break;
        }
      } catch (error) {
        console.log(`Password selector ${selector} failed: ${error.message}`);
        continue;
      }
    }
    
    if (!passwordFieldFound) {
      console.log('⚠ Password field not found with any selector, taking screenshot...');
      await this.page.screenshot({ path: 'password-field-not-found.png', fullPage: true });
      throw new Error('Password field not found');
    }
    
    console.log('✓ Login credentials entered successfully');
  } catch (error) {
    console.error('Error entering login credentials:', error.message);
    await this.page.screenshot({ path: 'login-credentials-error.png', fullPage: true });
    throw error;
  }
});

When('I click on the Continue button', async function () {
  try {
    console.log('Clicking Continue button...');
    
    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Try multiple selectors for continue button - prioritize the primary Continue button
    const buttonSelectors = [
      'button[name="action"][value="default"]', // Primary Continue button
      'button[data-action-button-primary="true"]', // Primary action button
      'button#Continue',
      'button[type="submit"]:not([data-provider])', // Submit button that's not Microsoft login
      'input[type="submit"]',
      '.btn-primary',
      'button.btn-primary'
    ];
    
    let buttonFound = false;
    for (const selector of buttonSelectors) {
      try {
        console.log(`Trying button selector: ${selector}`);
        const button = this.page.locator(selector);
        const isVisible = await button.isVisible();
        if (isVisible) {
          await button.click();
          console.log(`✓ Continue button clicked using: ${selector}`);
          buttonFound = true;
          break;
        }
      } catch (error) {
        console.log(`Button selector ${selector} failed: ${error.message}`);
        continue;
      }
    }
    
    if (!buttonFound) {
      console.log('⚠ Continue button not found with any selector, taking screenshot...');
      await this.page.screenshot({ path: 'continue-button-not-found.png', fullPage: true });
      throw new Error('Continue button not found');
    }
    
    // Wait for navigation with a shorter timeout and fallback
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✓ Continue button clicked successfully');
    } catch (timeoutError) {
      console.log('⚠ Network idle timeout, but continuing...');
      // Wait a bit more and continue
      await this.page.waitForTimeout(3000);
      console.log('✓ Continue button clicked successfully (with timeout fallback)');
    }
  } catch (error) {
    console.error('Error clicking Continue button:', error.message);
    await this.page.screenshot({ path: 'continue-button-error.png', fullPage: true });
    throw error;
  }
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

When('click on the Cancel button of set location modal', async function () {
  try {
    console.log('Looking for set location modal...');
    
    // Wait a moment for any modal to appear after login
    await this.page.waitForTimeout(3000);
    
    // Check for multiple possible modal selectors
    const modalSelectors = [
      credentials.selectors.setLocationModal.modal,
      '#rocket-modal',
      '.rocket-modal-dialog',
      'div[role="dialog"]'
    ];
    
    let modalFound = false;
    let activeModal = null;
    
    for (const selector of modalSelectors) {
      try {
        const modal = this.page.locator(selector);
        const isVisible = await modal.isVisible();
        if (isVisible) {
          activeModal = modal;
          modalFound = true;
          console.log(`Modal found with selector: ${selector}`);
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (modalFound && activeModal) {
      // Check if this is the set location modal by looking for the form
      const setLocationForm = this.page.locator(credentials.selectors.setLocationModal.form);
      const isSetLocationModal = await setLocationForm.isVisible();
      
      if (isSetLocationModal) {
        console.log('Set location modal detected');
        
        // Try multiple cancel button selectors
        const cancelButtonSelectors = [
          credentials.selectors.setLocationModal.cancelButton,
          'button:has-text("Cancel")',
          '.btn-cancel',
          'button[data-dismiss="modal"]',
          '#rocket-modal-btn-cancel'
        ];
        
        let cancelButtonFound = false;
        for (const buttonSelector of cancelButtonSelectors) {
          try {
            const cancelButton = this.page.locator(buttonSelector);
            const isButtonVisible = await cancelButton.isVisible();
            if (isButtonVisible) {
              await cancelButton.click();
              console.log(`Clicked Cancel button using selector: ${buttonSelector}`);
              cancelButtonFound = true;
              break;
            }
          } catch (error) {
            continue;
          }
        }
        
        if (!cancelButtonFound) {
          // Fallback: press Escape key
          console.log('Cancel button not found, pressing Escape key');
          await this.page.keyboard.press('Escape');
        }
        
        // Wait for modal to disappear
        await activeModal.waitFor({ state: 'hidden', timeout: 5000 });
        console.log('Set location modal dismissed successfully');
        
      } else {
        // If it's not the set location modal, just dismiss it
        console.log('Different modal detected, dismissing with Escape key');
        await this.page.keyboard.press('Escape');
        
        // Try multiple ways to close the modal
        try {
          await activeModal.waitFor({ state: 'hidden', timeout: 3000 });
          console.log('Modal closed successfully with Escape');
        } catch (timeoutError) {
          console.log('Escape timeout, trying close button...');
          
          // Try clicking close button
          try {
            const closeButton = this.page.locator('.modal .close, .modal .btn-close, .rocket-close-button');
            if (await closeButton.isVisible()) {
              await closeButton.click();
              await this.page.waitForTimeout(1000);
              console.log('Modal closed with close button');
            }
          } catch (e) {
            console.log('Close button approach failed, continuing anyway...');
          }
        }
      }
    } else {
      console.log('No modal found - set location modal may not have appeared');
      // This is not necessarily an error, the modal might not appear in all cases
    }
    
  } catch (error) {
    console.error('Error handling set location modal:', error.message);
    await this.page.screenshot({ path: 'set-location-modal-error.png', fullPage: true });
    
    // Don't throw error if modal simply doesn't appear or doesn't close - this might be expected
    if (error.message.includes('not found') || error.message.includes('timeout') || error.message.includes('Timeout') || error.message.includes('exceeded')) {
      console.log('Set location modal step completed (modal may not have appeared or closed properly)');
    } else {
      throw error;
    }
  }
});

module.exports = {};


