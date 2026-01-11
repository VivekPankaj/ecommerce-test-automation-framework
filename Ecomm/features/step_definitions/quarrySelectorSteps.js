const { Given, When, Then } = require('@cucumber/cucumber');
const { QuarrySelectorPage } = require('../../../pageobjects/QuarrySelectorPage');
const testData = require("../../../utils/testData.json");

Given('I am on the Address Selector', async function () {
    this.quarryPage = new QuarrySelectorPage(this.page);
    await this.quarryPage.gotoHomepage();
    await this.quarryPage.clickDefaultAddressText();
});

When('the Modal is displayed', async function () {
    await this.quarryPage.waitForAddressModal();
});

// Data-driven steps
When('I enter primary zipcode in the Address Input Field', async function () {
    await this.quarryPage.enterAddress(testData.quarrySelector.zipCodes.primary);
});

When('I enter secondary zipcode in the Address Input Field', async function () {
    await this.quarryPage.enterAddress(testData.quarrySelector.zipCodes.secondary);
});

Then('I should see the Address Input Field with primary zipcode', async function () {
    await this.quarryPage.verifyAddressInputField(testData.quarrySelector.zipCodes.primary);
});

Then('I should see the Address Input Field with no zipcode', async function () {
    await this.quarryPage.verifyAddressInputField(null);
});

// Original parameterized steps (kept for backward compatibility)
When('I enter {string} in the Address Input Field', async function (zip) {
    await this.quarryPage.enterAddress(zip);
});

When('I select the first address suggestion', async function () {
    await this.quarryPage.selectFirstSuggestion();
});

When('I click the Confirm CTA', async function () {
    await this.quarryPage.clickConfirmCTA();
});

When('I close the Address Selector modal', async function () {
    await this.quarryPage.closeModal();
});

When('I reopen the Address Selector', async function () {
    await this.quarryPage.reopenAddressSelector();
});

// VALIDATION STEPS
Then('I should see the following components', async function () {
    await this.quarryPage.verifyDeliveryPickupSelector();
    await this.quarryPage.verifySubheaders();
});

Then('I should see the Address Input Field with zipcode {string}', async function (zip) {
    await this.quarryPage.verifyAddressInputField(zip === 'none' ? null : zip);
});

Then('I should see Google Map Component with controls', async function () {
    await this.quarryPage.verifyGoogleMapComponents();
});

Then('I should see the Confirm CTA', async function () {
    await this.quarryPage.verifyConfirmCTA();
});

Then('I should see the Close CTA', async function () {
    await this.quarryPage.verifyCloseCTA();
});

When('I close the Address Selector modal without saving', async function () {
    await this.quarryPage.closeModal();
});

Then('the address should not be saved', async function () {
    await this.quarryPage.verifyAddressNotSaved();
});

