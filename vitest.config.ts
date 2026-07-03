import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Component/unit tests run in a REAL browser (Playwright provider) so the
// native-HTML behavior bankai-vue is built on — <dialog>, Popover, top-layer,
// focus, ARIA — is exercised faithfully rather than under a jsdom shim.
// `@vitejs/plugin-vue` lets tests import `.vue` SFCs directly.

// Cross-engine in CI to catch browser edge cases before merge; chromium-only
// locally for a fast dev loop.
const browsers = process.env.CI ? ['chromium', 'firefox', 'webkit'] : ['chromium'];

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['packages/*/test/**/*.{test,spec}.ts'],
    // Type-level tests (`*.test-d.ts`) run via `vitest --typecheck.only`
    // (see the `test:types` script). vue-tsc is the checker because the type
    // surface flows through `.vue` SFCs, which plain tsc can't parse.
    typecheck: {
      checker: 'vue-tsc',
      tsconfig: './packages/core/tsconfig.test.json',
      include: ['packages/*/test/**/*.test-d.ts'],
    },
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: browsers.map((browser) => ({ browser })),
    },
  },
});
