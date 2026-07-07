import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiText } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiText into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountText(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiText, props) : h(BankaiText, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiText did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// The component styles through the theme's `:where()` rules, not inline styles, so these unit
// tests assert the rendered anatomy (class, `data-*`). That the anatomy resolves to real type
// styles is covered by the e2e/visual tests, which load the theme.
test('renders a <span> exposing the text anatomy by default', () => {
  const { root, teardown } = mountText();

  expect(root.tagName).toBe('SPAN');
  expect(root.classList.contains('bankai-text')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toContain('content');

  // Unset props reflect no attribute, and no inline style is emitted at all.
  expect(Object.hasOwn(root.dataset, 'size')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'weight')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'tone')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'truncate')).toBe(false);
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders as the polymorphic `as` element for native inline semantics', () => {
  const { root, teardown } = mountText({ as: 'strong' });

  expect(root.tagName).toBe('STRONG');
  expect(root.classList.contains('bankai-text')).toBe(true);

  teardown();
});

test('reflects truncate as a presence flag', () => {
  const { root, teardown } = mountText({ truncate: true });

  // Empty-string value so the CSS can match `[data-bankai-truncate]` regardless of value.
  expect(root.dataset.bankaiTruncate).toBe('');

  teardown();
});

test('reflects named size/weight/tone verbatim as data-* (no inline style)', () => {
  const { root, teardown } = mountText({ size: 'lg', weight: 'semibold', tone: 'muted' });

  // Named values reflect as-is; the theme CSS maps them to type styles.
  expect(root.dataset.bankaiSize).toBe('lg');
  expect(root.dataset.bankaiWeight).toBe('semibold');
  expect(root.dataset.bankaiTone).toBe('muted');
  // Named values take the data-* path, not the custom-property escape hatch.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('routes non-named size/weight/tone to the custom-property escape hatch', () => {
  const { root, teardown } = mountText({ size: '1.5rem', weight: 350, tone: '#ff8800' });

  // Verbatim values ride `--bankai-text-*` custom properties, applied by the theme's base rule.
  expect(root.style.getPropertyValue('--bankai-text-size')).toBe('1.5rem');
  expect(root.style.getPropertyValue('--bankai-text-weight')).toBe('350');
  expect(root.style.getPropertyValue('--bankai-text-tone')).toBe('#ff8800');
  // ...and are NOT also reflected as data-* (no rule would match them there).
  expect(Object.hasOwn(root.dataset, 'size')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'weight')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'tone')).toBe(false);

  teardown();
});

test('routes weight by name, not by type — a non-named string takes the escape hatch', () => {
  // A numeric-looking or `var()`/`calc()` string weight is verbatim CSS, not a named step.
  const custom = mountText({ weight: 'var(--wght)' });
  expect(custom.root.style.getPropertyValue('--bankai-text-weight')).toBe('var(--wght)');
  expect(Object.hasOwn(custom.root.dataset, 'weight')).toBe(false);
  custom.teardown();

  // A named string still takes the data-* path (no inline style).
  const named = mountText({ weight: 'bold' });
  expect(named.root.dataset.bankaiWeight).toBe('bold');
  expect(named.root.getAttribute('style')).toBe(null);
  named.teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountText({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountText({}, null);

  expect(root.tagName).toBe('SPAN');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountText(
    { class: 'my-text', style: { padding: '4px' }, 'data-testid': 'text', size: 'sm' },
    'content',
  );

  // Consumer class merges with the component's own `bankai-text`.
  expect(root.classList.contains('bankai-text')).toBe(true);
  expect(root.classList.contains('my-text')).toBe(true);
  expect(root.dataset.testid).toBe('text');
  expect(root.style.padding).toBe('4px');
  // The component's own reflected state is untouched by the merge.
  expect(root.dataset.bankaiSize).toBe('sm');

  teardown();
});
