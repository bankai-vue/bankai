import { expect, test } from '@playwright/test';

// e2e coverage for BankaiButton, complementing the Vitest browser tests: it
// exercises the component through the real Vite-served app, with real keyboard
// interaction, and across the OS matrix (ubuntu/macOS/windows).

test('activates via keyboard (Enter and Space)', async ({ page }) => {
  await page.goto('/');

  const counter = page.getByTestId('counter');
  await counter.focus();
  await expect(counter).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(counter).toContainText('count is 1');

  await page.keyboard.press('Space');
  await expect(counter).toContainText('count is 2');
});

test('disabled button exposes the native disabled state', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'disabled' })).toBeDisabled();
});

test('auto-generates a stable id through the app (useBankaiId)', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('counter')).toHaveAttribute('id', /^bankai-button-/u);
});
