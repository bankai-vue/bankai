import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiInputNumber, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app — the bare default field, the wrapped button layouts, the stepper
// controls driving the native step, bounds-disabling, and the number v-model round-trip — across the OS
// matrix.

// The `.bankai-input-number` wrapper that owns a given field (data-testid routes to the composed input).
const wrapperOf = (page: Page, testId: string): Locator =>
  page.locator('.bankai-input-number', { has: page.getByTestId(testId) });

test.describe('anatomy + layouts (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=input-number');
    await expect(page.getByTestId('input-number-fixture')).toBeVisible();
  });

  test('renders a bare native number input by default (no wrapper)', async ({ page }) => {
    const field = page.getByTestId('input-number-md');

    await expect(field).toHaveClass(/bankai-input/u);
    expect(await field.getAttribute('type')).toBe('number');
    // The bare input is itself the root; there is no wrapper.
    expect(await field.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await field.evaluate((el) => el.closest('.bankai-input-number'))).toBeNull();
    await expect(field).toHaveAttribute('id', /^bankai-input-number-/u);
  });

  test('wraps the field and reflects the layout when buttons are set', async ({ page }) => {
    const stacked = wrapperOf(page, 'input-number-stacked');
    await expect(stacked).toHaveAttribute('data-bankai-buttons', 'stacked');
    expect(await stacked.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await page.getByTestId('input-number-stacked').evaluate((el) => el.dataset.part)).toBe(
      'field',
    );

    const split = wrapperOf(page, 'input-number-split');
    await expect(split).toHaveAttribute('data-bankai-buttons', 'split');

    // Stepper controls are decorative to assistive tech and out of the tab order.
    const decrement = stacked.locator('[data-part="decrement"]');
    await expect(decrement).toHaveAttribute('aria-hidden', 'true');
    await expect(decrement).toHaveAttribute('tabindex', '-1');
  });

  test('disables the increment control at the max bound', async ({ page }) => {
    const wrapper = wrapperOf(page, 'input-number-bounded');
    await expect(wrapper.locator('[data-part="increment"]')).toBeDisabled();
    await expect(wrapper.locator('[data-part="decrement"]')).toBeEnabled();
  });

  test('hides the browser native spin buttons', async ({ page }) => {
    // `appearance: textfield` is the cross-engine hook; asserting the computed value confirms the theme
    // rule resolved (the ::-webkit spin pseudo-elements aren't observable from computed style).
    const field = page.getByTestId('input-number-md');
    expect(await field.evaluate((el) => getComputedStyle(el).appearance)).toBe('textfield');
  });
});

test.describe('states (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=input-number');
    await expect(page.getByTestId('input-number-fixture')).toBeVisible();
  });

  test('reflects disabled/readonly on the field and both controls', async ({ page }) => {
    await expect(page.getByTestId('input-number-disabled')).toBeDisabled();
    const disabledWrapper = wrapperOf(page, 'input-number-disabled');
    await expect(disabledWrapper.locator('[data-part="decrement"]')).toBeDisabled();
    await expect(disabledWrapper.locator('[data-part="increment"]')).toBeDisabled();

    await expect(page.getByTestId('input-number-readonly')).toHaveJSProperty('readOnly', true);
  });
});

test('typing and the stepper controls both drive the number v-model', async ({ page }) => {
  await page.goto('/');

  const field = page.getByTestId('input-number-model-field');
  const wrapper = wrapperOf(page, 'input-number-model-field');
  const model = page.getByTestId('input-number-model');

  // Seeded model value.
  await expect(model).toHaveText('Model: 3');

  // Typing updates the model as a number.
  await field.fill('7');
  await expect(model).toHaveText('Model: 7');

  // The increment control drives the native step (max is 10).
  await wrapper.locator('[data-part="increment"]').click();
  await expect(field).toHaveValue('8');
  await expect(model).toHaveText('Model: 8');

  // Clearing the field yields an empty (undefined) model, never coerced to 0.
  await field.fill('');
  await expect(model).toHaveText('Model: (empty)');
});
