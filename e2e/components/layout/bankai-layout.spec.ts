import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiLayout, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the landmark structure the browser resolves and
// (b) the computed grid placement the theme's `:where()` rules produce from the `data-part`s, across
// the OS matrix (ubuntu/macOS/windows).

test('resolves to a grid container emitting one region per provided slot', async ({ page }) => {
  await page.goto('/');

  const layout = page.getByTestId('layout');
  await expect(layout).toBeVisible();

  // The theme puts the root on a grid.
  expect(await layout.evaluate((el) => getComputedStyle(el).display)).toBe('grid');

  // Each provided slot becomes exactly one native landmark region as a direct child of the root.
  await expect(layout.locator('> header')).toHaveCount(1);
  await expect(layout.locator('> aside')).toHaveCount(1);
  await expect(layout.locator('> main')).toHaveCount(1);
  await expect(layout.locator('> footer')).toHaveCount(1);
});

// Grid placement: against the bounded fixture, the regions land where the default template puts them
// — header across the top, footer across the bottom, sidebar left of the main content.
const box = async (
  loc: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('region has no bounding box');
  }
  return b;
};

test.describe('default grid placement (theme layout.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=layout');
    await expect(page.getByTestId('layout-fixture')).toBeVisible();
  });

  test('regions render as the expected native landmarks with their region classes', async ({
    page,
  }) => {
    // BankaiLayout composes the region components, so each region carries its `.bankai-*` class (the
    // hook the theme keys grid placement on) on the matching native landmark element.
    const layout = page.getByTestId('layout-fixture').locator('.bankai-layout');
    await expect(layout.locator('> header.bankai-header')).toHaveCount(1);
    await expect(layout.locator('> aside.bankai-aside')).toHaveCount(1);
    await expect(layout.locator('> main.bankai-main')).toHaveCount(1);
    await expect(layout.locator('> footer.bankai-footer')).toHaveCount(1);

    // In an isolated layout the emitted <main> is the document's sole main landmark.
    await expect(page.locator('main')).toHaveCount(1);
  });

  test('header spans the top, footer the bottom, sidebar left of main', async ({ page }) => {
    const layout = page.getByTestId('layout-fixture').locator('.bankai-layout');
    const header = await box(layout.locator('> header'));
    const aside = await box(layout.locator('> aside'));
    const main = await box(layout.locator('> main'));
    const footer = await box(layout.locator('> footer'));

    // Header sits above the middle row; footer below it.
    expect(header.y + header.height).toBeLessThanOrEqual(main.y + 1);
    expect(footer.y).toBeGreaterThanOrEqual(main.y + main.height - 1);

    // Sidebar is left of the main content, on the same middle row.
    expect(aside.x + aside.width).toBeLessThanOrEqual(main.x + 1);

    // Header/footer span both columns → wider than the main content column alone.
    expect(header.width).toBeGreaterThan(main.width);
    expect(footer.width).toBeGreaterThan(main.width);
  });
});
