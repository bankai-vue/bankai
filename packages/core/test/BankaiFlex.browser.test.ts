import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiFlex } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiFlex into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountFlex(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiFlex, props) : h(BankaiFlex, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiFlex did not render an element');
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
// unit tests assert the rendered anatomy (class, `data-*`, the gap custom property). That the
// anatomy resolves to real flex layout is covered by the e2e/visual tests, which load the theme.
test('renders a <div> exposing the flex anatomy by default', () => {
  const { root, teardown } = mountFlex();

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-flex')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toContain('content');

  // Unset props reflect no attribute, and no inline style is emitted at all.
  expect(Object.hasOwn(root.dataset, 'direction')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'align')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'justify')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'wrap')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'inline')).toBe(false);
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders as the polymorphic `as` element', () => {
  const { root, teardown } = mountFlex({ as: 'section' });

  expect(root.tagName).toBe('SECTION');
  expect(root.classList.contains('bankai-flex')).toBe(true);

  teardown();
});

test('reflects inline as a presence flag', () => {
  const { root, teardown } = mountFlex({ inline: true });

  // Empty-string value so the CSS can match `[data-bankai-inline]` regardless of value.
  expect(root.dataset.bankaiInline).toBe('');

  teardown();
});

test('reflects direction/align/justify/wrap verbatim as data-*', () => {
  const { root, teardown } = mountFlex({
    direction: 'column',
    align: 'start',
    justify: 'between',
    wrap: 'wrap',
  });

  // The short prop keywords are reflected as-is; the theme CSS maps them to CSS values.
  expect(root.dataset.bankaiDirection).toBe('column');
  expect(root.dataset.bankaiAlign).toBe('start');
  expect(root.dataset.bankaiJustify).toBe('between');
  expect(root.dataset.bankaiWrap).toBe('wrap');

  teardown();
});

test('exposes gap via the --bankai-flex-gap custom property with scale-step coercion', () => {
  const gapVar = (props: Record<string, unknown>): string => {
    const { root, teardown } = mountFlex(props);
    const value = root.style.getPropertyValue('--bankai-flex-gap');
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
  // A step beyond the shipped scale (0–32) still resolves via the base-unit fallback (never px, never dropped).
  expect(gapVar({ gap: 40 })).toBe(
    'var(--bankai-space-40, calc(40 * var(--bankai-space-unit, 0.125rem)))',
  );
  // Fractional steps have no valid token name, so they use the base-unit fallback directly.
  expect(gapVar({ gap: 1.5 })).toBe('calc(1.5 * var(--bankai-space-unit, 0.125rem))');
  // Any other string passes through verbatim.
  expect(gapVar({ gap: '1rem' })).toBe('1rem');
  expect(gapVar({ gap: 'var(--bankai-space-2)' })).toBe('var(--bankai-space-2)');
  expect(gapVar({ gap: 'clamp(0.5rem, 2vw, 1.5rem)' })).toBe('clamp(0.5rem, 2vw, 1.5rem)');
});

test('renders rich slot content', () => {
  const { root, teardown } = mountFlex({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountFlex({}, null);

  expect(root.tagName).toBe('DIV');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountFlex(
    { class: 'my-layout', style: { padding: '4px' }, 'data-testid': 'flex', gap: 8 },
    'content',
  );

  // Consumer class merges with the component's own `bankai-flex`.
  expect(root.classList.contains('bankai-flex')).toBe(true);
  expect(root.classList.contains('my-layout')).toBe(true);
  expect(root.dataset.testid).toBe('flex');
  // Consumer style merges with the component's gap custom property.
  expect(root.style.padding).toBe('4px');
  expect(root.style.getPropertyValue('--bankai-flex-gap')).toBe(
    'var(--bankai-space-8, calc(8 * var(--bankai-space-unit, 0.125rem)))',
  );

  teardown();
});
