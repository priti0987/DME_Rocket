const fs = require('fs');
const path = require('path');

/**
 * Utility class for reading test data from JSON files
 */
class TestDataReader {
  /**
   * Read test data from a JSON file
   * @param {string} fileName - Name of the JSON file (without extension)
   * @param {string} dataPath - Optional path within the JSON structure (dot notation)
   * @returns {any} - Parsed JSON data or specific data path
   */
  static readData(fileName, dataPath = null) {
    try {
      const filePath = path.resolve('TestData', `${fileName}.json`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Test data file not found: ${filePath}`);
      }
      
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(rawData);
      
      if (dataPath) {
        return this.getNestedValue(jsonData, dataPath);
      }
      
      return jsonData;
    } catch (error) {
      console.error(`Error reading test data from ${fileName}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get nested value from object using dot notation
   * @param {object} obj - Object to search in
   * @param {string} path - Dot notation path (e.g., 'patientSearch.MRN')
   * @returns {any} - Value at the specified path
   */
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      throw new Error(`Path '${path}' not found in test data`);
    }, obj);
  }
  
  /**
   * Get patient search data
   * @returns {object} - Patient search test data
   */
  static getPatientSearchData() {
    return this.readData('patientSearchData', 'patientSearch');
  }
  
  /**
   * Get MRN for patient search
   * @param {string} scenario - Scenario type (validMRN, invalidMRN, partialMRN)
   * @returns {string} - MRN value
   */
  static getMRN(scenario = 'validMRN') {
    const searchData = this.getPatientSearchData();
    
    if (scenario === 'primary') {
      return searchData.MRN;
    }
    
    if (searchData.searchCriteria.testScenarios[scenario]) {
      return searchData.searchCriteria.testScenarios[scenario];
    }
    
    // Default to primary MRN
    return searchData.MRN;
  }
  
  /**
   * Get alternative MRNs for testing
   * @returns {array} - Array of alternative MRN values
   */
  static getAlternativeMRNs() {
    return this.readData('patientSearchData', 'patientSearch.searchCriteria.alternativeMRNs');
  }

  // Order Creation Data Methods
  
  /**
   * Get order creation data
   * @param {string} type - Order type (default, urgent, standard, rush)
   * @returns {object} - Order creation data
   */
  static getOrderData(type = 'default') {
    const data = this.readData('orderCreationData', 'orderCreation');
    switch (type) {
      case 'default':
        return data.defaultOrder;
      case 'urgent':
        return data.testScenarios.urgentOrder;
      case 'standard':
        return data.testScenarios.standardOrder;
      case 'rush':
        return data.testScenarios.rushOrder;
      default:
        return data.defaultOrder;
    }
  }

  /**
   * Get available order types
   * @returns {array} - Array of order types
   */
  static getOrderTypes() {
    return this.readData('orderCreationData', 'orderCreation.orderTypes');
  }

  /**
   * Get available physicians
   * @returns {array} - Array of physicians
   */
  static getPhysicians() {
    return this.readData('orderCreationData', 'orderCreation.physicians');
  }

  /**
   * Get available priorities
   * @returns {array} - Array of priorities
   */
  static getPriorities() {
    return this.readData('orderCreationData', 'orderCreation.priorities');
  }

  /**
   * Get validation messages
   * @returns {object} - Validation messages
   */
  static getValidationMessages() {
    return this.readData('orderCreationData', 'orderCreation.validationMessages');
  }
}

module.exports = TestDataReader;
