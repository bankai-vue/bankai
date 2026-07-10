import { expect, test } from '@playwright/test';
import { expectBaselineSurface } from '../../helpers/color';

// Visual regression for BankaiLayout. The component ships no CSS — the theme places the regions on a
// grid; the fixture bounds the shell and colors the regions so the baseline captures the default
// placement (header top, footer bottom, sidebar left of main). Baselines are per-OS (Playwright
// suffixes them with the platform) and are generated in CI via the "Update Visual Snapshots"
// workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiLayout — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=layout');

    // Snapshot only the fixture element so the baseline crops to the shell (plus the fixture's own
    // padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('layout-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    const snapshot = `bankai-layout-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface behind the
    // fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}
