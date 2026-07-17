import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiPage, complementing the Vitest browser tests: it exercises the component through
// the real Vite-served app and asserts (a) the page host anatomy the browser resolves and (b) the
// min-block-size fill the theme's `:where()` rule produces, across the OS matrix (ubuntu/macOS/windows).

// Bounding-box height of a locator (kept out of the test body so the null-guard isn't a conditional in a
// test).
const height = async (loc: Locator): Promise<number> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('element has no bounding box');
  }
  return b.height;
};

test.describe('page host + theme (theme-bankai page.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=page');
    await expect(page.getByTestId('page-fixture')).toBeVisible();
  });

  test('renders a plain <div> with the page anatomy — not a landmark', async ({ page }) => {
    const host = page.getByTestId('page');

    expect(await host.evaluate((el) => el.tagName)).toBe('DIV');
    await expect(host).toHaveAttribute('data-part', 'root');
    await expect(host).toHaveClass(/bankai-page/u);

    // BankaiPage is deliberately NOT a landmark — it hosts a route inside <main>, it is not <main>.
    await expect(page.getByRole('main')).toHaveCount(0);
  });

  test('theme fills min-block-size so a short route occupies the whole content region', async ({
    page,
  }) => {
    const host = page.getByTestId('page');

    // The house fill resolved from the theme: `100%` of the containing block (SPEC.md §4.19 — not a
    // viewport unit). The fixture frame is 16rem tall, so the fill resolves to that pixel height.
    expect(await host.evaluate((el) => getComputedStyle(el).minBlockSize)).toBe(`${16 * 16}px`);

    // With the fill, the short one-line page still stretches to the full 16rem frame height.
    expect(await height(host)).toBeGreaterThanOrEqual(16 * 16 - 1);
  });
});
