import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 120000,
  use: {
    baseURL: 'https://neeto-form-web-playwright.neetodeployapp.com/login',
    trace: 'on',
    testIdAttribute: 'data-cy'
  },

  projects: [
    {
      name: 'task-1.1',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/task-1.1.spec.ts'
    },
    {
      name: 'task-1.2',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/task-1.2.spec.ts'
    },
    {
      name: 'task-1.3',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/task-1.3.spec.ts'
    },
  ],
});
