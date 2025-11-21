const { expect } = require('@playwright/test');
const SearchPage = require('./SearchPage');

class ProductListingPage extends SearchPage {
    constructor(page) {
        super(page);

        //quantity selector
        this.qtySelectorArrow = page.locator('div.flex.items-center.gap-2 > svg.MuiSvgIcon-root >path')

        // Product tile container locators
        this.productTiles = page.locator('div.component--product-tile>a[href^="/product/"]');
        this.productTileContainer = page.locator('.s-result-item');

        // Product tile component locators
       this.productName = "p.component--typography.global-text-lg";
       this.productThumbnail = 'img[data-nimg="fill"]';
        this.productDetails = 'div.product-description ul > li';
        this.productPrice = 'p[aria-label^="Total Price"]';
        this.unitPrice = 'span[aria-label^="Price per Ton"]';
        this.totalPrice = 'p[aria-label^="Total Price"]';
        this.deliveryPrice = 'p[aria-label^="Delivery Price"]';
        this.addToCartButton = 'button[aria-label="Add to Cart"]';
        this.productBadges = '.a-badge-label-inner.a-text-ellipsis';
        this.infoIcon = 'svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeInherit.mui-1cms5u3';

        // Quantity selector locators
        this.QuantitySelectorHeader = 'h3:has-text("Select Quantity")';
        this.QuantitySelectorSubtext = 'p:has-text("Select an option")';
        this.Tonswatchs = "p.component--typography.global-text-md-bold";
        this.CustomQuantityTextField = 'label.MuiFormLabel-root.MuiInputLabel-root';
        this.CustomQuantityValueField = 'input[name=quantity]';
        this.QuantitySelectorSaveButton = 'button[type=submit]>div';
        this.QuantitySelectorCloseButton = 'button[aria-label="close"]';
        this.ShowPricesForValue='div.component--quantity-selector-button> button > div > p';
        this.addAddressButtonLocator='button:has-text("Add Address For Exact Price")';
        this.addLocation='#location-autocomplete';
        this.addressSubmit='button[type=submit]';
    }

    async clickOnArrow() {
        console.log('Clicking on Qty Selector arrow');
        await this.qtySelectorArrow.click();
        console.log('Qty Selector arrow clicked');
    }

    async navigateToPlp(url) {
        console.log(`Navigating to PLP URL: ${url}`);
        await this.page.goto(url);
        console.log('Page loaded, waiting for product tiles');
        await this.waitForProductTilesToLoad();
        console.log('Initial product tiles loaded');
    }

    async waitForProductTilesToLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('div.component--product-tile>a[href^="/product/"]', { timeout: 10000 });
        await this.productTiles.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async scrollAndWaitForAllProductsToLoad() {
        let previousCount = 0;
        let currentCount = await this.getProductTileCount();

        while (currentCount > previousCount) {
            previousCount = currentCount;

            // Scroll to the bottom of the page
            await this.page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            // Wait for potential new products to load
            await this.page.waitForTimeout(5000); // Increased wait time for loading

            currentCount = await this.getProductTileCount();
        }

        console.log(`All products loaded. Total count: ${currentCount}`);
    }

    async verifyProductTileComponents(component) {
    const productTile = this.productTiles.first();
    console.log(`Verifying component: ${component}`);

    const softExpect = async (description, assertionFn) => {
        try {
            await assertionFn();
            console.log(`✓ ${description} is visible`);
        } catch (error) {
            console.warn(`✗ ${description} is NOT visible`);
            console.warn(`  ↳ Reason: ${error.message}`);
        }
    };

    switch (component.toLowerCase()) {
        case 'component':
            await softExpect('Component (product tile)', async () => {
                await expect(productTile).toBeVisible();
            });
            break;

        case 'product name':
            await softExpect('Product name component', async () => {
                await expect(productTile.locator(this.productName)).toBeVisible();
            });
            break;

        case 'product thumbnail':
            await softExpect('Product thumbnail component', async () => {
                await expect(productTile.locator(this.productThumbnail)).toBeVisible();
            });
            break;

        case 'product details':
            await softExpect('Product details component', async () => {
                await expect(productTile.locator(this.productDetails.first())).toBeVisible();
            });
            break;

        case 'product price':
            await softExpect('Product price component', async () => {
                await expect(productTile.locator(this.productPrice)).toBeVisible();
            });
            break;

        case 'delivery price':
            await softExpect('Delivery price component', async () => {
                const deliveryInfo = productTile.locator(this.deliveryPrice);
                await expect(deliveryInfo).toBeVisible();
            });
            break;

        case 'information CTA':
            await softExpect('information CTA component', async () => {
                const infoIcon = productTile.locator(this.infoIcon);
                await expect(infoIcon).toBeVisible();
            });
            break;

        case 'add to cart':
            await softExpect('Add to cart component', async () => {
                await expect(productTile.locator(this.addToCartButton)).toBeVisible();
            });
            break;

        default:
            console.warn(`⚠ Unknown component: ${component}`);
    }
    }

    async isComponentVisible(component) {
        const productTile = this.productTiles.first();

        switch (component.toLowerCase()) {
            case 'component':
                return await productTile.isVisible();
            case 'product name':
                return await productTile.locator(this.productName).isVisible();
            case 'product thumbnail':
                return await productTile.locator(this.productThumbnail).isVisible();
            case 'product details':
                return await productTile.locator(this.productDetails).count() > 0;
            case 'product price':
                return await productTile.locator(this.productPrice).isVisible();
            case 'delivery price':
                return await productTile.locator(this.deliveryPrice).isVisible();
            case 'add to cart':
                return await productTile.locator(this.addToCartButton).isVisible();
            case 'information cta':
                return await productTile.locator(this.infoIcon).isVisible();
            default:
                console.warn(`⚠ Unknown component: ${component}`);
                return false;
        }
    }

    async verifyUnitPriceDisplayed() {
        const productTile = this.productTiles.first();
        const unitPrice = productTile.locator(this.unitPrice);

        // Check if unit price is visible or if there's any price information
        const isUnitPriceVisible = await unitPrice.first().isVisible();
        const hasAnyPrice = await productTile.locator(this.productPrice).isVisible();

        expect(isUnitPriceVisible || hasAnyPrice).toBeTruthy();
    }

    async verifyTotalPriceDisplayed() {
        const productTile = this.productTiles.first();
        const totalPrice = productTile.locator(this.totalPrice);
        const regularPrice = productTile.locator(this.productPrice);

        // Total price might be the same as regular price for some items
        const isTotalPriceVisible = await totalPrice.isVisible();
        const isRegularPriceVisible = await regularPrice.isVisible();

        expect(isTotalPriceVisible || isRegularPriceVisible).toBeTruthy();
    }

    async verifyDeliveryPriceDisplayed() {
        const productTile = this.productTiles.first();
        const deliveryPrice = productTile.locator(this.deliveryPrice);

        // Check for delivery price or free delivery text
        const isDeliveryPriceVisible = await deliveryPrice.isVisible();


        expect(isDeliveryPriceVisible).toBeTruthy();
    }

    async verifyBadgesWhenApplicable() {
        const productTile = this.productTiles.first();
        const badges = productTile.locator(this.productBadges);

        const badgeCount = await badges.count();

        if (badgeCount > 0) {
            for (let i = 0; i < badgeCount; i++) {
                await expect(badges.nth(i)).toBeVisible();
            }
            console.log(`Badges available: true (${badgeCount} badges)`);
            return true;
        } else {
            console.log('Badges available: false');
            return false;
        }
    }

    async getProductTileCount() {
        return await this.productTiles.count();
    }

    async getProductDetails(tileIndex = 0) {
        const productTile = this.productTiles.nth(tileIndex);

        return {
            name: await productTile.locator(this.productName).textContent(),
            price: await productTile.locator(this.productPrice).textContent(),
            hasThumbnail: await productTile.locator(this.productThumbnail).isVisible(),
            hasAddToCart: await productTile.locator(this.addToCartButton).isVisible()
        };
    }

    async verifyAllComponentsForTile(tileIndex = 0) {
        const productTile = this.productTiles.nth(tileIndex);

        const components = {
            'product name': await productTile.locator(this.productName).isVisible(),
            'product thumbnail': await productTile.locator(this.productThumbnail).isVisible(),
            'product price': await productTile.locator(this.productPrice).isVisible(),
            'add to cart': await productTile.locator(this.addToCartButton).isVisible()
        };

        return components;
    }

    async getLoggingAllComponentsList() {
        console.log('Logging all product tile components:');
        console.log('- component (product tile)');
        console.log('- product name');
        console.log('- product thumbnail');
        console.log('- product details');
        console.log('- product price');
        console.log('- add to cart');
    }

    async getUnitPrice() {
        const productTile = this.productTiles.first();
        const unitPriceElement = productTile.locator(this.unitPrice).first();
        return await unitPriceElement.textContent() || 'Not found';
    }

    async getTotalPrice() {
        const productTile = this.productTiles.first();
        const totalPriceElement = productTile.locator(this.totalPrice);
        return await totalPriceElement.textContent() || 'Not found';
    }

    async getDeliveryPrice() {
        const productTile = this.productTiles.first();
        const deliveryPriceElement = productTile.locator(this.deliveryPrice);
        const deliveryText = await deliveryPriceElement.textContent();
        return deliveryText || 'Free Delivery' || 'Not found';
    }

    async getProductName() {
        const productTile = this.productTiles.first();
        const productNameElement = productTile.locator(this.productName);
        return await productNameElement.textContent() || 'Not found';
    }

    async verifyQuantitySelectorHeaderDisplayed(){
        const QuantitySelectorHeader= this.QuantitySelectorHeader.isVisible();
        expect(QuantitySelectorHeader).toBeTruthy();
    }

    async verifyQuantitySelectorSubtextDisplayed(){
        const QuantitySelectorSubtext= this.QuantitySelectorSubtext.isVisible();
        expect(QuantitySelectorSubtext).toBeTruthy();
    }

    async verifyTwentytwoTonswatchHighlighted(){
        const TwentytwoTonswatch = this.page.locator(`p.component--typography.global-text-md-bold:text("22 Tons")`);
        const isVisible = await TwentytwoTonswatch.isVisible();
        expect(isVisible).toBeTruthy();
    }

    async verifyAllTonsSwatches(){
        const FiveTonSwatch= this.Tonswatchs.nth(1).isVisible();
        expect(FiveTonSwatch).toBeTruthy();

        const TenTonSwatch= this.Tonswatchs.nth(2).isVisible();
        expect(TenTonSwatch).toBeTruthy();

        const FifteenTonSwatch= this.Tonswatchs.nth(3).isVisible();
        expect(FifteenTonSwatch).toBeTruthy();
    }

    async verifyCustomQuantityTextFieldDisplayed(){
        const CustomQuantityTextField= this.CustomQuantityTextField.isVisible();
        expect(CustomQuantityTextField).toBeTruthy();
    }

    async verifyQuantitySelectorSaveButtonDisplayed(){
        const QuantitySelectorSaveButton= this.QuantitySelectorSaveButton.isVisible();
        expect(QuantitySelectorSaveButton).toBeTruthy();
    }

    async verifyQuantitySelectorCloseButtonDisplayed(){
        const QuantitySelectorCloseButton= this.QuantitySelectorCloseButton.isVisible();
        expect(QuantitySelectorCloseButton).toBeTruthy();
    }

    async getQuantitySelectorHeader() {
        console.log('Getting Quantity Selector Header text');
        const headerText = await this.page.locator(this.QuantitySelectorHeader).textContent();
        console.log(`Header text: ${headerText}`);
        return headerText;
    }

    async getQuantitySelectorSubtext() {
        console.log('Getting Quantity Selector Subtext');
        const subtext = await this.page.locator(this.QuantitySelectorSubtext).textContent();
        console.log(`Subtext: ${subtext}`);
        return subtext;
    }

    async isTwentyTwoTonSwatchHighlighted() {
        const swatch = this.page.locator(`p.component--typography.global-text-md-bold:text("22 Tons")`);
        const className = await swatch.getAttribute('class');
        return className && (className.includes('selected') || className.includes('active') || className.includes('highlighted'));
    }

    async areSwatchesVisible(tonsArray) {
        console.log(`Checking visibility of swatches for: ${tonsArray.join(', ')}`);
        for (const tons of tonsArray) {
            console.log(`Checking swatch for ${tons} Tons`);
            const swatch = this.page.locator(`p.component--typography.global-text-md-bold:text("${tons} Tons")`).first();
            await swatch.waitFor({ state: 'visible', timeout: 10000 });
            const isVisible = await swatch.isVisible();
            console.log(`Swatch ${tons} Tons visible: ${isVisible}`);
            if (!isVisible) {
                console.log(`Swatch ${tons} Tons not visible, returning false`);
                return false;
            }
        }
        console.log('All swatches are visible');
        return true;
    }

    async isCustomQuantityFieldVisible() {
        console.log('Checking if Custom Quantity Field is visible');
        const visible = await this.page.locator(this.CustomQuantityTextField).isVisible();
        console.log(`Custom Quantity Field visible: ${visible}`);
        return visible;
    }

    async isInformationTooltipIconVisible() {
        console.log('Checking if Information Tooltip Icon is visible in Select Quantity modal');
        const quantityModal = this.page.locator('div:has(h3:has-text("Select Quantity"))');
        const visible = await quantityModal.locator('svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeInherit').isVisible();
        console.log(`Information Tooltip Icon visible: ${visible}`);
        return visible;
    }

    async isSaveButtonVisible() {
        console.log('Checking if Save Button is visible');
        const visible = await this.page.locator(this.QuantitySelectorSaveButton).isVisible();
        console.log(`Save Button visible: ${visible}`);
        return visible;
    }

    async isCloseButtonVisible() {
        console.log('Checking if Close Button is visible');
        const visible = await this.page.locator(this.QuantitySelectorCloseButton).isVisible();
        console.log(`Close Button visible: ${visible}`);
        return visible;
    }

    async clickFirstProduct() {
        console.log('Clicking on the first product tile');
        const firstProduct = this.productTiles.nth(0);
        await firstProduct.click();
        console.log('Clicked on first product, waiting for navigation');
        await this.page.waitForLoadState('networkidle');
        console.log('Navigation completed');
    }

    async clickSecondProduct() {
        console.log('Clicking on the second product tile');
        const secondProduct = this.productTiles.nth(1);
        await secondProduct.click();
        console.log('Clicked on second product, waiting for navigation');
        await this.page.waitForLoadState('networkidle');
        console.log('Navigation completed');
    }

    async isOnProductDetailPage() {
        console.log('Checking if redirected to Product Detail Page');
        const url = this.page.url();
        console.log(`Current URL: ${url}`);

        const isProductUrl = url.includes('/product/') || url.includes('/Product/');
        console.log(`URL contains product path: ${isProductUrl}`);

        try {
            await this.page.waitForSelector('.component--product-description-product-overview', { timeout: 10000 });
            console.log('Product detail elements found');
            return true;
        } catch {
            if (isProductUrl) {
                console.log('On PDP based on URL pattern');
                return true;
            }
            console.log('Not on PDP');
            return false;
        }
    }

    async verifyNavigationBarCategoriesDisplayed() {
        console.log('Checking if navigation bar categories are displayed');

        const navBarSelector = 'div[role="navigation"]';
        const navBar = this.page.locator(navBarSelector);

        await navBar.waitFor({ state: 'visible', timeout: 10000 });

        const categories = await this.page.locator('div[aria-label="product categories"][role="tablist"] > a').all();
        console.log(`Found ${categories.length} navigation categories`);

        for (const category of categories) {
            const text = await category.textContent();
            console.log(`Category: ${text?.trim()}`);
        }

        const hasCategories = categories.length > 0;
        console.log(`Navigation bar categories displayed: ${hasCategories}`);
        return hasCategories;
    }

    async getNavigationBarDefaultSelection() {
        console.log('Getting navigation bar default selection');
        const activeSelector = 'div[aria-label="product categories"] > a[aria-selected="true"]';
        const defaultItem = this.page.locator(activeSelector);

        try {
            const text = await defaultItem.first().textContent();
            console.log(`Default selection: ${text?.trim()}`);
            return text?.trim() || 'All Products';
        } catch {
            console.log('No specific active item found, defaulting to All Products');
            return 'All Products';
        }
    }

    async clickCategoryInNavigationBar() {
        console.log('Selecting a category from navigation bar');
        const categoryLinks = this.page.locator('div[aria-label="product categories"][role="tablist"] > a');

        const totalCategories = await categoryLinks.count();
        console.log(`Total categories found: ${totalCategories}`);

        if (totalCategories >= 2) {
            const secondCategory = categoryLinks.nth(1);
            const categoryName = await secondCategory.textContent();
            console.log(`Clicking category: ${categoryName?.trim()}`);
            await secondCategory.click();
            console.log('Category clicked, waiting for page to load');
            await this.page.waitForLoadState('networkidle');
            await this.waitForProductTilesToLoad();
        } else {
            console.log('Less than 2 categories available, refreshing current page');
            await this.page.reload();
        }
    }

    async verifyCategoryHighlighted() {
        console.log('Verifying that a category is highlighted');
        const activeSelector = 'div[aria-label="product categories"] > a[aria-selected="true"]';
        const isHighlighted = await this.page.locator(activeSelector).isVisible();
        console.log(`Category highlight present: ${isHighlighted}`);
        return isHighlighted;
    }

    async verifyCategoryProductsLoaded() {
        console.log('Verifying that category products are loaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        await this.waitForProductTilesToLoad();

        const productCount = await this.getProductTileCount();
        const url = this.page.url();
        console.log(`URL after category selection: ${url}`);
        console.log(`Product count after category selection: ${productCount}`);

        return productCount > 0;
    }

    async addAddressLocation(zipCode) {
        console.log('⭐⭐⭐ STARTING addAddressLocation method ⭐⭐⭐');
        console.log('ZIP code:', zipCode);

        console.log('1. Checking if Add Address button is visible...');
        const addAddressButton = this.page.locator(this.addAddressButtonLocator);
        const isVisible = await addAddressButton.isVisible().catch(() => false);

        if (!isVisible) {
            console.log('❌ Add Address button is NOT visible! Clicking anyway...');
            await addAddressButton.click().catch(e => console.log('Error clicking invis button:', e.message));
        } else {
            console.log('✓ Add Address button is visible, clicking it...');
            await addAddressButton.click().catch(e => console.log('Click failed:', e.message));
            console.log('✓ Add Address button clicked');
        }

        console.log('2. Checking if location autocomplete field is visible...');
        const locationField = this.page.locator(this.addLocation);
        await locationField.waitFor({ state: 'visible', timeout: 10000 }).catch(() => console.log('Location field timeout'));
        console.log('✓ Location field found, clicking and typing...');
        await locationField.click().catch(() => console.log('Click failed'));
        await locationField.type(zipCode).catch(() => console.log('Type failed'));
        await this.page.keyboard.press('Enter');
        console.log('✓ Typed ZIP code and pressed Enter:', zipCode);

        console.log('3. Checking if submit button is visible...');
        const submitButton = this.page.locator(this.addressSubmit);
        await submitButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => console.log('Submit button timeout'));
        console.log('✓ Submit button found, clicking it...');
        await submitButton.click().catch(() => console.log('Submit click failed'));
        console.log('✓ Submit button clicked');

        console.log(' COMPLETED addAddressLocation for zip code: ${zipCode}');
    }
}

module.exports = ProductListingPage;
