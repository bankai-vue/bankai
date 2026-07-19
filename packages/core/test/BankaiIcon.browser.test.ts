import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiIcon, createBankai } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content (an inline `<svg>`), a plain
// string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mounts BankaiIcon into the real browser DOM and returns the rendered root element plus a teardown.
// `plugins` lets a test install `createBankai(...)` to exercise config-driven behavior. Dependency-free.
function mountIcon(
  props: Record<string, unknown> = {},
  slot: Slot = null,
  plugins: Array<ReturnType<typeof createBankai>> = [],
): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiIcon, props) : h(BankaiIcon, props, renderSlot),
  );
  for (const plugin of plugins) {
    app.use(plugin);
  }

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiIcon did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// The component styles through the theme's `:where()` rules, not inline styles, so these unit tests assert
// the rendered anatomy (class, `data-*`, aria). That the anatomy resolves to a square box and real sizes is
// covered by the e2e/visual tests, which load the theme.
test('renders a decorative <span> exposing the icon anatomy by default', () => {
  const { root, teardown } = mountIcon();

  expect(root.tagName).toBe('SPAN');
  expect(root.classList.contains('bankai-icon')).toBe(true);
  expect(root.dataset.part).toBe('root');
  // Decorative by default: hidden from assistive tech, no role/label.
  expect(root.getAttribute('aria-hidden')).toBe('true');
  expect(root.getAttribute('role')).toBe(null);
  expect(root.getAttribute('aria-label')).toBe(null);

  // Unset props reflect no attribute, and no inline style is emitted at all.
  expect(Object.hasOwn(root.dataset, 'size')).toBe(false);
  expect(Object.hasOwn(root.dataset, 'square')).toBe(false);
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('renders as the polymorphic `as` element', () => {
  const { root, teardown } = mountIcon({ as: 'i' });

  expect(root.tagName).toBe('I');
  expect(root.classList.contains('bankai-icon')).toBe(true);

  teardown();
});

test('applies `name` verbatim as a class with no resolver', () => {
  const { root, teardown } = mountIcon({ name: 'i-mdi-home' });

  expect(root.classList.contains('bankai-icon')).toBe(true);
  expect(root.classList.contains('i-mdi-home')).toBe(true);

  teardown();
});

test('maps `name` through config.icon.class when registered', () => {
  const bankai = createBankai({ icon: { class: (name) => `x-${name}` } });
  const { root, teardown } = mountIcon({ name: 'home' }, null, [bankai]);

  // The resolver output is the class; the raw token is not.
  expect(root.classList.contains('x-home')).toBe(true);
  expect(root.classList.contains('home')).toBe(false);

  teardown();
});

test('renders slot content (an inline svg)', () => {
  const { root, teardown } = mountIcon({}, () =>
    h('svg', { viewBox: '0 0 24 24' }, [h('path', { d: 'M0 0h24v24H0z' })]),
  );

  expect(root.querySelector('svg')).not.toBe(null);

  teardown();
});

test('reflects named size as data-bankai-size (no inline style)', () => {
  const { root, teardown } = mountIcon({ size: 'lg' });

  expect(root.dataset.bankaiSize).toBe('lg');
  // Named values take the data-* path, not the custom-property escape hatch.
  expect(root.getAttribute('style')).toBe(null);

  teardown();
});

test('routes a non-named size to the custom-property escape hatch', () => {
  const { root, teardown } = mountIcon({ size: '20px' });

  expect(root.style.getPropertyValue('--bankai-icon-size')).toBe('20px');
  // ...and is NOT also reflected as data-* (no rule would match it there).
  expect(Object.hasOwn(root.dataset, 'size')).toBe(false);

  teardown();
});

test('names a meaningful icon via `label` (role=img + aria-label, not hidden)', () => {
  const { root, teardown } = mountIcon({ label: 'Home' });

  expect(root.getAttribute('role')).toBe('img');
  expect(root.getAttribute('aria-label')).toBe('Home');
  expect(root.getAttribute('aria-hidden')).toBe(null);

  teardown();
});

test('does not hide the icon when the consumer supplies their own labeling', () => {
  // A consumer aria-label (without the `label` prop) means the icon is meaningful — the decorative
  // `aria-hidden` default must not stomp it.
  const { root, teardown } = mountIcon({ 'aria-label': 'Search' });

  expect(root.getAttribute('aria-label')).toBe('Search');
  expect(root.getAttribute('aria-hidden')).toBe(null);

  teardown();
});

test('reflects the 1:1 opt-out as data-bankai-square="false"', () => {
  const { root, teardown } = mountIcon({ noSquare: true });

  expect(root.dataset.bankaiSquare).toBe('false');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountIcon({
    class: 'my-icon',
    style: { padding: '4px' },
    'data-testid': 'icon',
    size: 'sm',
  });

  // Consumer class merges with the component's own `bankai-icon` (and any resolved `name` class).
  expect(root.classList.contains('bankai-icon')).toBe(true);
  expect(root.classList.contains('my-icon')).toBe(true);
  expect(root.dataset.testid).toBe('icon');
  expect(root.style.padding).toBe('4px');
  // The component's own reflected state is untouched by the merge.
  expect(root.dataset.bankaiSize).toBe('sm');

  teardown();
});
