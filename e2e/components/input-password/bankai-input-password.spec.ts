import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiInputPassword, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app — the wrapped default with its reveal button, the bare shape, the reveal
// toggle flipping the field type, disabled/read-only states, and the string + revealed v-model round-trip —
// across the OS matrix.

// The `.bankai-input-password` wrapper that owns a given field (data-testid routes to the composed input).
const wrapperOf = (page: Page, testId: string): Locator =>
  page.locator('.bankai-input-password', { has: page.getByTestId(testId) });

test.describe('anatomy + states (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=input-password');
    await expect(page.getByTestId('input-password-fixture')).toBeVisible();
  });

  test('wraps a masked field with a reveal button by default', async ({ page }) => {
    const field = page.getByTestId('input-password-md');
    const wrapper = wrapperOf(page, 'input-password-md');

    await expect(field).toHaveClass(/bankai-input/u);
    expect(await field.getAttribute('type')).toBe('password');
    expect(await wrapper.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await field.evaluate((el) => el.dataset.part)).toBe('field');
    await expect(field).toHaveAttribute('id', /^bankai-input-password-/u);

    // The reveal button is a real, focusable, tab-order control (not aria-hidden / tabindex="-1").
    const toggle = wrapper.locator('[data-part="toggle"]');
    await expect(toggle).toHaveAttribute('type', 'button');
    await expect(toggle).toHaveAttribute('aria-label', 'Show password');
    expect(await toggle.getAttribute('aria-hidden')).toBeNull();
    expect(await toggle.getAttribute('tabindex')).toBeNull();
  });

  test('renders a bare masked input with no wrapper/button when toggle is false', async ({
    page,
  }) => {
    const field = page.getByTestId('input-password-bare');
    expect(await field.getAttribute('type')).toBe('password');
    expect(await field.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await field.evaluate((el) => el.closest('.bankai-input-password'))).toBeNull();
  });
});

test.describe('reveal + states (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=input-password');
    await expect(page.getByTestId('input-password-fixture')).toBeVisible();
  });

  test('a pre-revealed field shows text and its button reads Hide', async ({ page }) => {
    const field = page.getByTestId('input-password-revealed');
    const wrapper = wrapperOf(page, 'input-password-revealed');
    expect(await field.getAttribute('type')).toBe('text');
    await expect(wrapper).toHaveAttribute('data-bankai-revealed', '');
    await expect(wrapper.locator('[data-part="toggle"]')).toHaveAttribute(
      'aria-label',
      'Hide password',
    );
  });

  test('reflects disabled/readonly on the field; disabled also disables the button', async ({
    page,
  }) => {
    await expect(page.getByTestId('input-password-disabled')).toBeDisabled();
    await expect(
      wrapperOf(page, 'input-password-disabled').locator('[data-part="toggle"]'),
    ).toBeDisabled();

    await expect(page.getByTestId('input-password-readonly')).toHaveJSProperty('readOnly', true);
    // A read-only field can still be revealed — the button stays enabled.
    await expect(
      wrapperOf(page, 'input-password-readonly').locator('[data-part="toggle"]'),
    ).toBeEnabled();
  });
});

test('the reveal button and the string field both drive the v-model', async ({ page }) => {
  await page.goto('/');

  const field = page.getByTestId('input-password-model-field');
  const wrapper = wrapperOf(page, 'input-password-model-field');
  const model = page.getByTestId('input-password-model');
  const toggle = wrapper.locator('[data-part="toggle"]');

  // Seeded, masked.
  await expect(field).toHaveAttribute('type', 'password');
  await expect(model).toHaveText('Model: hunter2 · revealed: false');

  // Typing updates the string model.
  await field.fill('correcthorse');
  await expect(model).toHaveText('Model: correcthorse · revealed: false');

  // The reveal button flips the field to text and updates revealed.
  await toggle.click();
  await expect(field).toHaveAttribute('type', 'text');
  await expect(toggle).toHaveAttribute('aria-label', 'Hide password');
  await expect(model).toHaveText('Model: correcthorse · revealed: true');
});
