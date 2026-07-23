import { expect, test } from '@playwright/test';
import { computedRgb, expectBaselineSurface, tokenRgb } from '../../helpers/color';

// Visual regression for BankaiInputPassword styled by @bankai-vue/theme-bankai. Baselines are per-OS
// (Playwright suffixes them with the platform) and are generated in CI via the "Update Visual Snapshots"
// workflow, not locally. The field's fill is the page surface (`--bankai-color-bg`); the reveal button uses
// the raised surface role — the deterministic color checks below assert that token wiring.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInputPassword — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input-password');

    const fixture = page.getByTestId('input-password-fixture');
    await expect(fixture.getByTestId('input-password-md')).toBeVisible();

    const snapshot = `bankai-input-password-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}

// Deterministic color checks complementing the pixel snapshot: the field fills to the page bg/fg, while the
// reveal button rides the raised surface role. `tokenRgb`/`computedRgb` normalize to canonical sRGB, so
// these survive an intentional token retune (both sides move together).
for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInputPassword colors — ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input-password');

    const html = page.locator('html');
    const field = page.getByTestId('input-password-md');
    const wrapper = page.locator('.bankai-input-password', {
      has: page.getByTestId('input-password-md'),
    });
    const toggle = wrapper.locator('[data-part="toggle"]');
    await expect(field).toBeVisible();

    // Field: fill = page bg, text = fg.
    expect(await computedRgb(field, 'background-color')).toBe(await tokenRgb(html, 'bg'));
    expect(await computedRgb(field, 'color')).toBe(await tokenRgb(html, 'fg'));

    // Reveal button: the raised surface role distinguishes it from the field.
    expect(await computedRgb(toggle, 'background-color')).toBe(await tokenRgb(html, 'surface'));
  });
}
