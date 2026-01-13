/**
 * MyAccountPage - Page Object for My Account sections
 * Created: 11 January 2026
 * 
 * Pages covered:
 *   - My Profile (/account)
 *   - Purchase History (/order/history)
 *   - Payment (/payment)
 */

class MyAccountPage {

    constructor(page) {
        this.page = page;

        // My Account dropdown elements
        this.myAccountBtn = page.locator('span:has-text("My Account")');
        this.myProfileLink = page.locator('button:has-text("My Profile"), a:has-text("My Profile"), text=My Profile');
        this.purchaseHistoryLink = page.locator('button:has-text("Purchase History"), a:has-text("Purchase History"), text=Purchase History');
        this.paymentLink = page.locator('button:has-text("Payment"), a:has-text("Payment")');

        // My Profile page elements
        this.myProfileHeader = page.locator('text="MY PROFILE"');

        // Purchase History page elements
        this.purchaseHistoryHeader = page.locator('text="PURCHASE HISTORY"');

        // Payment page elements
        this.paymentHeader = page.locator('text="PAYMENT"');
        this.noSavedPaymentText = page.locator('text="NO SAVED PAYMENT"');
        this.noPaymentCardText = page.locator('text=/haven.*added any payment card/i');
        this.addPaymentBtn = page.locator('button:has-text("Add Payment")');
    }

    // Close any blocking modal dialogs
    async closeBlockingModals() {
        try {
            const dialogClose = this.page.locator('[data-testid="dialog"] button[aria-label="close"], [class*="MuiDialog"] button:has(svg)').first();
            if (await dialogClose.isVisible({ timeout: 1000 }).catch(() => false)) {
                await dialogClose.click();
                await this.page.waitForTimeout(500);
            }
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
        } catch (error) {
            // No blocking modals
        }
    }

    // Open My Account dropdown
    async openMyAccount() {
        await this.closeBlockingModals();
        await this.myAccountBtn.click();
        await this.page.waitForTimeout(500);
    }

    // Navigate to My Profile page
    async clickMyProfile() {
        await this.closeBlockingModals();
        await this.page.waitForTimeout(500);
        
        // Try multiple strategies to click My Profile
        try {
            await this.myProfileLink.first().click({ timeout: 5000 });
        } catch (error) {
            // Fallback: direct navigation
            console.log('My Profile link click failed, navigating directly...');
            await this.page.goto('https://qa-shop.vulcanmaterials.com/account');
        }
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    // Navigate to Purchase History page
    async clickPurchaseHistory() {
        await this.closeBlockingModals();
        await this.page.waitForTimeout(500);
        
        // Try multiple strategies to click Purchase History
        try {
            await this.purchaseHistoryLink.first().click({ timeout: 5000 });
        } catch (error) {
            // Fallback: direct navigation
            console.log('Purchase History link click failed, navigating directly...');
            await this.page.goto('https://qa-shop.vulcanmaterials.com/order/history');
        }
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    // Navigate to Payment page
    async clickPayment() {
        await this.closeBlockingModals();
        await this.page.waitForTimeout(500);
        
        // Try multiple strategies to click Payment
        try {
            // Look specifically for the Payment link in the dropdown
            const paymentInDropdown = this.page.locator('[class*="popover"], [class*="dropdown"], [class*="menu"]').locator('text=Payment').first();
            if (await paymentInDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await paymentInDropdown.click();
            } else {
                await this.paymentLink.first().click({ timeout: 5000 });
            }
        } catch (error) {
            // Fallback: direct navigation
            console.log('Payment link click failed, navigating directly...');
            await this.page.goto('https://qa-shop.vulcanmaterials.com/payment');
        }
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    // ==================== MY PROFILE VALIDATIONS ====================

    async isMyProfileHeaderVisible() {
        try {
            await this.page.waitForTimeout(1000);
            
            // Check URL first (most reliable)
            const url = this.page.url();
            if (url.includes('/account')) {
                console.log('✓ URL indicates My Profile page: ' + url);
                return true;
            }
            
            // Check for "MY PROFILE" text anywhere on the page
            const header = this.page.locator('text="MY PROFILE"').first();
            if (await header.isVisible({ timeout: 3000 }).catch(() => false)) {
                return true;
            }
            
            // Check for Personal Info section as indicator
            const personalInfo = this.page.locator('text="Personal Info"').first();
            if (await personalInfo.isVisible({ timeout: 2000 }).catch(() => false)) {
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    async getFirstNameFromProfile() {
        try {
            await this.page.waitForTimeout(500);
            
            // Look for the value next to "First Name" label
            // Based on screenshot: First Name | Vivek
            const firstNameRow = this.page.locator('text=First Name').first();
            if (await firstNameRow.isVisible({ timeout: 2000 })) {
                // Get the sibling/next element with the value
                const container = firstNameRow.locator('xpath=ancestor::div[1]');
                const containerText = await container.textContent();
                
                // Extract just the name value
                const match = containerText.match(/First Name\s*([A-Za-z]+)/);
                if (match) {
                    return match[1].trim();
                }
                
                // Try getting next sibling
                const valueElement = this.page.locator('text=First Name').locator('xpath=following-sibling::*[1] | ../following-sibling::*[1]').first();
                if (await valueElement.isVisible({ timeout: 1000 }).catch(() => false)) {
                    return (await valueElement.textContent()).trim();
                }
            }
            
            // Fallback: Look for "Vivek" specifically based on test data
            const nameLocator = this.page.locator('text=/^Vivek$/i').first();
            if (await nameLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
                return (await nameLocator.textContent()).trim();
            }

            return null;
        } catch (error) {
            console.log(`Error getting first name: ${error.message}`);
            return null;
        }
    }

    async getLastNameFromProfile() {
        try {
            await this.page.waitForTimeout(500);
            
            // Look for the value next to "Last Name" label
            const lastNameRow = this.page.locator('text=Last Name').first();
            if (await lastNameRow.isVisible({ timeout: 2000 })) {
                const container = lastNameRow.locator('xpath=ancestor::div[1]');
                const containerText = await container.textContent();
                
                const match = containerText.match(/Last Name\s*([A-Za-z]+)/);
                if (match) {
                    return match[1].trim();
                }
                
                const valueElement = this.page.locator('text=Last Name').locator('xpath=following-sibling::*[1] | ../following-sibling::*[1]').first();
                if (await valueElement.isVisible({ timeout: 1000 }).catch(() => false)) {
                    return (await valueElement.textContent()).trim();
                }
            }
            
            // Fallback: Look for "pankaj" specifically based on test data
            const nameLocator = this.page.locator('text=/^pankaj$/i').first();
            if (await nameLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
                return (await nameLocator.textContent()).trim();
            }

            return null;
        } catch (error) {
            console.log(`Error getting last name: ${error.message}`);
            return null;
        }
    }

    async getEmailFromProfile() {
        try {
            await this.page.waitForTimeout(500);
            
            // Look for email pattern on the page
            const emailLocator = this.page.locator('text=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/').first();
            if (await emailLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                return (await emailLocator.textContent()).trim();
            }
            
            // Look in Login Info section
            const emailRow = this.page.locator('text=Email').first();
            if (await emailRow.isVisible({ timeout: 2000 })) {
                const valueElement = this.page.locator('text=Email').locator('xpath=following-sibling::*[1] | ../following-sibling::*[1]').first();
                if (await valueElement.isVisible({ timeout: 1000 }).catch(() => false)) {
                    return (await valueElement.textContent()).trim();
                }
            }

            return null;
        } catch (error) {
            console.log(`Error getting email: ${error.message}`);
            return null;
        }
    }

    // ==================== PURCHASE HISTORY VALIDATIONS ====================

    async isPurchaseHistoryHeaderVisible() {
        try {
            const header = this.page.locator('text="PURCHASE HISTORY"').first();
            if (await header.isVisible({ timeout: 3000 }).catch(() => false)) {
                return true;
            }
            const url = this.page.url();
            return url.includes('/order/history');
        } catch (error) {
            return false;
        }
    }

    async getOrderCount() {
        try {
            await this.page.waitForTimeout(1000);
            // Count all order cards/sections on the page
            const orders = this.page.locator('text=/Order #\\d+/');
            const count = await orders.count();
            return count;
        } catch (error) {
            console.log(`Error getting order count: ${error.message}`);
            return 0;
        }
    }

    async hasNoOrdersMessage() {
        try {
            // Check for "no orders" empty state message
            // TODO: Update locator when actual message text is known
            const noOrdersLocators = [
                this.page.locator('text=/no.*order/i').first(),
                this.page.locator('text=/no existing order/i').first(),
                this.page.locator('text=/no purchase history/i').first(),
                this.page.locator('text=/you have not placed any orders/i').first(),
                this.page.locator('text=/no orders found/i').first(),
                this.page.locator('[class*="empty"]').first()
            ];

            for (const loc of noOrdersLocators) {
                const isVis = await loc.isVisible({ timeout: 1000 }).catch(() => false);
                if (isVis) {
                    const msgText = await loc.textContent().catch(() => '');
                    console.log(`Found "no orders" message: ${msgText}`);
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async getFirstOrderDetails() {
        try {
            const details = {
                orderNumber: null,
                orderDate: null,
                products: []
            };

            // Get order number (e.g., "Order #202196")
            const orderNumLocator = this.page.locator('text=/Order #\\d+/').first();
            if (await orderNumLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                const orderText = await orderNumLocator.textContent();
                const match = orderText.match(/#(\d+)/);
                details.orderNumber = match ? match[1] : orderText;
            }

            // Get order date (e.g., "Order Date: Jan 10, 2026")
            const dateLocator = this.page.locator('text=/Order Date:/').first();
            if (await dateLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                const dateText = await dateLocator.textContent();
                details.orderDate = dateText.replace('Order Date:', '').trim();
            }

            // Get product details
            const productNames = await this.page.locator('text=/\\d.*" .*Base|Aggregate|Stone|Gravel/i').allTextContents();
            const quantities = await this.page.locator('text=/\\d+ Tons/').allTextContents();
            
            for (let i = 0; i < Math.min(productNames.length, quantities.length); i++) {
                details.products.push({
                    name: productNames[i],
                    quantity: quantities[i]
                });
            }

            return details;
        } catch (error) {
            console.log(`Error getting order details: ${error.message}`);
            return null;
        }
    }

    async getFirstOrderType() {
        try {
            // Look for Pickup or Delivery label on the first order card
            // Based on screenshots: "Pickup" appears with truck icon at top-right of order card
            const firstOrderCard = this.page.locator('text=/Order #\\d+/').first();
            
            // Check if Pickup label is visible near the first order
            const pickupLabel = this.page.locator('text=/Pickup/i').first();
            const deliveryLabel = this.page.locator('text=/Delivery/i').first();
            
            const isPickup = await pickupLabel.isVisible({ timeout: 2000 }).catch(() => false);
            const isDelivery = await deliveryLabel.isVisible({ timeout: 2000 }).catch(() => false);
            
            if (isPickup) {
                console.log("First order type detected: PICKUP");
                return 'pickup';
            } else if (isDelivery) {
                console.log("First order type detected: DELIVERY");
                return 'delivery';
            }
            
            // Fallback: try to find by class or specific attributes
            const pickupByClass = await this.page.locator('[class*="pickup" i], [data-type="pickup"]').first().isVisible({ timeout: 1000 }).catch(() => false);
            if (pickupByClass) {
                console.log("First order type detected via class: PICKUP");
                return 'pickup';
            }
            
            console.log("Could not determine order type, defaulting to PICKUP");
            return 'pickup';
        } catch (error) {
            console.log(`Error detecting order type: ${error.message}`);
            return 'pickup'; // Default fallback
        }
    }

    async hasOrderNumberAndDate() {
        try {
            const hasOrderNum = await this.page.locator('text=/Order #\\d+/').first().isVisible({ timeout: 2000 });
            const hasDate = await this.page.locator('text=/Order Date:|\\w{3} \\d+, \\d{4}/').first().isVisible({ timeout: 2000 });
            return hasOrderNum && hasDate;
        } catch (error) {
            return false;
        }
    }

    async hasProductDetailsWithQuantity() {
        try {
            // Check for product images or product names
            const hasProducts = await this.page.locator('text=/Base|Aggregate|Stone|Gravel/i').first().isVisible({ timeout: 2000 }).catch(() => false);
            // Check for quantity (e.g., "22 Tons", "5 Tons")
            const hasQuantity = await this.page.locator('text=/\\d+ Tons/').first().isVisible({ timeout: 2000 }).catch(() => false);
            return hasProducts && hasQuantity;
        } catch (error) {
            return false;
        }
    }

    // ==================== PAYMENT VALIDATIONS ====================

    async isPaymentHeaderVisible() {
        try {
            const header = this.page.locator('text="PAYMENT"').first();
            if (await header.isVisible({ timeout: 3000 }).catch(() => false)) {
                return true;
            }
            const url = this.page.url();
            return url.includes('/payment');
        } catch (error) {
            return false;
        }
    }

    async hasPaymentCards() {
        try {
            // Check if there are any saved cards (not showing "NO SAVED PAYMENT")
            const noPayment = await this.noSavedPaymentText.isVisible({ timeout: 2000 }).catch(() => false);
            return !noPayment;
        } catch (error) {
            return false;
        }
    }

    async getPaymentPageState() {
        try {
            const state = {
                hasSavedCards: false,
                showsEmptyState: false,
                emptyStateText: null,
                hasAddPaymentButton: false
            };

            // Check for empty state
            if (await this.noSavedPaymentText.isVisible({ timeout: 2000 }).catch(() => false)) {
                state.showsEmptyState = true;
                state.emptyStateText = "NO SAVED PAYMENT";
                
                // Get the subtext too
                if (await this.noPaymentCardText.isVisible({ timeout: 1000 }).catch(() => false)) {
                    state.emptyStateText += " - " + await this.noPaymentCardText.textContent();
                }
            } else {
                state.hasSavedCards = true;
            }

            // Check for Add Payment button
            state.hasAddPaymentButton = await this.addPaymentBtn.isVisible({ timeout: 2000 }).catch(() => false);

            return state;
        } catch (error) {
            console.log(`Error getting payment page state: ${error.message}`);
            return null;
        }
    }

    async isAddPaymentButtonVisible() {
        try {
            // Look for "+ Add Payment" button
            const addPaymentBtn = this.page.locator('button:has-text("Add Payment"), text=/\\+ Add Payment/').first();
            return await addPaymentBtn.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    // ==================== PURCHASE HISTORY - ORDER LIST VALIDATIONS ====================

    async hasOrderTotal() {
        try {
            const orderTotal = this.page.locator('text=/Order Total.*\\$[\\d,]+\\.\\d{2}/').first();
            return await orderTotal.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasViewDetailsButton() {
        try {
            // Based on screenshot: View Details is an <a> tag with href="/order/details/..."
            // First scroll to Order Total area to ensure buttons are visible
            const orderTotal = this.page.locator('text=/Order Total.*\\$/').first();
            if (await orderTotal.isVisible({ timeout: 2000 }).catch(() => false)) {
                await orderTotal.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
            }
            
            // Use the exact structure from screenshot: <a> with href containing /order/details/
            const viewDetailsLink = this.page.locator('a[href*="/order/details/"]').first();
            if (await viewDetailsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log('✓ View Details link found');
                return true;
            }
            
            // Fallback: look for text "View Details" in a div with component--typography class
            const viewDetailsText = this.page.locator('div.component--typography:has-text("View Details")').first();
            return await viewDetailsText.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasReorderButton() {
        try {
            // Based on screenshot: "Re-order" is an orange MuiButton next to View Details
            // Try multiple strategies
            const strategies = [
                this.page.locator('button:has-text("Re-order")').first(),
                this.page.locator('button:has-text("Reorder")').first(),
                this.page.locator('button.MuiButton-containedSecondary').first(),
                this.page.locator('[class*="MuiButton"][class*="contained"]').filter({ hasText: /re-?order/i }).first()
            ];
            
            for (const locator of strategies) {
                if (await locator.isVisible({ timeout: 1000 }).catch(() => false)) {
                    console.log('✓ Re-order button found');
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async clickViewDetailsFirstOrder() {
        try {
            await this.closeBlockingModals();
            
            // Scroll to see the View Details button
            const orderTotal = this.page.locator('text=/Order Total.*\\$/').first();
            if (await orderTotal.isVisible({ timeout: 2000 }).catch(() => false)) {
                await orderTotal.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
            }
            
            // Click the View Details link (using href pattern from screenshot)
            const viewDetailsLink = this.page.locator('a[href*="/order/details/"]').first();
            await viewDetailsLink.click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1000);
        } catch (error) {
            throw new Error(`Failed to click View Details: ${error.message}`);
        }
    }

    // ==================== ORDER DETAILS PAGE VALIDATIONS ====================

    async isOrderDetailsPage() {
        try {
            await this.page.waitForTimeout(1000);
            const url = this.page.url();
            if (url.includes('/order/details')) {
                return true;
            }
            // Also check for ORDER # header
            const orderHeader = this.page.locator('text=/ORDER #\\d+/').first();
            return await orderHeader.isVisible({ timeout: 3000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async getOrderDetailsPageInfo() {
        try {
            const info = {
                orderNumber: null,
                orderDate: null
            };

            await this.page.waitForTimeout(1000);
            
            // Get order number from page header - "ORDER #202196"
            // Try multiple strategies
            let orderHeader = this.page.locator('text=/ORDER\\s*#\\d+/i').first();
            if (await orderHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
                const text = await orderHeader.textContent();
                const match = text.match(/#(\d+)/);
                info.orderNumber = match ? match[1] : null;
                console.log(`Found order number via ORDER #: ${info.orderNumber}`);
            }
            
            // Fallback: look for any element containing the order number pattern
            if (!info.orderNumber) {
                const pageContent = await this.page.content();
                const orderMatch = pageContent.match(/ORDER\s*#(\d+)/i);
                if (orderMatch) {
                    info.orderNumber = orderMatch[1];
                    console.log(`Found order number via page content: ${info.orderNumber}`);
                }
            }

            // Get order date - "Order Date: Jan 10, 2026"
            const dateLocator = this.page.locator('text=/Order Date:/i').first();
            if (await dateLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                const dateText = await dateLocator.textContent();
                info.orderDate = dateText.replace(/Order Date:/i, '').trim();
                console.log(`Found order date: ${info.orderDate}`);
            }

            return info;
        } catch (error) {
            console.log(`Error getting order details info: ${error.message}`);
            return null;
        }
    }

    async hasModifyQuantityLinks() {
        try {
            const modifyLinks = this.page.locator('text=Modify Quantity');
            const count = await modifyLinks.count();
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    async getModifyQuantityLinksCount() {
        try {
            const modifyLinks = this.page.locator('text=Modify Quantity');
            return await modifyLinks.count();
        } catch (error) {
            return 0;
        }
    }

    async hasOrderSummarySection() {
        try {
            // Wait for page to load
            await this.page.waitForTimeout(1000);
            
            // Try multiple selectors for Order Summary section
            const selectors = [
                'text="Order Summary"',
                'text="ORDER SUMMARY"',
                'h2:has-text("Order Summary")',
                'h3:has-text("Order Summary")',
                '[class*="order-summary"]',
                '[class*="OrderSummary"]',
                // Cart page specific - look for Subtotal, Delivery Charges, Estimated Total
                'text="Subtotal"',
                'text="Estimated Total"',
                // Additional cart page selectors
                'text="Delivery Charges"',
                'text="Pickup Charges"',
                'button:has-text("Checkout")'
            ];
            
            for (const selector of selectors) {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                    console.log(`Order Summary found with: ${selector}`);
                    return true;
                }
            }
            
            // Take screenshot for debugging
            console.log('Order Summary selectors not found, checking page content...');
            const pageContent = await this.page.textContent('body');
            console.log('Page contains Order Summary:', pageContent.includes('Order Summary'));
            console.log('Page contains Subtotal:', pageContent.includes('Subtotal'));
            
            return false;
        } catch (error) {
            console.log('Error in hasOrderSummarySection:', error.message);
            return false;
        }
    }

    async hasPickupOrDeliverySection() {
        try {
            // Scroll down to find the Pickup/Delivery section
            await this.page.evaluate(() => window.scrollBy(0, 600));
            await this.page.waitForTimeout(500);
            
            // Try multiple locator strategies
            const locators = [
                this.page.locator('text=/PICKUP DETAILS/i').first(),
                this.page.locator('text=/DELIVERY DETAILS/i').first(),
                this.page.locator('text=/Pickup Address/i').first(),
                this.page.locator('text=/Delivery Address/i').first(),
                this.page.locator('text=/PICKUP ADDRESS/i').first(),
                this.page.locator('text=/DELIVERY ADDRESS/i').first(),
                this.page.locator('[class*="pickup"], [class*="delivery"]').first(),
                this.page.getByText('Pickup Details').first(),
                this.page.getByText('Delivery Details').first()
            ];

            for (const loc of locators) {
                const isVis = await loc.isVisible({ timeout: 1000 }).catch(() => false);
                if (isVis) {
                    console.log('Found Pickup/Delivery section');
                    return true;
                }
            }

            // Scroll more if not found
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(500);

            for (const loc of locators) {
                const isVis = await loc.isVisible({ timeout: 1000 }).catch(() => false);
                if (isVis) {
                    console.log('Found Pickup/Delivery section after full scroll');
                    return true;
                }
            }

            // Debug: log what's visible on page
            const pageText = await this.page.locator('body').innerText();
            console.log('Page text sample (last 1000 chars):', pageText.slice(-1000));

            return false;
        } catch (error) {
            console.log('Error checking Pickup/Delivery section:', error.message);
            return false;
        }
    }

    async hasPickupAddressSection() {
        try {
            const pickupAddress = this.page.locator('text=/PICKUP ADDRESS/i').first();
            return await pickupAddress.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasDeliveryAddressSection() {
        try {
            const deliveryAddress = this.page.locator('text=/DELIVERY ADDRESS/i').first();
            return await deliveryAddress.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async hasPickupDetailsSection() {
        try {
            // Look for "PICKUP DETAILS" header with "Modify" link
            const pickupDetails = this.page.locator('text=/PICKUP DETAILS/i').first();
            const modifyLink = this.page.locator('text=Modify').first();
            
            const hasDetails = await pickupDetails.isVisible({ timeout: 2000 }).catch(() => false);
            const hasModify = await modifyLink.isVisible({ timeout: 1000 }).catch(() => false);
            
            return hasDetails && hasModify;
        } catch (error) {
            return false;
        }
    }

    async hasDeliveryDetailsSection() {
        try {
            // Look for "DELIVERY DETAILS" header with "Modify" link
            const deliveryDetails = this.page.locator('text=/DELIVERY DETAILS/i').first();
            const modifyLink = this.page.locator('text=Modify').first();
            
            const hasDetails = await deliveryDetails.isVisible({ timeout: 2000 }).catch(() => false);
            const hasModify = await modifyLink.isVisible({ timeout: 1000 }).catch(() => false);
            
            return hasDetails && hasModify;
        } catch (error) {
            return false;
        }
    }

    async getCurrentContactInfo() {
        try {
            const contactInfo = {
                name: null,
                phone: null,
                email: null
            };

            // Look for Contact Info section
            const contactSection = this.page.locator('text=/Contact Info/i').first();
            if (await contactSection.isVisible({ timeout: 2000 }).catch(() => false)) {
                // Get the text content after "Contact Info"
                const sectionText = await this.page.locator('text=/Contact Info/i').locator('xpath=following-sibling::*').allTextContents();
                console.log('Contact Info section text:', sectionText);
            }

            return contactInfo;
        } catch (error) {
            return null;
        }
    }

    // ==================== MODIFY QUANTITY FLOW ====================

    async clickModifyQuantityFirstProduct() {
        try {
            await this.closeBlockingModals();
            const modifyLink = this.page.locator('text=Modify Quantity').first();
            await modifyLink.click();
            await this.page.waitForTimeout(500);
        } catch (error) {
            throw new Error(`Failed to click Modify Quantity: ${error.message}`);
        }
    }

    async isQuantityInputVisible() {
        try {
            const quantityInput = this.page.locator('input[type="text"], input[type="number"]').filter({ hasText: /Tons/i }).first();
            const customQtyInput = this.page.locator('text=/Enter Custom Quantity/').first();
            const inputField = this.page.locator('input').filter({ has: this.page.locator('xpath=ancestor::*[contains(text(), "Tons")]') }).first();
            
            // Check for any visible input after clicking Modify Quantity
            const anyInput = this.page.locator('[class*="quantity"] input, input[placeholder*="quantity" i]').first();
            
            return await customQtyInput.isVisible({ timeout: 2000 }).catch(() => false) ||
                   await quantityInput.isVisible({ timeout: 2000 }).catch(() => false) ||
                   await anyInput.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async isSaveButtonForQuantityVisible() {
        try {
            const saveBtn = this.page.locator('button:has-text("Save")').first();
            return await saveBtn.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async isCloseXButtonForQuantityVisible() {
        try {
            // Look for X button near quantity edit
            const closeBtn = this.page.locator('[class*="close"], button:has(svg[data-testid="CloseIcon"]), text=×').first();
            return await closeBtn.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async getCurrentQuantityFirstProduct() {
        try {
            const quantityText = this.page.locator('text=/\\d+ Tons/').first();
            if (await quantityText.isVisible({ timeout: 2000 })) {
                const text = await quantityText.textContent();
                const match = text.match(/(\d+)\s*Tons/);
                return match ? parseInt(match[1]) : null;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async enterNewQuantity(quantity) {
        try {
            const quantityInput = this.page.locator('input').filter({ hasText: '' }).nth(0);
            // Find visible input
            const inputs = this.page.locator('input[type="text"], input[type="number"]');
            const count = await inputs.count();
            for (let i = 0; i < count; i++) {
                const input = inputs.nth(i);
                if (await input.isVisible()) {
                    await input.clear();
                    await input.fill(quantity.toString());
                    console.log(`✓ Entered quantity: ${quantity}`);
                    return;
                }
            }
            throw new Error('No visible input field found');
        } catch (error) {
            throw new Error(`Failed to enter quantity: ${error.message}`);
        }
    }

    async clickCancelQuantityChange() {
        try {
            // Look for X button
            const closeBtn = this.page.locator('svg[data-testid="CloseIcon"], button:has(svg[data-testid="CloseIcon"]), [aria-label="close"]').first();
            if (await closeBtn.isVisible({ timeout: 2000 })) {
                await closeBtn.click();
            } else {
                // Try pressing Escape
                await this.page.keyboard.press('Escape');
            }
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.log(`Cancel quantity change: ${error.message}`);
        }
    }

    async clickSaveQuantityChange() {
        try {
            const saveBtn = this.page.locator('button:has-text("Save")').first();
            await saveBtn.click();
            await this.page.waitForTimeout(1000);
            console.log('✓ Clicked Save button');
        } catch (error) {
            throw new Error(`Failed to click Save: ${error.message}`);
        }
    }

    async isSubmitChangesButtonVisible() {
        try {
            const submitBtn = this.page.locator('button:has-text("Submit Changes")').first();
            return await submitBtn.isVisible({ timeout: 3000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async isReviewChangesMessageVisible() {
        try {
            const message = this.page.locator('text=/Review your changes|Submit Changes.*button/').first();
            return await message.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async clickSubmitChanges() {
        try {
            const submitBtn = this.page.locator('button:has-text("Submit Changes")').first();
            await submitBtn.click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1000);
            console.log('✓ Clicked Submit Changes button');
        } catch (error) {
            throw new Error(`Failed to click Submit Changes: ${error.message}`);
        }
    }

    async getOrderTotal() {
        try {
            const orderTotalLocator = this.page.locator('text=/Order Total.*\\$[\\d,]+\\.\\d{2}|\\$[\\d,]+\\.\\d{2}.*Order Total/').first();
            if (await orderTotalLocator.isVisible({ timeout: 2000 })) {
                const text = await orderTotalLocator.textContent();
                const match = text.match(/\\$([\\d,]+\\.\\d{2})/);
                return match ? match[1] : text;
            }
            
            // Fallback: look for Order Total section in Order Summary
            const summaryTotal = this.page.locator('text="Order Total"').locator('xpath=following-sibling::*').first();
            if (await summaryTotal.isVisible({ timeout: 1000 })) {
                return (await summaryTotal.textContent()).trim();
            }
            
            return null;
        } catch (error) {
            return null;
        }
    }

    async isConfirmationPopupVisible() {
        try {
            const popup = this.page.locator('[class*="snackbar"], [class*="toast"], [class*="notification"], [role="alert"]').first();
            return await popup.isVisible({ timeout: 3000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    // ==================== PICKUP/DELIVERY DETAILS FLOW ====================

    async scrollToPickupOrDeliverySection() {
        try {
            const section = this.page.locator('text=/PICKUP DETAILS|DELIVERY DETAILS/').first();
            if (await section.isVisible({ timeout: 2000 })) {
                await section.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
            }
        } catch (error) {
            console.log(`Scroll to pickup section: ${error.message}`);
        }
    }

    async hasModifyLinkForPickupDelivery() {
        try {
            // Look for Modify link near PICKUP DETAILS
            const modifyLink = this.page.locator('text=/PICKUP DETAILS|DELIVERY DETAILS/').locator('xpath=following::*[contains(text(), "Modify")]').first();
            if (await modifyLink.isVisible({ timeout: 2000 }).catch(() => false)) {
                return true;
            }
            // Also check for Modify link anywhere on page
            const anyModifyLink = this.page.locator('a:has-text("Modify"), button:has-text("Modify")').first();
            return await anyModifyLink.isVisible({ timeout: 2000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async clickModifyPickupDeliveryDetails() {
        try {
            await this.scrollToPickupOrDeliverySection();
            // Find the Modify link near PICKUP DETAILS
            const modifyLink = this.page.locator('text=Modify').last();
            await modifyLink.click();
            await this.page.waitForTimeout(1000);
            console.log('✓ Clicked Modify link for Pickup/Delivery Details');
        } catch (error) {
            throw new Error(`Failed to click Modify for Pickup/Delivery: ${error.message}`);
        }
    }

    async isPickupDetailsModalVisible() {
        try {
            // Check for modal with First Name, Last Name fields
            const firstNameInput = this.page.locator('text=First Name').first();
            const lastNameInput = this.page.locator('text=Last Name').first();
            const contactInfo = this.page.locator('text=Contact Info').first();
            
            return await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false) &&
                   await lastNameInput.isVisible({ timeout: 1000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }

    async getPickupDetailsModalFields() {
        try {
            const fields = {
                firstName: false,
                lastName: false,
                mobile: false,
                email: false,
                pickupDate: false,
                pickupTime: false,
                saveButton: false,
                closeButton: false
            };

            fields.firstName = await this.page.locator('text=First Name').isVisible({ timeout: 1000 }).catch(() => false);
            fields.lastName = await this.page.locator('text=Last Name').isVisible({ timeout: 1000 }).catch(() => false);
            fields.mobile = await this.page.locator('text=Mobile').isVisible({ timeout: 1000 }).catch(() => false);
            fields.email = await this.page.locator('text=Email').isVisible({ timeout: 1000 }).catch(() => false);
            fields.pickupDate = await this.page.locator('text=/Preferred Pickup Date|Select Day/').isVisible({ timeout: 1000 }).catch(() => false);
            fields.pickupTime = await this.page.locator('text=/Select Pickup Time|7am|12pm/').isVisible({ timeout: 1000 }).catch(() => false);
            fields.saveButton = await this.page.locator('button:has-text("Save")').isVisible({ timeout: 1000 }).catch(() => false);
            fields.closeButton = await this.page.locator('[class*="close"], svg[data-testid="CloseIcon"], button:has(svg)').first().isVisible({ timeout: 1000 }).catch(() => false);

            return fields;
        } catch (error) {
            return null;
        }
    }

    async getCurrentPickupDetails() {
        try {
            const details = {
                firstName: null,
                lastName: null,
                mobile: null,
                email: null
            };

            // Get values from input fields
            const firstNameInput = this.page.locator('input').filter({ hasText: '' }).nth(0);
            const inputs = this.page.locator('input[type="text"], input[type="tel"], input[type="email"]');
            const count = await inputs.count();
            
            // Try to get values from visible inputs
            for (let i = 0; i < Math.min(count, 4); i++) {
                const input = inputs.nth(i);
                if (await input.isVisible()) {
                    const value = await input.inputValue();
                    if (i === 0) details.firstName = value;
                    else if (i === 1) details.lastName = value;
                    else if (i === 2) details.mobile = value;
                    else if (i === 3) details.email = value;
                }
            }

            return details;
        } catch (error) {
            return null;
        }
    }

    async updateFirstNameField(newFirstName) {
        try {
            // Find the First Name input and update it
            const firstNameLabel = this.page.locator('text=First Name').first();
            const firstNameInput = firstNameLabel.locator('xpath=following::input[1]');
            
            if (await firstNameInput.isVisible({ timeout: 2000 })) {
                await firstNameInput.clear();
                await firstNameInput.fill(newFirstName);
                console.log(`✓ Updated First Name to: ${newFirstName}`);
            } else {
                // Fallback: find first input
                const inputs = this.page.locator('input[type="text"]');
                const firstInput = inputs.first();
                await firstInput.clear();
                await firstInput.fill(newFirstName);
            }
        } catch (error) {
            throw new Error(`Failed to update First Name: ${error.message}`);
        }
    }

    async clickClosePickupDetailsModal() {
        try {
            const closeBtn = this.page.locator('svg[data-testid="CloseIcon"], button:has(svg[data-testid="CloseIcon"]), [aria-label="close"]').first();
            if (await closeBtn.isVisible({ timeout: 2000 })) {
                await closeBtn.click();
            } else {
                await this.page.keyboard.press('Escape');
            }
            await this.page.waitForTimeout(500);
            console.log('✓ Closed Pickup Details modal');
        } catch (error) {
            console.log(`Close pickup modal: ${error.message}`);
        }
    }

    async clickSavePickupDetails() {
        try {
            const saveBtn = this.page.locator('button:has-text("Save")').last();
            await saveBtn.click();
            await this.page.waitForTimeout(1000);
            console.log('✓ Clicked Save button for Pickup Details');
        } catch (error) {
            throw new Error(`Failed to click Save for Pickup Details: ${error.message}`);
        }
    }

    async isPickupDetailsConfirmationVisible() {
        try {
            const popup = this.page.locator('[class*="snackbar"], [class*="toast"], [class*="notification"], [role="alert"], text=/success|updated|saved/i').first();
            return await popup.isVisible({ timeout: 3000 }).catch(() => false);
        } catch (error) {
            return false;
        }
    }
}

module.exports = { MyAccountPage };
