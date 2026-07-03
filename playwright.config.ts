import { defineConfig, devices } from '@playwright/test';

// e2e + cross-browser (SPEC.md §4.14). Boots the playground Vite dev server and
// drives it in a real browser.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // `list` for readable CI logs; `html` for an inspectable report (embeds the
  // expected/actual/diff images on visual mismatches). `open: 'never'` so CI
  // doesn't try to launch a browser.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Stable visual regression: freeze animations and allow a tiny tolerance for
  // sub-pixel anti-aliasing. Baselines are per-OS (see the visual specs).
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm --filter playground run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
