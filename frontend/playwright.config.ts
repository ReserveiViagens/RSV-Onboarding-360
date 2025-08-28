import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: (() => {
    const base = [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ] as any[];
    if (process.env.ALL_BROWSERS === '1') {
      base.push({ name: 'firefox', use: { ...devices['Desktop Firefox'] } });
      base.push({ name: 'webkit', use: { ...devices['Desktop Safari'] } });
    }
    return base;
  })(),
});

