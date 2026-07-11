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
  //
  // `threshold` is the per-pixel YIQ tolerance; `maxDiffPixelRatio` is how many
  // pixels may exceed it. We tighten `threshold` to 0.1 (Playwright's default is a
  // lax 0.2): at 0.2 a *uniform* surface-color change has to shift by ~53/255
  // before a single pixel even counts (which is how a page-background change once
  // slipped through green), whereas 0.1 catches perceptible surface/color changes
  // (~26/255) while still tolerating AA jitter. Stricter starts flagging AA-edge
  // pixels and risks Firefox/WebKit flakes, so 0.1 is the balance point.
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
    },
  },
  // WebKit only ships a Safari-representative build on macOS; the Linux build is a
  // real WebKit engine and gives cheap, fast cross-engine coverage. WebKit-on-Windows
  // is neither Safari (that's macOS) nor cheaper than Linux — it's the same non-Safari
  // port running on the slowest, critical-path runner. So we skip it there (and keep no
  // *-webkit-win32 baselines). See SPEC.md §4.14.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    ...(process.platform === 'win32'
      ? []
      : [
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
        ]),
  ],
  webServer: {
    command: 'pnpm --filter playground run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
