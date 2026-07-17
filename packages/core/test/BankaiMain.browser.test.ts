import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiMain } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiMain into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountMain(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiMain, props) : h(BankaiMain, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiMain did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiMain ships no CSS — the theme styles the `bankai-main` class. These unit tests assert the
// rendered anatomy (the native `<main>` element, class, `data-part`); the min-inline-size floor the
// theme resolves is covered by the e2e/visual tests, which load the theme.
test('renders a native <main> exposing the main anatomy', () => {
  const { root, teardown } = mountMain();

  expect(root.tagName).toBe('MAIN');
  expect(root.classList.contains('bankai-main')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('content');

  // Pure wrapper: no state props, so no inline style is emitted.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountMain({}, () => [
    h('h1', { class: 'a' }, 'one'),
    h('p', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountMain({}, null);

  expect(root.tagName).toBe('MAIN');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountMain(
    { class: 'my-main', style: { color: 'red' }, 'data-testid': 'main' },
    'content',
  );

  // Consumer class merges with the component's own `bankai-main`.
  expect(root.classList.contains('bankai-main')).toBe(true);
  expect(root.classList.contains('my-main')).toBe(true);
  expect(root.dataset.testid).toBe('main');
  expect(root.style.color).toBe('red');

  teardown();
});

test('does not let a consumer fallthrough clobber the owned data-part', () => {
  const { root, teardown } = mountMain({ 'data-part': 'evil' }, 'content');

  // inheritAttrs:false + v-bind="attrs" FIRST → the component's own data-part wins (SPEC §4.4/§5.6).
  expect(root.dataset.part).toBe('root');

  teardown();
});
