import { expect, test } from '@playwright/test';
import { expectBaselineSurface } from '../../helpers/color';

// Visual regression for BankaiCode. The component ships no CSS — the theme gives it a monospace font and a
// chip background; the fixture places inline code in normal and small text so the baseline captures the
// chip and its `em`-relative sizing. Baselines are per-OS (Playwright suffixes them with the platform) and
// are generated in CI via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiCode — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=code');

    // Snapshot only the fixture element so the baseline crops to the demo instead of the whole viewport.
    const fixture = page.getByTestId('code-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    const snapshot = `bankai-code-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface behind the
    // fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}
