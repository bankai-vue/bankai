import { expect, test } from '@playwright/test';
import { computedRgb, expectBaselineSurface, tokenRgb } from '../../helpers/color';

// Visual regression for BankaiText. The component ships no CSS — the theme's type styles
// (size scale, weight, tone, truncation) and the native inline semantics reached via `as`
// are what the baseline captures.
// Baselines are per-OS (Playwright suffixes them with the platform) and are generated in CI
// via the "Update Visual Snapshots" workflow, not locally.

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiText — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=text');

    // Snapshot only the fixture element so the baseline crops to the text samples
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('text-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture).toBeVisible();

    const snapshot = `bankai-text-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface
    // behind the fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    // Text tone colors themselves are anti-aliased glyphs, not pixel-sampleable — they're
    // locked on the live render by the `BankaiText tones` computed value-locks below.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));
  });
}

// Deterministic tone-color checks complementing the pixel snapshot (which tolerates small
// color shifts). Foreground only — text glyphs are thin anti-aliased strokes, so a real
// *pixel* sample is unreliable; the computed `color` is what drives them. Two layers:
// (1) token-wiring — each neutral tone aliases its `--bankai-color-fg*` role (survives a
// retune); (2) exact value-lock — the resolved rgb; a retune trips it, the cue to update
// here AND regenerate the baselines. Verified byte-identical across chromium/firefox/webkit.
const TONE_ROLE = { default: 'fg', muted: 'fg-muted', subtle: 'fg-subtle' } as const;
const TONE = {
  light: { default: '15,23,43,255', muted: '69,85,108,255', subtle: '144,161,185,255' },
  dark: { default: '248,250,252,255', muted: '202,213,226,255', subtle: '98,116,142,255' },
} as const;

for (const colorScheme of ['light', 'dark'] as const) {
  for (const tone of ['default', 'muted', 'subtle'] as const) {
    test(`BankaiText tone ${tone} — ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/?fixture=text');
      await expect(page.getByTestId('text-fixture')).toBeVisible();

      const el = page.getByText(`${tone} tone`);
      // (1) token-wiring: the tone aliases its fg-family role.
      expect(await computedRgb(el, 'color')).toBe(
        await tokenRgb(page.locator('html'), TONE_ROLE[tone]),
      );
      // (2) exact value-lock — regenerate tripwire.
      expect(await computedRgb(el, 'color')).toBe(TONE[colorScheme][tone]);
    });
  }
}
