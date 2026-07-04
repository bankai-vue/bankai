import { expect, test } from '@playwright/test';

// Visual regression for BankaiFlex. The component ships no CSS — the fixture's
// boxes make the prop-driven layout (gap, direction, alignment, distribution,
// wrap) visible so the baseline actually captures flex behavior.
// Baselines are per-OS (Playwright suffixes them with the platform) and are
// generated in CI via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiFlex — ${colorScheme}`, { tag: '@visual' }, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=flex');

    // Snapshot only the fixture element so the baseline crops to the layouts
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('flex-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    await expect(fixture).toHaveScreenshot(`bankai-flex-${colorScheme}.png`);
  });
}
