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



Then('no results found message should be displayed', async function () {
    await this.plpPage.verifyNoResultsFoundMessage();
});
