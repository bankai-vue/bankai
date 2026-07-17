import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiFooter } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiFooter into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountFooter(props: Record<string, unknown> = {}, slot: Slot = '© bankai-vue'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiFooter, props) : h(BankaiFooter, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiFooter did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiFooter ships no CSS — the theme styles the `bankai-footer` class. These unit tests assert the
// rendered anatomy (the native `<footer>` element, class, `data-part`); the foot look the theme
// resolves is covered by the e2e/visual tests, which load the theme.
test('renders a native <footer> exposing the footer anatomy', () => {
  const { root, teardown } = mountFooter();

  expect(root.tagName).toBe('FOOTER');
  expect(root.classList.contains('bankai-footer')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('© bankai-vue');

  // Pure wrapper: no state props, so no inline style is emitted.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('resolves to the contentinfo landmark for a top-level footer', () => {
  const { root, teardown } = mountFooter();

  // A native <footer> not nested in article/aside/main/nav/section is the `contentinfo` landmark.
  expect(root.matches('footer')).toBe(true);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountFooter({}, () => [
    h('nav', { class: 'a' }, 'one'),
    h('small', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountFooter({}, null);

  expect(root.tagName).toBe('FOOTER');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountFooter(
    { class: 'my-footer', style: { color: 'red' }, 'data-testid': 'footer' },
    '© bankai-vue',
  );

  // Consumer class merges with the component's own `bankai-footer`.
  expect(root.classList.contains('bankai-footer')).toBe(true);
  expect(root.classList.contains('my-footer')).toBe(true);
  expect(root.dataset.testid).toBe('footer');
  expect(root.style.color).toBe('red');

  teardown();
});

test('does not let a consumer fallthrough clobber the owned data-part', () => {
  const { root, teardown } = mountFooter({ 'data-part': 'evil' }, '© bankai-vue');

  // inheritAttrs:false + v-bind="attrs" FIRST → the component's own data-part wins (SPEC §4.4/§5.6).
  expect(root.dataset.part).toBe('root');

  teardown();
});
