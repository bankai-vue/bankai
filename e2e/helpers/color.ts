import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Color assertion helpers for e2e. Colors are normalized to canonical 8-bit sRGB
// ("r,g,b,a") by painting them on a 1×1 canvas, so the value is identical across
// engines — chromium / firefox / webkit serialize oklch/oklab differently in
// `getComputedStyle`, but the rasterized bytes agree (verified). Colors are also
// OS-independent, so unlike the image baselines these need no per-OS variants.

/** Canonical sRGB of a computed style property (e.g. `color`, `background-color`). */
export const computedRgb = (loc: Locator, prop: string): Promise<string> =>
  loc.evaluate((el, p) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = getComputedStyle(el).getPropertyValue(p);
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(',');
  }, prop);

/** Canonical sRGB of `var(--bankai-color-<role>)` resolved in the element's context.
 *  Use it to assert a component's color is *wired to* the intended token — the check
 *  then survives an intentional token retune (both sides move together). */
export const tokenRgb = (loc: Locator, role: string): Promise<string> =>
  loc.evaluate((el, r) => {
    const probe = document.createElement('div');
    probe.style.color = `var(--bankai-color-${r})`;
    el.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(',');
  }, role);

/** The REAL painted pixel ("r,g,b,a") at fractional coords (fx, fy) of an element:
 *  screenshots the element to a buffer, then decodes it in-browser via canvas (each
 *  engine's own PNG decoder — no Node PNG-decode dependency). Fractions are scale-safe.
 *  Solid fills are cross-engine exact; composited pixels (opacity, anti-aliased edges)
 *  drift ±1 per engine — assert those with `expectCloseRgb`, not exact equality. Text
 *  glyphs are thin AA strokes and are not reliably sampleable — use `computedRgb`. */
export const pixelAt = async (
  page: Page,
  loc: Locator,
  fx: number,
  fy: number,
): Promise<string> => {
  const buffer = await loc.screenshot();
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
  return page.evaluate(
    async ({ url, x, y }) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(Math.floor(img.width * x), Math.floor(img.height * y), 1, 1).data;
      return `${d[0]},${d[1]},${d[2]},${d[3]}`;
    },
    { url: dataUrl, x: fx, y: fy },
  );
};

// Decode a committed baseline PNG (from disk) in-browser and sample one pixel at CSS coords
// (cssX, cssY) relative to the image's top-left. Scale is self-calibrated from the image width
// vs the container's CSS width, so it's robust to devicePixelRatio differences across
// engines/OSes (e.g. a 2× retina baseline). Reading the committed file — not a live screenshot —
// is what lets callers verify the shipped snapshot itself.
const sampleBaseline = (
  page: Page,
  snapshotPath: string,
  cssX: number,
  cssY: number,
  cssWidth: number,
): Promise<string> => {
  const dataUrl = `data:image/png;base64,${readFileSync(snapshotPath).toString('base64')}`;
  return page.evaluate(
    async ({ url, x, y, width }) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      // image px per CSS px — self-calibrated, so devicePixelRatio never matters
      const scale = img.width / width;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(Math.floor(x * scale), Math.floor(y * scale), 1, 1).data;
      return `${d[0]},${d[1]},${d[2]},${d[3]}`;
    },
    { url: dataUrl, x: cssX, y: cssY, width: cssWidth },
  );
};

/** The pixel ("r,g,b,a") in a committed baseline PNG at the point (fx, fy) *within* `target`,
 *  located relative to `container` (the element the baseline was captured from). Reads the
 *  *committed* baseline on disk — not a live screenshot — so it verifies the shipped snapshot
 *  itself has the right color, catching a stale baseline that `toHaveScreenshot`'s threshold
 *  tolerates (the "regenerate the baseline" signal). Solid fills only — text and edges are
 *  anti-aliased (see `pixelAt`). */
export const baselinePixel = async (
  page: Page,
  snapshotPath: string,
  container: Locator,
  target: Locator,
  fx: number,
  fy: number,
): Promise<string> => {
  const c = await container.boundingBox();
  const t = await target.boundingBox();
  if (!c || !t) {
    throw new Error('baselinePixel: element has no bounding box');
  }
  // Sample point as a CSS offset from the container's (= baseline image's) top-left.
  return sampleBaseline(
    page,
    snapshotPath,
    t.x - c.x + t.width * fx,
    t.y - c.y + t.height * fy,
    c.width,
  );
};

/** The themed page surface (`--bankai-color-bg`) as canonical sRGB — matches
 *  e2e/page-surface.spec.ts. A theme retune trips the baseline-surface checks: update here
 *  AND regenerate the baselines. */
export const PAGE_SURFACE = { light: '255,255,255,255', dark: '23,23,23,255' } as const;

/** Assert the committed baseline's page surface is fresh — the universal committed-baseline
 *  check for every visual spec. Samples a small inset from the fixture's top-left corner, which
 *  sits inside the fixture's transparent padding where the page background shows through (every
 *  visual fixture has `padding: 1rem` and no background of its own). Catches a stale baseline
 *  whose surface drifted under the image threshold (the "regenerate" signal), cross-engine via
 *  the self-calibrated scale. */
export const expectBaselineSurface = async (
  page: Page,
  snapshotPath: string,
  fixture: Locator,
  colorScheme: 'light' | 'dark',
): Promise<void> => {
  const box = await fixture.boundingBox();
  if (!box) {
    throw new Error('expectBaselineSurface: fixture has no bounding box');
  }
  // 4px inset — safely inside the fixture's 1rem padding, so it lands on the page surface.
  const px = await sampleBaseline(page, snapshotPath, 4, 4, box.width);
  expect(px, 'baseline page surface').toBe(PAGE_SURFACE[colorScheme]);
};

/** Assert two canonical-sRGB strings match within `tolerance` per channel — for
 *  composited pixels whose value drifts ±1 across engines. */
export const expectCloseRgb = (actual: string, expected: string, tolerance = 2): void => {
  const a = actual.split(',').map(Number);
  const e = expected.split(',').map(Number);
  for (let index = 0; index < e.length; index++) {
    expect(
      Math.abs(a[index] - e[index]),
      `channel ${index}: ${actual} vs ${expected} (±${tolerance})`,
    ).toBeLessThanOrEqual(tolerance);
  }
};
