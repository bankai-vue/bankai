import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiCode } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiCode into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountCode(props: Record<string, unknown> = {}, slot: Slot = 'npm'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiCode, props) : h(BankaiCode, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiCode did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiCode ships no CSS — the theme styles the `bankai-code` class. These unit tests assert the
// rendered anatomy (the native `<code>` element, class, `data-part`); the monospace font + chip
// background the theme resolves are covered by the e2e/visual tests, which load the theme.
test('renders a native <code> exposing the code anatomy', () => {
  const { root, teardown } = mountCode();

  expect(root.tagName).toBe('CODE');
  expect(root.classList.contains('bankai-code')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toBe('npm');

  // Pure wrapper: no state props, so no inline style is emitted.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountCode({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountCode({}, null);

  expect(root.tagName).toBe('CODE');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountCode(
    { class: 'my-code', style: { color: 'red' }, 'data-testid': 'code' },
    'fluid',
  );

  // Consumer class merges with the component's own `bankai-code`.
  expect(root.classList.contains('bankai-code')).toBe(true);
  expect(root.classList.contains('my-code')).toBe(true);
  expect(root.dataset.testid).toBe('code');
  expect(root.style.color).toBe('red');

  teardown();
});
