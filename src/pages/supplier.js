class SupplierPage {
  constructor(page) {
    this.page = page;   
    this.addSupplierButton = page.locator('a.btn.btn-add.btn-xs');

    async function clickAddSupplier() {
      await this.addSupplierButton.click();
    }
  }}
    module.exports = { SupplierPage };