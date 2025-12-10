export class MyProfilePage {
  constructor(page) {
    this.page = page;

    // Modal → My Profile option
   this.myProfileOption = page.locator('a:has-text("My Profile")');



    // Personal Info Section → Edit Button
    this.editPersonalInfoBtn = page.getByRole('button', { name: 'Edit' }).first();

    // Form fields
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]'); 
    this.mobileInput = page.getByPlaceholder('Enter Your Mobile');

    // Save button
    this.saveBtn = page.getByRole('button', { name: 'Save' }).first();

    // Confirmation
    this.successToast = page.locator('p:has-text("Changes have been updated!")');


    
    //Company Info Section → Edit Button
    this.editCompanyInfoBtn = page.getByRole('button', { name: 'Edit' }).nth(0);
    
    //form fields
    this.companyNameInput = page.locator('input[name="companyName"]');
    this.companyPhoneInput = page.getByPlaceholder('Enter Your Phone Number');
    this.companyAddressInput = page.getByPlaceholder('Enter Address/City/State Or Zip');

    // Save button
    this.saveCompanyBtn = page.getByRole('button', { name: 'Save' }).nth(1);




    //Login Info Section → Edit Button
    this.editLoginInfoBtn = page.getByRole('button', { name: 'Edit' }).nth(1);

    //form fields
    this.currentPasswordInput = page.locator('input[name="currentPassword"]');
    this.newPasswordInput = page.locator('input[name="newPassword"]');

    // Cancel Button
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' }).nth(1);
    
  }

 

  async clickMyProfile() {
    await this.myProfileOption.click();
  }

  async clickEditPersonalInfo() {
    await this.editPersonalInfoBtn.click();
  }

  async updateFirstName(first) {
    await this.firstNameInput.fill(first);
  }

  async updateLastName(last) {
    await this.lastNameInput.fill(last);
  }

  async updateMobile(mobile) {
    await this.mobileInput.fill(mobile);
  }

  async saveProfile() {
    await this.saveBtn.click();
  }

  async isProfileUpdated() {
    return this.successToast.isVisible();
  }

  async clickEditCompanyInfo() {
    await this.editCompanyInfoBtn.click();
  }

  async updateCompanyName(name) {
    await this.companyNameInput.fill(name);
  }

  async updateCompanyPhone(phone) {
    await this.companyPhoneInput.fill(phone);
  }

  async updateCompanyAddress(address) {
    await this.companyAddressInput.fill(address);
  }

  async saveCompanyInfo() {
    await this.saveCompanyBtn.click();
  }

  async clickEditLoginInfo() {
    await this.editLoginInfoBtn.click();
  }

  async updateCurrentPassword(currentPassword) {
    await this.currentPasswordInput.fill(currentPassword);
  }

  async updateNewPassword(newPassword) {
    await this.newPasswordInput.fill(newPassword);
  }

  async cancelLoginInfoUpdate() {
    await this.cancelBtn.click();
  }

  
}
