import { test, expect } from '@playwright/test';

test('playground renders and shows the core version', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('title')).toHaveText('bankai-vue playground');
  await expect(page.getByTestId('core-version')).toContainText('core v');

  // Sanity: Vue reactivity is wired end-to-end through the real browser.
  await page.getByTestId('counter').click();
  await expect(page.getByTestId('counter')).toContainText('count is 1');
});
