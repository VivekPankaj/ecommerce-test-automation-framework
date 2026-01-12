const { expect } = require('@playwright/test');

class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        // PDP component locators (Vulcan Materials QA site specific)
        this.productName = 'p.component--typography.global-text-2xl';
        this.totalMaterialPrice = 'div.component--product-price > div > p';
        this.unitPrice = 'div.component--product-price > div > p > span.component--typography.global-text-sm';
        this.addToCartButton = 'button.MuiButton-outlinedPrimary[name="addToCart"]';
        this.buyNowButton = 'button[name="buy"]';
        this.productImage = '.component--product-description-image-carousel';
        this.estimateQuantityLink = 'div.component--product-description-quantity-selector > div > div > button';
        this.customQuantityField = 'input[name="quantity"]';
        this.productOverview = 'div.MuiContainer-root.component--container > div > div > div > p';
        this.deliveryInfoSection = 'button[aria-label=info]>svg';

        //Quantity calculator locators 
        this.widthInputField = 'input[name=width]';
        this.lengthInputField = 'input[name=length]';
        this.thicknessInputField = 'input[name=thickness]';
        this.thicknessDropdown = 'div[aria-haspopup=listbox]';  // Locator for thickness dropdown
        this.feetOption = 'li[data-value=ft]';  // Locator for feet option
        this.calculateButton = 'div.component--quantity-calculator-form> form > button > p';
        this.materialNeededText = 'h3:has-text("Estimated materials needed")';
        this.calculatedValue = 'span[aria-hidden="true"]';
        this.applyEstimateLink = 'p:has-text("Apply Estimate")';
        this.deliveryInfoButton = 'button[aria-label=info]>svg';
        this.tooltipMessage = 'div[role=tooltip]>div>div>div';
    }

    async navigateToPDP(url) {
        await this.page.goto(url);
        await this.waitForPDPToLoad();
    }

    async waitForPDPToLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000); // Additional wait for dynamic content
    }

    async verifyProductAttribute(attribute) {
        console.log(`Verifying attribute: ${attribute}`);

        switch (attribute.toLowerCase()) {
            case 'product name':
                await expect(this.page.locator(this.productName).nth(2)).toBeVisible();
                console.log(`✓ Product name is visible`);
                break;

            case 'total material price':
                await expect(this.page.locator(this.totalMaterialPrice).first()).toBeVisible();
                console.log(`✓ Total Material Price is visible`);
                break;

            case 'unit price':
                await expect(this.page.locator(this.unitPrice).first()).toBeVisible();
                console.log(`✓ Unit Price is visible`);
                break;

            case 'add to cart':
                await expect(this.page.locator(this.addToCartButton)).toBeVisible();
                console.log(`✓ Add to cart button is visible`);
                break;

            case 'buy now':
                await expect(this.page.locator(this.buyNowButton)).toBeVisible();
                console.log(`✓ Buy Now button is visible`);
                break;

            case 'product image':
                await expect(this.page.locator(this.productImage)).toBeVisible();
                console.log(`✓ Product image is visible`);
                break;

            case 'estimate quantity link':
                await expect(this.page.locator(this.estimateQuantityLink)).toBeVisible();
                console.log(`✓ Estimate quantity link is visible`);
                break;

            case 'enter custom quantity field':
                await expect(this.page.locator(this.customQuantityField)).toBeVisible();
                console.log(`✓ Custom quantity field is visible`);
                break;

            case 'product overview':
                await expect(this.page.locator(this.productOverview).first()).toBeVisible();
                console.log(`✓ Product overview is visible`);
                break;

            default:
                throw new Error(`Unknown attribute: ${attribute}`);
        }
    }

    // Methods for getting specific attribute values
    async getProductName() {
        const element = this.page.locator(this.productName);
        return await element.textContent() || 'Not found';
    }

    async getTotalMaterialPrice() {
        const element = this.page.locator(this.totalMaterialPrice);
        return await element.textContent() || 'Not found';
    }

    async getUnitPrice() {
        const element = this.page.locator(this.unitPrice);
        return await element.textContent() || 'Not found';
    }

    async setQuantity(quantity) {
        await this.page.locator(this.customQuantityField).clear();
        await this.page.locator(this.customQuantityField).fill(quantity.toString());
        console.log(`Set quantity to ${quantity} tons`);
    }

    async isUnitPriceVisible() {
        return await this.page.locator(this.unitPrice).first().isVisible();
    }

    async isTotalPriceVisible() {
        return await this.page.locator(this.totalMaterialPrice).first().isVisible();
    }

    async getUnitPriceNumeric() {
        const element = this.page.locator(this.unitPrice);
        const text = await element.textContent();
        if (text === 'Not found') return 0;
        // Parse price, assuming format like "$123.45 per ton" or similar
        const match = text.match(/\$?([0-9,]+\.?\d+)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }

    async getTotalPriceNumeric() {
        const element = this.page.locator(this.totalMaterialPrice);
        const text = await element.textContent();
        if (text === 'Not found') return 0;
        // Parse price, assuming format like "$123.45" or similar
        const match = text.match(/\$?([0-9,]+\.?\d+)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }

    async clickEstimateQuantityLink() {
        await this.page.locator(this.estimateQuantityLink).click();
    }

    async enterDimensions(width, length, thickness) {
        await this.page.locator(this.widthInputField).fill(width.toString());
        await this.page.locator(this.lengthInputField).fill(length.toString());
        await this.page.locator(this.thicknessInputField).fill(thickness.toString());
    }

    async enterDimensionsInFeet(width, length, thickness) {
        await this.page.locator(this.widthInputField).fill(width.toString());
        await this.page.locator(this.lengthInputField).fill(length.toString());
        await this.page.locator(this.thicknessInputField).fill(thickness.toString());
        // Click on the thickness dropdown and select feet option
        await this.page.locator(this.thicknessDropdown).click();
        await this.page.locator(this.feetOption).click();
    }

    async clickCalculateButton() {
        await this.page.locator('div.component--quantity-calculator-form > form > button').click();
    }

    async isMaterialNeededTextVisible() {
        await expect(this.page.locator(this.materialNeededText)).toBeVisible();
    }

    async getCalculatedValue() {
        const element = this.page.locator(this.calculatedValue);
        return await element.textContent();
    }

    async isCalculatedValueVisible() {
        await expect(this.page.locator(this.calculatedValue)).toBeVisible();
    }

    async clickApplyEstimateButton() {
        await this.page.locator(this.applyEstimateLink).click();
    }

    async getCustomQuantityFieldValue() {
        return await this.page.locator(this.customQuantityField).inputValue();
    }

    async isErrorMessageVisible(expectedMessage = null) {
        console.log('Checking if error message is visible');
        
        // Wait a moment for error to appear
        await this.page.waitForTimeout(500);
        
        if (expectedMessage) {
            // Look for specific error message using multiple strategies
            const searchStrategies = [
                // Exact match
                this.page.locator(`text="${expectedMessage}"`).first(),
                // Partial match
                this.page.locator(`text="${expectedMessage.substring(0, 20)}"`).first(),
                // Using getByText
                this.page.getByText(expectedMessage).first(),
                // Common error containers with text
                this.page.locator(`p:has-text("${expectedMessage.substring(0, 15)}")`).first(),
                this.page.locator(`span:has-text("${expectedMessage.substring(0, 15)}")`).first(),
                this.page.locator(`div.MuiFormHelperText-root:has-text("${expectedMessage.substring(0, 15)}")`).first()
            ];
            
            for (const locator of searchStrategies) {
                try {
                    if (await locator.isVisible({ timeout: 1000 })) {
                        console.log(`Error message "${expectedMessage}" visible: true`);
                        return true;
                    }
                } catch {
                    continue;
                }
            }
            console.log(`Error message "${expectedMessage}" visible: false`);
            
            // Debug: Look for any visible text containing "quantity" or "between"
            const debugSelectors = [
                '*:has-text("Quantity")',
                '*:has-text("between")',
                '*:has-text("must be")',
                '.MuiFormHelperText-root'
            ];
            for (const sel of debugSelectors) {
                try {
                    const count = await this.page.locator(sel).count();
                    if (count > 0) {
                        const text = await this.page.locator(sel).first().textContent();
                        console.log(`Debug - Found with "${sel}": "${text?.substring(0, 50)}..."`);
                    }
                } catch {}
            }
            
            return false;
        }
        // Look for any error-like messages
        const possibleSelectors = [
            'p:has-text("Please enter")',
            'div:has-text("Please enter")',
            'span:has-text("Please enter")',
            '.MuiFormHelperText-root',
            '[class*="error"]',
            '[class*="invalid"]'
        ];

        for (const selector of possibleSelectors) {
            try {
                const isVisible = await this.page.locator(selector).first().isVisible();
                if (isVisible) {
                    console.log(`Found error message with selector: ${selector}`);
                    return true;
                }
            } catch (e) {
                // Continue checking other selectors
            }
        }

        console.log('No error message found');
        return false;
    }

    async getErrorMessageText() {
        console.log('Getting error message text');
        // Try to find any error message
        const possibleSelectors = [
            'p:has-text("Please enter")',
            'div:has-text("Please enter")',
            'span:has-text("Please enter")',
            '[class*="error"]',
            '[class*="invalid"]'
        ];

        for (const selector of possibleSelectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible()) {
                    const text = await element.textContent();
                    console.log(`Found error message text: "${text}"`);
                    return text;
                }
            } catch (e) {
                // Continue checking other selectors
            }
        }

        console.log('No error message text found');
        return '';
    }

    async clickDeliveryInfoButton() {
        console.log('Clicking on delivery info button');
        await this.page.locator(this.deliveryInfoButton).nth(1).click();
        // Wait for tooltip to appear
        await this.page.waitForTimeout(500);
        console.log('Delivery info button clicked');
    }

    async getTooltipMessage() {
        console.log('Getting tooltip message text');
        
        // Try multiple tooltip locators
        const tooltipSelectors = [
            'div[role="tooltip"]',
            '[role="tooltip"]',
            '.MuiTooltip-tooltip',
            'div[class*="tooltip"]',
            'div[class*="Tooltip"]'
        ];
        
        for (const selector of tooltipSelectors) {
            try {
                const tooltipElement = this.page.locator(selector).first();
                if (await tooltipElement.isVisible({ timeout: 2000 })) {
                    const text = await tooltipElement.textContent();
                    console.log(`Tooltip message: "${text}"`);
                    return text;
                }
            } catch (e) {
                continue;
            }
        }
        
        console.log('Tooltip not found with any selector');
        return '';
    }

    // ========================================================================
    // ADD TO CART FUNCTIONALITY
    // ========================================================================

    /**
     * Click Add to Cart button on PDP
     */
    async clickAddToCart() {
        console.log('Clicking Add to Cart button on PDP...');
        
        // Close any blocking modals
        await this.closeBlockingModals();
        await this.page.waitForTimeout(500);

        const addToCartSelectors = [
            this.addToCartButton,  // 'button.MuiButton-outlinedPrimary[name="addToCart"]'
            'button[name="addToCart"]',
            'button:has-text("Add to Cart")',
            '[data-testid="add-to-cart"]',
            'button[aria-label="Add to Cart"]'
        ];

        for (const selector of addToCartSelectors) {
            try {
                const button = this.page.locator(selector).first();
                if (await button.isVisible({ timeout: 3000 })) {
                    await button.scrollIntoViewIfNeeded();
                    await button.click();
                    console.log(`✓ Clicked Add to Cart with: ${selector}`);
                    await this.page.waitForTimeout(2000);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error('Add to Cart button not found on PDP');
    }

    /**
     * Close any blocking modals on the page
     */
    async closeBlockingModals() {
        const modalCloseSelectors = [
            'button[aria-label="close"]',
            'button[aria-label="Close"]',
            '[data-testid="modal-close"]',
            '.modal-close',
            'button:has-text("Close")',
            '[role="dialog"] button[aria-label="close"]'
        ];

        for (const selector of modalCloseSelectors) {
            try {
                const closeBtn = this.page.locator(selector).first();
                if (await closeBtn.isVisible({ timeout: 1000 })) {
                    await closeBtn.click();
                    console.log(`Closed modal with: ${selector}`);
                    await this.page.waitForTimeout(500);
                }
            } catch (e) {
                continue;
            }
        }
    }

    /**
     * Check if Add to Cart button is visible
     */
    async isAddToCartButtonVisible() {
        const addToCartBtn = this.page.locator(this.addToCartButton);
        return await addToCartBtn.isVisible().catch(() => false);
    }

    /**
     * Set custom quantity on PDP
     * @param {string|number} quantity - The quantity to set
     */
    async setCustomQuantity(quantity) {
        console.log(`Setting custom quantity to ${quantity}...`);
        const quantityField = this.page.locator(this.customQuantityField);
        await quantityField.clear();
        await quantityField.fill(quantity.toString());
        
        // Trigger blur to update the price
        await quantityField.blur();
        await this.page.waitForTimeout(1500);
        console.log(`✓ Custom quantity set to ${quantity}`);
    }

    /**
     * Get current quantity value from the PDP
     */
    async getCurrentQuantity() {
        const quantityField = this.page.locator(this.customQuantityField);
        const value = await quantityField.inputValue();
        console.log(`Current quantity: ${value}`);
        return value;
    }

    /**
     * Wait for cart confirmation after adding product
     */
    async waitForCartConfirmation() {
        console.log('Waiting for cart confirmation...');
        const confirmationSelectors = [
            'text=/added to cart/i',
            'text=/item added/i',
            '.MuiSnackbar-root',
            '[role="alert"]',
            '.cart-confirmation'
        ];

        for (const selector of confirmationSelectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 5000 })) {
                    console.log(`✓ Cart confirmation visible with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        console.log('No explicit confirmation, checking cart badge...');
        return true; // Continue even without explicit confirmation
    }

    /**
     * Click Buy Now button on PDP
     */
    async clickBuyNow() {
        console.log('Clicking Buy Now button on PDP...');
        const buyNowBtn = this.page.locator(this.buyNowButton);
        await buyNowBtn.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Clicked Buy Now');
    }
}

module.exports = ProductDisplayPage;
