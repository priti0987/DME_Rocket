const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I open the base url', async function () {
  await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
});

When('I click the first link on the page', async function () {
  const firstLink = this.page.locator('a').first();
  await firstLink.click();
});

Then('the page URL contains {string}', async function (text) {
  await expect(this.page).toHaveURL(new RegExp(text, 'i'));
});
