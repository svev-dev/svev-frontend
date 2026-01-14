import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

const CI: boolean = process.env.CI === 'true' ? true : false;

export const baseConfig: PlaywrightTestConfig = {
  testDir: './e2e-tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

export function createPlaywrightConfig(
  port: number,
  overrides?: Partial<PlaywrightTestConfig>
): PlaywrightTestConfig {
  return defineConfig({
    ...baseConfig,
    /* Run your local dev server before starting the tests */
    webServer: {
      command: 'npm run dev',
      url: `http://localhost:${port}`,
      reuseExistingServer: !CI,
    },
    ...overrides,
  });
}
