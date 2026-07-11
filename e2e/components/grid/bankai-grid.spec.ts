import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiGrid, complementing the Vitest browser tests: it
// exercises the component through the real Vite-served app and asserts the
// computed layout the browser resolves from the reflected `data-*` + the
// `--bankai-grid-*` custom properties + the theme's `:where()` rules, across the
// OS matrix (ubuntu/macOS/windows).

const computed = (page: Page, testId: string, prop: string): Promise<string> =>
  page.getByTestId(testId).evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

// `grid-template-columns`/`-rows` resolve to concrete pixel tracks; count them to prove the
// custom property wired the template in (over the fixture's fixed-width/height container).
const trackCount = (page: Page, testId: string, prop: string): Promise<number> =>
  page
    .getByTestId(testId)
    .evaluate(
      (el, p) => getComputedStyle(el).getPropertyValue(p).split(/\s+/u).filter(Boolean).length,
      prop,
    );

test('resolves to a grid container with the prop-driven column template', async ({ page }) => {
  await page.goto('/');

  const grid = page.getByTestId('grid-cols');
  await expect(grid).toBeVisible();

  const layout = await grid.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      trackCount: style.gridTemplateColumns.split(/\s+/u).filter(Boolean).length,
      columnGap: style.columnGap,
    };
  });

  expect(layout.display).toBe('grid');
  // A `columns=3` count must yield three resolved tracks.
  expect(layout.trackCount).toBe(3);
  expect(layout.columnGap).toBe('8px');
});

// Locks the mapping now that it lives in theme grid.css (not type-checked TS): each prop value must
// resolve to the expected computed style. Reads `getComputedStyle` so a broken/renamed CSS selector
// or custom-property wiring is a failing test, not a silent no-op. Uses the non-visual `grid-mapping`
// fixture (one BankaiGrid per value).

// `align` keyword → resolved `align-items` (grid uses the box-alignment keywords 1:1).
const ALIGN = ['start', 'end', 'center', 'baseline', 'stretch'];
// `justify` keyword → resolved `justify-items`.
const JUSTIFY = ['start', 'end', 'center', 'stretch'];

// `flow` keyword → the set of tokens that MUST appear in the computed `grid-auto-flow` (browsers
// normalize `dense` to include the implicit `row`, so assert token membership, not an exact string).
const FLOW: Record<string, string[]> = {
  row: ['row'],
  column: ['column'],
  dense: ['dense'],
  'row-dense': ['dense'],
  'column-dense': ['column', 'dense'],
};

// track-count assertions: [testId, prop, expected count].
const TRACKS: Array<[string, string, number]> = [
  ['map-columns-count', 'grid-template-columns', 3],
  ['map-columns-static', 'grid-template-columns', 2],
  ['map-columns-verbatim', 'grid-template-columns', 2],
  ['map-rows-count', 'grid-template-rows', 2],
];

// gap step → resolved `gap` (theme-bankai's 2px grid; step 40 is past the 0–32 tokens → base-unit fallback).
const GAP: Record<string, string> = {
  'map-gap-step': '8px',
  'map-gap-fallback': '80px',
  'map-gap-static': '4px',
};

test.describe('mapping → CSS (theme grid.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=grid-mapping');
    await expect(page.getByTestId('grid-mapping')).toBeVisible();
  });

  for (const value of ALIGN) {
    test(`align="${value}" → align-items: ${value}`, async ({ page }) => {
      expect(await computed(page, `map-align-${value}`, 'align-items')).toBe(value);
    });
  }

  for (const value of JUSTIFY) {
    test(`justify="${value}" → justify-items: ${value}`, async ({ page }) => {
      expect(await computed(page, `map-justify-${value}`, 'justify-items')).toBe(value);
    });
  }

  for (const [value, tokens] of Object.entries(FLOW)) {
    test(`flow="${value}" → grid-auto-flow includes ${tokens.join('+')}`, async ({ page }) => {
      const flow = (await computed(page, `map-flow-${value}`, 'grid-auto-flow')).split(/\s+/u);
      expect(tokens.every((token) => flow.includes(token))).toBe(true);
    });
  }

  for (const [testId, prop, count] of TRACKS) {
    test(`${testId} → ${count} resolved tracks`, async ({ page }) => {
      expect(await trackCount(page, testId, prop)).toBe(count);
    });
  }

  for (const [testId, expected] of Object.entries(GAP)) {
    test(`${testId} → gap ${expected}`, async ({ page }) => {
      expect(await computed(page, testId, 'gap')).toBe(expected);
    });
  }

  test('inline → display: inline-grid', async ({ page }) => {
    expect(await computed(page, 'map-inline', 'display')).toBe('inline-grid');
  });

  test('areas=[…] → quoted, normalized grid-template-areas', async ({ page }) => {
    expect(await computed(page, 'map-areas', 'grid-template-areas')).toBe(
      '"header header" "sidebar main"',
    );
  });
});

// Bug fixes: a named t-shirt `gap` step (`xs`–`xl`) resolves to `--bankai-gap-<name>` instead of dying
// as an invalid CSS length, and a verbatim native `align`/`justify` (not a keyword) rides the
// escape-hatch custom property applied by the base `:where()` rule — so the widened types never lie.
// [testId, computed prop, expected value].
const ESCAPE: Array<[string, string, string]> = [
  // gap="md" → --bankai-gap-md (0.75rem = 12px on theme-bankai)
  ['map-gap-named', 'gap', '12px'],
  ['map-align-verbatim', 'align-items', 'flex-start'],
  ['map-justify-verbatim', 'justify-items', 'flex-start'],
];

test.describe('escape hatch → CSS (theme grid.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=grid-mapping');
    await expect(page.getByTestId('grid-mapping')).toBeVisible();
  });

  for (const [testId, prop, expected] of ESCAPE) {
    test(`${testId} → ${prop}: ${expected}`, async ({ page }) => {
      expect(await computed(page, testId, prop)).toBe(expected);
    });
  }
});
