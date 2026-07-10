import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiContainer, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the anatomy the browser resolves and (b) the computed
// width the theme's `:where()` rules produce — centered max-width by default, edge-to-edge when `fluid` —
// across the OS matrix (ubuntu/macOS/windows).

const box = async (
  loc: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('container has no bounding box');
  }
  return b;
};

test.describe('width behavior (theme container.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=container');
    await expect(page.getByTestId('container-fixture')).toBeVisible();
  });

  test('renders as .bankai-container roots with the fluid flag reflected', async ({ page }) => {
    const centered = page.getByTestId('container-centered');
    const fluid = page.getByTestId('container-fluid');

    // Both are the polymorphic default (<div>) exposing the container anatomy.
    await expect(centered).toHaveClass(/bankai-container/u);
    await expect(fluid).toHaveClass(/bankai-container/u);
    expect(await centered.evaluate((el) => el.dataset.part)).toBe('root');

    // `fluid` reflects a presence flag; the centered default has none.
    expect(await centered.evaluate((el) => 'bankaiFluid' in el.dataset)).toBe(false);
    expect(await fluid.evaluate((el) => el.dataset.bankaiFluid)).toBe('');
  });

  test('centered container caps at the max-width; fluid drops the cap', async ({ page }) => {
    // The theme resolves `max-inline-size` from the token on the centered box, and `none` on the fluid one.
    const centeredMaxWidth = await page
      .getByTestId('container-centered')
      .evaluate((el) => getComputedStyle(el).maxInlineSize);
    const fluidMaxWidth = await page
      .getByTestId('container-fluid')
      .evaluate((el) => getComputedStyle(el).maxInlineSize);

    // Centered has a concrete px cap (the fixture shrinks the token to 16rem = 256px); fluid has none.
    expect(centeredMaxWidth).toBe('256px');
    expect(fluidMaxWidth).toBe('none');
  });

  test('centered leaves equal side bars; fluid fills the available width', async ({ page }) => {
    const bounds = await box(page.getByTestId('container-fixture').locator('.bounds'));
    const centered = await box(page.getByTestId('container-centered'));
    const fluid = await box(page.getByTestId('container-fluid'));

    // Fluid spans the full available width; centered is narrower (its cap leaves bars).
    expect(Math.round(fluid.width)).toBe(Math.round(bounds.width));
    expect(centered.width).toBeLessThan(fluid.width);

    // `margin-inline: auto` centers the capped box: the left and right bars are equal (±1px rounding).
    const leftBar = centered.x - bounds.x;
    const rightBar = bounds.x + bounds.width - (centered.x + centered.width);
    expect(Math.abs(leftBar - rightBar)).toBeLessThanOrEqual(1);
    expect(leftBar).toBeGreaterThan(0);
  });
});
