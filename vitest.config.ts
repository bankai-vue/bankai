import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Component/unit tests run in a REAL browser (Playwright provider) so the
// native-HTML behavior bankai-vue is built on — <dialog>, Popover, top-layer,
// focus, ARIA — is exercised faithfully rather than under a jsdom shim.
export default defineConfig({
  test: {
    include: ['packages/*/test/**/*.{test,spec}.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
