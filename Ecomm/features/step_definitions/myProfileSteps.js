const { Given, When, Then } = require('@cucumber/cucumber');
const { MyProfilePage } = require('../../../pageobjects/MyProfilePage');
const {LoginPage} = require('../../../pageobjects/LoginPage');

let myProfilePage;
let loginPage;


Given('I am on My Profile page', async function () {
	loginPage = new LoginPage(this.page);
	myProfilePage = new MyProfilePage(this.page);
	await this.page.goto('https://qa-shop.vulcanmaterials.com/');
	await loginPage.clickSignInCTA();
	await loginPage.enterEmail('vivekpankaj@gmail.com');
	await loginPage.enterPassword('S@p1ent2014');
	await loginPage.submitLogin();
  await loginPage.openMyAccount()
  await myProfilePage.clickMyProfile();
});




When('I click the Edit button in Personal Info section', async function () {
  await myProfilePage.clickEditPersonalInfo();
});

When('I update First Name {string}', async function (first) {
  await myProfilePage.updateFirstName(first);
});

When('I update Last Name {string}', async function (last) {
  await myProfilePage.updateLastName(last);
});

When('I update Mobile {string}', async function (mobile) {
  await myProfilePage.updateMobile(mobile);
});

When('I save the profile', async function () {
  await myProfilePage.saveProfile();
});

Then('I should see profile updated successfully', async function () {
  await myProfilePage.isProfileUpdated();
});


When('I click the Edit button in Company Info section', async function () {
  await myProfilePage.clickEditCompanyInfo();
});

When('I update Company Name {string}', async function (name) {
  await myProfilePage.updateCompanyName(name);
});

When('I update Company Phone {string}', async function (phone) {
  await myProfilePage.updateCompanyPhone(phone);
});

When('I update Company Address {string}', async function (address) {
  await myProfilePage.updateCompanyAddress(address);
});

When('I save the company info', async function () {
  await myProfilePage.saveCompanyInfo();
});

Then('I should see company info updated successfully', async function () {
  await myProfilePage.isProfileUpdated();
});


When('I click on Edit Login Info', async function () {
  await myProfilePage.clickEditLoginInfo();
});

When('I fill current password {string}', async function (password) {
  await myProfilePage.updateCurrentPassword(password);});

When('I fill new password {string}', async function (password) {
  await myProfilePage.updateNewPassword(password);
});


When('I click the Cancel button', async function () {
  await myProfilePage.cancelLoginInfoUpdate();
});



