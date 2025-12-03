const { Given, When, Then } = require('@cucumber/cucumber');
const { MyProfilePage } = require('../../../pageobjects/MyProfilePage');

let myProfilePage;

Given('I am on My Profile page', async function () {
  myProfilePage = new MyProfilePage(this.page);
  await myProfilePage.clickMyAccount();
  await myProfilePage.clickMyProfile();
});



When('I click on My Profile', async function () {
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
  await expect(myProfilePage.successToast).toBeVisible();
});
