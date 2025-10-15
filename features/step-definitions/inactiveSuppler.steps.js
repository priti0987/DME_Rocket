const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const OrderUtils = require('../../utils/orderUtils.js');
const TestDataReader = require('../../utils/testDataReader.js');
const { SupplierPage } = require('../../src/pages/supplier.js');
const DataGenerator = require('../../utils/dataGenerator.js');
const myFunctions = require('../../src/support/world.cjs');
const { Console } = require('console');

When('I select edit supplier',async function () {
    console.log('I select edit supplier');
    editButtonClass=' btn btn-white-link btn-xs';
    await this.clickElementByClass(editButtonClass,'Supplier Edit Button ')
});
Then('The Edit Supplier modal should open',async function () {
    console.log('The Edit Supplier modal should open'); 
    const editPageTitle='#rocket-modal-header';
    await this.elementISVisibleOnPage(editPageTitle,'Edit Supplier Modal');
    const companyNameField=credentials.selectors.supplierDetails.companyName;
    await this.elementISVisibleOnPage(companyNameField,'Company Name Field');
    const statusField_=credentials.selectors.supplierDetails.statusField;
    await this.elementISVisibleOnPage(statusField_,'Status Field');
    const saveAndCloseButton=credentials.selectors.createPatient.saveAndCloseButton;
    await expect(this.page.locator(saveAndCloseButton)).toBeVisible({ timeout: 5000 });
});
When('I change status as Inactive',async function () {
           // Write code here that turns the phrase above into concrete actions
            console.log('I change status as Inactive');
            const statusField_=credentials.selectors.supplierDetails.statusField;

            await this.clickLocator(statusField_,'Status Field'); 
            console.log('Generated Supplier Data:', credentials.generatedsupplierData);
});


Then('I should not see the Inactive supplier in the supplier dropdown', async function () {
    console.log('I should not see the Inactive supplier in the supplier dropdown');
    const noResultsFoundMessage = await this.page.locator('li[role="alert"]').textContent();
    expect(noResultsFoundMessage.trim()).toBe('No results found');
    console.log('No results found message is displayed as expected.');
    
});

