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

// `variant`/`size` are a LiteralUnion (open named set): a value outside the shipped members must
// reflect verbatim as `data-variant`/`data-size` — the reflected `data-*` *is* the escape hatch —
// so a consumer's own rule (see the fixture's global `[data-variant='brand']` / `[data-size='xl']`)
// actually applies. Guards the widened type against a future refactor silently dropping the value.
test('custom variant/size reflect verbatim so a consumer rule applies (LiteralUnion escape hatch)', async ({
  page,
}) => {
  await page.goto('/?fixture=button-escape-hatch');

  const button = page.getByTestId('custom-button');
  await expect(button).toBeVisible();

  // Verbatim reflection: the custom values reach the DOM unchanged.
  await expect(button).toHaveAttribute('data-variant', 'brand');
  await expect(button).toHaveAttribute('data-size', 'xl');

  // End-to-end: the consumer rules keyed on those custom values actually take effect.
  const applied = await button.evaluate((el) => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, paddingTop: style.paddingTop };
  });
  expect(applied.background).toBe('rgb(1, 2, 3)');
  expect(applied.paddingTop).toBe('42px');
});
