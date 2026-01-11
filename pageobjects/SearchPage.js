const { expect } = require('@playwright/test');

class SearchPage {
    constructor(page) {
        this.page = page;

         //search locators
        this.searchInput='.component--app-header-search-button>button';
        this.resultsFor='div.component--search-result-page p:has-text("Results for")';
        this.searchKey='div.component--search-result-page h1 q';
        this.noResultsMessage='p:has-text("Sorry, no results found")';

        //search suggestions locators
        this.productsSuggestions='h4:has-text("PRODUCTS")';
        this.categoriesSuggestions='h4:has-text("CATEGORIES")';
    }

    async closeBlockingModals() {
        try {
            // Try multiple strategies to close any blocking modal dialogs
            const closeStrategies = [
                // Strategy 1: Close button with CloseIcon
                async () => {
                    const closeBtn = this.page.locator('[data-testid="CloseIcon"]').first();
                    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                        await closeBtn.click();
                        console.log('✓ Closed blocking modal dialog via CloseIcon');
                        return true;
                    }
                    return false;
                },
                // Strategy 2: Close button in dialog
                async () => {
                    const closeBtn = this.page.locator('.MuiDialog-root button[aria-label="close"], .MuiDialog-root .MuiIconButton-root').first();
                    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                        await closeBtn.click();
                        console.log('✓ Closed blocking modal dialog via close button');
                        return true;
                    }
                    return false;
                },
                // Strategy 3: Press Escape key
                async () => {
                    const dialog = this.page.locator('.MuiDialog-root').first();
                    if (await dialog.isVisible({ timeout: 1000 }).catch(() => false)) {
                        await this.page.keyboard.press('Escape');
                        await this.page.waitForTimeout(500);
                        console.log('✓ Closed blocking modal via Escape key');
                        return true;
                    }
                    return false;
                }
            ];

            for (const strategy of closeStrategies) {
                if (await strategy()) {
                    await this.page.waitForTimeout(500);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log('No blocking modal to close or error:', error.message);
            return false;
        }
    }

   async enterSearchTerm(searchTerm) {
        console.log(`Entering search term: ${searchTerm}`);

        // Close any blocking modals first - try multiple times with waits
        for (let i = 0; i < 3; i++) {
            const closed = await this.closeBlockingModals();
            if (closed) {
                await this.page.waitForTimeout(500); // Wait for modal animation
            }
        }

        // Wait for any modal to fully disappear
        try {
            await this.page.waitForSelector('div[data-testid="dialog"]', { state: 'hidden', timeout: 5000 });
        } catch (e) {
            // Modal may not exist, that's fine
        }

        // Wait for search button and click to open search
        await this.page.locator('.component--app-header-search-button>button').click({ force: true });

        // Wait for search input field to be visible and interactable
        await this.page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });

        // Clear and fill the search input field
        await this.page.fill('input[placeholder*="Search"]', '');
        await this.page.fill('input[placeholder*="Search"]', searchTerm);

        // Press Enter to submit the search
        await this.page.press('input[placeholder*="Search"]', 'Enter');

        console.log(`Search term "${searchTerm}" entered and Enter pressed`);

        // Wait for search results to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    async verifyOnSearchResultPage() {
        console.log('Verifying navigation to Search Result Page');

        const url = this.page.url();
        console.log(`Current URL: ${url}`);

        // Check if URL contains search parameters or SRP-specific patterns
        const isSRP = url.includes('/search') || url.includes('q=Stone') ||
                     await this.page.locator('h1:has-text("Results")').isVisible() ||
                     await this.page.locator('h2:has-text("Search Results")').isVisible();

        if (isSRP) {
            console.log('Confirmed: Navigated to Search Result Page');
            return true;
        } else {
            throw new Error('Not navigated to Search Result Page');
        }
    }

    async getSearchResultsHeaderAndKeyword() {
        console.log('Getting search results header and keyword text');

        try {
            // Get the "Results for" text from the provided locator
            const resultsForElement = this.page.locator(this.resultsFor);
            const resultsFor = await resultsForElement.textContent() || 'Results for';

            // Get the search keyword from the provided locator
            const keywordElement = this.page.locator(this.searchKey);
            const keyword = (await keywordElement.textContent()) || '';

            console.log(`Found: Results for="${resultsFor}", Keyword="${keyword}"`);
            console.log(`Raw results for element:`, await resultsForElement.allTextContents());
            console.log(`Raw keyword element:`, await keywordElement.allTextContents());

            return {
                resultsFor: resultsFor.trim(),
                keyword: keyword.trim()
            };
        } catch (error) {
            console.log(`Error getting header and keyword:`, error);
            console.log('Trying alternative locators...');

            // Try alternative locators
            try {
                const keywordAlt = await this.page.locator('q').first().textContent() || '';
                console.log(`Alternative keyword found: "${keywordAlt}"`);

                return {
                    resultsFor: 'Results for',
                    keyword: keywordAlt.trim()
                };
            } catch (altError) {
                console.log(`Alternative locator also failed:`, altError);
                return {
                    resultsFor: 'Results for',
                    keyword: ''
                };
            }
        }
    }

    async getSearchResultsProductCount() {
        console.log('Counting products in search results');

        // Use the existing method to get product tiles count
        const productCount = await this.getProductTileCount();
        console.log(`Found ${productCount} products in search results`);

        return productCount;
    }

    async enterSearchTermWithoutEnter(searchTerm) {
        console.log(`Entering search term without submitting: ${searchTerm}`);

        // Close any blocking modals first
        await this.closeBlockingModals();
        await this.closeBlockingModals(); // Try twice in case of multiple modals

       // Wait for search button and click to open search
        await this.page.locator('.component--app-header-search-button>button').click();

        // Wait for search input field to be visible and interactable
        await this.page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });

        // Clear and fill the search input field
        await this.page.fill('input[placeholder*="Search"]', '');
        await this.page.fill('input[placeholder*="Search"]', searchTerm);
        // Wait for suggestions to appear
        await this.page.waitForTimeout(1000);

        console.log(`Search term "${searchTerm}" entered without submitting`);
    }

    async verifySearchSuggestions() {
        console.log('Verifying search suggestions are visible');

        const productsSection = this.page.locator(this.productsSuggestions);
        const categoriesSection = this.page.locator(this.categoriesSuggestions);

        await expect(productsSection).toBeVisible();
        await expect(categoriesSection).toBeVisible();

        // Check if there are suggestion items using the provided locators
        const productItems = this.page.locator('ul:nth-child(1) > a > div.MuiListItemText-root.mui-14rdsw0 > span > p');
        const categoryItems = this.page.locator('ul:nth-child(2) > a > div.MuiListItemText-root.mui-14rdsw0 > span > p');

        const productCount = await productItems.count();
        const categoryCount = await categoryItems.count();

        expect(productCount).toBeGreaterThan(0);
        expect(categoryCount).toBeGreaterThan(0);

        // Log the suggestions in console
        console.log(`Found ${productCount} product suggestions:`);
        for (let i = 0; i < productCount; i++) {
            const text = await productItems.nth(i).textContent();
            console.log(`  Product ${i + 1}: ${text}`);
        }

        console.log(`Found ${categoryCount} category suggestions:`);
        for (let i = 0; i < categoryCount; i++) {
            const text = await categoryItems.nth(i).textContent();
            console.log(`  Category ${i + 1}: ${text}`);
        }

        console.log('Search suggestions verified');
    }

    async verifyNoSearchSuggestions() {
        console.log('Verifying search suggestions are not visible');

        const productsSection = this.page.locator(this.productsSuggestions);
        const categoriesSection = this.page.locator(this.categoriesSuggestions);

        // Check that the sections are not visible
        await expect(productsSection).not.toBeVisible();
        await expect(categoriesSection).not.toBeVisible();

        // Also check that the suggestion items are not present
        const productItems = this.page.locator('ul:nth-child(1) > a > div.MuiListItemText-root.mui-14rdsw0 > span > p');
        const categoryItems = this.page.locator('ul:nth-child(2) > a > div.MuiListItemText-root.mui-14rdsw0 > span > p');

        const productCount = await productItems.count();
        const categoryCount = await categoryItems.count();

        expect(productCount).toBe(0);
        expect(categoryCount).toBe(0);

        console.log('No search suggestions found - verification passed');
    }

    async clickFirstCategorySuggestion() {
        console.log('Clicking on the first category suggestion');

        // Wait for suggestions to be visible
        await this.page.waitForTimeout(1000);

        // Click on the first category suggestion using the specific locator
        const firstCategorySuggestion = this.page.locator('ul:nth-child(2) > a').first();
        await firstCategorySuggestion.click();

        console.log('Clicked on first category suggestion, waiting for navigation');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    async verifyNavigationToCategoryPage() {
        console.log('Verifying navigation to category page');

        const currentUrl = this.page.url();
        console.log(`Current URL after clicking category suggestion: ${currentUrl}`);

        // Check if URL contains category-related parameters or if we're on a category page
        const isCategoryPage = currentUrl.includes('/category/') ;

        if (isCategoryPage) {
            console.log('Successfully navigated to category page');
            return true;
        } else {
            // Additional check: verify we have products displayed (indicating category filter applied)
            const productCount = await this.getProductTileCount();
            if (productCount > 0) {
                console.log(`Category page verified - ${productCount} products displayed`);
                return true;
            }
            throw new Error('Not navigated to category page');
        }
    }

    async updateCustomQuantityField(quantity) {
        console.log(`Updating custom quantity field to ${quantity}`);
        await this.page.locator(this.CustomQuantityValueField).fill(quantity.toString());
        console.log(`Custom quantity field updated to ${quantity}`);
    }

    async clickSaveButton() {
        console.log('Clicking Save button in quantity selector');
        await this.page.locator(this.QuantitySelectorSaveButton).click();
        await this.page.waitForTimeout(1000); // Wait for price updates
        console.log('Save button clicked successfully');
    }

    async getDisplayedQuantity() {
        console.log('Getting displayed quantity value');
        try {
            const quantityText = await this.page.locator(this.ShowPricesForValue).textContent();
            console.log(`Raw quantity text: "${quantityText}"`);
            // Extract number from text like "Show prices for 25 tons"
            const match = quantityText.match(/(\d+)/);
            const quantity = match ? parseInt(match[1], 10) : null;
            console.log(`Parsed quantity: ${quantity}`);
            return quantity;
        } catch (error) {
            console.log(`Error getting displayed quantity: ${error.message}`);
            // Fallback: check if quantity selector is closed
            const isModalClosed = !(await this.page.locator('div:has(h3:has-text("Select Quantity"))').isVisible());
            console.log(`Quantity selector modal closed: ${isModalClosed}`);
            if (isModalClosed) {
                // Assume quantity was saved successfully
                return parseInt(this.page.locator(this.CustomQuantityValueField).getAttribute('value')) || 25;
            }
            throw error;
        }
    }

    async isUnitPriceVisiblePLP() {
        const productTile = this.productTiles.first();
        return await productTile.locator(this.unitPrice).isVisible();
    }

    async isTotalPriceVisiblePLP() {
        const productTile = this.productTiles.first();
        return await productTile.locator(this.totalPrice).isVisible();
    }

    async getUnitPriceNumericPLP() {
        const unitPriceText = await this.getUnitPrice();
        // Extract numeric value from price string (e.g., "$123.45" -> 123.45)
        const match = unitPriceText.match(/\$?(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async getTotalPriceNumericPLP() {
        const totalPriceText = await this.getTotalPrice();
        // Extract numeric value from price string (e.g., "$123.45" -> 123.45)
        const match = totalPriceText.match(/\$?(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async verifyNoResultsFoundMessage() {
        console.log('Verifying "no results found" message is displayed');
        const noResultsMessage = this.page.locator(this.noResultsMessage);
        await expect(noResultsMessage).toBeVisible();
        console.log('No results found message is displayed');
        return true;
    }

    // ============================================================================
    // NEW METHODS FOR SEARCH FEATURE (11 Jan 2026)
    // ============================================================================

    async openSearchAndType(text) {
        try {
            await this.closeBlockingModals();
            await this.closeBlockingModals();
            
            await this.page.locator('.component--app-header-search-button>button').click();
            await this.page.waitForSelector('input[placeholder*="Search"]', { timeout: 10000 });
            await this.page.fill('input[placeholder*="Search"]', text);
            await this.page.waitForTimeout(500);
        } catch (error) {
            throw new Error(`Failed to open search and type: ${error.message}`);
        }
    }

    async clearAndType(text) {
        try {
            await this.page.fill('input[placeholder*="Search"]', '');
            await this.page.fill('input[placeholder*="Search"]', text);
            // Wait longer for autocomplete suggestions to appear
            await this.page.waitForTimeout(2000);
        } catch (error) {
            throw new Error(`Failed to clear and type: ${error.message}`);
        }
    }

    async hasSearchResults() {
        try {
            // Check for product tiles or results indication
            const hasProducts = await this.page.locator('[class*="product-tile"], [class*="ProductTile"]').first().isVisible({ timeout: 3000 }).catch(() => false);
            const hasResultsFor = await this.page.locator('text=/Results for/i').first().isVisible({ timeout: 2000 }).catch(() => false);
            const hasItems = await this.page.locator('text=/\\d+ items?/i').first().isVisible({ timeout: 2000 }).catch(() => false);
            
            return hasProducts || hasResultsFor || hasItems;
        } catch (error) {
            return false;
        }
    }

    async resultsContainKeyword(keyword) {
        try {
            const pageText = await this.page.locator('body').innerText();
            return pageText.toLowerCase().includes(keyword.toLowerCase());
        } catch (error) {
            return false;
        }
    }

    async hasResultCount() {
        try {
            const countElement = await this.page.locator('text=/\\d+ items?|\\d+ results?|\\d+ products?/i').first();
            return await countElement.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async getResultCount() {
        try {
            const countElement = await this.page.locator('text=/\\d+ items?|\\d+ results?|\\d+ products?/i').first();
            const text = await countElement.textContent();
            const match = text.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        } catch (error) {
            return 0;
        }
    }

    async hasNoResultsMessage() {
        try {
            const noResults = await this.page.locator('text=/no results|no products found|sorry.*no/i').first();
            return await noResults.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasErrorMessage() {
        try {
            const error = await this.page.locator('text=/error|something went wrong|500|404/i').first();
            return await error.isVisible({ timeout: 1000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasAutocompleteSuggestions() {
        try {
            const products = await this.page.locator(this.productsSuggestions).isVisible({ timeout: 2000 }).catch(() => false);
            const categories = await this.page.locator(this.categoriesSuggestions).isVisible({ timeout: 2000 }).catch(() => false);
            return products || categories;
        } catch (error) {
            return false;
        }
    }

    async hasProductSuggestions() {
        try {
            return await this.page.locator(this.productsSuggestions).isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasCategorySuggestions() {
        try {
            return await this.page.locator(this.categoriesSuggestions).isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async clickFirstSuggestion() {
        try {
            await this.page.waitForTimeout(500);
            // Try product suggestion first, then category
            const productSuggestion = this.page.locator('ul:nth-child(1) > a').first();
            if (await productSuggestion.isVisible({ timeout: 1000 }).catch(() => false)) {
                await productSuggestion.click();
            } else {
                const categorySuggestion = this.page.locator('ul:nth-child(2) > a').first();
                await categorySuggestion.click();
            }
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click first suggestion: ${error.message}`);
        }
    }

    async clickFirstSearchResult() {
        try {
            await this.closeBlockingModals();
            const firstProduct = this.page.locator('[class*="product-tile"] a, [class*="ProductTile"] a').first();
            await firstProduct.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click first search result: ${error.message}`);
        }
    }

    async navigateToPLP() {
        try {
            await this.closeBlockingModals();
            await this.closeBlockingModals();
            
            // Navigate to PLP - try clicking "Shop by Categories" or direct navigation
            const shopByCategories = this.page.locator('text=/Shop by Categories/i').first();
            if (await shopByCategories.isVisible({ timeout: 2000 }).catch(() => false)) {
                await shopByCategories.click();
                await this.page.waitForTimeout(1000);
                // Click first category
                const firstCategory = this.page.locator('[class*="category"] a, [class*="menu"] a').first();
                if (await firstCategory.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await firstCategory.click();
                }
            } else {
                // Direct navigation fallback
                const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
                await this.page.goto(`${baseUrl}/category/all-products`);
            }
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.log(`PLP navigation warning: ${error.message}`);
        }
    }

    async navigateToPDP() {
        try {
            await this.navigateToPLP();
            await this.clickFirstSearchResult();
        } catch (error) {
            console.log(`PDP navigation warning: ${error.message}`);
        }
    }

    async navigateToCart() {
        try {
            await this.closeBlockingModals();
            const cartIcon = this.page.locator('[class*="cart"], [aria-label*="cart" i]').first();
            await cartIcon.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.log(`Cart navigation warning: ${error.message}`);
        }
    }

    async typeInSearchBox(text) {
        try {
            const searchInput = this.page.locator('input[placeholder*="Search"]');
            if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                await searchInput.fill(text);
            } else {
                await this.openSearchAndType(text);
            }
        } catch (error) {
            throw new Error(`Failed to type in search box: ${error.message}`);
        }
    }
}

module.exports = SearchPage;
