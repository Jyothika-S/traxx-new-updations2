import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: `./.env`});

dotenv.config();
// console.log(process.env)
// console.log(process.env.URL)


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // globalSetup: './global-setup.ts',
  // globalSetup: require.resolve("./global-setup.ts"),
  testDir: './tests',
  timeout: 105 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  /*monocart report*/
  // reporter: [
  //   ['list'],
  //   ['monocart-reporter', {  
  //       name: "My Test Report",
  //       outputFile: './test-results/report.html'
  //   }]
  // ],
  /*allure report*/
  reporter: [
      ['list'],
      ['html'],
      ['line'], 
      ['allure-playwright', {outputFolder: 'allure-results'}],
      ['monocart-reporter', {  
              name: "My Test Report",
              outputFile: './test-results/report.html'
          }],
  ['./custom-report/customReporter.ts'] 
    ],
  /*custom report*/
  // reporter: './custom-report/customReporter.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // storageState: './storageState.json'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testDir: "./",
      testMatch: "global-setup.ts",
      use: { 
        baseURL: 'https://app.qa.traxinsights.app/',
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        headless: false
     },
    },
    {
      name: 'QA_Chromium',
      // dependencies: ['setup'],
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://app.qa.traxinsights.app/',
        // storageState: './storageState.json',
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        // headless: false,
        // storageState: './loginAuth.json'
        // storageState: 'loginAuth.json' //pass filename
     },
    },
    // {
    //   name: 'Sandbox_Chrome',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'https://app.sandbox.traxinsights.app/',
    //     screenshot: 'on',
    //     video: 'on',
    //     trace: 'on',
    //     headless: false,
    //  },
    // },
    {
      name: 'QA_Firefox',
      use: 
      { 
        ...devices['Desktop Firefox'],
        baseURL:'https://app.qa.traxinsights.app/',
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },
    {
      name: 'QA_Edge',
      use: 
      { 
        ...devices['Desktop Edge'],channel:'msedge',
        baseURL:'https://app.qa.traxinsights.app/',
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },   
    },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     screenshot: 'on',
    //     video: 'on',
    //     trace: 'on',
    //     },
    // },

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
