const { expect } = require('@playwright/test');

class QuarrySelectorPage {
    constructor(page) {
        this.page = page;

        // Landing Page
        this.homeUrl = 'https://qa-shop.vulcanmaterials.com/';
        this.changeAddressBtn = 'button:has-text("Change address")';
        this.addAddressBtn = 'button:has-text("Add address for exact price")';

        // Modal
        this.addressModal = '[data-testid="map"]';

        // Delivery / Pickup selector
        this.deliveryButton = 'button[role="tab"]:has-text("Delivery")';
        this.pickupButton = 'button[role="tab"]:has-text("Pickup")';


        // Subheader
        this.subheaderText = 'text=Type your address or zoom on the map to choose delivery location.';

        // Address input field
        // Address input field

        this.addressInputField = '#location-autocomplete';
        this.addressSuggestions = '[role="listbox"] div';

        // Map container
        this.googleMapContainer = '[data-testid="map"]';

        // Confirm Button
        this.confirmCta = 'button:has-text("Confirm")';

        // Modal Close(X)
        this.closeModalBtn = 'button.MuiIconButton-root[aria-label="close"]';

    }

    async gotoHomepage() {
        await this.page.goto(this.homeUrl, { waitUntil: 'networkidle' });
        console.log('✓ Navigated to Homepage');
    }

    async clickDefaultAddressText() {
        if (await this.page.locator(this.changeAddressBtn).isVisible())
            await this.page.locator(this.changeAddressBtn).click();
        else
            await this.page.locator(this.addAddressBtn).click();

        console.log('✓ Clicked default address selector');
    }

    async waitForAddressModal() {
        await expect(this.page.locator(this.addressModal)).toBeVisible();
        console.log('✓ Address modal displayed');
    }

    // -----------------------------
    // NEW METHODS FOR FLOW
    // -----------------------------

    async enterAddress(zip) {
        const input = this.page.locator(this.addressInputField);
        await input.fill(zip);
        console.log(`✓ Entered address/zip: ${zip}`);
    }

    async selectFirstSuggestion() {
        await this.page.locator(this.addressSuggestions).first().click();
        console.log('✓ Selected first suggestion');
    }

    async clickConfirmCTA() {
        await this.page.locator(this.confirmCta).click();
        console.log('✓ Clicked Confirm CTA');
    }

    async closeModal() {
        await this.page.locator(this.closeModalBtn).click();
        console.log('✓ Closed modal');
    }

    async reopenAddressSelector() {
        await this.clickDefaultAddressText();
        await this.waitForAddressModal();
        console.log('✓ Reopened Address Selector');
    }

    // -----------------------------
    // VALIDATION METHODS
    // -----------------------------

    async verifyDeliveryPickupSelector() {
        await expect(this.page.locator(this.deliveryButton)).toBeVisible();
        await expect(this.page.locator(this.pickupButton)).toBeVisible();
        console.log('✓ Delivery & Pickup selectors visible');
    }

    async verifySubheaders() {
        await expect(this.page.locator(this.subheaderText)).toBeVisible();
        console.log('✓ Subheader displayed');
    }

    async verifyAddressInputField(zipCode) {
        const input = this.page.locator(this.addressInputField);

        await expect(input).toBeVisible();
        const value = await input.inputValue();

        if (zipCode) {
            expect(value).toContain(zipCode);
            console.log(`✓ Address input contains zip code: ${zipCode}`);
        } else {
            expect(value).toBe('');
            console.log('✓ Address input shows placeholder only');
        }
    }

    async verifyGoogleMapComponents() {
        const map = this.page.locator(this.googleMapContainer);
        await expect(map).toBeVisible();

        await expect(map.locator('button[aria-label="Zoom in"]')).toBeVisible();
        await expect(map.locator('button[aria-label="Zoom out"]')).toBeVisible();
        await expect(map.locator('button[aria-label="Show street map"]')).toBeVisible();
        await expect(map.locator('button[aria-label="Show satellite imagery"]')).toBeVisible();


        console.log('✓ Google map controls visible');
    }

    async verifyConfirmCTA() {
        await expect(this.page.locator(this.confirmCta)).toBeVisible();
        await expect(this.page.locator(this.confirmCta)).toHaveText('Confirm');
        console.log('✓ Confirm CTA visible');
    }

    async verifyCloseCTA() {
        await expect(this.page.locator(this.closeModalBtn)).toBeVisible();
        console.log('✓ Close (X) CTA visible');
    }

    async verifyAddressNotSaved() {
        // Reopen modal
        await this.reopenAddressSelector();

        const input = this.page.locator(this.addressInputField);
        await expect(input).toBeVisible();

        const value = await input.inputValue();

        // The zip we typed was 23323 → It should NOT appear
        expect(value).not.toContain('23323');

        console.log('✓ Address was NOT saved (as expected)');
    }

    

    

}

module.exports = { QuarrySelectorPage };
