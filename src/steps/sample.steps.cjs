const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I open example site', async function () {
  await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
});

Then('page title contains {string}', async function (sub) {
  await expect(this.page).toHaveTitle(new RegExp(sub, 'i'));
});
