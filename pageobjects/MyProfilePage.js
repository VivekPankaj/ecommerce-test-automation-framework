export class MyProfilePage {
  constructor(page) {
    this.page = page;

    // Modal → My Profile option
   this.myProfileOption = page.locator('a:has-text("My Profile")');



    // Personal Info Section → Edit Button
    this.editPersonalInfoBtn = page.locator('[data-testid="edit-personal-info-btn"]');

    // Form fields
    this.firstNameInput = page.locator('[data-testid="profile-first-name"]');
    this.lastNameInput = page.locator('[data-testid="profile-last-name"]');
    this.mobileInput = page.locator('[data-testid="profile-mobile"]');

    // Save button
    this.saveBtn = page.locator('[data-testid="profile-save-btn"]');

    // Confirmation
    this.successToast = page.locator('[data-testid="profile-update-success"]');
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
}
