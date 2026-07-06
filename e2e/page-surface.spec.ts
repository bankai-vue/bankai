import { expect, test } from '@playwright/test';
import { computedRgb, tokenRgb } from './helpers/color';

// The page surface — theme-bankai's `base.css` paints `--bankai-color-bg` / `-fg`
// onto `html` (SPEC.md §4.18). A pixel diff can't reliably catch a small *uniform*
// background shift without also flagging anti-aliasing noise (see the `threshold`
// note in playwright.config.ts), so the surface is locked here with deterministic
// computed-style assertions instead — flake-free and cross-browser. Any `?fixture=…`
// page loads theme-bankai (playground main.ts), which is what paints `html`.

// EXACT resolved surface colors, as canonical 8-bit sRGB (see `computedRgb`). This is a
// deliberate tripwire: unlike the pixel snapshots (which stay green for a sub-threshold
// tweak) and the token-wiring check below (which follows the token wherever it moves),
// these fail on ANY change to the effective surface color, however slight. When you
// retune `--bankai-color-bg` / `-fg` in theme-bankai, that failure is your reminder to
// update these values AND regenerate the visual baselines in the same change.
// Verified identical across chromium / firefox / webkit.
const SURFACE = {
  light: { bg: '255,255,255,255', fg: '15,23,43,255' },
  dark: { bg: '23,23,23,255', fg: '248,250,252,255' },
} as const;

for (const colorScheme of ['light', 'dark'] as const) {
  test(`page surface (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');
    // Guard: the fixture mounts only after theme-bankai is imported, so this
    // confirms the page-surface CSS is loaded before we read it.
    await expect(page.getByTestId('button-fixture')).toBeVisible();

    const html = page.locator('html');

    // Token-driven: the paint follows `--bankai-color-bg` (not a hardcoded literal),
    // so a token retune actually reaches `html`. Catches a removed/renamed selector too.
    expect(await computedRgb(html, 'background-color')).toBe(await tokenRgb(html, 'bg'));

    // Value lock / regenerate tripwire — see SURFACE above.
    expect(await computedRgb(html, 'background-color')).toBe(SURFACE[colorScheme].bg);
    expect(await computedRgb(html, 'color')).toBe(SURFACE[colorScheme].fg);
  });
}
