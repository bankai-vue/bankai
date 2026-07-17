import { expect, test } from '@playwright/test';

// e2e coverage for BankaiHeading, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the anatomy the browser resolves and (b) the per-level
// font-size the theme's `:where()` rules produce, keyed on `data-bankai-level`, across the OS matrix
// (ubuntu/macOS/windows).

const LEVELS = [1, 2, 3, 4, 5, 6] as const;

// House-theme `--bankai-heading-size-*` steps in px (1rem = 16px): 2.25 / 1.875 / 1.5 / 1.25 / 1.125 / 1rem.
const SIZE_PX: Record<string, string> = {
  '1': '36px',
  '2': '30px',
  '3': '24px',
  '4': '20px',
  '5': '18px',
  '6': '16px',
};

test.describe('per-level type styles (theme heading.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=heading');
    await expect(page.getByTestId('heading-fixture')).toBeVisible();
  });

  for (const level of LEVELS) {
    test(`level ${level} renders <h${level}> exposing the heading anatomy`, async ({ page }) => {
      const heading = page.getByTestId(`heading-${level}`);
      await expect(heading).toHaveClass(/bankai-heading/u);
      // The element itself carries the outline semantics — level 2 → <h2>.
      expect(await heading.evaluate((el) => el.tagName)).toBe(`H${level}`);
      expect(await heading.evaluate((el) => el.dataset.part)).toBe('root');
      expect(await heading.evaluate((el) => el.dataset.bankaiLevel)).toBe(String(level));
    });
  }

  for (const [level, px] of Object.entries(SIZE_PX)) {
    test(`level ${level} resolves font-size ${px}`, async ({ page }) => {
      const fontSize = await page
        .getByTestId(`heading-${level}`)
        .evaluate((el) => getComputedStyle(el).fontSize);
      expect(fontSize).toBe(px);
    });
  }

  test('headings ship no default margin (spacing is the layout’s job)', async ({ page }) => {
    const margin = await page
      .getByTestId('heading-1')
      .evaluate((el) => getComputedStyle(el).margin);
    expect(margin).toBe('0px');
  });
});
