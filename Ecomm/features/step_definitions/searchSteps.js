const { Given, When, Then , And } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const SearchPage = require('../../../pageobjects/SearchPage');



Given('I enter a valid search term {string} and press Enter', async function (searchTerm) {
    if (!this.plpPage) {
        throw new Error('PLP page object not initialized');
    }
    await this.plpPage.enterSearchTerm(searchTerm);
});

Then('I should be navigated to the SRP', async function () {
    await this.plpPage.verifyOnSearchResultPage();
});

Then('the header should display {string} and the search keyword {string}', async function (expectedPrefix, expectedKeyword) {
    const { resultsFor, keyword } = await this.plpPage.getSearchResultsHeaderAndKeyword();
    expect((resultsFor || '').trim().toLowerCase()).toBe(expectedPrefix.toLowerCase());
    expect((keyword || '').trim().toUpperCase()).toBe(expectedKeyword.toUpperCase());
    console.log(`Results for: "${resultsFor}", Keyword: "${keyword}"`);
});

Then('I should see a list of relevant products', async function () {
    const productCount = await this.plpPage.getSearchResultsProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`Found ${productCount} relevant products in search results`);
});

When('I enter a valid search term {string} without pressing Enter', async function (searchTerm) {
    if (!this.plpPage) {
        throw new Error('PLP page object not initialized');
    }
    await this.plpPage.enterSearchTermWithoutEnter(searchTerm);
});

Then('I should see search suggestions from products and categories', async function () {
    await this.plpPage.verifySearchSuggestions();
});

Then('I should not see search suggestions from products and categories', async function () {
    await this.plpPage.verifyNoSearchSuggestions();
});

When('I click on the first category suggestions', async function () {
    await this.plpPage.clickFirstCategorySuggestion();
});

Then('I should be navigated to the category page', async function () {
    await this.plpPage.verifyNavigationToCategoryPage();
});

Then('I update the quantity in Enter Custom Quantity field to {int}', async function (quantity) {
    if (!this.plpPage) {
        throw new Error('PLP page object not initialized');
    }
    await this.plpPage.updateCustomQuantityField(quantity);
    // Store the selected quantity for use in price verification
    this.selectedQuantity = quantity;
    console.log(`Custom quantity updated to ${quantity} tons`);
});

Then('I click on Save button', async function () {
    if (!this.plpPage) {
        throw new Error('PLP page object not initialized');
    }
    await this.plpPage.clickSaveButton();
    console.log('Save button clicked');
});

Then('the prices for products should be updated for {int} tons', async function (expectedQuantity) {
    if (!this.plpPage) {
        throw new Error('PLP page object not initialized');
    }
    // Verify the quantity display shows the expected value
    const displayedQuantity = await this.plpPage.getDisplayedQuantity();
    expect(displayedQuantity).toBe(expectedQuantity);
    console.log(`Prices updated for ${expectedQuantity} tons`);
});

Then('I should see the following PRICE attributes for each product on PLP:', async function (dataTable) {
    const expectedAttributes = dataTable.hashes().map(row => row.attribute);

    for (const attribute of expectedAttributes) {
        console.log(`Verifying PRICE attribute: ${attribute}`);
        try {
            if (attribute === 'Unit Price') {
                const unitPriceVisible = await this.plpPage.isUnitPriceVisiblePLP();
                expect(unitPriceVisible).toBe(true);
                console.log(`✓ Unit Price is visible`);
            } else if (attribute === 'Total Price') {
                const totalPriceVisible = await this.plpPage.isTotalPriceVisiblePLP();
                expect(totalPriceVisible).toBe(true);
                console.log(`✓ Total Price is visible`);

                // Verify calculation: Total Material Price = Qty selected * Unit Price
                const quantity = this.selectedQuantity || expectedQuantity || 25; // default to 25 as per scenario
                const unitPrice = await this.plpPage.getUnitPriceNumericPLP();
                const totalPrice = await this.plpPage.getTotalPriceNumericPLP();
                const calculatedTotal = unitPrice * quantity;
                expect(Math.abs(totalPrice - calculatedTotal)).toBeLessThan(0.01);
                console.log(`✓ Price calculation verified: ${totalPrice} = ${unitPrice} * ${quantity}`);
            } else {
                throw new Error(`Unknown PRICE attribute: ${attribute}`);
            }
        } catch (error) {
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
            this.attach(`Price attribute verification failed for "${attribute}": ${error.message}`, 'text/plain');
            throw error;
        }
    }
    console.log('PRICE attributes verification completed.');
});

Then('no results found message should be displayed', async function () {
    await this.plpPage.verifyNoResultsFoundMessage();
});
