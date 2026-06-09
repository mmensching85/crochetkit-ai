// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src',
  testMatch: ['**/test_playwright.js'],
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
