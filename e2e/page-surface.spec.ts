import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// The page surface — theme-bankai's `base.css` paints `--bankai-color-bg` / `-fg`
// onto `html` (SPEC.md §4.18). A pixel diff can't reliably catch a small *uniform*
// background shift without also flagging anti-aliasing noise (see the `threshold`
// note in playwright.config.ts), so the surface is locked here with deterministic
// computed-style assertions instead — flake-free and cross-browser. Any `?fixture=…`
// page loads theme-bankai (playground main.ts), which is what paints `html`.

// EXACT resolved surface colors, as canonical 8-bit sRGB (see `htmlRgb`). This is a
// deliberate tripwire: unlike the pixel snapshots (which stay green for a sub-threshold
// tweak) and the token-wiring checks below (which follow the token wherever it moves),
// these fail on ANY change to the effective surface color, however slight. When you
// retune `--bankai-color-bg` / `-fg` in theme-bankai, that failure is your reminder to
// update these values AND regenerate the visual baselines in the same change.
// Verified identical across chromium / firefox / webkit.
const SURFACE = {
  light: { bg: '255,255,255,255', fg: '15,23,43,255' },
  dark: { bg: '23,23,23,255', fg: '248,250,252,255' },
} as const;

// The raw computed value of `getComputedStyle(html)[prop]` (engine-specific color
// serialization — used only for token-equality, never as a hardcoded expectation).
const htmlStyle = (page: Page, prop: string): Promise<string> =>
  page.evaluate((p) => getComputedStyle(document.documentElement).getPropertyValue(p), prop);

// `getComputedStyle(html)[prop]` normalized to canonical 8-bit sRGB via a 1×1 canvas —
// identical across engines (verified), unlike the oklch/oklab string the browser prints.
const htmlRgb = (page: Page, prop: string): Promise<string> =>
  page.evaluate((p) => {
    const css = getComputedStyle(document.documentElement).getPropertyValue(p);
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(',');
  }, prop);

// Resolve `var(--bankai-color-<role>)` in-page via a throwaway probe, so it goes through
// the same serialization as the `html` paint — equality then holds regardless of engine
// output. Inherits the token (and `color-scheme`, so `light-dark()` picks the same branch).
const resolvedToken = (page: Page, role: string): Promise<string> =>
  page.evaluate((r) => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(--bankai-color-${r})`;
    document.documentElement.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  }, role);

for (const colorScheme of ['light', 'dark'] as const) {
  test(`page surface (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');
    // Guard: the fixture mounts only after theme-bankai is imported, so this
    // confirms the page-surface CSS is loaded before we read it.
    await expect(page.getByTestId('button-fixture')).toBeVisible();

    // Token-driven: the paint follows `--bankai-color-bg` (not a hardcoded literal),
    // so a token retune actually reaches `html`. Catches a removed/renamed selector too.
    expect(await htmlStyle(page, 'background-color')).toBe(await resolvedToken(page, 'bg'));

    // Value lock / regenerate tripwire — see SURFACE above.
    expect(await htmlRgb(page, 'background-color')).toBe(SURFACE[colorScheme].bg);
    expect(await htmlRgb(page, 'color')).toBe(SURFACE[colorScheme].fg);
  });
}
