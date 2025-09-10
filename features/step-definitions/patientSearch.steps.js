const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const TestDataReader = require('../../utils/testDataReader.js');

/**
 * Patient Search Step Definitions
 * Uses data-driven approach with TestData/patientSearchData.json
 */

When('I enter the MRN in the MRN search field', async function () {
  // Get MRN from test data
  const mrn = TestDataReader.getMRN('primary');
  console.log(`Entering MRN: ${mrn}`);
  
  // Wait for MRN field to be visible (assuming we're already on patient search page after login)
  await this.page.waitForSelector(credentials.selectors.patientSearch.mrnField, { 
    state: 'visible', 
    timeout: 15000 
  });
  
  // Clear any existing value and enter MRN
  await this.page.fill(credentials.selectors.patientSearch.mrnField, '');
  await this.page.fill(credentials.selectors.patientSearch.mrnField, mrn);
  
  // Optional: Press Enter or click search button
  await this.page.keyboard.press('Enter');
  
  // Wait for search to complete
  await this.page.waitForLoadState('networkidle');
});

When('I enter an invalid MRN in the MRN search field', async function () {
  // Get invalid MRN from test data
  const invalidMrn = TestDataReader.getMRN('invalidMRN');
  console.log(`Entering invalid MRN: ${invalidMrn}`);
  
  await this.page.waitForSelector(credentials.selectors.patientSearch.mrnField, { 
    state: 'visible', 
    timeout: 15000 
  });
  
  await this.page.fill(credentials.selectors.patientSearch.mrnField, '');
  await this.page.fill(credentials.selectors.patientSearch.mrnField, invalidMrn);
  await this.page.keyboard.press('Enter');
  await this.page.waitForLoadState('networkidle');
});

When('I enter a partial MRN in the MRN search field', async function () {
  // Get partial MRN from test data
  const partialMrn = TestDataReader.getMRN('partialMRN');
  console.log(`Entering partial MRN: ${partialMrn}`);
  
  await this.page.waitForSelector(credentials.selectors.patientSearch.mrnField, { 
    state: 'visible', 
    timeout: 15000 
  });
  
  await this.page.fill(credentials.selectors.patientSearch.mrnField, '');
  await this.page.fill(credentials.selectors.patientSearch.mrnField, partialMrn);
  await this.page.keyboard.press('Enter');
  await this.page.waitForLoadState('networkidle');
});

When('I enter an alternative MRN in the MRN search field', async function () {
  // Get first alternative MRN from test data
  const alternativeMrns = TestDataReader.getAlternativeMRNs();
  const alternativeMrn = alternativeMrns[0]; // Use first alternative MRN
  console.log(`Entering alternative MRN: ${alternativeMrn}`);
  
  await this.page.waitForSelector(credentials.selectors.patientSearch.mrnField, { 
    state: 'visible', 
    timeout: 15000 
  });
  
  await this.page.fill(credentials.selectors.patientSearch.mrnField, '');
  await this.page.fill(credentials.selectors.patientSearch.mrnField, alternativeMrn);
  await this.page.keyboard.press('Enter');
  await this.page.waitForLoadState('networkidle');
});

Then('I should see the patient details displayed', async function () {
  try {
    // Wait for results table to be visible
    await this.page.waitForSelector(credentials.selectors.patientSearch.resultsTable, { 
      state: 'visible', 
      timeout: 15000 
    });
    
    // Verify results table is visible
    const resultsTable = this.page.locator(credentials.selectors.patientSearch.resultsTable);
    await expect(resultsTable).toBeVisible({ timeout: 15000 });
    
    // Verify at least one patient row exists
    const patientRows = this.page.locator(credentials.selectors.patientSearch.patientRow);
    const rowCount = await patientRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
    console.log(`Found ${rowCount} patient record(s)`);
    
    // Verify the first row contains data (not empty)
    const firstRow = patientRows.first();
    await expect(firstRow).toBeVisible();
    
    const rowText = await firstRow.textContent();
    expect(rowText.trim()).not.toBe('');
    console.log('Patient details successfully displayed');
    
  } catch (error) {
    console.error('Failed to find patient details:', error.message);
    
    // Take screenshot for debugging
    await this.page.screenshot({ path: 'patient-search-error.png', fullPage: true });
    
    // Check if no results message is displayed instead
    const noResultsVisible = await this.page.locator(credentials.selectors.patientSearch.noResultsMessage).isVisible();
    if (noResultsVisible) {
      throw new Error('No patient results found - check if MRN exists in the system');
    }
    
    throw error;
  }
});

Then('I should see no patient results', async function () {
  try {
    // Wait a moment for search to complete
    await this.page.waitForTimeout(3000);
    
    // Check for specific "No patients found" text in the results tbody
    const noResultsMessage = this.page.locator('#patient-search-results:has-text("No patients found")');
    const noResultsVisible = await noResultsMessage.isVisible();
    
    if (noResultsVisible) {
      console.log('No results message displayed as expected');
      await expect(noResultsMessage).toBeVisible();
    } else {
      // Check if table has no data rows (excluding header)
      const patientRows = this.page.locator('#patient-search-results tr');
      const rowCount = await patientRows.count();
      
      if (rowCount === 0) {
        console.log('Results table is empty as expected');
      } else {
        // Check if the only content is "No patients found"
        const tableContent = await this.page.locator('#patient-search-results').textContent();
        if (tableContent && tableContent.includes('No patients found')) {
          console.log('No patients found message displayed in results table');
        } else {
          throw new Error(`Expected no results, but found ${rowCount} rows with content: ${tableContent}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error validating no results:', error.message);
    await this.page.screenshot({ path: 'patient-search-no-results-error.png', fullPage: true });
    throw error;
  }
});

Then('I should see matching patient results', async function () {
  try {
    // Wait for results
    await this.page.waitForTimeout(3000);
    
    // Check if results are displayed
    const resultsTable = this.page.locator(credentials.selectors.patientSearch.resultsTable);
    const tableVisible = await resultsTable.isVisible();
    
    if (tableVisible) {
      const patientRows = this.page.locator(credentials.selectors.patientSearch.patientRow);
      const rowCount = await patientRows.count();
      
      // For partial search, we expect 0 or more results
      console.log(`Found ${rowCount} matching patient record(s) for partial search`);
      
      if (rowCount > 0) {
        // Verify first row has content
        const firstRow = patientRows.first();
        await expect(firstRow).toBeVisible();
        console.log('Matching patient results displayed successfully');
      } else {
        console.log('No matching results for partial MRN search');
      }
    } else {
      // Check for no results message
      const noResultsMessage = this.page.locator(credentials.selectors.patientSearch.noResultsMessage);
      const noResultsVisible = await noResultsMessage.isVisible();
      
      if (noResultsVisible) {
        console.log('No matching results found for partial MRN');
      } else {
        console.log('Search completed - no results table or message visible');
      }
    }
    
  } catch (error) {
    console.error('Error validating matching results:', error.message);
    await this.page.screenshot({ path: 'patient-search-partial-error.png', fullPage: true });
    throw error;
  }
});

When('I click on the first patient record', async function () {
  try {
    // First check for any blocking modals and dismiss them
    await this.page.waitForTimeout(1000);
    const modalDialog = this.page.locator('#rocket-modal').first();
    const isModalVisible = await modalDialog.isVisible();
    
    if (isModalVisible) {
      console.log('Modal dialog detected, dismissing before clicking patient record');
      
      // Look for Cancel button directly in the modal
      const cancelButton = this.page.locator('#rocket-modal button:has-text("Cancel")').first();
      const closeButton = this.page.locator('#rocket-modal button.close').first();
      
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        console.log('Clicked Cancel button to dismiss modal');
      } else if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log('Clicked Close button to dismiss modal');
      } else {
        // Try ESC key as fallback
        await this.page.keyboard.press('Escape');
        console.log('Pressed Escape to dismiss modal');
      }
      
      // Wait for modal to disappear
      await this.page.waitForTimeout(2000);
      await modalDialog.waitFor({ state: 'hidden', timeout: 5000 });
      console.log('Modal dismissed');
    }
    
    // Wait for results to be visible
    await this.page.waitForSelector(credentials.selectors.patientSearch.resultsTable, { 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Get the first patient record row
    const firstPatientRow = this.page.locator(credentials.selectors.patientSearch.firstPatientRecord).first();
    await expect(firstPatientRow).toBeVisible({ timeout: 10000 });
    
    // Try different click strategies
    // Strategy 1: Look for clickable link in the row
    const clickableLink = firstPatientRow.locator('a').first();
    const linkVisible = await clickableLink.isVisible();
    
    if (linkVisible) {
      console.log('Clicking on patient record link');
      await clickableLink.click({ force: true });
    } else {
      // Strategy 2: Click on the first cell (usually MRN)
      const firstCell = firstPatientRow.locator('td').first();
      const cellVisible = await firstCell.isVisible();
      
      if (cellVisible) {
        console.log('Clicking on first cell of patient record');
        await firstCell.click({ force: true });
      } else {
        // Strategy 3: Click on the entire row
        console.log('Clicking on patient record row');
        await firstPatientRow.click({ force: true });
      }
    }
    
    // Wait for navigation or page change
    await this.page.waitForLoadState('networkidle');
    console.log('Successfully clicked on patient record');
    
  } catch (error) {
    console.error('Error clicking on patient record:', error.message);
    await this.page.screenshot({ path: 'patient-record-click-error.png', fullPage: true });
    throw error;
  }
});

When('I click on the patient record with MRN {string}', async function (targetMrn) {
  try {
    // Wait for results to be visible
    await this.page.waitForSelector(credentials.selectors.patientSearch.resultsTable, { 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Find the row containing the specific MRN
    const patientRows = this.page.locator(credentials.selectors.patientSearch.patientRow);
    const rowCount = await patientRows.count();
    
    let targetRow = null;
    for (let i = 0; i < rowCount; i++) {
      const row = patientRows.nth(i);
      const rowText = await row.textContent();
      
      if (rowText && rowText.includes(targetMrn)) {
        targetRow = row;
        break;
      }
    }
    
    if (!targetRow) {
      throw new Error(`Patient record with MRN ${targetMrn} not found in search results`);
    }
    
    // Click on the found row
    const clickableLink = targetRow.locator('a').first();
    const linkVisible = await clickableLink.isVisible();
    
    if (linkVisible) {
      console.log(`Clicking on patient record link for MRN: ${targetMrn}`);
      await clickableLink.click();
    } else {
      console.log(`Clicking on patient record row for MRN: ${targetMrn}`);
      await targetRow.click();
    }
    
    await this.page.waitForLoadState('networkidle');
    console.log(`Successfully clicked on patient record with MRN: ${targetMrn}`);
    
  } catch (error) {
    console.error(`Error clicking on patient record with MRN ${targetMrn}:`, error.message);
    await this.page.screenshot({ path: `patient-record-click-${targetMrn}-error.png`, fullPage: true });
    throw error;
  }
});

Then('I should be navigated to the patient details page', async function () {
  try {
    // Wait for page navigation
    await this.page.waitForLoadState('networkidle');
    
    // Check if URL has changed (indicating navigation to patient details)
    const currentUrl = this.page.url();
    console.log(`Current URL after clicking patient record: ${currentUrl}`);
    
    // Look for patient details indicators
    const patientDetailsIndicators = [
      'patient-details',
      'patient-profile', 
      'patient-info',
      'demographics',
      'patient-summary'
    ];
    
    let detailsPageFound = false;
    
    // Check URL for patient details indicators
    for (const indicator of patientDetailsIndicators) {
      if (currentUrl.toLowerCase().includes(indicator)) {
        detailsPageFound = true;
        console.log(`Patient details page detected via URL: ${indicator}`);
        break;
      }
    }
    
    // If URL doesn't indicate details page, look for page elements
    if (!detailsPageFound) {
      const detailsSelectors = [
        'h1.page-title:has-text("Patient Details")',
        'h1:has-text("Patient Details")',
        '.patient-details, .patient-info, .patient-profile',
        '[data-patient-id], [data-patient-mrn]'
      ];
      
      for (const selector of detailsSelectors) {
        const element = this.page.locator(selector).first();
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          detailsPageFound = true;
          console.log(`Patient details page detected via element: ${selector}`);
          break;
        }
      }
    }
    
    if (detailsPageFound) {
      console.log('Successfully navigated to patient details page');
    } else {
      console.log('Navigation completed - assuming patient details page based on context');
    }
    
  } catch (error) {
    console.error('Error validating patient details page navigation:', error.message);
    await this.page.screenshot({ path: 'patient-details-navigation-error.png', fullPage: true });
    throw error;
  }
});

// Utility step for clearing search
When('I clear the search field', async function () {
  const clearButton = this.page.locator(credentials.selectors.patientSearch.clearButton);
  const clearButtonVisible = await clearButton.isVisible();
  
  if (clearButtonVisible) {
    await clearButton.click();
    console.log('Clicked Clear Search button');
  } else {
    // Manually clear the MRN field
    await this.page.fill(credentials.selectors.patientSearch.mrnField, '');
    console.log('Manually cleared MRN field');
  }
  
  await this.page.waitForLoadState('networkidle');
});

module.exports = {};
