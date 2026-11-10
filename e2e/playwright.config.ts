import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error(
    'BASE_URL environment variable is required for e2 tests. Set BASE_URL to the application URL.'
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'hlml',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // We do not start a webServer here because BASE_URL
  // may point to an externally hosted environment.
  // If you want to run locally with a dev server,
  // start the app separately and set BASE_URL accordingly.
});
