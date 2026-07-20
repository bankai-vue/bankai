import { expect, test } from '@playwright/test';
import { computedRgb, expectBaselineSurface, tokenRgb } from '../../helpers/color';

// Visual regression for BankaiInput styled by @bankai-vue/theme-bankai. Baselines are per-OS (Playwright
// suffixes them with the platform) and are generated in CI via the "Update Visual Snapshots" workflow,
// not locally. The input's fill is the page surface (`--bankai-color-bg`); the border + text define the
// box, so the deterministic color checks below assert the token wiring rather than sampling a fill pixel.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInput — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input');

    // Snapshot only the fixture element so the baseline crops to the fields (plus the fixture's own
    // padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('input-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture.getByTestId('input-md')).toBeVisible();

    const snapshot = `bankai-input-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface behind the
    // fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}

// Deterministic color checks that complement the pixel snapshot above. The resting field wires to the
// surface/text/border roles; on focus the border shifts to the accent role. `tokenRgb`/`computedRgb`
// normalize to canonical sRGB, so these survive an intentional token retune (both sides move together).
for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiInput colors — ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=input');
    const html = page.locator('html');
    const input = page.getByTestId('input-md');
    await expect(input).toBeVisible();

    // Resting: fill = page bg, text = fg, border = border role.
    expect(await computedRgb(input, 'background-color')).toBe(await tokenRgb(html, 'bg'));
    expect(await computedRgb(input, 'color')).toBe(await tokenRgb(html, 'fg'));
    expect(await computedRgb(input, 'border-top-color')).toBe(await tokenRgb(html, 'border'));

    // Focus: the border shifts to the accent role. Clicking a text input matches :focus-visible; poll
    // past the 150ms border-color transition so the assertion reads the settled color, not a mid-tween.
    const accent = await tokenRgb(html, 'accent');
    await input.click();
    await expect
      .poll(() => computedRgb(input, 'border-top-color'), { message: 'focus border → accent' })
      .toBe(accent);

    // Read-only: a raised surface fill distinguishes it from an editable field.
    const readonly = page.getByTestId('input-readonly');
    expect(await computedRgb(readonly, 'background-color')).toBe(await tokenRgb(html, 'surface'));
  });
}
