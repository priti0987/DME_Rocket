const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { config } = require('./config.cjs');

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
}

setWorldConstructor(TestWorld);
