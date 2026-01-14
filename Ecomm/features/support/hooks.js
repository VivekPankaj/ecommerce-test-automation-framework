const {After, Before,AfterStep,Status} = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(120 * 1000); // Increased to 120 seconds to allow more time for browser launch

Before(async function (scenario) {
    // This hook will be executed before all scenarios
    
    // Check if this is a Pickup scenario and set a flag
    const tags = scenario.pickle.tags.map(t => t.name);
    this.isPickupScenario = tags.includes('@Pickup');
    if (this.isPickupScenario) {
        console.log('>>> PICKUP SCENARIO DETECTED - will skip delivery address setup');
    }

    const browserName = process.env.BROWSER || 'chromium';  // Set Chromium as default browser
    const browserType = { chromium, firefox, webkit }[browserName] || chromium;
    this.browser = await browserType.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']  // Added args to prevent common timeout issues
    });
    // Create a browser context with a fixed geolocation so tests that depend on location
    // behave consistently. We also pre-grant geolocation permission for the AUT origin
    // to prevent the browser permission popup from appearing.
    const context = await this.browser.newContext({
      geolocation: { latitude: 39.8283, longitude: -98.5795 }, // center of US by default
      // Clear all storage to ensure clean state for each test
      storageState: undefined,
      // viewport, locale, etc. can be added here if needed
    });

    // Ensure a clean permissions state then explicitly grant geolocation for the AUT origin.
    await context.clearPermissions();
    const origin = process.env.TEST_AUT_ORIGIN || 'https://qa-shop.vulcanmaterials.com';
    await context.grantPermissions(['geolocation'], { origin });

    this.page = await context.newPage();
    
    // Clear any existing storage and cookies for the QA site to ensure fresh login
    await this.page.goto(origin);
    await context.clearCookies();
    await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
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
