import type { Component, Plugin, VNodeChild } from 'vue';
import { expect, test, vi } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { BankaiLink, createBankai } from '../src/index';

interface Mounted {
  root: HTMLAnchorElement;
  host: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a plain string, a render function, or `null` to omit the slot.
type Slot = string | null | (() => VNodeChild);

// A no-op `console.warn` stub (avoids an inline empty/`undefined`-returning arrow the linter flags).
function noop(): void {}

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
  // A cross-host absolute href is external (its host differs from the current origin).
  expect(root.dataset.bankaiExternal).toBe('');

  teardown();
});

test('does not mark a same-origin absolute href external', () => {
  const { root, teardown } = mountLink({ href: `${window.location.origin}/settings` }, 'Settings');

  // Same host as the current origin → an internal full-page link, not external.
  expect(root.dataset.bankaiExternal).toBeUndefined();

  teardown();
});

test('does not mark a relative href external', () => {
  const { root, teardown } = mountLink({ href: '/docs' }, 'Docs');

  expect(root.dataset.bankaiExternal).toBeUndefined();

  teardown();
});

test('classifies host against config.linkOrigin over window', () => {
  // A configured origin is authoritative (SSR/SSG-safe): a URL to that host is internal even though it
  // differs from window's origin, and a URL to any other host is external.
  const plugin = createBankai({ linkOrigin: 'https://my-app.example' });

  const internal = mountLink({ href: 'https://my-app.example/settings' }, 'Settings', { plugin });
  expect(internal.root.dataset.bankaiExternal).toBeUndefined();
  internal.teardown();

  const external = mountLink({ href: 'https://other.example/x' }, 'Other', { plugin });
  expect(external.root.dataset.bankaiExternal).toBe('');
  external.teardown();
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

test('warns in dev for an object `to` with no router, and honors config.warnings', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(noop);

  // Object `to`, no router to resolve it → renders a destination-less <a> and warns.
  const noisy = mountLink({ to: { name: 'user' } }, 'User');
  expect(warn).toHaveBeenCalledOnce();
  expect(warn.mock.calls[0]?.[0]).toContain('[BankaiLink]');
  noisy.teardown();

  warn.mockClear();

  // Opting out globally silences it.
  const silent = mountLink({ to: { name: 'user' } }, 'User', {
    plugin: createBankai({ warnings: false }),
  });
  expect(warn).not.toHaveBeenCalled();
  silent.teardown();

  warn.mockRestore();
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

test('does not let consumer attrs override component-owned attributes', () => {
  // `data-part` (anatomy) and `data-bankai-external` (reflected state) are the component's identity, not a
  // consumer fallthrough. A same-named attribute must NOT clobber them — the template binds `v-bind="attrs"`
  // BEFORE the owned attributes so the owned values win. Regression guard: this is silently overridable if
  // an owned attr is ever placed before `v-bind="attrs"` (and is the default under `inheritAttrs: true`).
  const { root, teardown } = mountLink({
    href: 'https://example.com',
    target: '_blank',
    'data-part': 'HACKED',
    'data-bankai-external': 'HACKED',
  });

  expect(root.dataset.part).toBe('root');
  // A cross-host new-tab link is genuinely external — and the consumer can't spoof the value either way.
  expect(root.dataset.bankaiExternal).toBe('');

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
