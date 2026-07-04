import { expect, test } from '@playwright/test';

// Visual regression for BankaiText. The component ships no CSS — the theme's type styles
// (size scale, weight, tone, truncation) and the native inline semantics reached via `as`
// are what the baseline captures.
// Baselines are per-OS (Playwright suffixes them with the platform) and are generated in CI
// via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiText — ${colorScheme}`, { tag: '@visual' }, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=text');

    // Snapshot only the fixture element so the baseline crops to the text samples
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('text-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    await expect(fixture).toHaveScreenshot(`bankai-text-${colorScheme}.png`);
  });
}
