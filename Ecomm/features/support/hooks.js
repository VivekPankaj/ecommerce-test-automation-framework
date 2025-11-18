const {After, Before,AfterStep,Status} = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(120 * 1000); // Increased to 120 seconds to allow more time for browser launch

Before(async function () {
    // This hook will be executed before all scenarios

    const browserName = process.env.BROWSER || 'firefox';  // Set Chromium as default browser
    const browserType = { chromium, firefox, webkit }[browserName] || firefox;
    this.browser = await browserType.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']  // Added args to prevent common timeout issues
    });
    const context = await this.browser.newContext();
    this.page =  await context.newPage();
  });

  AfterStep( async function ({result}) {
    // This hook will be executed after all steps, and take a screenshot on step failure
    if (result.status === Status.FAILED) {
      const buffer = await this.page.screenshot();
      await this.page.screenshot({ path: 'screenshot1.png' });
      this.attach(buffer.toString('base64'), 'base64:image/png');
      console.log("Screenshot logged")

    }
  });
  After(async function (scenario) {
    // This hook will be executed after all scenarios, and take a screenshot on scenario success
    if (scenario.result.status === Status.PASSED) {
      const buffer = await this.page.screenshot();
      await this.page.screenshot({ path: 'screenshot_success.png' });
      this.attach(buffer.toString('base64'), 'base64:image/png');
      console.log("Success screenshot logged")
    }

    // Close browser after each scenario
    if (this.browser) {
      await this.browser.close();
    }
  });
