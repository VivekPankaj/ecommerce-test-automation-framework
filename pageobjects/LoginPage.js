class LoginPage {

constructor(page)
{
    this.page = page;
    this.signInbutton= page.locator("#submit");
    this.userName = page.locator("#username");
    this.password = page.locator("#password");

}

async goTo()
{
    await this.page.goto("https://practicetestautomation.com/practice-test-login/");
    await this.page.waitForLoadState('networkidle');
}

async validLogin(username,password)
{
    await  this.userName.fill(username);
     await this.password.fill(password);
     await this.signInbutton.click();
     await this.page.waitForLoadState('networkidle');

}

}
module.exports = {LoginPage};