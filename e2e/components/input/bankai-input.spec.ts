import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiInput, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app — real typing (v-model), the native disabled/readonly states, and
// the full-width sizing the theme's `:where()` rules produce — across the OS matrix.

const box = async (
  loc: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('element has no bounding box');
  }
  return b;
};

test.describe('anatomy + theme sizing (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=input');
    await expect(page.getByTestId('input-fixture')).toBeVisible();
  });

  test('renders .bankai-input roots with the size reflected', async ({ page }) => {
    const md = page.getByTestId('input-md');

    await expect(md).toHaveClass(/bankai-input/u);
    expect(await md.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await md.evaluate((el) => el.dataset.bankaiSize)).toBe('md');
    // A native text input.
    expect(await md.getAttribute('type')).toBe('text');
  });

  test('auto-generates a stable id (useBankaiId)', async ({ page }) => {
    await expect(page.getByTestId('input-md')).toHaveAttribute('id', /^bankai-input-/u);
  });

  test('fills the container width by default (theme inline-size: 100%)', async ({ page }) => {
    const bounds = await box(page.getByTestId('input-fixture').locator('.bounds'));
    const input = await box(page.getByTestId('input-md'));

    // `inline-size: 100%` + `box-sizing: border-box` → the field spans the full container width.
    expect(Math.round(input.width)).toBe(Math.round(bounds.width));
  });

  test('reflects the native disabled/readonly states', async ({ page }) => {
    await expect(page.getByTestId('input-disabled')).toBeDisabled();
    await expect(page.getByTestId('input-readonly')).toHaveJSProperty('readOnly', true);
  });
});

test('typing updates the v-model through the app', async ({ page }) => {
  await page.goto('/');

  const field = page.getByTestId('input-model-field');
  await expect(page.getByTestId('input-model')).toHaveText('Model: (empty)');

  await field.fill('hello world');
  await expect(page.getByTestId('input-model')).toHaveText('Model: hello world');
});
