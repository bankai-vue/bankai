import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiMain, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the main landmark structure the browser resolves
// and (b) the min-inline-size floor the theme's `:where()` rule produces, across the OS matrix
// (ubuntu/macOS/windows).

// Bounding box of a locator (kept out of the test body so the null-guard isn't a conditional in a test).
const width = async (loc: Locator): Promise<number> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('element has no bounding box');
  }
  return b.width;
};

test.describe('main region + theme (theme-bankai main.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=main');
    await expect(page.getByTestId('main-fixture')).toBeVisible();
  });

  test('renders a native <main> with the main anatomy + sole landmark', async ({ page }) => {
    const main = page.getByTestId('main');

    // The native element itself carries the main landmark (SPEC §4.9).
    expect(await main.evaluate((el) => el.tagName)).toBe('MAIN');
    await expect(main).toHaveAttribute('data-part', 'root');
    await expect(main).toHaveClass(/bankai-main/u);

    // The isolated fixture emits exactly one main landmark (it must be unique per document).
    await expect(page.getByRole('main')).toHaveCount(1);
  });

  test('theme floors min-inline-size so the region shrinks instead of overflowing', async ({
    page,
  }) => {
    const main = page.getByTestId('main');

    // The house overflow-floor resolved from the theme.
    expect(await main.evaluate((el) => getComputedStyle(el).minInlineSize)).toBe('0px');

    // With the floor, the flex child stays within its bounded 20rem row (would blow wider otherwise).
    expect(await width(main)).toBeLessThanOrEqual(20 * 16 + 1);
  });
});
