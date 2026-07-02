import { expect, test } from '@playwright/test';

// Visual regression for BankaiButton styled by @bankai-vue/theme-bankai.
// Baselines are per-OS (Playwright suffixes them with the platform) and are
// generated in CI via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiButton — ${colorScheme}`, { tag: '@visual' }, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');

    // Snapshot only the fixture element so the baseline crops to the buttons
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('button-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture.getByRole('button').first()).toBeVisible();

    await expect(fixture).toHaveScreenshot(`bankai-button-${colorScheme}.png`);
  });
}
