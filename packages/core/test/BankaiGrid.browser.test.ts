import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiGrid } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiGrid into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountGrid(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiGrid, props) : h(BankaiGrid, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiGrid did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// The component styles through the theme's `:where()` rules, not inline styles, so these
// unit tests assert the rendered anatomy (class, `data-*`, the `--bankai-grid-*` custom properties).
// That the anatomy resolves to real grid layout is covered by the e2e/visual tests, which load the theme.
test('renders a <div> exposing the grid anatomy by default', () => {
  const { root, teardown } = mountGrid();

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-grid')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toContain('content');

  // Unset props reflect no attribute, and no inline style is emitted at all.
  expect(Object.hasOwn(root.dataset, 'flow')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'align')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'justify')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'inline')).toBe(false);
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders as the polymorphic `as` element', () => {
  const { root, teardown } = mountGrid({ as: 'section' });

  expect(root.tagName).toBe('SECTION');
  expect(root.classList.contains('bankai-grid')).toBe(true);

  teardown();
});

test('reflects inline as a presence flag', () => {
  const { root, teardown } = mountGrid({ inline: true });

  // Empty-string value so the CSS can match `[data-bankai-inline]` regardless of value.
  expect(root.dataset.bankaiInline).toBe('');

  teardown();
});

test('reflects flow/align/justify verbatim as data-*', () => {
  const { root, teardown } = mountGrid({
    flow: 'column-dense',
    align: 'center',
    justify: 'start',
  });

  // The short prop keywords are reflected as-is; the theme CSS maps them to CSS values.
  expect(root.dataset.bankaiFlow).toBe('column-dense');
  expect(root.dataset.bankaiAlign).toBe('center');
  expect(root.dataset.bankaiJustify).toBe('start');

  teardown();
});

test('exposes columns/rows via the --bankai-grid-* custom properties with track coercion', () => {
  const trackVar = (props: Record<string, unknown>, name: string): string => {
    const { root, teardown } = mountGrid(props);
    const value = root.style.getPropertyValue(name);
    teardown();
    return value;
  };

  // A number is a track count → `repeat(<n>, minmax(0, 1fr))` (the `minmax(0, …)` avoids blowout).
  expect(trackVar({ columns: 3 }, '--bankai-grid-columns')).toBe('repeat(3, minmax(0, 1fr))');
  // A bare-numeric string (e.g. a static `columns="2"`) is the same count — not a raw value.
  expect(trackVar({ columns: '2' }, '--bankai-grid-columns')).toBe('repeat(2, minmax(0, 1fr))');
  // Any other string passes through verbatim.
  expect(trackVar({ columns: '200px 1fr' }, '--bankai-grid-columns')).toBe('200px 1fr');
  expect(
    trackVar({ columns: 'repeat(auto-fill, minmax(10rem, 1fr))' }, '--bankai-grid-columns'),
  ).toBe('repeat(auto-fill, minmax(10rem, 1fr))');
  // `rows` uses the identical coercion.
  expect(trackVar({ rows: 2 }, '--bankai-grid-rows')).toBe('repeat(2, minmax(0, 1fr))');
  expect(trackVar({ rows: 'auto 1fr' }, '--bankai-grid-rows')).toBe('auto 1fr');
});

test('exposes areas via --bankai-grid-areas, auto-quoting an array of rows', () => {
  const areasVar = (props: Record<string, unknown>): string => {
    const { root, teardown } = mountGrid(props);
    const value = root.style.getPropertyValue('--bankai-grid-areas');
    teardown();
    return value;
  };

  // An array is the ergonomic form: one entry per row, each wrapped in quotes.
  expect(areasVar({ areas: ['header header', 'sidebar main'] })).toBe(
    '"header header" "sidebar main"',
  );
  // A string is verbatim — it must already carry its own quotes.
  expect(areasVar({ areas: '"a b" "c d"' })).toBe('"a b" "c d"');
});

test('exposes gap via the --bankai-grid-gap custom property with scale-step coercion', () => {
  const gapVar = (props: Record<string, unknown>): string => {
    const { root, teardown } = mountGrid(props);
    const value = root.style.getPropertyValue('--bankai-grid-gap');
    teardown();
    return value;
  };

  // A number is a spacing-scale step → the rem-based token; the fallback multiplies the theme's
  // base unit (`--bankai-space-unit`) so it tracks the active theme's grid, not a hardcoded base.
  expect(gapVar({ gap: 4 })).toBe(
    'var(--bankai-space-4, calc(4 * var(--bankai-space-unit, 0.125rem)))',
  );
  // A bare-numeric string (e.g. a static `gap="2"`) is the same step — not a raw/px value.
  expect(gapVar({ gap: '2' })).toBe(
    'var(--bankai-space-2, calc(2 * var(--bankai-space-unit, 0.125rem)))',
  );
  // A step beyond the shipped scale (0–32) still resolves via the base-unit fallback.
  expect(gapVar({ gap: 40 })).toBe(
    'var(--bankai-space-40, calc(40 * var(--bankai-space-unit, 0.125rem)))',
  );
  // Fractional steps have no valid token name, so they use the base-unit fallback directly.
  expect(gapVar({ gap: 1.5 })).toBe('calc(1.5 * var(--bankai-space-unit, 0.125rem))');
  // Any other string passes through verbatim (including two-value row/column gaps).
  expect(gapVar({ gap: '1rem' })).toBe('1rem');
  expect(gapVar({ gap: '1rem 2rem' })).toBe('1rem 2rem');
  expect(gapVar({ gap: 'clamp(0.5rem, 2vw, 1.5rem)' })).toBe('clamp(0.5rem, 2vw, 1.5rem)');
  // A named t-shirt step resolves to its dedicated theme-owned token, not an invalid `gap: md`.
  expect(gapVar({ gap: 'md' })).toBe('var(--bankai-gap-md)');
});

// The widened `align`/`justify` types never lie: a value the component doesn't recognise as a keyword
// is not dropped — it rides the `--bankai-grid-*` escape hatch the theme's base rule applies, with
// `data-bankai-*` omitted so the two paths stay mutually exclusive (SPEC.md §4.4, §4.6).
test('reflects a verbatim align/justify on the custom-property escape hatch, not data-*', () => {
  const { root, teardown } = mountGrid({ align: 'flex-start', justify: 'left' });

  // Non-keyword → no `data-*`, so the keyword `[data-bankai-*]` rules can't spuriously match.
  expect(Object.hasOwn(root.dataset, 'align')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'justify')).toBe(false);
  // …and the value lands verbatim on the escape-hatch custom property instead.
  expect(root.style.getPropertyValue('--bankai-grid-align')).toBe('flex-start');
  expect(root.style.getPropertyValue('--bankai-grid-justify')).toBe('left');

  teardown();
});

// The two channels are mutually exclusive: a recognised keyword reflects as `data-*` and leaves the
// escape-hatch custom property unset (so the theme's keyword rule wins, not the verbatim base rule).
test('leaves the escape-hatch custom property unset for a recognised keyword', () => {
  const { root, teardown } = mountGrid({ align: 'center', justify: 'start' });

  expect(root.dataset.bankaiAlign).toBe('center');
  expect(root.dataset.bankaiJustify).toBe('start');
  expect(root.style.getPropertyValue('--bankai-grid-align')).toBe('');
  expect(root.style.getPropertyValue('--bankai-grid-justify')).toBe('');

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountGrid({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountGrid({}, null);

  expect(root.tagName).toBe('DIV');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountGrid(
    { class: 'my-layout', style: { padding: '4px' }, 'data-testid': 'grid', columns: 2, gap: 8 },
    'content',
  );

  // Consumer class merges with the component's own `bankai-grid`.
  expect(root.classList.contains('bankai-grid')).toBe(true);
  expect(root.classList.contains('my-layout')).toBe(true);
  expect(root.dataset.testid).toBe('grid');
  // Consumer style merges with the component's own custom properties.
  expect(root.style.padding).toBe('4px');
  expect(root.style.getPropertyValue('--bankai-grid-columns')).toBe('repeat(2, minmax(0, 1fr))');
  expect(root.style.getPropertyValue('--bankai-grid-gap')).toBe(
    'var(--bankai-space-8, calc(8 * var(--bankai-space-unit, 0.125rem)))',
  );

  teardown();
});
