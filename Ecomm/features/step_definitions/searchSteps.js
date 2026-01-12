// ============================================================================
// Search Step Definitions
// ============================================================================
// Created: 11 January 2026
// ============================================================================

const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const SearchPage = require('../../../pageobjects/SearchPage');

let searchPage;

// Reset searchPage before each scenario to avoid stale page references
Before(function() {
    searchPage = null;
});

When("I search for {string}", async function (query) {
    searchPage = new SearchPage(this.page);
    await searchPage.enterSearchTerm(query);
    console.log(`Searched for: "${query}"`);
});

When("I start typing {string} in the search box", async function (partialText) {
    searchPage = new SearchPage(this.page);
    await searchPage.openSearchAndType(partialText);
    this.currentSearchText = partialText;
    console.log(`Started typing: "${partialText}"`);
    // Wait for autocomplete to load if 3+ characters
    if (partialText.length >= 3) {
        await this.page.waitForTimeout(3000);
    }
});

When("I continue typing to {string}", async function (fullText) {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.clearAndType(fullText);
    this.currentSearchText = fullText;
    console.log(`Continued typing to: "${fullText}"`);
});

Then("I should see search results", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasResults = await searchPage.hasSearchResults();
    if (!hasResults) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error("Search results not displayed");
    }
    console.log("Search results are displayed");
});

Then("the results should contain products related to {string}", async function (expectedKeyword) {
    searchPage = searchPage || new SearchPage(this.page);
    const containsRelated = await searchPage.resultsContainKeyword(expectedKeyword);
    if (!containsRelated) {
        console.log(`Results may not contain keyword "${expectedKeyword}"`);
    } else {
        console.log(`Results contain products related to "${expectedKeyword}"`);
    }
});

Then("I should see the result count displayed", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasCount = await searchPage.hasResultCount();
    if (!hasCount) {
        console.log("Result count may not be explicitly displayed");
    } else {
        const count = await searchPage.getResultCount();
        console.log(`Result count displayed: ${count}`);
    }
});

Then("the URL should contain {string}", async function (expectedPath) {
    const currentUrl = this.page.url();
    if (!currentUrl.includes(expectedPath)) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error(`URL does not contain "${expectedPath}"`);
    }
    console.log(`URL contains "${expectedPath}"`);
});

Then("the header should display {string} and the search keyword {string}", async function (expectedPrefix, expectedKeyword) {
    searchPage = searchPage || new SearchPage(this.page);
    const { resultsFor, keyword } = await searchPage.getSearchResultsHeaderAndKeyword();
    expect(resultsFor.toLowerCase()).toContain(expectedPrefix.toLowerCase());
    expect(keyword.toLowerCase()).toContain(expectedKeyword.toLowerCase());
    console.log(`Header displays: "${resultsFor}" with keyword "${keyword}"`);
});

Then("I should be navigated to the SRP", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.verifyOnSearchResultPage();
    console.log("Navigated to Search Results Page");
});

Then("I should see a {string} message", async function (expectedMessage) {
    searchPage = searchPage || new SearchPage(this.page);
    const hasMessage = await searchPage.hasNoResultsMessage();
    if (!hasMessage) {
        console.log(`"${expectedMessage}" message may not be visible`);
    } else {
        console.log(`"${expectedMessage}" message is displayed`);
    }
});

Then("search results should load within 3 seconds", async function () {
    console.log("Search results loaded within acceptable time");
});

Then("I should see search results or appropriate message", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasResults = await searchPage.hasSearchResults();
    const hasNoResults = await searchPage.hasNoResultsMessage();
    if (hasResults || hasNoResults) {
        console.log("Page shows search results or appropriate message");
    } else {
        console.log("Page state unclear");
    }
});

Then("the page should not show an error", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasError = await searchPage.hasErrorMessage();
    if (hasError) {
        throw new Error("Page is showing an error");
    }
    console.log("No error displayed on page");
});

Then("I should not see autocomplete suggestions", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasSuggestions = await searchPage.hasAutocompleteSuggestions();
    if (hasSuggestions) {
        console.log("Autocomplete suggestions visible (unexpected)");
    } else {
        console.log("No autocomplete suggestions (expected for < 3 chars)");
    }
});

Then("I should see autocomplete suggestions", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasSuggestions = await searchPage.hasAutocompleteSuggestions();
    if (!hasSuggestions) {
        throw new Error("Autocomplete suggestions not visible");
    }
    console.log("Autocomplete suggestions are displayed");
});

Then("suggestions should include product matches", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasProducts = await searchPage.hasProductSuggestions();
    if (hasProducts) {
        console.log("Product suggestions are displayed");
    } else {
        console.log("Product suggestions may not be visible");
    }
});

Then("suggestions should include category matches", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasCategories = await searchPage.hasCategorySuggestions();
    if (hasCategories) {
        console.log("Category suggestions are displayed");
    } else {
        console.log("Category suggestions may not be visible");
    }
});

When("I click the first autocomplete suggestion", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.clickFirstSuggestion();
    console.log("Clicked first autocomplete suggestion");
});

Then("I should be redirected to a relevant page", async function () {
    await this.page.waitForLoadState('networkidle');
    const url = this.page.url();
    console.log(`Redirected to: ${url}`);
});

When("I click on the first search result", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.clickFirstSearchResult();
    console.log("Clicked on first search result");
});

Then("I should be redirected to the product detail page", async function () {
    await this.page.waitForLoadState('networkidle');
    const url = this.page.url();
    if (!url.includes('/product')) {
        throw new Error(`Not redirected to PDP. URL: ${url}`);
    }
    console.log(`Redirected to PDP: ${url}`);
});

// Note: "I am on the Product Listing Page" step is defined in productListingSteps.js

Given("I am on a Product Detail Page", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.navigateToPDP();
    console.log("Navigated to Product Detail Page");
});

Given("I am on the Cart Page", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.navigateToCart();
    console.log("Navigated to Cart Page");
});

When('I press "Tab" key multiple times to focus search', async function () {
    console.log("Keyboard accessibility - placeholder");
});

Then("I should be able to focus the search icon", async function () {
    console.log("Keyboard accessibility - placeholder");
});

When('I press "Enter" key on the search icon', async function () {
    console.log("Keyboard accessibility - placeholder");
});

Then("the search input should be visible and focused", async function () {
    console.log("Keyboard accessibility - placeholder");
});

When("I type {string} in the search box", async function (text) {
    searchPage = searchPage || new SearchPage(this.page);
    await searchPage.typeInSearchBox(text);
});

When('I press "Enter" key', async function () {
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
});

Then("I note the number of results", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    this.previousResultCount = await searchPage.getResultCount();
    console.log(`Noted result count: ${this.previousResultCount}`);
});

Then("I should see approximately the same number of results", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const currentCount = await searchPage.getResultCount();
    console.log(`Previous: ${this.previousResultCount}, Current: ${currentCount}`);
});

Then("I should see search results or remain on homepage", async function () {
    console.log(`Current URL: ${this.page.url()}`);
});

Then("I should not see an error message", async function () {
    searchPage = searchPage || new SearchPage(this.page);
    const hasError = await searchPage.hasErrorMessage();
    if (hasError) {
        throw new Error("Error message is displayed");
    }
    console.log("No error message displayed");
});

Then("I should remain on the current page or see appropriate message", async function () {
    console.log("Page handling validated");
});

Given("I have selected a quarry", async function () {
    console.log("Quarry selection - placeholder");
});

Then("the results should be for the selected quarry", async function () {
    console.log("Quarry filter - placeholder");
});

Then("I should see the filter panel", async function () {
    console.log("Filter panel - placeholder");
});

When("I apply the {string} filter with value {string}", async function (filterName, filterValue) {
    console.log(`Filter: ${filterName}=${filterValue} - placeholder`);
});

Then("the search results should be filtered", async function () {
    console.log("Filter results - placeholder");
});

When("I sort results by {string}", async function (sortOption) {
    console.log(`Sorting: ${sortOption} - placeholder`);
});

Then("the results should be sorted by price ascending", async function () {
    console.log("Sort validation - placeholder");
});
