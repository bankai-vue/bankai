import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { computedRgb } from '../../helpers/color';

// e2e coverage for BankaiIcon, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts the computed box the browser resolves from the reflected
// `data-*` + the theme's `:where()` rules (the 1em size scale, the square 1:1 box vs the `no-square`
// opt-out, and `currentColor` inheritance), across the OS matrix.

// `size` step → resolved `font-size` (theme-bankai's rem icon scale @ 16px root), which drives the box.
const SIZE: Record<string, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

const computed = (page: Page, testId: string, prop: string): Promise<string> =>
  page.getByTestId(testId).evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test.describe('data-* → CSS mapping (theme icon.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/?fixture=icon-mapping');
    await expect(page.getByTestId('icon-mapping')).toBeVisible();
  });

  for (const [value, expected] of Object.entries(SIZE)) {
    test(`size="${value}" → font-size: ${expected}`, async ({ page }) => {
      expect(await computed(page, `map-size-${value}`, 'font-size')).toBe(expected);
    });
  }

  test('non-named size → verbatim font-size (escape hatch)', async ({ page }) => {
    expect(await computed(page, 'map-size-custom', 'font-size')).toBe('20px');
  });

  test('default box is square (1:1) — a square glyph yields a square box', async ({ page }) => {
    const box = await page.getByTestId('map-square').boundingBox();
    expect(box).not.toBeNull();
    // size="xl" → 2rem = 32px, both axes.
    expect(Math.round(box!.width)).toBe(32);
    expect(Math.round(box!.height)).toBe(32);
  });

  test('no-square keeps the glyph ratio — a 2:1 glyph is wider than tall', async ({ page }) => {
    const box = await page.getByTestId('map-no-square').boundingBox();
    expect(box).not.toBeNull();
    // Height still driven by size (32px); width follows the 48×24 (2:1) viewBox → ~64px.
    expect(Math.round(box!.height)).toBe(32);
    expect(box!.width).toBeGreaterThan(box!.height);
  });

  test('currentColor — the svg inherits the ambient color', async ({ page }) => {
    const svg = page.getByTestId('map-color').locator('svg');
    expect(await computedRgb(svg, 'fill')).toBe('1,2,3,255');
  });
});
