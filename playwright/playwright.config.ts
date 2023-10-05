import { defineConfig, devices, expect, Locator } from '@playwright/test';
import { Toggle_object } from '@wrappers/Toggle_object';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
expect.extend({
  async toBeSelected(element: Locator) {
    await expect.poll(async () => {
      const wrapper = new Toggle_object(element, this.page);
      const isSelected = await wrapper.isSelected();
      return isSelected;
    }).toBeTruthy();
    return {
      pass: true,
      message: () => `Expected element not to be selected`,
    };
  }

});
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 90 * 1000,
  globalTimeout: 15 * 60 * 1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['github'], ['html'], [
      "./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
      {
        // slackWebHookUrl: process.env.SLACK_WEBHOOK_URL,
        sendResults: "always", // "always" , "on-failure", "off",
        maxNumberOfFailuresToShow: 2,
        slackLogLevel: "WARN",
        slackOAuthToken: process.env.SLACK_AUTH_TOKEN,
        channels: ["@konrad"],
        showInThread: true,
        disableUnfurl: true,
        meta: [
          {
            key: ":checkered_flag: STATUS",
          },
          {
            key: ":computer: test env",
            value: process.env.JOB_NAME
          },
          {
            key: ":tyk-new: Author",
            value: process.env.EVENT_TRIGGER            
          },
          {
            key: ":link: Results",
            value: `<https://github.com/${process.env.FRAMEWORK_REPO}/actions/runs/${process.env.JOB_RUN_ID}|Execution page>`
          },
          {
            key: ":link: Report",
            value: `<https://tyk-qa-reports.s3.eu-central-1.amazonaws.com/${process.env.RUN_ID}/playwright-report/index.html|Link to report>`
          }
        ]
      },
    ]] : [
      ['html'], ['json', { outputFile: 'playwright-report/summary.json' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1800, height: 1200 }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1800, height: 1000 }
      },
      grepInvert: [/@prerequisits/],
      testDir: './tests/specs',
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

});
