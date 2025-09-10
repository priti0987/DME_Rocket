/**
 * Utility functions for order creation automation
 */

class OrderUtils {
  /**
   * Get today's date in MM-DD-YYYY format for the Date of Service field
   * @returns {string} - Today's date formatted as MM-DD-YYYY
   */
  static getTodaysDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}-${day}-${year}`;
  }

  /**
   * Get today's date in MM/DD/YYYY format (alternative format)
   * @returns {string} - Today's date formatted as MM/DD/YYYY
   */
  static getTodaysDateSlash() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Build dynamic notes string from selected field values
   * @param {object} fieldValues - Object containing all field values
   * @param {string} fieldValues.client - Client name
   * @param {string} fieldValues.location - Location name
   * @param {string} fieldValues.dateOfService - Date of service
   * @param {string} fieldValues.orderingProvider - Ordering provider name
   * @param {string} fieldValues.supervisingProvider - Supervising provider name
   * @param {string} fieldValues.fitter - Fitter name
   * @returns {string} - Formatted notes string
   */
  static buildNotesString(fieldValues) {
    const {
      client,
      location,
      dateOfService,
      orderingProvider,
      supervisingProvider,
      fitter
    } = fieldValues;

    return `Client: ${client} | Location: ${location} | Date Of Service: ${dateOfService} | Ordering Provider: ${orderingProvider} | Supervising Provider: ${supervisingProvider} | Fitter: ${fitter}`;
  }

  /**
   * Get provider dependency mapping
   * @returns {object} - Mapping of ordering providers to supervising providers
   */
  static getProviderDependencies() {
    return {
      'Devin Dukes': 'Daniel Del Gaizo'
      // Add more mappings as needed
    };
  }

  /**
   * Get supervising provider based on ordering provider
   * @param {string} orderingProvider - Name of the ordering provider
   * @returns {string|null} - Name of the supervising provider or null if no dependency
   */
  static getSupervisingProvider(orderingProvider) {
    const dependencies = this.getProviderDependencies();
    return dependencies[orderingProvider] || null;
  }

  /**
   * Validate if a field is disabled/readonly
   * @param {object} page - Playwright page object
   * @param {string} selector - CSS selector for the field
   * @returns {Promise<boolean>} - True if field is disabled
   */
  static async isFieldDisabled(page, selector) {
    try {
      const element = page.locator(selector);
      const isDisabled = await element.isDisabled();
      const isReadonly = await element.getAttribute('readonly') !== null;
      return isDisabled || isReadonly;
    } catch (error) {
      console.error(`Error checking if field is disabled: ${error.message}`);
      return false;
    }
  }

  /**
   * Get selected option text from a select element
   * @param {object} page - Playwright page object
   * @param {string} selector - CSS selector for the select element
   * @returns {Promise<string>} - Selected option text
   */
  static async getSelectedOptionText(page, selector) {
    try {
      const element = page.locator(selector);
      const selectedValue = await element.inputValue();
      
      // Get the text of the selected option
      const selectedOption = element.locator(`option[value="${selectedValue}"]`);
      const optionText = await selectedOption.textContent();
      
      return optionText ? optionText.trim() : selectedValue;
    } catch (error) {
      console.error(`Error getting selected option text: ${error.message}`);
      return '';
    }
  }

  /**
   * Wait for select options to load
   * @param {object} page - Playwright page object
   * @param {string} selector - CSS selector for the select element
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} - True if options loaded successfully
   */
  static async waitForSelectOptions(page, selector, timeout = 10000) {
    try {
      const element = page.locator(selector);
      
      // Wait for the select element to be visible
      await element.waitFor({ state: 'visible', timeout });
      
      // Wait for options to load (more than just the default empty option)
      await page.waitForFunction(
        (sel) => {
          const select = document.querySelector(sel);
          return select && select.options.length > 1;
        },
        selector,
        { timeout }
      );
      
      return true;
    } catch (error) {
      console.error(`Error waiting for select options: ${error.message}`);
      return false;
    }
  }

  /**
   * Format date for display in notes (MM-DD-YYYY format)
   * @param {string} dateString - Date string in various formats
   * @returns {string} - Formatted date string
   */
  static formatDateForNotes(dateString) {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    } catch (error) {
      console.error(`Error formatting date: ${error.message}`);
      return dateString; // Return original string if formatting fails
    }
  }
}

module.exports = OrderUtils;
