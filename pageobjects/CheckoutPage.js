// ============================================================================
// CheckoutPage.js - Page Object for Checkout Flow
// ============================================================================
// Created: 12 January 2026
// 
// This page object handles all checkout-related interactions including:
// - Delivery/Pickup address management
// - Schedule selection (date and time slots)
// - Payment method selection and card entry
// - Order summary validation
// - Place order and confirmation
// ============================================================================

class CheckoutPage {
    constructor(page) {
        this.page = page;

        // =====================================================================
        // CHECKOUT PAGE IDENTIFICATION
        // =====================================================================
        this.checkoutPageUrl = /checkout/i;
        this.checkoutPageTitle = 'Checkout';
        
        // =====================================================================
        // MAIN SECTIONS
        // =====================================================================
        this.orderSummarySection = '[data-testid="order-summary"], .order-summary, [class*="OrderSummary"]';
        this.deliverySection = '[data-testid="delivery-section"], .delivery-section, [class*="DeliverySection"]';
        this.pickupSection = '[data-testid="pickup-section"], .pickup-section, [class*="PickupSection"]';
        this.scheduleSection = '[data-testid="schedule-section"], .schedule-section, [class*="ScheduleSection"]';
        this.paymentSection = '[data-testid="payment-section"], .payment-section, [class*="PaymentSection"]';

        // =====================================================================
        // DELIVERY ADDRESS FORM
        // =====================================================================
        this.addressLine1Input = 'input[name="addressLine1"], input[placeholder*="Address Line 1"], #addressLine1';
        this.addressLine2Input = 'input[name="addressLine2"], input[placeholder*="Address Line 2"], #addressLine2';
        this.cityInput = 'input[name="city"], input[placeholder*="City"], #city';
        this.stateSelect = 'select[name="state"], #state, [data-testid="state-select"]';
        this.zipCodeInput = 'input[name="zipCode"], input[placeholder*="Zip"], #zipCode';
        this.saveAddressButton = 'button:has-text("Save Address"), button:has-text("Save")';
        this.addNewAddressButton = 'button:has-text("Add New Address"), a:has-text("Add New Address")';
        this.editAddressButton = 'button:has-text("Edit Address"), button:has-text("Edit"), [data-testid="edit-address"]';
        this.savedAddressList = '[data-testid="saved-addresses"], .saved-addresses, [class*="SavedAddress"]';
        this.savedAddressItem = '[data-testid="saved-address-item"], .saved-address-item';

        // =====================================================================
        // PICKUP FACILITY
        // =====================================================================
        this.pickupLocationDisplay = '[data-testid="pickup-location"], .pickup-location, [class*="PickupLocation"]';
        this.changeFacilityButton = 'button:has-text("Change Facility"), button:has-text("Change Location")';
        this.facilitySelectionModal = '[role="dialog"], .MuiDialog-root, .facility-modal';
        this.facilityList = '[data-testid="facility-list"], .facility-list';
        this.facilityItem = '[data-testid="facility-item"], .facility-item';
        this.confirmFacilityButton = 'button:has-text("Confirm"), button:has-text("Select")';

        // =====================================================================
        // SCHEDULE SELECTION
        // =====================================================================
        this.deliveryDatePicker = '[data-testid="delivery-date"], .delivery-date-picker, [class*="DatePicker"]';
        this.pickupDatePicker = '[data-testid="pickup-date"], .pickup-date-picker, [class*="DatePicker"]';
        this.availableDates = '[data-testid="available-date"], .available-date, button[class*="date"]:not([disabled])';
        this.timeSlotContainer = '[data-testid="time-slots"], .time-slots, [class*="TimeSlot"]';
        this.availableTimeSlots = '[data-testid="time-slot"]:not([disabled]), .time-slot:not(.disabled), button[class*="slot"]:not([disabled])';
        this.selectedDate = '[data-testid="selected-date"], .selected-date, [class*="selected"]';
        this.selectedTimeSlot = '[data-testid="selected-time"], .selected-time';
        this.changeScheduleButton = 'button:has-text("Change Schedule"), button:has-text("Change Date")';
        this.todayDateOption = 'button[data-testid="today"], .today-date, [aria-label*="today"]';

        // =====================================================================
        // PAYMENT METHODS
        // =====================================================================
        this.paymentMethodsList = '[data-testid="payment-methods"], .payment-methods, [class*="PaymentMethod"]';
        this.creditCardOption = 'input[value="creditCard"], button:has-text("Credit Card"), [data-testid="credit-card-option"]';
        this.payOnDeliveryOption = 'input[value="payOnDelivery"], button:has-text("Pay on Delivery"), [data-testid="pay-on-delivery"]';
        this.payOnPickupOption = 'input[value="payOnPickup"], button:has-text("Pay on Pickup"), [data-testid="pay-on-pickup"]';
        
        // Saved Cards
        this.savedCardsList = '[data-testid="saved-cards"], .saved-cards, [class*="SavedCard"]';
        this.savedCardItem = '[data-testid="saved-card-item"], .saved-card-item';
        this.addNewCardButton = 'button:has-text("Add New Card"), a:has-text("Add New Card")';
        
        // Credit Card Form
        this.cardNumberInput = 'input[name="cardNumber"], input[placeholder*="Card Number"], #cardNumber, [data-testid="card-number"]';
        this.expiryDateInput = 'input[name="expiryDate"], input[placeholder*="MM/YY"], #expiryDate, [data-testid="expiry-date"]';
        this.cvvInput = 'input[name="cvv"], input[placeholder*="CVV"], #cvv, [data-testid="cvv"]';
        this.cardNameInput = 'input[name="cardName"], input[placeholder*="Name on Card"], #cardName, [data-testid="card-name"]';
        this.saveCardCheckbox = 'input[type="checkbox"][name="saveCard"], input#saveCard, [data-testid="save-card-checkbox"]';
        this.cardValidationError = '.card-error, [class*="error"], .MuiFormHelperText-root.Mui-error';

        // =====================================================================
        // ORDER SUMMARY
        // =====================================================================
        this.productNameInSummary = '[data-testid="product-name"], .product-name, [class*="ProductName"]';
        this.productQuantityInSummary = '[data-testid="product-quantity"], .product-quantity, [class*="Quantity"]';
        this.productPriceInSummary = '[data-testid="product-price"], .product-price, [class*="Price"]';
        this.subtotalAmount = '[data-testid="subtotal"], .subtotal, [class*="Subtotal"]';
        this.deliveryCharges = '[data-testid="delivery-charges"], .delivery-charges, [class*="DeliveryCharge"]';
        this.pickupCharges = '[data-testid="pickup-charges"], .pickup-charges, [class*="PickupCharge"]';
        this.taxAmount = '[data-testid="tax-amount"], .tax-amount, [class*="Tax"]';
        this.estimatedTotal = '[data-testid="estimated-total"], .estimated-total, [class*="EstimatedTotal"], [class*="TotalAmount"]';
        this.editQuantityButton = 'button:has-text("Edit"), [data-testid="edit-quantity"]';
        this.quantityInput = 'input[type="number"], input[name="quantity"]';

        // =====================================================================
        // PROMO CODE
        // =====================================================================
        this.promoCodeInput = 'input[name="promoCode"], input[placeholder*="Promo"], #promoCode, [data-testid="promo-input"]';
        this.applyPromoButton = 'button:has-text("Apply"), [data-testid="apply-promo"]';
        this.removePromoButton = 'button:has-text("Remove"), [data-testid="remove-promo"]';
        this.promoCodeError = '.promo-error, [class*="promo"][class*="error"]';
        this.promoDiscount = '[data-testid="promo-discount"], .promo-discount, [class*="PromoDiscount"]';

        // =====================================================================
        // PLACE ORDER
        // =====================================================================
        this.placeOrderButton = 'button:has-text("Place Order"), button:has-text("Complete Order"), [data-testid="place-order"]';
        this.checkoutButton = 'button:has-text("Checkout"), button:has-text("Proceed to Checkout"), [data-testid="checkout-btn"]';
        this.continueButton = 'button:has-text("Continue"), [data-testid="continue-btn"]';

        // =====================================================================
        // ORDER CONFIRMATION
        // =====================================================================
        this.confirmationPage = '[data-testid="order-confirmation"], .order-confirmation, [class*="OrderConfirmation"]';
        this.orderNumber = '[data-testid="order-number"], .order-number, [class*="OrderNumber"]';
        this.thankYouMessage = 'h1:has-text("Thank You"), .thank-you-message, [class*="ThankYou"]';
        this.viewOrderDetailsLink = 'a:has-text("View Order Details"), button:has-text("View Order"), [data-testid="view-order"]';
        this.continueShoppingButton = 'button:has-text("Continue Shopping"), a:has-text("Continue Shopping"), [data-testid="continue-shopping"]';

        // =====================================================================
        // VALIDATION MESSAGES
        // =====================================================================
        this.errorMessage = '.error-message, .MuiAlert-message, [role="alert"]';
        this.incompleteIndicator = '.incomplete, [class*="incomplete"], [class*="pending"]';

        // =====================================================================
        // GUEST CHECKOUT
        // =====================================================================
        this.signInLink = 'a:has-text("Sign In"), button:has-text("Already have an account")';
        this.createAccountPrompt = '[data-testid="create-account"], .create-account-prompt';
        this.createAccountButton = 'button:has-text("Create Account")';
        this.passwordInput = 'input[type="password"][name="password"], #password';
    }

    // =========================================================================
    // PAGE NAVIGATION
    // =========================================================================

    async isOnCheckoutPage() {
        try {
            await this.page.waitForURL(this.checkoutPageUrl, { timeout: 10000 });
            return true;
        } catch {
            const url = this.page.url();
            return url.includes('checkout');
        }
    }

    async waitForCheckoutPage() {
        await this.page.waitForURL(this.checkoutPageUrl, { timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickCheckoutButton() {
        await this.page.waitForSelector(this.checkoutButton, { state: 'visible', timeout: 10000 });
        await this.page.click(this.checkoutButton);
        await this.waitForCheckoutPage();
    }

    // =========================================================================
    // SECTION VISIBILITY
    // =========================================================================

    async isOrderSummarySectionVisible() {
        try {
            const element = await this.page.locator(this.orderSummarySection).first();
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async isDeliverySectionVisible() {
        try {
            const element = await this.page.locator(this.deliverySection).first();
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async isScheduleSectionVisible() {
        try {
            const element = await this.page.locator(this.scheduleSection).first();
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async isPaymentSectionVisible() {
        try {
            const element = await this.page.locator(this.paymentSection).first();
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async isPickupLocationSectionVisible() {
        try {
            const element = await this.page.locator(this.pickupSection).first();
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    // =========================================================================
    // DELIVERY ADDRESS METHODS
    // =========================================================================

    async enterDeliveryAddress(addressDetails) {
        if (addressDetails.addressLine1) {
            await this.page.fill(this.addressLine1Input, addressDetails.addressLine1);
        }
        if (addressDetails.addressLine2) {
            await this.page.fill(this.addressLine2Input, addressDetails.addressLine2);
        }
        if (addressDetails.city) {
            await this.page.fill(this.cityInput, addressDetails.city);
        }
        if (addressDetails.state) {
            await this.page.selectOption(this.stateSelect, { label: addressDetails.state });
        }
        if (addressDetails.zipCode) {
            await this.page.fill(this.zipCodeInput, addressDetails.zipCode);
        }
    }

    async clickSaveAddress() {
        await this.page.click(this.saveAddressButton);
        await this.page.waitForTimeout(2000);
    }

    async clickAddNewAddress() {
        await this.page.click(this.addNewAddressButton);
        await this.page.waitForTimeout(1000);
    }

    async clickEditAddress() {
        await this.page.click(this.editAddressButton);
        await this.page.waitForTimeout(1000);
    }

    async selectSavedAddress(index = 0) {
        const addresses = await this.page.locator(this.savedAddressItem).all();
        if (addresses.length > index) {
            await addresses[index].click();
            await this.page.waitForTimeout(1000);
        }
    }

    async getSavedAddressCount() {
        const addresses = await this.page.locator(this.savedAddressItem).all();
        return addresses.length;
    }

    async isDeliveryAddressPreFilled() {
        const addressField = await this.page.locator(this.addressLine1Input).first();
        const value = await addressField.inputValue();
        return value && value.length > 0;
    }

    // =========================================================================
    // PICKUP FACILITY METHODS
    // =========================================================================

    async getPickupLocationText() {
        const location = await this.page.locator(this.pickupLocationDisplay).first();
        return await location.textContent();
    }

    async clickChangeFacility() {
        await this.page.click(this.changeFacilityButton);
        await this.page.waitForSelector(this.facilitySelectionModal, { state: 'visible', timeout: 10000 });
    }

    async selectFacility(index = 0) {
        const facilities = await this.page.locator(this.facilityItem).all();
        if (facilities.length > index) {
            await facilities[index].click();
        }
    }

    async confirmFacilitySelection() {
        await this.page.click(this.confirmFacilityButton);
        await this.page.waitForTimeout(2000);
    }

    // =========================================================================
    // SCHEDULE SELECTION METHODS
    // =========================================================================

    async navigateToScheduleSection() {
        await this.page.locator(this.scheduleSection).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
    }

    async getAvailableDatesCount() {
        const dates = await this.page.locator(this.availableDates).all();
        return dates.length;
    }

    async selectDeliveryDate(index = 0) {
        const dates = await this.page.locator(this.availableDates).all();
        if (dates.length > index) {
            await dates[index].click();
            await this.page.waitForTimeout(1000);
        }
    }

    async selectTodayIfAvailable() {
        try {
            const todayButton = await this.page.locator(this.todayDateOption).first();
            if (await todayButton.isVisible()) {
                await todayButton.click();
                await this.page.waitForTimeout(1000);
                return true;
            }
        } catch {
            // Today not available, select first available date
            await this.selectDeliveryDate(0);
        }
        return false;
    }

    async selectFutureDate(daysFromToday = 7) {
        // This will need to be customized based on the actual date picker implementation
        // For now, selecting by index
        await this.selectDeliveryDate(daysFromToday);
    }

    async getAvailableTimeSlotsCount() {
        const slots = await this.page.locator(this.availableTimeSlots).all();
        return slots.length;
    }

    async selectTimeSlot(index = 0) {
        const slots = await this.page.locator(this.availableTimeSlots).all();
        if (slots.length > index) {
            await slots[index].click();
            await this.page.waitForTimeout(1000);
        }
    }

    async selectEarliestTimeSlot() {
        await this.selectTimeSlot(0);
    }

    async clickChangeSchedule() {
        await this.page.click(this.changeScheduleButton);
        await this.page.waitForTimeout(1000);
    }

    // =========================================================================
    // PAYMENT METHODS
    // =========================================================================

    async navigateToPaymentSection() {
        await this.page.locator(this.paymentSection).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
    }

    async selectCreditCardPayment() {
        await this.page.click(this.creditCardOption);
        await this.page.waitForTimeout(1000);
    }

    async selectPayOnDelivery() {
        await this.page.click(this.payOnDeliveryOption);
        await this.page.waitForTimeout(1000);
    }

    async selectPayOnPickup() {
        await this.page.click(this.payOnPickupOption);
        await this.page.waitForTimeout(1000);
    }

    async enterCreditCardDetails(cardDetails) {
        if (cardDetails.cardNumber) {
            await this.page.fill(this.cardNumberInput, cardDetails.cardNumber);
        }
        if (cardDetails.expiryDate) {
            await this.page.fill(this.expiryDateInput, cardDetails.expiryDate);
        }
        if (cardDetails.cvv) {
            await this.page.fill(this.cvvInput, cardDetails.cvv);
        }
        if (cardDetails.cardName) {
            await this.page.fill(this.cardNameInput, cardDetails.cardName);
        }
    }

    async checkSaveCard() {
        const checkbox = await this.page.locator(this.saveCardCheckbox).first();
        if (!(await checkbox.isChecked())) {
            await checkbox.check();
        }
    }

    async getSavedCardsCount() {
        const cards = await this.page.locator(this.savedCardItem).all();
        return cards.length;
    }

    async selectSavedCard(index = 0) {
        const cards = await this.page.locator(this.savedCardItem).all();
        if (cards.length > index) {
            await cards[index].click();
            await this.page.waitForTimeout(1000);
        }
    }

    async enterCVVForSavedCard(cvv) {
        await this.page.fill(this.cvvInput, cvv);
    }

    async clickAddNewCard() {
        await this.page.click(this.addNewCardButton);
        await this.page.waitForTimeout(1000);
    }

    async isCardValidationErrorVisible() {
        try {
            const error = await this.page.locator(this.cardValidationError).first();
            return await error.isVisible();
        } catch {
            return false;
        }
    }

    // =========================================================================
    // ORDER SUMMARY METHODS
    // =========================================================================

    async getProductNameFromSummary(index = 0) {
        const products = await this.page.locator(this.productNameInSummary).all();
        if (products.length > index) {
            return await products[index].textContent();
        }
        return null;
    }

    async getProductQuantityFromSummary(index = 0) {
        const quantities = await this.page.locator(this.productQuantityInSummary).all();
        if (quantities.length > index) {
            const text = await quantities[index].textContent();
            return parseInt(text.replace(/\D/g, ''));
        }
        return null;
    }

    async getProductPriceFromSummary(index = 0) {
        const prices = await this.page.locator(this.productPriceInSummary).all();
        if (prices.length > index) {
            return await prices[index].textContent();
        }
        return null;
    }

    async getSubtotal() {
        const subtotal = await this.page.locator(this.subtotalAmount).first();
        return await subtotal.textContent();
    }

    async getDeliveryCharges() {
        try {
            const charges = await this.page.locator(this.deliveryCharges).first();
            return await charges.textContent();
        } catch {
            return null;
        }
    }

    async getPickupCharges() {
        try {
            const charges = await this.page.locator(this.pickupCharges).first();
            return await charges.textContent();
        } catch {
            return null;
        }
    }

    async getTaxAmount() {
        const tax = await this.page.locator(this.taxAmount).first();
        return await tax.textContent();
    }

    async getEstimatedTotal() {
        const total = await this.page.locator(this.estimatedTotal).first();
        return await total.textContent();
    }

    async areDeliveryChargesDisplayed() {
        try {
            const charges = await this.page.locator(this.deliveryCharges).first();
            return await charges.isVisible();
        } catch {
            return false;
        }
    }

    async clickEditQuantity(productIndex = 0) {
        const editButtons = await this.page.locator(this.editQuantityButton).all();
        if (editButtons.length > productIndex) {
            await editButtons[productIndex].click();
            await this.page.waitForTimeout(1000);
        }
    }

    async updateQuantity(newQuantity) {
        await this.page.fill(this.quantityInput, newQuantity.toString());
        await this.page.waitForTimeout(500);
    }

    async getProductsInSummaryCount() {
        const products = await this.page.locator(this.productNameInSummary).all();
        return products.length;
    }

    // =========================================================================
    // PROMO CODE METHODS
    // =========================================================================

    async enterPromoCode(code) {
        await this.page.fill(this.promoCodeInput, code);
    }

    async clickApplyPromo() {
        await this.page.click(this.applyPromoButton);
        await this.page.waitForTimeout(2000);
    }

    async clickRemovePromo() {
        await this.page.click(this.removePromoButton);
        await this.page.waitForTimeout(1000);
    }

    async isPromoCodeApplied() {
        try {
            const discount = await this.page.locator(this.promoDiscount).first();
            return await discount.isVisible();
        } catch {
            return false;
        }
    }

    async getPromoDiscount() {
        const discount = await this.page.locator(this.promoDiscount).first();
        return await discount.textContent();
    }

    async isPromoCodeErrorVisible() {
        try {
            const error = await this.page.locator(this.promoCodeError).first();
            return await error.isVisible();
        } catch {
            return false;
        }
    }

    // =========================================================================
    // PLACE ORDER METHODS
    // =========================================================================

    async isPlaceOrderButtonEnabled() {
        const button = await this.page.locator(this.placeOrderButton).first();
        return await button.isEnabled();
    }

    async clickPlaceOrder() {
        await this.page.click(this.placeOrderButton);
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    // =========================================================================
    // ORDER CONFIRMATION METHODS
    // =========================================================================

    async isOnOrderConfirmationPage() {
        try {
            const confirmation = await this.page.locator(this.confirmationPage).first();
            return await confirmation.isVisible();
        } catch {
            const url = this.page.url();
            return url.includes('confirmation') || url.includes('thank-you');
        }
    }

    async waitForOrderConfirmation() {
        // Wait for either the confirmation element or URL change
        await this.page.waitForFunction(() => {
            return window.location.href.includes('confirmation') || 
                   window.location.href.includes('thank-you') ||
                   document.querySelector('[data-testid="order-confirmation"]') ||
                   document.querySelector('.order-confirmation');
        }, { timeout: 30000 });
    }

    async getOrderNumber() {
        const orderNum = await this.page.locator(this.orderNumber).first();
        return await orderNum.textContent();
    }

    async isThankYouMessageVisible() {
        try {
            const message = await this.page.locator(this.thankYouMessage).first();
            return await message.isVisible();
        } catch {
            return false;
        }
    }

    async clickViewOrderDetails() {
        await this.page.click(this.viewOrderDetailsLink);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickContinueShopping() {
        await this.page.click(this.continueShoppingButton);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // =========================================================================
    // VALIDATION METHODS
    // =========================================================================

    async getErrorMessage() {
        try {
            const error = await this.page.locator(this.errorMessage).first();
            return await error.textContent();
        } catch {
            return null;
        }
    }

    async isIncompleteIndicatorVisible() {
        try {
            const indicator = await this.page.locator(this.incompleteIndicator).first();
            return await indicator.isVisible();
        } catch {
            return false;
        }
    }

    // =========================================================================
    // GUEST CHECKOUT METHODS
    // =========================================================================

    async clickSignIn() {
        await this.page.click(this.signInLink);
        await this.page.waitForTimeout(1000);
    }

    async isCreateAccountPromptVisible() {
        try {
            const prompt = await this.page.locator(this.createAccountPrompt).first();
            return await prompt.isVisible();
        } catch {
            return false;
        }
    }

    async createAccountFromCheckout(password) {
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.createAccountButton);
        await this.page.waitForLoadState('networkidle');
    }

    // =========================================================================
    // CHECKOUT FLOW HELPER METHODS
    // =========================================================================

    async completeDeliveryAddressStep(addressDetails) {
        await this.enterDeliveryAddress(addressDetails);
        await this.clickSaveAddress();
    }

    async completeScheduleStep() {
        await this.navigateToScheduleSection();
        await this.selectDeliveryDate(0);
        await this.selectTimeSlot(0);
    }

    async completePaymentStep(cardDetails) {
        await this.navigateToPaymentSection();
        await this.selectCreditCardPayment();
        await this.enterCreditCardDetails(cardDetails);
    }

    async completeCheckoutForDelivery(addressDetails, cardDetails) {
        await this.completeDeliveryAddressStep(addressDetails);
        await this.completeScheduleStep();
        await this.completePaymentStep(cardDetails);
    }

    async placeOrderAndVerify() {
        await this.clickPlaceOrder();
        await this.waitForOrderConfirmation();
        return await this.isOnOrderConfirmationPage();
    }
}

module.exports = CheckoutPage;
