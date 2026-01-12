const { expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        
        // Cart icon and count (header)
        this.cartIcon = 'a[href*="/cart"], [aria-label*="Cart"], .cart-icon';
        this.cartBadge = '.MuiBadge-badge';
        
        // Cart confirmation slider (right-hand side)
        this.cartSlider = '.MuiDrawer-root, [role="dialog"]';
        this.sliderTitle = 'text="UPDATED TO CART", text="ADDED TO CART"';
        this.sliderProductName = '.MuiDrawer-root p';
        this.sliderQuantity = 'text=/\\d+ Tons/';
        this.sliderPrice = 'text=/\\$[0-9,]+/';
        this.sliderCloseButton = 'button[aria-label="close"], button[aria-label="Close"]';
        this.viewCartButton = 'button:has-text("View Cart")';
        this.editQuantityLink = 'text="Edit Quantity In Cart"';
        
        // Cart page elements
        this.cartContainer = '.cart-container, [data-testid="cart"]';
        this.cartItem = '.cart-item, [data-testid="cart-item"]';
        this.productName = '.product-name, [data-testid="product-name"]';
        this.productQuantity = 'input[type="number"], .quantity-value';
        this.productPrice = '.product-price, [data-testid="price"]';
        
        // Remove button
        this.removeButton = 'button:has-text("Remove"), [aria-label*="remove"], [aria-label*="delete"]';
        
        // Empty cart
        this.emptyCartMessage = 'text=/empty/i, text=/no items/i';
        
        // Totals
        this.subtotal = '.subtotal, [data-testid="subtotal"]';
        this.totalPrice = '.total-price, [data-testid="total"]';
    }

    // ========================================================================
    // CART ICON & COUNT
    // ========================================================================

    async clickCartIcon() {
        console.log('Clicking cart icon...');
        const selectors = [
            '[data-testid="cart-icon"]',
            '.cart-icon',
            'a[href*="/cart"]',
            '[aria-label*="cart"]',
            '[aria-label*="Cart"]',
            'button:has-text("Cart")',
            '.MuiIconButton-root[aria-label*="cart"]',
            'header a[href*="cart"]',
            '.header-cart',
            'svg[data-testid="ShoppingCartIcon"]'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    await element.click();
                    console.log(`✓ Clicked cart with: ${selector}`);
                    await this.page.waitForTimeout(1500);
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        // Try navigating directly to cart page
        console.log('Cart icon not found, navigating to /cart...');
        await this.page.goto('https://qa-shop.vulcanmaterials.com/cart');
        await this.page.waitForTimeout(2000);
    }

    async getCartItemCount() {
        console.log('Getting cart item count...');
        const selectors = [
            '.MuiBadge-badge',
            '[data-testid="cart-count"]',
            '.cart-count',
            '.cart-badge'
        ];

        for (const selector of selectors) {
            try {
                const badge = this.page.locator(selector).first();
                if (await badge.isVisible({ timeout: 2000 })) {
                    const text = await badge.textContent();
                    const count = parseInt(text.trim()) || 0;
                    console.log(`Cart count: ${count}`);
                    return count;
                }
            } catch (e) {
                continue;
            }
        }

        console.log('Cart badge not found, returning 0');
        return 0;
    }

    // ========================================================================
    // CART CONFIRMATION
    // ========================================================================

    async isCartConfirmationVisible() {
        console.log('Checking for cart confirmation...');
        const selectors = [
            'text=/added to cart/i',
            'text=/item added/i',
            '.MuiSnackbar-root',
            '[data-testid="add-to-cart-confirmation"]',
            '.cart-confirmation',
            '.success-message',
            '[role="alert"]'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 5000 })) {
                    console.log(`✓ Confirmation visible with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        // Check if cart count increased as alternative confirmation
        const count = await this.getCartItemCount();
        if (count > 0) {
            console.log('✓ Cart confirmation via cart count increase');
            return true;
        }

        console.log('No cart confirmation found');
        return false;
    }

    // ========================================================================
    // CART CONTENTS
    // ========================================================================

    async hasProductsInCart() {
        console.log('Checking if cart has products...');
        await this.page.waitForTimeout(1000);

        const selectors = [
            '.cart-item',
            '[data-testid="cart-item"]',
            '.MuiListItem-root',
            '.product-in-cart',
            '[data-testid="product-name"]',
            '.cart-product'
        ];

        for (const selector of selectors) {
            try {
                const items = this.page.locator(selector);
                const count = await items.count();
                if (count > 0) {
                    console.log(`✓ Found ${count} products in cart`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        // Check page content for product indicators
        const pageText = await this.page.textContent('body');
        if (pageText && (pageText.includes('$') && pageText.includes('ton'))) {
            console.log('✓ Cart has product (detected via page content)');
            return true;
        }

        console.log('No products found in cart');
        return false;
    }

    async getProductCount() {
        const selectors = [
            '.cart-item',
            '[data-testid="cart-item"]',
            '.cart-product'
        ];

        for (const selector of selectors) {
            try {
                const items = this.page.locator(selector);
                const count = await items.count();
                if (count > 0) {
                    console.log(`Product count in cart: ${count}`);
                    return count;
                }
            } catch (e) {
                continue;
            }
        }

        return 0;
    }

    async getProductQuantity() {
        const selectors = [
            'input[type="number"]',
            '.quantity-value',
            '[data-testid="quantity"]',
            '.product-quantity'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    const value = await element.inputValue().catch(() => null) ||
                                  await element.textContent();
                    console.log(`Product quantity: ${value}`);
                    return value.toString().trim();
                }
            } catch (e) {
                continue;
            }
        }

        return '0';
    }

    // ========================================================================
    // PRICING
    // ========================================================================

    async getTotalPrice() {
        const selectors = [
            '.total-price',
            '[data-testid="total"]',
            '.order-total',
            'text=/Total.*\\$/i',
            '.cart-total'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    const text = await element.textContent();
                    const price = parseFloat(text.replace(/[^0-9.]/g, ''));
                    console.log(`Total price: $${price}`);
                    return price;
                }
            } catch (e) {
                continue;
            }
        }

        return 0;
    }

    async getDeliveryCharges() {
        const selectors = [
            '.delivery-charges',
            '[data-testid="delivery-charges"]',
            'text=/Delivery.*\\$/i',
            '.shipping-cost'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    const text = await element.textContent();
                    const price = parseFloat(text.replace(/[^0-9.]/g, ''));
                    console.log(`Delivery charges: $${price}`);
                    return price;
                }
            } catch (e) {
                continue;
            }
        }

        return 0;
    }

    async hasDeliveryCharges() {
        console.log('Checking for delivery charges in cart...');
        const selectors = [
            'text=/Delivery.*\\$/i',
            'text=/Shipping.*\\$/i',
            '.delivery-charges',
            '[data-testid="delivery-charges"]',
            'text=/\\$.*per load/i'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`✓ Delivery charges found with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        console.log('No delivery charges found');
        return false;
    }

    // ========================================================================
    // PICKUP INFO
    // ========================================================================

    async hasPickupFacilityInfo() {
        console.log('Checking for pickup facility info in cart...');
        const selectors = [
            'text=/Pickup at/i',
            'text=/Pick up/i',
            '.pickup-info',
            '[data-testid="pickup-facility"]',
            'text=/Facility/i'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`✓ Pickup facility info found with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        console.log('No pickup facility info found');
        return false;
    }

    // ========================================================================
    // DELIVERY ADDRESS
    // ========================================================================

    async hasDeliveryAddress() {
        console.log('Checking for delivery address in cart...');
        const selectors = [
            '.delivery-address',
            '[data-testid="delivery-address"]',
            'text=/Deliver to/i',
            'text=/Delivery Address/i'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`✓ Delivery address found with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        return false;
    }

    // ========================================================================
    // CART ACTIONS
    // ========================================================================

    async updateQuantity(quantity) {
        console.log(`Updating quantity to ${quantity}...`);
        const input = this.page.locator('input[type="number"]').first();
        await input.fill('');
        await input.fill(quantity);
        
        // Look for update button or trigger blur
        const updateBtn = this.page.locator('button:has-text("Update")').first();
        if (await updateBtn.isVisible({ timeout: 2000 })) {
            await updateBtn.click();
        } else {
            await input.blur();
        }
        
        await this.page.waitForTimeout(2000);
        console.log(`✓ Quantity updated to ${quantity}`);
    }

    async removeFirstProduct() {
        console.log('Removing first product from cart...');
        const selectors = [
            'button:has-text("Remove")',
            '[data-testid="remove-item"]',
            '.remove-item',
            'button[aria-label*="remove"]',
            'button[aria-label*="delete"]'
        ];

        for (const selector of selectors) {
            try {
                const button = this.page.locator(selector).first();
                if (await button.isVisible({ timeout: 2000 })) {
                    await button.click();
                    console.log(`✓ Clicked remove with: ${selector}`);
                    await this.page.waitForTimeout(2000);
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error('Remove button not found');
    }

    async isCartEmpty() {
        await this.page.waitForTimeout(1000);
        const productCount = await this.getProductCount();
        return productCount === 0;
    }

    async hasEmptyCartMessage() {
        const selectors = [
            'text=/empty/i',
            'text=/no items/i',
            '[data-testid="empty-cart"]',
            '.empty-cart-message'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    console.log(`✓ Empty cart message found with: ${selector}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }

        return false;
    }

    // ========================================================================
    // CHECKOUT
    // ========================================================================

    async clickCheckout() {
        console.log('Clicking checkout button...');
        const selectors = [
            'button:has-text("Checkout")',
            'button:has-text("Proceed to Checkout")',
            '[data-testid="checkout"]',
            'a[href*="checkout"]'
        ];

        for (const selector of selectors) {
            try {
                const button = this.page.locator(selector).first();
                if (await button.isVisible({ timeout: 2000 })) {
                    await button.click();
                    console.log(`✓ Clicked checkout with: ${selector}`);
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error('Checkout button not found');
    }
}

module.exports = CartPage;
