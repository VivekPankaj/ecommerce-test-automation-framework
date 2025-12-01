const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { LoginPage } = require("../../../pageobjects/LoginPage");

let loginPage;

Given("I navigate to the Vulcan Shop application", async function () {
    loginPage = new LoginPage(this.page);
    await loginPage.goTo();
});

When("I click on the Sign In button", async function () {
    await loginPage.clickSignInCTA();
});

When("I enter email {string}", async function (email) {
    await loginPage.enterEmail(email);
});

When("I enter password {string}", async function (password) {
    await loginPage.enterPassword(password);
});

When("I submit the Sign In form", async function () {
    await loginPage.submitLogin();
});

Then("I should see {string}", async function (expectedText) {
    const welcomeText = this.page.locator('h2:has-text("Welcome,")');
    await expect(welcomeText).toContainText(expectedText);
});

When("I click on My Account", async function () {
    await loginPage.openMyAccount();
});

When("I click on Sign Out", async function () {
    await loginPage.signOut();
});
