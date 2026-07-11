import type { Component, Plugin, VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { BankaiLink, createBankai } from '../src/index';

interface Mounted {
  root: HTMLAnchorElement;
  host: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a plain string, a render function, or `null` to omit the slot.
type Slot = string | null | (() => VNodeChild);

// A stub router link that records how it was invoked: it renders an <a> tagged with `data-stub` (which
// component won) and reflects the `to` it received, so tests can assert resolution + `to` forwarding
// without depending on a real router. Registered globally as `RouterLink`/`NuxtLink`, exactly where
// vue-router / Nuxt register theirs.
function stubLink(which: 'router' | 'nuxt'): Component {
  return defineComponent({
    name: which === 'nuxt' ? 'NuxtLink' : 'RouterLink',
    props: { to: { type: [String, Object], default: undefined } },
    setup(props, { slots }) {
      return () =>
        h(
          'a',
          {
            'data-stub': which,
            'data-to': typeof props.to === 'string' ? props.to : JSON.stringify(props.to),
          },
          slots.default?.(),
        );
    },
  });
}

// Mounts BankaiLink into the real browser DOM. `globals` registers app-level components (router stubs);
// `plugin` configures the library (createBankai). Returns the rendered root <a> plus a teardown.
function mountLink(
  props: Record<string, unknown> = {},
  slot: Slot = 'Home',
  options: { plugin?: Plugin; globals?: Record<string, Component> } = {},
): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiLink, props) : h(BankaiLink, props, renderSlot),
  );
  if (options.plugin !== undefined) {
    app.use(options.plugin);
  }

  for (const [name, component] of Object.entries(options.globals ?? {})) {
    app.component(name, component);
  }

  app.mount(host);

  const root = host.querySelector('a');
  if (root === null) {
    throw new Error('BankaiLink did not render an <a>');
  }

  return {
    root,
    host,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

test('renders a native <a> when no router is registered', () => {
  const { root, teardown } = mountLink({ to: '/about' });

  expect(root.tagName).toBe('A');
  expect(root.getAttribute('href')).toBe('/about');
  expect(root.classList.contains('bankai-link')).toBe(true);
  expect(root.dataset.part).toBe('root');
  expect(root.textContent).toContain('Home');
  // No router → not marked external, no rel added.
  expect(root.dataset.bankaiExternal).toBeUndefined();
  expect(root.hasAttribute('rel')).toBe(false);

  teardown();
});

test('renders a plain <a> for an explicit href, even with a router present', () => {
  const { root, teardown } = mountLink({ href: 'https://example.com' }, 'Docs', {
    globals: { RouterLink: stubLink('router') },
  });

  // `href` always wins over router resolution, even when a router is registered.
  expect(root.dataset.stub).toBeUndefined();
  expect(root.getAttribute('href')).toBe('https://example.com');
  // A raw href is not assumed external (no URL-sniffing) — only `external`/`target="_blank"` mark it.
  expect(root.dataset.bankaiExternal).toBeUndefined();

  teardown();
});

test('resolves a globally-registered RouterLink for internal `to`', () => {
  const { root, teardown } = mountLink({ to: '/about' }, 'About', {
    globals: { RouterLink: stubLink('router') },
  });

  expect(root.dataset.stub).toBe('router');
  expect(root.dataset.to).toBe('/about');
  // A router-driven internal link is not external.
  expect(root.dataset.bankaiExternal).toBeUndefined();

  teardown();
});

test('prefers NuxtLink over RouterLink when both are registered', () => {
  const { root, teardown } = mountLink({ to: '/about' }, 'About', {
    globals: { RouterLink: stubLink('router'), NuxtLink: stubLink('nuxt') },
  });

  expect(root.dataset.stub).toBe('nuxt');

  teardown();
});

test('forwards an object `to` to the router link', () => {
  const { root, teardown } = mountLink({ to: { name: 'user', params: { id: '1' } } }, 'User', {
    globals: { RouterLink: stubLink('router') },
  });

  expect(root.dataset.stub).toBe('router');
  expect(root.dataset.to).toBe(JSON.stringify({ name: 'user', params: { id: '1' } }));

  teardown();
});

test('`external` forces a native <a> even with a router present', () => {
  const { root, teardown } = mountLink({ to: '/about', external: true }, 'About', {
    globals: { RouterLink: stubLink('router') },
  });

  expect(root.dataset.stub).toBeUndefined();
  expect(root.tagName).toBe('A');
  // A string `to` degrades to href on the native anchor.
  expect(root.getAttribute('href')).toBe('/about');
  expect(root.dataset.bankaiExternal).toBe('');

  teardown();
});

test('auto-adds rel="noopener noreferrer" for target="_blank"', () => {
  const { root, teardown } = mountLink({ href: 'https://example.com', target: '_blank' }, 'Ext');

  expect(root.getAttribute('rel')).toBe('noopener noreferrer');
  expect(root.dataset.bankaiExternal).toBe('');

  teardown();
});

test('keeps a consumer-provided rel over the auto default', () => {
  const { root, teardown } = mountLink({
    href: 'https://example.com',
    target: '_blank',
    rel: 'nofollow',
  });

  expect(root.getAttribute('rel')).toBe('nofollow');

  teardown();
});

test('omits the auto rel when disabled via createBankai', () => {
  const { root, teardown } = mountLink({ href: 'https://example.com', target: '_blank' }, 'Ext', {
    plugin: createBankai({ linkNoopener: false }),
  });

  expect(root.hasAttribute('rel')).toBe(false);
  // Still marked external (a new-tab link leaves the SPA regardless of rel policy).
  expect(root.dataset.bankaiExternal).toBe('');

  teardown();
});

test('honors a config-provided linkComponent override', () => {
  const { root, teardown } = mountLink({ to: '/about' }, 'About', {
    plugin: createBankai({ linkComponent: stubLink('nuxt') }),
    // No RouterLink registered: the override alone drives resolution.
  });

  expect(root.dataset.stub).toBe('nuxt');
  expect(root.dataset.to).toBe('/about');

  teardown();
});

test('forwards attributes/classes/events onto the root', () => {
  let clicks = 0;
  const { root, teardown } = mountLink(
    {
      href: '/x',
      'aria-label': 'Home link',
      'data-testid': 'home',
      class: 'my-link',
      // Prevent the real browser (vitest browser mode) from navigating away on click.
      onClick: (event: Event) => {
        event.preventDefault();
        clicks += 1;
      },
    },
    'Home',
  );

  expect(root.getAttribute('aria-label')).toBe('Home link');
  expect(root.dataset.testid).toBe('home');
  expect(root.classList.contains('bankai-link')).toBe(true);
  expect(root.classList.contains('my-link')).toBe(true);

  root.click();
  expect(clicks).toBe(1);

  teardown();
});
