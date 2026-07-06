import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import {
  baselinePixel,
  computedRgb,
  expectBaselineSurface,
  expectCloseRgb,
  PAGE_SURFACE,
  pixelAt,
  resolveColorRgb,
  tokenRgb,
} from '../../helpers/color';

// Visual regression for BankaiButton styled by @bankai-vue/theme-bankai.
// Baselines are per-OS (Playwright suffixes them with the platform) and are
// generated in CI via the "Update Visual Snapshots" workflow, not locally.

// Expected solid-variant colors, canonical 8-bit sRGB — the single source of truth for both
// the committed-baseline pixel check (via BASELINE_FILL) and the exact color checks below.
// Verified byte-identical across chromium / firefox / webkit. A theme retune trips these:
// update the value here AND regenerate the baselines.
const SOLID = {
  light: { fg: '248,250,252,255', bg: '29,41,61,255' },
  dark: { fg: '15,23,43,255', bg: '226,232,240,255' },
} as const;

// Expected interior fill of each variant as it appears in the committed baseline: `solid`
// paints `primary`; `outline`/`ghost` have transparent fills, so the page surface shows
// through (PAGE_SURFACE). Verified byte-identical across chromium / firefox / webkit.
const BASELINE_FILL = {
  light: { solid: SOLID.light.bg, outline: PAGE_SURFACE.light, ghost: PAGE_SURFACE.light },
  dark: { solid: SOLID.dark.bg, outline: PAGE_SURFACE.dark, ghost: PAGE_SURFACE.dark },
} as const;

// disabled = the solid fill at `opacity: 0.5` composited over the page bg; a blended
// pixel, so it drifts ±1 across engines — asserted with tolerance, not exact.
const DISABLED_FILL = { light: '142,148,158,255', dark: '125,128,132,255' } as const;

for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiButton — ${colorScheme}`, { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');

    // Snapshot only the fixture element so the baseline crops to the buttons
    // (plus the fixture's own padding as a margin) instead of the whole viewport.
    const fixture = page.getByTestId('button-fixture');

    // Guard: confirm the fixture actually rendered before snapshotting.
    await expect(fixture.getByRole('button').first()).toBeVisible();

    const snapshot = `bankai-button-${colorScheme}.png`;
    await expect(fixture).toHaveScreenshot(snapshot);

    // Universal committed-baseline check (shared by every visual spec): the page surface
    // behind the fixture is fresh — catches a stale baseline whose bg drifted under threshold.
    // `toHaveScreenshot` above guarantees the baseline exists by now (a missing one fails it
    // first; update mode writes it), so the committed-baseline reads below are unconditional.
    await test.step('committed baseline surface is fresh', () =>
      expectBaselineSurface(page, testInfo.snapshotPath(snapshot), fixture, colorScheme));

    // The whole-image comparison above tolerates a small uniform color shift (threshold);
    // this pins each variant's fill *inside the committed baseline* to an exact value, so a
    // stale baseline (a retuned color that slipped under the threshold) fails here and tells
    // you to regenerate. Interior fills only — text and the outline border are anti-aliased
    // (see helpers).
    await test.step('committed baseline has the exact per-variant fill', async () => {
      const snapshotPath = testInfo.snapshotPath(snapshot);
      const checkFill = async (variant: keyof (typeof BASELINE_FILL)['light']): Promise<void> => {
        const button = fixture.getByRole('button', { name: `${variant} md` });
        const px = await baselinePixel(page, snapshotPath, fixture, button, 0.1, 0.5);
        expect(px, `${variant} fill`).toBe(BASELINE_FILL[colorScheme][variant]);
      };
      await checkFill('solid');
      await checkFill('outline');
      await checkFill('ghost');
    });
  });
}

// Deterministic color checks that complement the pixel snapshot above (a threshold'd
// image diff tolerates small uniform color shifts). Three layers per the theme mapping:
//   (1) token-wiring — the variant resolves to the intended `--bankai-color-*` role;
//       survives an intentional retune, catches a wrong-token / broken-selector regression.
//   (2) exact value-lock — the resolved rgb; a retune trips this, which is the cue to
//       update it here AND regenerate the baselines above.
//   (3) real painted pixel — the fill is actually painted, not just declared.
for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiButton colors — ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');
    const fixture = page.getByTestId('button-fixture');
    await expect(fixture.getByRole('button').first()).toBeVisible();

    const html = page.locator('html');
    const solid = page.getByRole('button', { name: 'solid md' });
    const outline = page.getByRole('button', { name: 'outline md' });
    const ghost = page.getByRole('button', { name: 'ghost md' });

    // (1) token-wiring: solid draws from `primary`, the quiet variants inherit the
    // ambient foreground over a transparent fill.
    expect(await computedRgb(solid, 'color')).toBe(await tokenRgb(html, 'primary-fg'));
    expect(await computedRgb(solid, 'background-color')).toBe(await tokenRgb(html, 'primary'));
    expect(await computedRgb(outline, 'color')).toBe(await tokenRgb(html, 'fg'));
    expect(await computedRgb(ghost, 'color')).toBe(await tokenRgb(html, 'fg'));
    expect(await computedRgb(outline, 'background-color')).toBe('0,0,0,0');
    expect(await computedRgb(ghost, 'background-color')).toBe('0,0,0,0');

    // (2) exact value-lock — regenerate tripwire.
    expect(await computedRgb(solid, 'color')).toBe(SOLID[colorScheme].fg);
    expect(await computedRgb(solid, 'background-color')).toBe(SOLID[colorScheme].bg);

    // (3) real painted pixel — sample the left interior, off the centered label. The
    // solid fill is exact; the disabled state bakes in `opacity: 0.5`, so allow ±2.
    expect(await pixelAt(page, solid, 0.1, 0.5)).toBe(SOLID[colorScheme].bg);
    const disabled = page.getByRole('button', { name: 'disabled' });
    expectCloseRgb(await pixelAt(page, disabled, 0.1, 0.5), DISABLED_FILL[colorScheme]);
  });
}

// Poll `background-color` until it settles to `expected` — retries across the 150ms color
// transition (the pointer set by `hover()` / `mouse.down()` stays put across the poll).
const expectFill = (loc: Locator, expected: string, message: string): Promise<void> =>
  expect.poll(() => computedRgb(loc, 'background-color'), { message }).toBe(expected);

// Interaction states (`:hover` / `:active`) — the deterministic complement to the static
// snapshot above (screenshotting hover/active would triple the per-OS baseline matrix and
// race the 150ms color transition). Each expected fill is the theme's own `color-mix(...)`
// token resolved through the same canvas path as the assertion, so it stays cross-engine
// exact and survives a retune.
for (const colorScheme of ['light', 'dark'] as const) {
  test(`BankaiButton interaction states — ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/?fixture=button');
    const fixture = page.getByTestId('button-fixture');
    await expect(fixture.getByRole('button').first()).toBeVisible();

    const html = page.locator('html');
    const solid = page.getByRole('button', { name: 'solid md' });
    const outline = page.getByRole('button', { name: 'outline md' });
    const disabled = page.getByRole('button', { name: 'disabled' });

    // solid: fill darkens toward black — 12% on hover, 20% on active (a deeper pressed feel).
    // quiet: a `currentcolor` tint over the transparent fill, resolved in the button's own color
    // context (not a fixed rgb), since the tint tracks the inherited foreground.
    const solidBg = 'var(--bankai-button-bg)';
    const solidHover = await resolveColorRgb(html, `color-mix(in oklch, ${solidBg}, black 12%)`);
    const solidActive = await resolveColorRgb(html, `color-mix(in oklch, ${solidBg}, black 20%)`);
    const quietTint = 'color-mix(in oklch, currentcolor 8%, transparent)';
    const quietHover = await resolveColorRgb(outline, quietTint);

    // Sanity: the interaction fills actually differ from the resting fill and from each other,
    // so a token that silently collapsed to the base color can't pass the checks below.
    expect(new Set([SOLID[colorScheme].bg, solidHover, solidActive]).size).toBe(3);

    await solid.hover();
    await expectFill(solid, solidHover, 'solid :hover fill');
    await page.mouse.down();
    await expectFill(solid, solidActive, 'solid :active fill');
    await page.mouse.up();

    // quiet variants (outline shown; ghost shares the same tokens): transparent at rest, tinted on hover.
    expect(await computedRgb(outline, 'background-color')).toBe('0,0,0,0');
    await outline.hover();
    await expectFill(outline, quietHover, 'outline :hover tint');

    // Guard: a disabled button is inert — `:not(:disabled)` keeps the resting solid fill on hover.
    await disabled.hover({ force: true });
    expect(await computedRgb(disabled, 'background-color')).toBe(SOLID[colorScheme].bg);
  });
}
