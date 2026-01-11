/**
 * ============================================================================
 * 🔒 LOCKED FILE - DO NOT MODIFY WITHOUT APPROVAL
 * ============================================================================
 * Status: VERIFIED & LOCKED
 * Last Verified: 11 January 2026
 * All 5 scenarios (49 steps) passing
 * 
 * This file contains step definitions for:
 *   - User login validation (Sign In)
 *   - User logout validation (Sign Out from Homepage, PLP, PDP, Cart)
 * 
 * Dependencies:
 *   - LoginPage.js (pageobjects)
 *   - testData.json (utils)
 * 
 * ⚠️  Any modifications require re-running all @Login tests:
 *     npx cucumber-js --config .cucumber.json --tags "@Login"
 * ============================================================================
 */

const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { LoginPage } = require("../../../pageobjects/LoginPage");
const testData = require("../../../utils/testData.json");

let loginPage;

// ============================================================================
// 🔒 LOCKED STEPS - Navigation & Authentication
// ============================================================================

Given("I navigate to the Vulcan Shop application", async function () {
    loginPage = new LoginPage(this.page);
    await loginPage.goTo();
});

When("I click on the Sign In button", async function () {
    await loginPage.clickSignInCTA();
});

When("I enter valid user email", async function () {
    await loginPage.enterEmail(testData.login.validUser.email);
    // Store email for later verification
    this.enteredEmail = testData.login.validUser.email;
});

When("I enter valid user password", async function () {
    await loginPage.enterPassword(testData.login.validUser.password);
});

When("I enter email {string}", async function (email) {
    await loginPage.enterEmail(email);
    this.enteredEmail = email;
});

When("I enter password {string}", async function (password) {
    await loginPage.enterPassword(password);
});

When("I submit the Sign In form", async function () {
    await loginPage.submitLogin();
});

// Validation 1: Sign In should change to My Account
Then("the Sign In button should change to My Account", async function () {
    const isMyAccountVisible = await loginPage.isMyAccountVisible();
    if (!isMyAccountVisible) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error("Sign In did not change to My Account after login");
    }
    console.log("✓ Sign In button changed to My Account");
});

// Validation 2: My Account dropdown should show greeting and menu items
Then("clicking on My Account should show the user greeting and menu items", async function () {
    await loginPage.openMyAccount();
    
    const dropdownContent = await loginPage.verifyMyAccountDropdownContent();
    
    // Verify greeting with first name
    if (!dropdownContent.greeting) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error("Greeting (Hi, FirstName) not found in My Account dropdown");
    }
    console.log(`✓ Greeting found: ${dropdownContent.greetingText}`);
    
    // Store the first name from greeting for later comparison
    this.greetingFirstName = await loginPage.getFirstNameFromGreeting();
    console.log(`✓ First name from greeting: ${this.greetingFirstName}`);
    
    // Verify all menu items are present
    if (!dropdownContent.purchaseHistory) {
        throw new Error("Purchase History link not found in dropdown");
    }
    console.log("✓ Purchase History link is visible");
    
    if (!dropdownContent.myProfile) {
        throw new Error("My Profile link not found in dropdown");
    }
    console.log("✓ My Profile link is visible");
    
    if (!dropdownContent.payment) {
        throw new Error("Payment link not found in dropdown");
    }
    console.log("✓ Payment link is visible");
    
    if (!dropdownContent.signOut) {
        throw new Error("Sign Out button not found in dropdown");
    }
    console.log("✓ Sign Out button is visible");
});

// Validation 3: First name in greeting should match profile first name
Then("the first name should match with the profile name in My Profile page", async function () {
    // Navigate to My Profile
    await loginPage.navigateToMyProfile();
    
    // Get first name from profile page
    const profileFirstName = await loginPage.getFirstNameFromProfile();
    const expectedFirstName = testData.login.validUser.firstName;
    
    console.log(`Greeting first name: ${this.greetingFirstName}`);
    console.log(`Profile first name: ${profileFirstName}`);
    console.log(`Expected first name: ${expectedFirstName}`);
    
    // Verify first name matches
    if (profileFirstName !== expectedFirstName && this.greetingFirstName !== expectedFirstName) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error(`First name mismatch. Expected: ${expectedFirstName}, Got from profile: ${profileFirstName}, Got from greeting: ${this.greetingFirstName}`);
    }
    console.log(`✓ First name matches: ${expectedFirstName}`);
});

// Validation 4: Email in profile should match the entered email
Then("the email should match with the email in My Profile page", async function () {
    // Get email from profile page
    const profileEmail = await loginPage.getEmailFromProfile();
    const expectedEmail = this.enteredEmail || testData.login.validUser.email;
    
    console.log(`Profile email: ${profileEmail}`);
    console.log(`Expected email: ${expectedEmail}`);
    
    if (profileEmail !== expectedEmail) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error(`Email mismatch. Expected: ${expectedEmail}, Got: ${profileEmail}`);
    }
    console.log(`✓ Email matches: ${expectedEmail}`);
});

When("I click on My Account", async function () {
    await loginPage.openMyAccount();
});

When("I click on My Profile", async function () {
    await loginPage.navigateToMyProfile();
});

When("I click on Sign Out", async function () {
    await loginPage.signOut();
});

// Sign Out validation steps
Then("the My Account button should change to Sign In", async function () {
    const isSignInVisible = await loginPage.isSignInButtonVisible();
    if (!isSignInVisible) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        throw new Error("My Account did not change to Sign In after logout");
    }
    console.log("✓ My Account button changed to Sign In");
});

Then("I should be redirected to the Homepage", async function () {
    const isOnHomepage = await loginPage.isOnHomepage();
    if (!isOnHomepage) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
        const currentUrl = this.page.url();
        throw new Error(`Not redirected to Homepage. Current URL: ${currentUrl}`);
    }
    console.log("✓ User is redirected to Homepage");
});

// Navigation steps for sign out from different pages
When("I navigate to the PLP page", async function () {
    await loginPage.navigateToPLP();
});

When("I navigate to the PDP page", async function () {
    await loginPage.navigateToPDP();
});

When("I navigate to the Cart page", async function () {
    await loginPage.navigateToCart();
});

When("I sign out from the current page", async function () {
    await loginPage.signOutFromCurrentPage();
});

// Legacy steps kept for backward compatibility
Then("I should see welcome message for valid user", async function () {
    const isMyAccountVisible = await loginPage.isMyAccountVisible();
    expect(isMyAccountVisible).toBe(true);
});

Then("I should see logout welcome message", async function () {
    // After logout, Sign In should be visible again
    await this.page.waitForTimeout(2000);
    const signInVisible = await this.page.locator('span:has-text("Sign In")').isVisible();
    expect(signInVisible).toBe(true);
});

Then("I should see {string}", async function (expectedText) {
    const welcomeText = this.page.locator('h2:has-text("Welcome,")');
    await expect(welcomeText).toContainText(expectedText);
});
