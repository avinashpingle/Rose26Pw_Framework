import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
/**
 * See https://playwright.dev/docs/test-configuration.
 */

let env = process.env.ENV
if (!env) {
  logger.info("Executing tests on default env: QA")
  env = 'qa'
}
dotenv.config({
  path: `config/.env.${env}`
})

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['stepdefinitions/**/*.ts', 'fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
    }],
  ],
  timeout: 60_000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false
      },
    },
    {
      name: 'e2e',
      testDir: './tests',
      use: {
        ...devices['Desktop Chrome'],
        headless: false
      },
    },
  
   /*
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 17 Pro Max Landscape'],
        headless: false
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  ]

});
