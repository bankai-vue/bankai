import { expect, test } from '@playwright/test';
import { expectBaselineSurface } from '../../helpers/color';

// Visual regression for BankaiIcon. The component ships no CSS — the theme's box (size scale, the square
// 1:1 frame vs the `no-square` opt-out) and `currentColor` inheritance are what the baseline captures.
// Baselines are per-OS (Playwright suffixes them with the platform) and are generated in CI via the
// "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiIcon — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=icon');

    // Snapshot only the fixture element so the baseline crops to the icon samples
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('icon-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    const snapshot = `bankai-icon-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface
    // behind the fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}
