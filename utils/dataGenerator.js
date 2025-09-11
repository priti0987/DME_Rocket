/**
 * Data Generator Utility for creating dynamic test data
 */

class DataGenerator {
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
   * Generate a complete patient data object
   * @returns {object} - Patient data with all required fields
   */
  static generatePatientData() {
    return {
      mrn: this.generateMRN(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      dateOfBirth: '10/10/2000',
      client: 'Beaufort Orthopaedic Sports & Spine',
      language: 'English'
    };
  }

  /**
   * Generate a complete insurance data object
   * @returns {object} - Insurance data with all required fields
   */
  static generateInsuranceData() {
    return {
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
