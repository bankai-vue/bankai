import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiAside } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiAside into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountAside(props: Record<string, unknown> = {}, slot: Slot = 'nav'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiAside, props) : h(BankaiAside, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiAside did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiAside ships no CSS — the theme styles the `bankai-aside` class. These unit tests assert the
// rendered anatomy (the native `<aside>` element, class, `data-part`) and the `label` → `aria-label`
// wiring; the side-rail look the theme resolves is covered by the e2e/visual tests.
test('renders a native <aside> exposing the aside anatomy', () => {
  const { root, teardown } = mountAside();

  expect(root.tagName).toBe('ASIDE');
  expect(root.classList.contains('bankai-aside')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('nav');

  teardown();
});

test('omits aria-label when no label is given', () => {
  const { root, teardown } = mountAside();

  expect(root.hasAttribute('aria-label')).toBe(false);

  teardown();
});

test('sets aria-label from the label prop', () => {
  const { root, teardown } = mountAside({ label: 'Secondary navigation' });

  expect(root.getAttribute('aria-label')).toBe('Secondary navigation');

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountAside({}, () => [
    h('nav', { class: 'a' }, 'one'),
    h('div', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountAside({}, null);

  expect(root.tagName).toBe('ASIDE');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountAside(
    { class: 'my-aside', style: { color: 'red' }, 'data-testid': 'aside' },
    'nav',
  );

  // Consumer class merges with the component's own `bankai-aside`.
  expect(root.classList.contains('bankai-aside')).toBe(true);
  expect(root.classList.contains('my-aside')).toBe(true);
  expect(root.dataset.testid).toBe('aside');
  expect(root.style.color).toBe('red');

  teardown();
});

test('does not let a consumer fallthrough clobber the owned data-part', () => {
  const { root, teardown } = mountAside({ 'data-part': 'evil' }, 'nav');

  // inheritAttrs:false + v-bind="attrs" before the owned data-part → the component's own wins.
  expect(root.dataset.part).toBe('root');

  teardown();
});

test('lets a consumer aria-label fallthrough override the label default', () => {
  const { root, teardown } = mountAside({ label: 'Filters', 'aria-label': 'Custom' }, 'nav');

  // `label` is a DEFAULT (bound before attrs), so a raw aria-label fallthrough wins.
  expect(root.getAttribute('aria-label')).toBe('Custom');

  teardown();
});
