import { expect, test } from '@playwright/test';
import { computedRgb, expectBaselineSurface, tokenRgb } from '../../helpers/color';

// Visual regression for BankaiInputNumber styled by @bankai-vue/theme-bankai. Baselines are per-OS
// (Playwright suffixes them with the platform) and are generated in CI via the "Update Visual Snapshots"
// workflow, not locally. The field's fill is the page surface (`--bankai-color-bg`); the stepper controls
// use the raised surface role — the deterministic color checks below assert that token wiring.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInputNumber — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input-number');

    const fixture = page.getByTestId('input-number-fixture');
    await expect(fixture.getByTestId('input-number-md')).toBeVisible();

    const snapshot = `bankai-input-number-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}

// Deterministic color checks complementing the pixel snapshot: the field fills to the page bg/fg, while the
// stepper controls ride the raised surface role. `tokenRgb`/`computedRgb` normalize to canonical sRGB, so
// these survive an intentional token retune (both sides move together).
for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInputNumber colors — ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input-number');

    const html = page.locator('html');
    // The bare default field (no wrapper).
    const field = page.getByTestId('input-number-md');
    // A buttoned field for the stepper-control color (bare fields have no controls).
    const wrapper = page.locator('.bankai-input-number', {
      has: page.getByTestId('input-number-stacked'),
    });
    const control = wrapper.locator('[data-part="increment"]');
    await expect(field).toBeVisible();

    // Field: fill = page bg, text = fg.
    expect(await computedRgb(field, 'background-color')).toBe(await tokenRgb(html, 'bg'));
    expect(await computedRgb(field, 'color')).toBe(await tokenRgb(html, 'fg'));

    // Stepper control: the raised surface role distinguishes it from the field.
    expect(await computedRgb(control, 'background-color')).toBe(await tokenRgb(html, 'surface'));
  });
}
