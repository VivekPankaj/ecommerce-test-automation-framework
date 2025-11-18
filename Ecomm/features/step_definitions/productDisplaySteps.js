const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ProductDisplayPage = require('../../../pageobjects/ProductDisplayPage');
const ProductListingPage = require('../../../pageobjects/ProductListingPage');

// Helper function to calculate expected cubic yards based on dimensions
function calculateExpectedCubicYards(width, length, thickness, isFeet = false) {
    // If all values are in feet, no conversion needed
    const thicknessFeet = isFeet ? thickness : thickness / 12;
    // Calculate volume in cubic feet
    const volumeCuFt = width * length * thicknessFeet;
    // Convert to cubic yards
    const volumeCuYd = volumeCuFt / 27;
    return volumeCuYd;
}




Then('I should see the following attributes for product:', async function (dataTable) {
    const expectedAttributes = dataTable.hashes().map(row => row.attribute);
    console.log(`Checking visibility of attributes: ${expectedAttributes.join(', ')}`);

    const pdpPage = new ProductDisplayPage(this.page);

    for (const attribute of expectedAttributes) {
        try {
            await pdpPage.verifyProductAttribute(attribute);
            console.log(`✓ Attribute "${attribute}" verified successfully`);
        } catch (error) {
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
            this.attach(`Attribute "${attribute}" is not visible or failed verification`, 'text/plain');
            throw new Error(`Attribute verification failed for "${attribute}": ${error.message}`);
        }
    }
    console.log('All product attributes visibility check completed.');
});



When('I click on Estimate quantity link', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.clickEstimateQuantityLink();
});

When('i enter width,length,thickness as {int},{int},{int}', async function (width, length, thickness) {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.enterDimensions(width, length, thickness);
    // Store dimensions for calculation verification
    this.width = width;
    this.length = length;
    this.thickness = thickness;
});

When('i enter width,length,thickness as {int},{int},{int} all in feet', async function (width, length, thickness) {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.enterDimensionsInFeet(width, length, thickness);
    // Store dimensions for calculation verification (all values are in feet)
    this.width = width;
    this.length = length;
    this.thickness = thickness;
    this.allInFeet = true; // Flag to indicate all values are in feet
});

When('i click on calculate button', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.clickCalculateButton();
});

When('i click on Apply Estimate', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.clickApplyEstimateButton();
});

Then('i see the text "Estimated materials needed"', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.isMaterialNeededTextVisible();
});

Then('i see the calulated material needed in tons', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.isCalculatedValueVisible();
    const calculatedValue = await pdpPage.getCalculatedValue();
    console.log(`Calculated material needed: ${calculatedValue}`);
    // Uncomment the line below if you want to debug and pause the test
    //await this.page.pause();
});

Then('calculated value matches with calculated material needed in yards', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    const calculatedValue = await pdpPage.getCalculatedValue();
    console.log(`Calculated material needed: ${calculatedValue}`);

    // Verify calculation matches expected cubic yards
    const expectedCubicYards = calculateExpectedCubicYards(this.width, this.length, this.thickness, this.allInFeet);
    console.log(`Expected cubic yards based on calculation: ${expectedCubicYards.toFixed(2)}`);

    // Extract cubic yards from calculatedValue (assuming format like "48 tons (30.86 yards)")
    const yardsMatch = calculatedValue.match(/(\d+\.?\d*)\s*yards/);
    const calculatedCubicYards = yardsMatch ? parseFloat(yardsMatch[1]) : null;

    if (calculatedCubicYards === null) {
        throw new Error(`Could not extract cubic yards from calculated value: ${calculatedValue}`);
    }

    if (Math.abs(calculatedCubicYards - expectedCubicYards) < 0.01) {
        console.log(`✓ Calculated value matches with calculated material needed in yards`);
    } else {
        throw new Error(`Mismatch: Calculated ${calculatedCubicYards} cubic yards vs expected ${expectedCubicYards.toFixed(2)} cubic yards`);
    }
});

Then('calculated tons value should be updated with custom quantity field', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    const calculatedValue = await pdpPage.getCalculatedValue();

    console.log(`Calculated value from display: ${calculatedValue}`);

    // Extract tons from calculated display value
    const tonsMatch = calculatedValue.match(/(\d+)\s*tons/);
    const expectedTons = tonsMatch ? parseInt(tonsMatch[1], 10) : null;

    if (expectedTons === null) {
        throw new Error(`Could not extract tons from calculated value: ${calculatedValue}`);
    }

    // Store for verification after Apply Estimate
    this.expectedTons = expectedTons;
    console.log(`Calculated tons from display: ${expectedTons} (will verify after Apply Estimate)`);
});

Then('Enter custom quantity field should be updated with calculated tons value', async function () {
    if (!this.expectedTons) {
        throw new Error('No expected tons value available. Calculate first before applying estimate.');
    }

    const pdpPage = new ProductDisplayPage(this.page);
    const customQuantityValue = await pdpPage.getCustomQuantityFieldValue();

    const actualTons = parseInt(customQuantityValue, 10);

    console.log(`Expected tons: ${this.expectedTons}, Custom quantity field value: ${actualTons}`);

    if (actualTons === this.expectedTons) {
        console.log(`✓ Enter custom quantity field is updated with calculated tons value: ${this.expectedTons}`);
    } else {
        throw new Error(`Mismatch: Custom quantity field shows ${actualTons} tons, expected ${this.expectedTons} tons`);
    }
});

Then('custom quantity field should be updated with apply estimate tons value', async function () {
    if (!this.expectedTons) {
        throw new Error('No expected tons value available. Calculate first before applying estimate.');
    }

    const pdpPage = new ProductDisplayPage(this.page);
    const customQuantityValue = await pdpPage.getCustomQuantityFieldValue();

    const actualTons = parseInt(customQuantityValue, 10);

    console.log(`Expected tons: ${this.expectedTons}, Custom quantity field value: ${actualTons}`);

    if (actualTons === this.expectedTons) {
        console.log(`✓ Enter custom quantity field is updated with calculated tons value: ${this.expectedTons}`);
    } else {
        throw new Error(`Mismatch: Custom quantity field shows ${actualTons} tons, expected ${this.expectedTons} tons`);
    }
});

Then('total material price should be unit price times custom quantity field value', async function () {
    const pdpPage = new ProductDisplayPage(this.page);

    const unitPrice = await pdpPage.getUnitPriceNumeric();
    const customQuantityValue = await pdpPage.getCustomQuantityFieldValue();
    const quantity = parseInt(customQuantityValue, 10);
    const totalMaterialPrice = await pdpPage.getTotalPriceNumeric();

    const expectedTotal = unitPrice * quantity;

    console.log(`Unit Price: ${unitPrice}, Custom Quantity: ${quantity}, Total Material Price: ${totalMaterialPrice}, Expected Total: ${expectedTotal}`);

    if (Math.abs(totalMaterialPrice - expectedTotal) < 0.01) {
        console.log(`✓ Total material price correctly calculated as unit price * custom quantity: ${totalMaterialPrice}`);
    } else {
        throw new Error(`Total material price mismatch: Expected ${expectedTotal}, but got ${totalMaterialPrice}`);
    }
});

Then('I should see a validation message {string}', async function (expectedMessage) {
    const pdpPage = new ProductDisplayPage(this.page);

    const isVisible = await pdpPage.isErrorMessageVisible(expectedMessage);
    if (!isVisible) {
        throw new Error(`Validation message "${expectedMessage}" is not visible`);
    }

    console.log(`✓ Validation message "${expectedMessage}" is displayed correctly`);
});

When('i click on delivery charges Info', async function () {
    const pdpPage = new ProductDisplayPage(this.page);
    await pdpPage.clickDeliveryInfoButton();
});

Then('i should see tooltip message {string}', async function (expectedMessage) {
    const pdpPage = new ProductDisplayPage(this.page);
    const actualMessage = await pdpPage.getTooltipMessage();

    if (!actualMessage.includes(expectedMessage.trim())) {
        throw new Error(`Expected tooltip message "${expectedMessage}", but got "${actualMessage}"`);
    }

    console.log(`✓ Tooltip message "${expectedMessage}" is displayed correctly`);
});




When('I set quantity to {int} tons on PDP', async function (quantity) {
    if (!this.pdpPage) {
        this.pdpPage = new ProductDisplayPage(this.page);
    }
    await this.pdpPage.setQuantity(quantity);
    // Store quantity for later use in PRICE verification
    this.selectedQuantity = quantity;
});

When('I set quantity to {string} tons on PDP', async function (quantityString) {
    if (!this.pdpPage) {
        this.pdpPage = new ProductDisplayPage(this.page);
    }
    // Handle string input including "test"
    await this.page.locator(this.pdpPage.customQuantityField).clear();
    await this.page.locator(this.pdpPage.customQuantityField).fill(quantityString);
    console.log(`Set quantity to "${quantityString}" tons on PDP`);
    // Store quantity for later use in PRICE verification
    this.selectedQuantity = quantityString;
    // await this.page.pause();
});



Then('I should see the following PRICE attributes for each product title:', async function (dataTable) {
    const expectedAttributes = dataTable.hashes().map(row => row.attribute);

    // Use the quantity set earlier, default to 22 if not set
    const quantity = this.selectedQuantity || 22;

    for (const attribute of expectedAttributes) {
        console.log(`Verifying PRICE attribute: ${attribute}`);
        try {
            if (attribute === 'Unit Price') {
                const unitPriceVisible = await this.pdpPage.isUnitPriceVisible();
                expect(unitPriceVisible).toBe(true);
                console.log(`✓ Unit Price is visible`);
            } else if (attribute === 'Total Material Price') {
                const totalPriceVisible = await this.pdpPage.isTotalPriceVisible();
                expect(totalPriceVisible).toBe(true);
                console.log(`✓ Total Material Price is visible`);

                // Verify calculation: Total Material Price = Qty selected * Unit Price
                const unitPrice = await this.pdpPage.getUnitPriceNumeric();
                const totalPrice = await this.pdpPage.getTotalPriceNumeric();
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
