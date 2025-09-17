/**
 * Data Generator Utility for creating dynamic test data
 */

const fs = require('fs');
const path = require('path');

class DataGenerator {
  // Static property to store current session data
  static sessionData = {
    currentMRN: null,
    currentPatientData: null,
    currentInsuranceData: null,
    currentOrderData: null
  };
  /**
   * Generate random integer with specified length
   * @param {number} length - Number of digits
   * @returns {string} - Random integer as string
   */
  static randomInt(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * Generate random alphabetic string
   * @param {number} length - Number of characters
   * @returns {string} - Random alphabetic string
   */
  static randomAlpha(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate dynamic MRN for patient creation
   * Format: MRNQA + 4-digit random number
   * @returns {string} - Generated MRN
   */
  static generateMRN() {
    return `MRNQA${this.randomInt(4)}`;
  }

  /**
   * Generate dynamic First Name for patient creation
   * Format: QAFirstName + 3 random alphabets
   * @returns {string} - Generated First Name
   */
  static generateFirstName() {
    return `QAFirstName${this.randomAlpha(3)}`;
  }

  /**
   * Generate dynamic Last Name for patient creation
   * Format: QALastName + 3 random alphabets
   * @returns {string} - Generated Last Name
   */
  static generateLastName() {
    return `QALastName${this.randomAlpha(3)}`;
  }

  /**
   * Generate dynamic Policy Number for insurance
   * Format: POLQA + 4-digit random number
   * @returns {string} - Generated Policy Number
   */
  static generatePolicyNumber() {
    return `POLQA${this.randomInt(4)}`;
  }

  /**
   * Generate dynamic Group Number for insurance
   * Format: GRPQA + 4-digit random number
   * @returns {string} - Generated Group Number
   */
  static generateGroupNumber() {
    return `GRPQA${this.randomInt(4)}`;
  }

  /**
   * Generate a complete patient data object and store it in session
   * @returns {object} - Patient data with all required fields
   */
  static generatePatientData() {
    const patientData = {
      mrn: this.generateMRN(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      dateOfBirth: '10/10/2000',
      client: 'Beaufort Orthopaedic Sports & Spine',
      language: 'English'
    };
    
    // Store in session for later retrieval
    this.sessionData.currentMRN = patientData.mrn;
    this.sessionData.currentPatientData = patientData;
    
    // Also save to file for persistence across test runs
    this.saveToFile('patientData', patientData);
    
    return patientData;
  }

  /**
   * Get the current MRN from session or file
   * @returns {string|null} - Current MRN or null if not found
   */
  static getCurrentMRN() {
    if (this.sessionData.currentMRN) {
      return this.sessionData.currentMRN;
    }
    
    // Try to load from file
    const patientData = this.loadFromFile('patientData');
    if (patientData && patientData.mrn) {
      this.sessionData.currentMRN = patientData.mrn;
      this.sessionData.currentPatientData = patientData;
      return patientData.mrn;
    }
    
    return null;
  }

  /**
   * Get the current patient data from session or file
   * @returns {object|null} - Current patient data or null if not found
   */
  static getCurrentPatientData() {
    if (this.sessionData.currentPatientData) {
      return this.sessionData.currentPatientData;
    }
    
    // Try to load from file
    const patientData = this.loadFromFile('patientData');
    if (patientData) {
      this.sessionData.currentPatientData = patientData;
      this.sessionData.currentMRN = patientData.mrn;
      return patientData;
    }
    
    return null;
  }

  /**
   * Generate a complete insurance data object and store it in session
   * @returns {object} - Insurance data with all required fields
   */
  static generateInsuranceData() {
    const insuranceData = {
      provider: 'Medicare Part A and B',
      policyNumber: this.generatePolicyNumber(),
      groupNumber: this.generateGroupNumber(),
      isPatientPolicyOwner: true,
      deductible: {
        individualInNet: '100',
        individualRemainingInNet: '100',
        familyInNet: '100',
        familyRemainingInNet: '100'
      },
      outOfPocket: {
        individualInNet: '100',
        individualRemainingInNet: '100',
        familyInNet: '100',
        familyRemainingInNet: '100'
      },
      coinsurance: '100'
    };
    
    // Store in session for later retrieval
    this.sessionData.currentInsuranceData = insuranceData;
    
    // Also save to file for persistence
    this.saveToFile('insuranceData', insuranceData);
    
    return insuranceData;
  }

  /**
   * Generate order data with dynamic content
   * @returns {object} - Order data with all required fields
   */
  static generateOrderData() {
    const currentDate = new Date();
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    
    const orderData = {
      dateOfService: formattedDate,
      notes: `QA Order created on ${formattedDate} - MRN: ${this.getCurrentMRN() || 'N/A'} - Test ID: ${this.randomAlpha(4)}${this.randomInt(3)}`
    };
    
    // Store in session for later retrieval
    this.sessionData.currentOrderData = orderData;
    
    // Also save to file for persistence
    this.saveToFile('orderData', orderData);
    
    return orderData;
  }

  /**
   * Save data to file in TestData directory
   * @param {string} dataType - Type of data (patientData, insuranceData, orderData)
   * @param {object} data - Data to save
   */
  static saveToFile(dataType, data) {
    try {
      const testDataDir = path.join(process.cwd(), 'TestData');
      
      // Ensure TestData directory exists
      if (!fs.existsSync(testDataDir)) {
        fs.mkdirSync(testDataDir, { recursive: true });
      }
      
      const filePath = path.join(testDataDir, `${dataType}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✓ Saved ${dataType} to ${filePath}`);
    } catch (error) {
      console.warn(`⚠ Failed to save ${dataType} to file:`, error.message);
    }
  }

  /**
   * Load data from file in TestData directory
   * @param {string} dataType - Type of data to load
   * @returns {object|null} - Loaded data or null if not found
   */
  static loadFromFile(dataType) {
    try {
      const testDataDir = path.join(process.cwd(), 'TestData');
      const filePath = path.join(testDataDir, `${dataType}.json`);
      
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✓ Loaded ${dataType} from ${filePath}`);
        return data;
      }
    } catch (error) {
      console.warn(`⚠ Failed to load ${dataType} from file:`, error.message);
    }
    
    return null;
  }

  /**
   * Clear all session data and files
   */
  static clearSessionData() {
    this.sessionData = {
      currentMRN: null,
      currentPatientData: null,
      currentInsuranceData: null,
      currentOrderData: null
    };
    
    // Also clear files
    const dataTypes = ['patientData', 'insuranceData', 'orderData'];
    dataTypes.forEach(dataType => {
      try {
        const testDataDir = path.join(process.cwd(), 'TestData');
        const filePath = path.join(testDataDir, `${dataType}.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✓ Cleared ${dataType} file`);
        }
      } catch (error) {
        console.warn(`⚠ Failed to clear ${dataType} file:`, error.message);
      }
    });
  }

  /**
   * Generate random email address
   * @param {string} domain - Email domain (default: 'test.com')
   * @returns {string} - Generated email address
   */
  static generateEmail(domain = 'test.com') {
    const username = `qa${this.randomAlpha(3).toLowerCase()}${this.randomInt(3)}`;
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   * Format: (XXX) XXX-XXXX
   * @returns {string} - Generated phone number
   */
  static generatePhoneNumber() {
    const areaCode = this.randomInt(3);
    const exchange = this.randomInt(3);
    const number = this.randomInt(4);
    return `(${areaCode}) ${exchange}-${number}`;
  }

  /**
   * Generate random address
   * @returns {object} - Address object with street, city, state, zip
   */
  static generateAddress() {
    const streetNumber = this.randomInt(4);
    const streetName = `QA Street ${this.randomAlpha(3)}`;
    const cities = ['QA City', 'Test Town', 'Demo District'];
    const states = ['CA', 'NY', 'TX', 'FL', 'IL'];
    
    return {
      street: `${streetNumber} ${streetName}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zip: this.randomInt(5)
    };
  }
}

module.exports = DataGenerator;
