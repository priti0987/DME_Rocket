const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const OrderUtils = require('../../utils/orderUtils.js');
const TestDataReader = require('../../utils/testDataReader.js');
const { SupplierPage } = require('../../src/pages/supplier.js');
const DataGenerator = require('../../utils/dataGenerator.js');
const myFunctions = require('../../src/support/world.cjs');
const { Console } = require('console');

let generatedsupplierData = {};
Given('I navigate to {string} from the main menu', async function (menuItem) {
    console.log(`Navigating to ${menuItem} from the main menu`)
    await this.hoverLeftMenuBar();
    console.log(`Clicking the ${menuItem} dropdownmenu`);
    await this.clickOnText(menuItem);

    });
When('I select {string} from the dropdown', async function (string) {
    console.log(`I select ${string} from the dropdown`);
    await this.clickOnText(string);
});
Then('I should be on the {string} page', async function (pageName) {
    console.log(`I should be on the ${pageName} page.`);
    const supplierSearchText = this.page.locator('//b[contains(text(),"Supplier Search")]');
    const newSupplierButton = this.page.locator('//a[contains(@class,"btn-add btn")]');
       
    await this.elementISVisibleOnPage(supplierSearchText,pageName );
    await this.elementISVisibleOnPage(newSupplierButton,pageName );

});


When('I click on new Supplier button', async function () {
    console.log(`I click on new supplier button`);

    await this.clickElementByClass('btn-add btn', 'New Supplier button');

});
Then('The {string} modal should open', async function (string) {
   console.log(`Verifying the ${string} modal is open`);
   const companyNameField = this.page.locator('#CompanyName');
   const saveCloseButton = this.page.locator('//div[@id="rocket-modal-btn-submit"]');
   await this.elementISVisibleOnPage(companyNameField,"Model page" );
   await this.elementISVisibleOnPage(saveCloseButton,"Model page" );
     console.log(" The {string} modal should open");
});
When('I enter dynamically generated company name', async function () {
    console.log(" I enter dynamically generated company name");
    // Generate dynamic Company  Name
    const CompanyName = DataGenerator.generateCompanyName();
    generatedsupplierData.CompanyName = CompanyName;
    console.log(`Generated Company Name: ${CompanyName}`);
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.companyName,CompanyName,"Company Name");
    console.log(`Entered Company Name: ${CompanyName}`);

});
When('I enter dynamically generated Street Line', async function () {
    console.log(" I enter dynamically generated Address Line");
    // Generate dynamic addressLine
    const addressLine = DataGenerator.generateAddressLine();
    generatedsupplierData.addressLine = addressLine;
    console.log(`Generated Street Line 1: ${addressLine}`);
    
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.addressLine_1,addressLine,"street Line");
    console.log(`Entered Street Line 1: ${addressLine}`);


});
When('I enter dynamically generated Street Line 2', async function () {
    console.log(" I enter dynamically generated Street Line 2");
    // Generate dynamic Street Line 2
    const StreetLine2 = DataGenerator.generateAddressLine();
    generatedsupplierData.addressLine = StreetLine2;
    console.log(`Generated Address Line: ${StreetLine2}`);
    
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.addressLine_2,StreetLine2,"street Line 2");
    console.log(`Entered Street Line 2 : ${StreetLine2}`);
});
When('I enter {string} as City', async function (cityName) {
    console.log(" I enter given City");
    generatedsupplierData.cityName = cityName;

    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.City,cityName," City");
    console.log(`Entered Street Line 2 : ${cityName}`);
});
When('I enter website',async function () {
    console.log(" I enter website"); 
    
    const website = "www.testwebsite.com";
    generatedsupplierData.website = website;
    console.log(` website : ${website}`);
    
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.website,website," website");
    console.log(`Entered website : ${website}`);

});

When('I select {string} as State Territory', async function (stateName) {
    console.log(`I select ${stateName} State`);
    generatedsupplierData.stateName = stateName;
    await this.selectFromDropdown(this.page,credentials.selectors.supplierDetails.State,stateName," state name");
    console.log(`Entered State Territory: ${stateName}`);
            
});

When('I enter dynamically generated zip code', async function () {
    console.log(" I enter dynamically generated zip code"); 

    const zipCode = DataGenerator.randomInt(6);
    generatedsupplierData.zipCode = zipCode;
    console.log(`Generated zip code: ${zipCode}`);
    
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.ZipCode,zipCode,"zip code");
   
});
When('I enter dynamically generated Shipping Terms', async function () {

    console.log(" I enter dynamically generated Shipping Terms");
    // Generate dynamic Company  Name
    const shippingTerms = DataGenerator.generateCompanyName();
    generatedsupplierData.shippingTerms = shippingTerms;
    console.log(`Generated Shipping Terms: ${shippingTerms}`);

    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.Shipping_Terms,shippingTerms,"Shipping Terms");
   
});
When('I select {string} as Payment Terms', async function (paymentTerms) {
    console.log(`I select ${paymentTerms} as Payment Terms`);
   generatedsupplierData.paymentTerms = paymentTerms;
    await this.selectFromDropdown(this.page,credentials.selectors.supplierDetails.Payment_Terms,paymentTerms,"payment terms");
   
});
When('I enter dynamically generated SendOrderToEmail', async function () {
    console.log(" I enter dynamically generated SendOrderToEmail");
 
     // Generate dynamic Company  Name
    const sendOrderToEmail = DataGenerator.generateEmail();
    generatedsupplierData.SendOrderToEmail = sendOrderToEmail;
    console.log(`Generated Shipping Terms: ${sendOrderToEmail}`);

    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.SendOrderToEmail,sendOrderToEmail,"SendOrder To Email");
   
});
    
Then('I should see the newly created supplier in the supplier list', async function () {
    try {
 
    console.log(" I should see the newly created supplier in the supplier list");
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Verify URL contains Supplier
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/Supplier')) {
      throw new Error(`Expected URL to contain '/Supplier', but got: ${currentUrl}`);
    }
    // Verify page elements that indicate we're on the Supplier page
    const supplierPageSelectors = [
      'h1:has-text("Supplier")',
      '.page-title:has-text("Supplier")',
    ];
    await this.checkPageElementsVisible(this.page,supplierPageSelectors,"Supplier page");

    console.log(`Step 4 passed: Successfully on Supplier page (${currentUrl})`);
    
  } catch (error) {
    console.error('Step 4 failed: Not on Supplier page:', error.message);
    await this.page.screenshot({ path: 'supplier-page-verification-error.png', fullPage: true });
    throw error;
  }
});  
When('I click on Add Notes button', async function () {
      console.log(`I click on Add Notes button`);
      const addNotesLocators = [
      'a.btn.btn-white-link.btn-xs',
      'a:has-text("Add Notes")',
      '//a[contains(@class,"btn-white-link") and contains(.,"Add Notes")]',
      'a.btn-white-link i.fa-pencil'
    ];  
    await this.clickFirstVisibleEnabled(this.page, addNotesLocators, 'Add Notes link');
});
Then('The Add Notes modal should open', async function () {
    console.log(" Verifying the Add Notes modal is open");
    const AddNotesModalSelectors = [
      'h5.modal-title.text-header-7',
      'h5#rocket-modal-header',
      'h5:has-text("Edit Supplier Notes")',
      'h5.modal-title i.fa-pencil-alt',
      '//h5[@id="rocket-modal-header" and contains(.,"Edit Supplier Notes")]'    
      ];
    
      await this.checkPageElementsVisible(this.page,AddNotesModalSelectors,"Supplier page");

  });
When('I enter notes in supplier notes', async function () {
    console.log(" I enter notes");
    const notes = generatedsupplierData.CompanyName
                + " " + generatedsupplierData.addressLine
                + " " + generatedsupplierData.cityName
                + " " + generatedsupplierData.stateName
                + " " + generatedsupplierData.zipCode
                + " " + generatedsupplierData.website
                + " " + generatedsupplierData.shippingTerms
                + " " + generatedsupplierData.paymentTerms
                + " " + generatedsupplierData.SendOrderToEmail;
                
    console.log("Generated notes: ",notes);
    await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.Supplier_Notes,notes,"Supplier Notes");

  });

    
  Then('I should see the newly added notes in the supplier details page', async function () {
  console.log(" I should see the newly added notes in the supplier details page");
  const generatedNotes =[
    'span.text-content',
    `span:has-text("${generatedsupplierData}")`,
    `//span[contains(@class,"text-content") and contains(.,"${generatedsupplierData}")]`
    ];

  await this.checkPageElementsVisible(this.page,generatedNotes,"Newly added notes")
  });

When('I click on Add Contact Details button', async function () {
  console.log(`I click on Add Contact Details button`);
  const addContactDetailsLocators = [
    'New Contact',
    'a.btn.btn-add.btn-xs',
    'a:has-text("New Contact")',
    '//a[contains(@class,"btn-add") and contains(.,"New Contact")]',
    'a.btn-add i.fa-user-plus'
  ];
  await this.clickFirstVisibleEnabled(this.page, addContactDetailsLocators, 'Add Contact Details link');
});


Then('The Add Contact Details modal should open', async function () {
  console.log(" Verifying the Add Contact Details modal is open");
  const AddContactDetailsModalSelectors = [
    'h5.modal-title.text-header-7',
    'h5#rocket-modal-header',
    'h5:has-text("Create Supplier Contact")',
    'h5.modal-title i.fa-pencil-alt',
    '//h5[@id="rocket-modal-header" and contains(.,"Create Supplier Contact")]'
  ];
  await this.checkPageElementsVisible(this.page,AddContactDetailsModalSelectors,"Add Contact Details modal");     
});


When('I enter dynamically generated contact details', async function () {
console.log(" I enter dynamically generated contact details");
await this.page.waitForTimeout(500); // Wait a moment to ensure all elements are loaded
await this.selectFromDropdown(this.page,credentials.selectors.supplierDetails.Title,"Mrs.","Title"); 
const contactFirstName = DataGenerator.generateFirstName();
generatedsupplierData.contactFirstName = contactFirstName;
await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.firstNameField,contactFirstName,"First Name");
const contactLastName = DataGenerator.generateLastName();
generatedsupplierData.contactLastName = contactLastName;
await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.lastNameField,contactLastName,"Last Name");
const contactEmail = DataGenerator.generateEmail();
generatedsupplierData.contactEmail = contactEmail;
await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.emailField,contactEmail,"Email"); 
const contactPhone = DataGenerator.generatePhoneNumber();
generatedsupplierData.contactPhone = contactPhone;  
await this.fillAndVerifyField(this.page,credentials.selectors.supplierDetails.phoneField,contactPhone,"Phone Number");


});


Then('I should see the newly added contact details in the supplier details page', async function () {
  console.log(" I should see the newly added contact details in the supplier details page");
  
  const contactDetails =[
    'a.btn.btn-delete-link.btn-xs',
    'a:has-text("Delete")',
    '//a[contains(@class,"btn-delete-link") and contains(.,"Delete")]',
    'a.btn-delete-link i.fa-trash',
    
    'a.btn.btn-link.btn-xs',
    'a:has-text("Edit")',
    '//a[contains(@class,"btn-link") and contains(.,"Edit")]',
    'a.btn-link i.fa-pencil'

  ];
  await this.checkPageElementsVisible(this.page,contactDetails,"Newly added contact details");

});


When('I click on account number for supplier',async function () {
  console.log(`I click on account number for supplier`);
  const accountNumberLocators = [
    'a.btn.btn-add.btn-xs',
    'a:has-text("Add Supplier Account Numbers")',
    '//a[contains(@class,"btn-add") and contains(.,"Add Supplier Account Numbers")]',
    'a.btn-add i.fa-plus-large'
  ];
  await this.clickFirstVisibleEnabled(this.page, accountNumberLocators, 'Account Number link');  

});


Then('The Edit Account Number modal should open', async function () {
  console.log(" Verifying the Edit Account Number modal is open");
  const EditAccountNumberModalSelectors = [
    'h5.modal-title.text-header-7',
  'h5#rocket-modal-header',
  'h5:has-text("Create Supplier Account Numbers")',
  'h5.modal-title i.fa-pencil-alt',
  '//h5[@id="rocket-modal-header" and contains(.,"Create Supplier Account Numbers")]'
  ];
  await this.checkPageElementsVisible(this.page,EditAccountNumberModalSelectors,"Edit Account Number modal");
});


When('I enter dynamically generated account number', async function () {
  console.log(" I enter dynamically generated account number");
  const accNumber = DataGenerator.randomInt(8);
  const clientName = "Acclaim Foot & Ankle Center";
  generatedsupplierData.clientName = clientName;
  await this.selectFromDropdown(this.page,credentials.selectors.supplierDetails.client_1,clientName,"client ");
  await this.fillAndVerifyField (this.page,credentials.selectors.supplierDetails.AccountNumber_1,accNumber,"Account Number");  
});

Then('I should see the newly added account number in the supplier details page', async function () {
  console.log(" I should see the newly added account number in the supplier details page");
  await this.page.locator('//*[text()="Supplier Account Numbers"]').scrollIntoViewIfNeeded();
  await this.clickOnText('Supplier Account Numbers');
  const accountNumberDetailsClient = await this.page.locator('//*[@id="supplier-account-results"]/tr[1]/td[1]').textContent();  
  await expect(accountNumberDetailsClient).toContain(generatedsupplierData.clientName);

});

        
    