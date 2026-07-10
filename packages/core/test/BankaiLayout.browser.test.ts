import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiLayout } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// A slots object for a mount — each key is a render function for that named slot.
type Slots = Record<string, () => VNodeChild>;

// Mounts BankaiLayout into the real browser DOM with the given named slots (and optional root props)
// and returns the rendered root element plus a teardown. Dependency-free (no test-utils).
function mountLayout(slots: Slots = {}, props: Record<string, unknown> | null = null): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const app = createApp(() => h(BankaiLayout, props, slots));

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiLayout did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiLayout emits native landmark regions; these unit tests assert the rendered anatomy (root
// class + `data-part`, which region elements exist, their tag names). That the theme's `:where()`
// rules place them on a grid is covered by the e2e/visual tests, which load the theme.

test('always renders the grid root and a single <main>, even with no slots', () => {
  const { root, teardown } = mountLayout();

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-layout')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.getAttribute('style')).toBe(null);

  // <main> is the sole always-on landmark; the optional regions are absent.
  const main = root.querySelector('main');
  expect(main).not.toBe(null);
  expect(main?.dataset.part).toBe('main');
  expect(root.querySelectorAll('main')).toHaveLength(1);
  expect(root.querySelector('header')).toBe(null);
  expect(root.querySelector('aside')).toBe(null);
  expect(root.querySelector('footer')).toBe(null);

  teardown();
});

test('wraps each provided slot in its matching landmark region, in DOM order', () => {
  const { root, teardown } = mountLayout({
    header: () => h('nav', 'nav'),
    sidebar: () => h('div', { class: 'side' }, 'side'),
    default: () => h('p', 'content'),
    footer: () => h('small', 'foot'),
  });

  const header = root.querySelector('header');
  const aside = root.querySelector('aside');
  const main = root.querySelector('main');
  const footer = root.querySelector('footer');

  // Each region is the expected native landmark with the expected `data-part`, wrapping its content.
  expect(header?.dataset.part).toBe('header');
  expect(header?.querySelector('nav')?.textContent).toBe('nav');
  expect(aside?.dataset.part).toBe('sidebar');
  expect(aside?.querySelector('.side')?.textContent).toBe('side');
  expect(main?.dataset.part).toBe('main');
  expect(main?.textContent).toBe('content');
  expect(footer?.dataset.part).toBe('footer');
  expect(footer?.textContent).toBe('foot');

  // Regions render header → sidebar → main → footer in source order.
  const order = [...root.children].map((el) => el.tagName);
  expect(order).toStrictEqual(['HEADER', 'ASIDE', 'MAIN', 'FOOTER']);

  teardown();
});

test('omits an optional region when only some slots are provided', () => {
  // Header + main only (a footer-less, sidebar-less app).
  const { root, teardown } = mountLayout({
    header: () => h('nav', 'nav'),
    default: () => h('p', 'content'),
  });

  expect(root.querySelector('header')).not.toBe(null);
  expect(root.querySelector('main')).not.toBe(null);
  expect(root.querySelector('aside')).toBe(null);
  expect(root.querySelector('footer')).toBe(null);

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountLayout(
    { default: () => h('p', 'content') },
    { class: 'my-app', style: { gap: '4px' }, 'data-testid': 'layout' },
  );

  // Consumer class merges with the component's own `bankai-layout`; style/attrs land on the root.
  expect(root.classList.contains('bankai-layout')).toBe(true);
  expect(root.classList.contains('my-app')).toBe(true);
  expect(root.dataset.testid).toBe('layout');
  expect(root.style.gap).toBe('4px');

  teardown();
});
