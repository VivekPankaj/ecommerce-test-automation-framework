class LoginPage {

    constructor(page) {
        this.page = page;

        this.signInHeaderBtn = page.locator('span:has-text("Sign In")');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.signInSubmitBtn = page.locator('button:has-text("Sign In")');

        this.myAccountBtn = page.locator('span:has-text("My Account")');
        this.signOutBtn = page.locator('button:has-text("Sign Out")');
    }

    async goTo() {
        await this.page.goto("https://qa-shop.vulcanmaterials.com/");
        await this.page.waitForLoadState("networkidle");
    }

    async clickSignInCTA() {
        await this.signInHeaderBtn.click();
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async submitLogin() {
        await this.signInSubmitBtn.click();
        // await this.page.waitForLoadState("networkidle");
    }

    async openMyAccount() {
        await this.myAccountBtn.click();
    }

    async signOut() {
        await this.signOutBtn.click();
        await this.page.waitForLoadState("networkidle");
    }

    async isSignInButtonVisible() {
        return await this.signInHeaderBtn.isVisible();
    }

    async isMyAccountVisible() {
        return await this.myAccountBtn.isVisible();
    }   

}

module.exports = { LoginPage };
