import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiContainer } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content
// (multiple children), a plain string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiContainer into the real browser DOM and returns the rendered root
// element plus a teardown. Dependency-free (no test-utils).
function mountContainer(props: Record<string, unknown> = {}, slot: Slot = 'content'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiContainer, props) : h(BankaiContainer, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiContainer did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// The component constrains width through the theme's `:where()` rules, not inline styles, so these
// unit tests assert the rendered anatomy (class, `data-part`, the `data-bankai-fluid` flag). That the
// anatomy resolves to a centered / full-width box is covered by the e2e/visual tests, which load the theme.
test('renders a centered <div> exposing the container anatomy by default', () => {
  const { root, teardown } = mountContainer();

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-container')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toContain('content');

  // Centered default: no fluid flag, and no inline style is emitted at all.
  expect(Object.hasOwn(root.dataset, 'bankaiFluid')).toBe(false);
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders as the polymorphic `as` element', () => {
  const { root, teardown } = mountContainer({ as: 'section' });

  expect(root.tagName).toBe('SECTION');
  expect(root.classList.contains('bankai-container')).toBe(true);

  teardown();
});

test('reflects fluid as a presence flag', () => {
  const { root, teardown } = mountContainer({ fluid: true });

  // Empty-string value so the CSS can match `[data-bankai-fluid]` regardless of value.
  expect(root.dataset.bankaiFluid).toBe('');

  teardown();
});

test('omits the fluid flag when fluid is false', () => {
  const { root, teardown } = mountContainer({ fluid: false });

  expect(Object.hasOwn(root.dataset, 'bankaiFluid')).toBe(false);

  teardown();
});

test('renders rich slot content', () => {
  const { root, teardown } = mountContainer({}, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountContainer({}, null);

  expect(root.tagName).toBe('DIV');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountContainer(
    { class: 'my-shell', style: { padding: '4px' }, 'data-testid': 'container', fluid: true },
    'content',
  );

  // Consumer class merges with the component's own `bankai-container`.
  expect(root.classList.contains('bankai-container')).toBe(true);
  expect(root.classList.contains('my-shell')).toBe(true);
  expect(root.dataset.testid).toBe('container');
  expect(root.dataset.bankaiFluid).toBe('');
  expect(root.style.padding).toBe('4px');

  teardown();
});
