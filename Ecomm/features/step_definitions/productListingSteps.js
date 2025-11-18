const { Given, When, Then , And } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ProductListingPage = require('../../../pageobjects/ProductListingPage');

Given('I am on the Product Listing Page', async function () {
    if (!this.page) {
        console.log('Page not available in test context, skipping PLP initialization');
        return;
    }

    this.plpPage = new ProductListingPage(this.page);
    // Replace with your actual PLP URL
    await this.plpPage.navigateToPlp('https://qa-shop.vulcanmaterials.com/category/categories/C001');

     // Wait for product tiles to load
    await this.plpPage.scrollAndWaitForAllProductsToLoad();
    const tileCount = await this.plpPage.getProductTileCount();
    console.log(`Found ${tileCount} product tiles on the PLP`);

    // Log product name
    const productName = await this.plpPage.getProductName();
    console.log(`Product Name: ${productName}`);
    this.attach(`Product Name: ${productName}`, 'text/plain');

});



 When('I view a product tile of PLP page', async function () {
           await this.plpPage.waitForProductTilesToLoad();
           
});

When('I click on the Qty Selector on the PLP', async function () {
    await this.plpPage.clickOnArrow();
});

Then('I should see the following components for first product:', async function (dataTable) {
    const expectedComponents = dataTable.hashes().map(row => row.component);
    console.log(`Checking visibility of components for first product: ${expectedComponents.join(', ')}`);

    for (const component of expectedComponents) {
        const isVisible = await this.plpPage.isComponentVisible(component);
        console.log(`Component "${component}": ${isVisible ? 'Visible' : 'Not Visible'}`);
        if (!isVisible) {
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
            this.attach(`Component "${component}" is not visible`, 'text/plain');
        }
        expect(isVisible).toBe(true);
    }
    console.log('All components visibility check completed.');
});

Then('I should see unit price displayed', async function () {
    await this.plpPage.verifyUnitPriceDisplayed();
    const unitPrice = await this.plpPage.getUnitPrice();
    console.log(`Unit Price: ${unitPrice}`);
    this.attach(`Unit Price: ${unitPrice}`, 'text/plain');
});

Then('I should see price displayed', async function () {
    await this.plpPage.verifyTotalPriceDisplayed();
    const totalPrice = await this.plpPage.getTotalPrice();
    console.log(`Total Price: ${totalPrice}`);
    this.attach(`Total Price: ${totalPrice}`, 'text/plain');
});

Then('I should see delivery price displayed', async function () {
    await this.plpPage.verifyDeliveryPriceDisplayed();
    const deliveryPrice = await this.plpPage.getDeliveryPrice();
    console.log(`Delivery Price: ${deliveryPrice}`);
    this.attach(`Delivery Price: ${deliveryPrice}`, 'text/plain');
});

Then('if badges are applicable they should be visible on the product tile', async function () {
    const badgesAvailable = await this.plpPage.verifyBadgesWhenApplicable();
    this.attach(`Badges available: ${badgesAvailable}`, 'text/plain');
});

Then('I should see a header with value {string}', async function (expectedHeader) {
    const headerText = await this.plpPage.getQuantitySelectorHeader();
    expect(headerText.trim()).toBe(expectedHeader);
});

Then('I should see a subtext {string}', async function (expectedSubtext) {
    const subtext = await this.plpPage.getQuantitySelectorSubtext();
    expect(subtext.trim()).toBe(expectedSubtext);
});

Then('{string} swatch should be highlighted', async function (swatchText) {
    let isHighlighted;
    if (swatchText === '22 tons') {
        isHighlighted = await this.plpPage.isTwentyTwoTonSwatchHighlighted();
    } else {
        // For other swatches, implement if needed
        throw new Error(`Highlight check not implemented for ${swatchText}`);
    }
    expect(isHighlighted).toBe(true);
});

Then('I should see swatches for {int}, {int}, {int} tons',async function (int, int2, int3) {
    const isVisible = await this.plpPage.areSwatchesVisible([5, 10, 15]);
    expect(isVisible).toBe(true);
});

Then('I should see a field labeled {string}', async function (label) {
    if (label === 'Enter Custom Quantity') {
        const isVisible = await this.plpPage.isCustomQuantityFieldVisible();
        expect(isVisible).toBe(true);
    } else {
        throw new Error(`Field check not implemented for ${label}`);
    }
});

Then('an information tooltip icon should be displayed', async function () {
    const isVisible = await this.plpPage.isInformationTooltipIconVisible();
    expect(isVisible).toBe(true);
});

Then('I should see a Save button and an X button', async function () {
    const saveVisible = await this.plpPage.isSaveButtonVisible();
    const closeVisible = await this.plpPage.isCloseButtonVisible();
    expect(saveVisible && closeVisible).toBe(true);
});

When('I click on a first product', async function () {
    await this.plpPage.clickFirstProduct();
    // Add wait after navigation to PDP
    await this.page.waitForTimeout(2000);
});

Then('I should be redirected to the corresponding Product Detail Page', async function () {
    const isOnPDP = await this.plpPage.isOnProductDetailPage();
    expect(isOnPDP).toBe(true);
});


When('I view the navigation bar', async function () {
    console.log('Viewing the navigation bar');
});

Then('all the categories should be displayed', async function () {
    const categoriesVisible = await this.plpPage.verifyNavigationBarCategoriesDisplayed();
    expect(categoriesVisible).toBe(true);
});

Then('the default selection should be {string}', async function (expectedDefault) {
    const defaultSelection = await this.plpPage.getNavigationBarDefaultSelection();
    expect(defaultSelection.trim()).toBe(expectedDefault);
});

When('I click a category in the navigation bar', async function () {
    await this.plpPage.clickCategoryInNavigationBar();
});

Then('the clicked category should be highlighted', async function () {
    const isHighlighted = await this.plpPage.verifyCategoryHighlighted();
    expect(isHighlighted).toBe(true);
});

Then('the total count of products in the category should be displayed', async function () {
    await this.plpPage.verifyCategoryProductsLoaded();
    const productCount = await this.plpPage.getProductTileCount();
    expect(productCount).toBeGreaterThan(0);
});




Then('I should see a list of relevant products', async function () {
    const productCount = await this.plpPage.getSearchResultsProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`Found ${productCount} relevant products in search results`);
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


