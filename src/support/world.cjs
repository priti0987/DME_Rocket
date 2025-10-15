const { setWorldConstructor, World } = require('@cucumber/cucumber');

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { config } = require('./config.cjs');
const { expect } = require('playwright/test');

class TestWorld extends World {
  async initBrowser() {
    if (this.browser && this.page) return;
    const artifactsRoot = path.resolve('test-results');
    fs.mkdirSync(artifactsRoot, { recursive: true });

    this.browser = await chromium.launch({ headless: !!config.HEADLESS });
    this.context = await this.browser.newContext({
      recordVideo: { dir: path.join(artifactsRoot, 'videos') },
      ignoreHTTPSErrors: !!config.IGNORE_HTTPS_ERRORS,
    });
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    this.page = await this.context.newPage();
    this.baseUrl = config.BASE_URL;
    this.browserName = 'chromium';
    }

  async ensureOnPatientSearchPage() {
    try {
      // Check if we're already on patient search page by looking for the MRN field
      const mrnFieldVisible = await this.page.locator('input[id="PatientSearchQuery_MRN"]').isVisible();
      
      if (mrnFieldVisible) {
        console.log('Already on patient search page');
        return;
      }

      // Check if we're logged in by looking for the sidebar menu
      const sidebarVisible = await this.page.locator('#dme-sidebar-menu').isVisible();
      
      if (!sidebarVisible) {
        console.log('Not logged in, performing login first...');
        // Perform login steps
        const credentials = require('../../config/credentials.js');
        await this.page.goto(credentials.baseUrl, { waitUntil: 'domcontentloaded' });
        await this.page.fill(credentials.selectors.username, credentials.email);
        await this.page.fill(credentials.selectors.password, credentials.password);
        await this.page.click(credentials.selectors.continueButton);
        await this.page.waitForLoadState('networkidle');
        
        // Dismiss any popup
        await this.page.waitForTimeout(2000);
        const modalDialog = this.page.locator('#rocket-modal').first();
        const isModalVisible = await modalDialog.isVisible();
        if (isModalVisible) {
          const cancelButton = this.page.locator(credentials.selectors.modalCancelButton);
          if (await cancelButton.isVisible()) {
            await cancelButton.click();
          } else {
            await this.page.keyboard.press('Escape');
          }
          await modalDialog.waitFor({ state: 'hidden', timeout: 5000 });
        }
      }

      // Now navigate to patient search page
      console.log('Navigating to patient search page...');
      
      // Look for Patient Search link or navigate directly
      const patientSearchLink = this.page.locator('a:has-text("Patient Search"), [href*="patient"], [href*="search"]');
      const linkVisible = await patientSearchLink.isVisible();
      
      if (linkVisible) {
        await patientSearchLink.first().click();
        await this.page.waitForLoadState('networkidle');
      } else {
        // If we can't find a link, we might already be on the right page
        // Check current URL
        const currentUrl = this.page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // If URL doesn't contain patient search indicators, we might need to navigate differently
        if (!currentUrl.includes('patient') && !currentUrl.includes('search')) {
          console.log('Assuming we are on the patient search page based on current context');
        }
      }

      // Wait for the MRN field to be available
      await this.page.waitForSelector('input[id="PatientSearchQuery_MRN"], input[name="PatientSearchQuery_MRN"]', { 
        state: 'visible', 
        timeout: 10000 
      });
      
      console.log('Successfully navigated to patient search page');
      
    } catch (error) {
      console.error('Error ensuring on patient search page:', error.message);
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'patient-search-navigation-error.png', fullPage: true });
      throw error;
    }
    }
  async selectFromDropdown(page, selector, value, fieldName) {
    console.log(`Selecting ${value} in ${fieldName} dropdown using ${selector}..`);
  try {
    
    await page.waitForSelector(selector);
    console.log(`Dropdown ${fieldName} is visible.`);
    // Use selectOption to choose the value
    const locator = page.locator(selector);
    await locator.selectOption({ label: value });
    console.log(`Selected ${fieldName}: ${value}`);
    // Optionally add further verification
  } catch (error) {
    console.error(`Error selecting ${fieldName}:`, error.message);
    await page.screenshot({ path: `${fieldName}-select-error.png`, fullPage: true });
    throw error;
  }
    }
/**
 * Fills an input field, waits for visibility, verifies entry, and handles errors/screenshots.
 * @param {import('@playwright/test').Page} page - Playwright page instance.
 * @param {string} selector - Selector for the field to fill.
 * @param {string} value - Value to enter.
 * @param {string} fieldName - Short name for logging and screenshot.
 */

  async hoverLeftMenuBar() {
    console.log('Hovering over the left menu bar to ensure visibility...');
      try {
        const leftPanel = this.page.locator('//div[@id="dme-sidebar-menu"]');
        console.log('Locator for sidebar menu:', leftPanel);
        await expect(leftPanel).toBeVisible({ timeout: 1000 });
        if (await leftPanel.isVisible()) {
            await this.page.locator('//div[@id="dme-sidebar-menu"]').hover();
            console.log('Sidebar menu was hidden, hovered to reveal it.');
        } 
      } catch (error) {
        console.error('Error locating the sidebar menu:', error);
        console.log('Attempting to click the sidebar toggle button as a fallback.');
      }
           

    }
  async clickOnText(menuItem) {
        try {
          console.log(`Navigating to menu item: ${menuItem}`);
          const locator = `//*[text()="${menuItem}"]`;
          const menu = await this.page.locator(locator);
          console.log('Locator for menu......:', menu);
          if (await menu.isVisible()) {
            await menu.click();
            console.log(`Clicked the ${menuItem} `);
        }
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000); // Wait for 2 seconds to ensure page loads
        } catch (error) {
          console.error(`Error clicking the ${menuItem} menu:`, error);
        }

    }

  async elementISVisibleOnPage(locator,pageName){    try {
        
        await this.page.waitForLoadState('networkidle');    
        if (await locator.isVisible())
          {
        console.log(`Successfully navigated to the ${pageName} page, And ${locator} is visible`); 
          }

    } catch (error) {
        console.error(`Error verifying the ${pageName} page:`, error);
    }}    

  async clickElementByClass(className, elementDescription) {

        try {
        const newSupplierButton = this.page.locator(`//a[contains(@class,"${className}")]`);
        if (await newSupplierButton.isVisible()){
            await newSupplierButton.click();
            console.log(`Clicked on the ${elementDescription}`);
        }
    } catch (error) {
        console.log(`Error clicking the ${elementDescription}:`, error);
    }

    }
    /**
 * Checks if any selector in the array matches a visible element on the page.
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string[]} selectors - Array of CSS or locator selectors
 * @param {string} elementName - Friendly name for logging (e.g., "Supplier page element")
 * @returns {Promise<boolean>} True if at least one selector matches a visible element
 */
  async checkPageElementsVisible(page, selectors, elementName = 'page element') {
  let elementFound = false;

  for (const selector of selectors) {
    try {
      console.log(`Trying ${elementName} selector: ${selector}`);
      const element = page.locator(selector);
      const isVisible = await element.isVisible();

      if (isVisible) {
        console.log(`Found ${elementName}: ${selector}`);
        elementFound = true;
        break;
      }
    } catch (error) {
      console.log(`${elementName} selector ${selector} failed: ${error.message}`);
      continue;
    }
  }

  if (!elementFound) {
    console.log(`⚠ ${elementName}s not found, but URL is correct`);
  }

  return elementFound;
  }  
  async fillAndVerifyField(page, selector, value, fieldName) {
  try {
    const fieldLocator = page.locator(selector);
    console.log(`Locator for ${fieldName} field:`, fieldLocator);

    await fieldLocator.waitFor({ state: 'visible', timeout: 10000 });
    await fieldLocator.fill('');
    console.log(`Filling ${fieldName} with value: ${value}`);
    await fieldLocator.fill(value);

    // Verify the value was entered correctly
    const enteredValue = await fieldLocator.inputValue();
    expect(enteredValue).toBe(value);

    console.log(`Entered ${fieldName}: ${value}`);
  } catch (error) {
    console.error(`Error entering ${fieldName}:`, error.message);
    await page.screenshot({ path: `${fieldName}-entry-error.png`, fullPage: true });
    throw error;
  }
  await page.waitForTimeout(100); // Wait a moment to ensure all elements are loaded
}
/**
 * Clicks the first element in the array that is visible and enabled.
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string[]} selectors - Array of Playwright selectors/locator strings
 * @param {string} elementName - Friendly name for logging
 * @returns {Promise<boolean>} True if an element was clicked, otherwise false
 */
async clickFirstVisibleEnabled(page, selectors, elementName = 'element') {
  await page.waitForLoadState('networkidle');
  for (const selector of selectors) {
  await page.waitForTimeout(1000); // Wait a moment to ensure all elements are loaded
 
    try {
      console.log(`Trying ${elementName} selector: ${selector}`);
      const element = await page.locator(selector);

      // Wait for the element, but don't throw if not found
      if (await element.isVisible() && await element.isEnabled()) {
        await element.click();
        console.log(`Clicked ${elementName}: ${selector}`);
        return true;
      }
    } catch (error) {
      console.log(`${elementName} selector ${selector} failed: ${error.message}`);
      continue;
    }
  }
  console.log(`⚠ No visible and enabled ${elementName} found to click.`);
  return false;
}

async clickLocator(locator, description) {
  try {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    const element = this.page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.click();
    console.log(`Clicked on ${description} (${locator})`);
  } catch (error) {
    console.error(`Error clicking on ${description} (${locator}):`, error);
    await this.page.screenshot({ path: `${description.replace(/\s+/g, '_')}-click-error.png`, fullPage: true });
    throw error;
  } };



  

}

setWorldConstructor(TestWorld);
