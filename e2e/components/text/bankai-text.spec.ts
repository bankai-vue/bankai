import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiText, complementing the Vitest browser tests: it exercises the
// component through the real Vite-served app and asserts the computed type styles the browser
// resolves from the reflected `data-*` + the theme's `:where()` rules, across the OS matrix.

// Locks the `data-*` → computed-style mapping now that it lives in theme text.css (not
// type-checked TS): each prop value must resolve to the expected computed style. Reads
// `getComputedStyle` so a broken/renamed CSS selector is a failing test, not a silent no-op.

// `size` step → resolved `font-size` (theme-bankai's rem scale @ 16px root).
const SIZE: Record<string, string> = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
};

// `weight` keyword → resolved numeric `font-weight`.
const WEIGHT: Record<string, string> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// `tone` keyword → resolved `color`, as OKLCH `[L, C, H]` (theme-bankai neutral tones alias the
// `--bankai-color-fg*` family, light scheme = the `light-dark()` first value). The theme is authored in
// OKLCH, so `getComputedStyle` now returns `oklch(...)`; assert component-wise with tolerance because
// WebKit emits extra hue precision (e.g. `265.755005`) that an exact string match would reject.
// Each is the aliased `--bankai-color-fg*` token (slate-900 / slate-600 / slate-400).
const TONE: Record<string, [l: number, c: number, h: number]> = {
  default: [0.208, 0.042, 265.755],
  muted: [0.446, 0.043, 257.281],
  subtle: [0.704, 0.04, 256.788],
};

const computed = (page: Page, testId: string, prop: string): Promise<string> =>
  page.getByTestId(testId).evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

const parseOklch = (color: string): [number, number, number] => {
  const m = color.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/u);
  if (!m) {
    throw new Error(`expected an oklch() color, got: ${color}`);
  }

  return [Number(m[1]), Number(m[2]), Number(m[3])];
};

test.describe('data-* → CSS mapping (theme text.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/?fixture=text-mapping');
    await expect(page.getByTestId('text-mapping')).toBeVisible();
  });

  for (const [value, expected] of Object.entries(SIZE)) {
    test(`size="${value}" → font-size: ${expected}`, async ({ page }) => {
      expect(await computed(page, `map-size-${value}`, 'font-size')).toBe(expected);
    });
  }

  for (const [value, expected] of Object.entries(WEIGHT)) {
    test(`weight="${value}" → font-weight: ${expected}`, async ({ page }) => {
      expect(await computed(page, `map-weight-${value}`, 'font-weight')).toBe(expected);
    });
  }

  for (const [value, [l, c, h]] of Object.entries(TONE)) {
    test(`tone="${value}" → color: oklch(${l} ${c} ${h})`, async ({ page }) => {
      const [al, ac, ah] = parseOklch(await computed(page, `map-tone-${value}`, 'color'));
      expect(al).toBeCloseTo(l, 3);
      expect(ac).toBeCloseTo(c, 3);
      expect(ah).toBeCloseTo(h, 3);
    });
  }

  test('truncate → block, single-line ellipsis', async ({ page }) => {
    expect(await computed(page, 'map-truncate', 'display')).toBe('block');
    expect(await computed(page, 'map-truncate', 'overflow-x')).toBe('hidden');
    expect(await computed(page, 'map-truncate', 'text-overflow')).toBe('ellipsis');
    expect(await computed(page, 'map-truncate', 'white-space')).toBe('nowrap');
  });
});

// Escape hatches: a verbatim value must actually apply via the `--bankai-text-*` base rule, not
// silently vanish — proving the widened types don't accept values the theme ignores — and `var()`
// must flow through too (nested custom properties resolve). Its own describe to stay under the
// per-function line cap.
test.describe('escape hatches → verbatim CSS (theme text.css base rule)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/?fixture=text-mapping');
    await expect(page.getByTestId('text-mapping')).toBeVisible();
  });

  test('non-named size → verbatim font-size', async ({ page }) => {
    // 1.5rem @ 16px root = 24px
    expect(await computed(page, 'map-size-custom', 'font-size')).toBe('24px');
  });
  test('numeric weight → verbatim font-weight', async ({ page }) => {
    expect(await computed(page, 'map-weight-custom', 'font-weight')).toBe('350');
  });
  test('non-named tone → verbatim color', async ({ page }) => {
    expect(await computed(page, 'map-tone-custom', 'color')).toBe('rgb(255, 0, 0)');
  });
  test('numeric-string weight → verbatim font-weight (routed by name, not type)', async ({
    page,
  }) => {
    expect(await computed(page, 'map-weight-string', 'font-weight')).toBe('350');
  });
  test('size via var() → resolved font-size', async ({ page }) => {
    // 2rem @ 16px root = 32px
    expect(await computed(page, 'map-size-var', 'font-size')).toBe('32px');
  });
  test('weight via var() → resolved font-weight', async ({ page }) => {
    expect(await computed(page, 'map-weight-var', 'font-weight')).toBe('650');
  });
  test('tone via var() → resolved color', async ({ page }) => {
    expect(await computed(page, 'map-tone-var', 'color')).toBe('rgb(1, 2, 3)');
  });

  // Regression: a verbatim `--bankai-text-*` value inherits (custom properties do), so the base
  // rule must reset it to `initial` — otherwise a verbatim ancestor leaks past a named-value
  // descendant and re-applies on deeper text. The innermost (no-prop) node must inherit its
  // named-value parent's resolved size (sm = 14px), not the verbatim grandparent's 3rem (48px).
  test('verbatim size does not leak past a named-value descendant', async ({ page }) => {
    expect(await computed(page, 'map-nested-inherit', 'font-size')).toBe('14px');
  });
});
