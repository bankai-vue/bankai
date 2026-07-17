import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiPage } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiPage into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountPage(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiPage, props) : h(BankaiPage, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiPage did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiPage ships no CSS — the theme fills its min-block-size. These unit tests assert the rendered
// anatomy (the plain `<div>` element, class, `data-part`); the min-block-size fill the theme resolves is
// covered by the e2e/visual tests, which load the theme.
test('renders a plain <div> exposing the page anatomy', () => {
  const { root, teardown } = mountPage();

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-page')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('content');

  // Not a landmark: a plain <div> exposes no implicit ARIA role.
  expect(root.getAttribute('role')).toBe(null);

  // Pure wrapper: no state props, so no inline style is emitted.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountPage({}, () => [
    h('h1', { class: 'a' }, 'one'),
    h('p', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountPage({}, null);

  expect(root.tagName).toBe('DIV');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountPage(
    { class: 'my-page', style: { color: 'red' }, 'data-testid': 'page' },
    'content',
  );

  // Consumer class merges with the component's own `bankai-page`.
  expect(root.classList.contains('bankai-page')).toBe(true);
  expect(root.classList.contains('my-page')).toBe(true);
  expect(root.dataset.testid).toBe('page');
  expect(root.style.color).toBe('red');

  teardown();
});

test('does not let a consumer fallthrough clobber the owned data-part', () => {
  const { root, teardown } = mountPage({ 'data-part': 'evil' }, 'content');

  // inheritAttrs:false + v-bind="attrs" FIRST → the component's own data-part wins (SPEC §4.4/§5.6).
  expect(root.dataset.part).toBe('root');

  teardown();
});
