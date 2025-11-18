// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries: 0,

  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {

    timeout: 5000
  },

  reporter: 'html',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        ignoreHttpsErrors: true
      },
    },
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

};

module.exports = config;
