import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiHeader } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiHeader into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountHeader(props: Record<string, unknown> = {}, slot: Slot = 'brand'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiHeader, props) : h(BankaiHeader, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiHeader did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiHeader ships no CSS — the theme styles the `bankai-header` class. These unit tests assert the
// rendered anatomy (the native `<header>` element, class, `data-part`); the banner look the theme
// resolves is covered by the e2e/visual tests, which load the theme.
test('renders a native <header> exposing the header anatomy', () => {
  const { root, teardown } = mountHeader();

  expect(root.tagName).toBe('HEADER');
  expect(root.classList.contains('bankai-header')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('brand');

  // Pure wrapper: no state props, so no inline style is emitted.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('resolves to the banner landmark for a top-level header', () => {
  const { root, teardown } = mountHeader();

  // A native <header> not nested in article/aside/main/nav/section is the `banner` landmark.
  expect(root.matches('header')).toBe(true);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountHeader({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('nav', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountHeader({}, null);

  expect(root.tagName).toBe('HEADER');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountHeader(
    { class: 'my-header', style: { color: 'red' }, 'data-testid': 'header' },
    'brand',
  );

  // Consumer class merges with the component's own `bankai-header`.
  expect(root.classList.contains('bankai-header')).toBe(true);
  expect(root.classList.contains('my-header')).toBe(true);
  expect(root.dataset.testid).toBe('header');
  expect(root.style.color).toBe('red');

  teardown();
});

test('does not let a consumer fallthrough clobber the owned data-part', () => {
  const { root, teardown } = mountHeader({ 'data-part': 'evil' }, 'brand');

  // inheritAttrs:false + v-bind="attrs" FIRST → the component's own data-part wins (SPEC §4.4/§5.6).
  expect(root.dataset.part).toBe('root');

  teardown();
});
