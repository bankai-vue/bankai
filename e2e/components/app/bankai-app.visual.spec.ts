import { expect, test } from '@playwright/test';
import { expectBaselineSurface } from '../../helpers/color';

// Visual regression for BankaiApp. The component ships no CSS — the theme carries the embedded-mode
// surface (color-scheme + the foundation bg/fg tokens) on the App box; the fixture sits the App box in a
// contrasting "foreign host" frame so its self-contained house surface is visible against a non-house
// background. Baselines are per-OS (Playwright suffixes them with the platform) and are generated in CI
// via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiApp — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=app');

    // Snapshot only the fixture element so the baseline crops to the region (plus the fixture's own
    // padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('app-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    const snapshot = `bankai-app-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface behind the
    // fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}
