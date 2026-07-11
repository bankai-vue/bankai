import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiFlex, complementing the Vitest browser tests: it
// exercises the component through the real Vite-served app and asserts the
// computed layout the browser resolves from the reflected `data-*` + the theme's
// `:where()` rules, across the OS matrix (ubuntu/macOS/windows).

test('resolves to a flex container with the prop-driven layout', async ({ page }) => {
  await page.goto('/');

  const flex = page.getByTestId('flex-row');
  await expect(flex).toBeVisible();

  const layout = await flex.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      alignItems: style.alignItems,
      columnGap: style.columnGap,
    };
  });

  expect(layout.display).toBe('flex');
  expect(layout.alignItems).toBe('center');
  expect(layout.columnGap).toBe('8px');
});

// Locks the shorthand → CSS-value mapping now that it lives in theme flex.css (not
// type-checked TS): each prop value must resolve to the expected computed style. Reads
// `getComputedStyle` so a broken/renamed CSS selector is a failing test, not a silent
// no-op. Uses the non-visual `flex-mapping` fixture (one BankaiFlex per value).

// `align` shorthand → resolved `align-items`.
const ALIGN: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};

// `justify` shorthand → resolved `justify-content`.
const JUSTIFY: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

// direction/wrap pass through unchanged, but still assert the selector fires.
const DIRECTION = ['row', 'row-reverse', 'column', 'column-reverse'];
const WRAP = ['nowrap', 'wrap', 'wrap-reverse'];

const computed = (page: Page, testId: string, prop: string): Promise<string> =>
  page.getByTestId(testId).evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test.describe('shorthand → CSS mapping (theme flex.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=flex-mapping');
    await expect(page.getByTestId('flex-mapping')).toBeVisible();
  });

  for (const [value, expected] of Object.entries(ALIGN)) {
    test(`align="${value}" → align-items: ${expected}`, async ({ page }) => {
      expect(await computed(page, `map-align-${value}`, 'align-items')).toBe(expected);
    });
  }

  for (const [value, expected] of Object.entries(JUSTIFY)) {
    test(`justify="${value}" → justify-content: ${expected}`, async ({ page }) => {
      expect(await computed(page, `map-justify-${value}`, 'justify-content')).toBe(expected);
    });
  }

  for (const value of DIRECTION) {
    test(`direction="${value}" → flex-direction: ${value}`, async ({ page }) => {
      expect(await computed(page, `map-direction-${value}`, 'flex-direction')).toBe(value);
    });
  }

  for (const value of WRAP) {
    test(`wrap="${value}" → flex-wrap: ${value}`, async ({ page }) => {
      expect(await computed(page, `map-wrap-${value}`, 'flex-wrap')).toBe(value);
    });
  }

  test('inline → display: inline-flex', async ({ page }) => {
    expect(await computed(page, 'map-inline', 'display')).toBe('inline-flex');
  });

  // gap steps resolve via theme-bankai's 2px grid; a static `gap="2"` (string "2") is the same step;
  // a step past the enumerated 0–32 tokens hits the `calc(n × --bankai-space-unit)` fallback (40 × 2px).
  test('gap step 4 → 0.5rem (8px)', async ({ page }) => {
    expect(await computed(page, 'map-gap-step', 'gap')).toBe('8px');
  });
  test('gap step 40 (out of scale) → base-unit fallback (80px)', async ({ page }) => {
    expect(await computed(page, 'map-gap-fallback', 'gap')).toBe('80px');
  });
  test('gap="2" (static string) → scale step 2 (4px)', async ({ page }) => {
    expect(await computed(page, 'map-gap-static', 'gap')).toBe('4px');
  });
});

// Bug fixes: a named t-shirt `gap` step (`xs`–`xl`) resolves to `--bankai-gap-<name>` instead of dying
// as an invalid CSS length, and a verbatim native `align`/`justify` (not a short keyword) rides the
// escape-hatch custom property applied by the base `:where()` rule — so the widened types never lie.
// [testId, computed prop, expected value].
const ESCAPE: Array<[string, string, string]> = [
  // gap="md" → --bankai-gap-md (0.75rem = 12px on theme-bankai)
  ['map-gap-named', 'gap', '12px'],
  ['map-justify-verbatim', 'justify-content', 'space-between'],
  ['map-align-verbatim', 'align-items', 'flex-start'],
];

test.describe('escape hatch → CSS (theme flex.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=flex-mapping');
    await expect(page.getByTestId('flex-mapping')).toBeVisible();
  });

  for (const [testId, prop, expected] of ESCAPE) {
    test(`${testId} → ${prop}: ${expected}`, async ({ page }) => {
      expect(await computed(page, testId, prop)).toBe(expected);
    });
  }
});
