import type { BankaiConfig } from '../src/config';
import type { App, Component, Plugin, VNode } from 'vue';
import { expect, test } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { useBankaiId } from '../src/composables/useBankaiId';
import { usePrefixedId } from '../src/composables/usePrefixedId';
import { createBankai, useBankaiConfig } from '../src/config';

interface Mounted {
  host: HTMLElement;
  app: App;
  teardown: () => void;
}

// Mounts a probe component into the real browser DOM. The composables need a
// component `setup` context (useId/inject/useAttrs), so each test renders a probe.
function mount(root: Component, plugin?: Plugin): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const app = createApp(root);
  if (plugin !== undefined) {
    app.use(plugin);
  }
  app.mount(host);

  return {
    host,
    app,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// Query helper that throws if missing, so tests stay conditional-free.
function requireEl(host: HTMLElement, selector: string): Element {
  const el = host.querySelector(selector);
  if (el === null) {
    throw new Error(`expected "${selector}" to render`);
  }

  return el;
}

test('usePrefixedId returns a prefixed, useId-based id', () => {
  let id = '';
  const Comp = defineComponent({
    setup() {
      id = usePrefixedId('bankai-probe');
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp);
  expect(id).toMatch(/^bankai-probe-/u);
  teardown();
});

test('useBankaiId generates an id by default', () => {
  const Comp = defineComponent({
    setup() {
      const id = useBankaiId('bankai-probe');
      return (): VNode => h('div', { id: id.value, class: 'probe' });
    },
  });

  const { host, teardown } = mount(Comp);
  const probe = requireEl(host, '.probe');
  expect(probe.id).toMatch(/^bankai-probe-/u);
  teardown();
});

test('useBankaiId honors a consumer-provided id', () => {
  const Comp = defineComponent({
    setup() {
      const id = useBankaiId('bankai-probe');
      return (): VNode => h('div', { id: id.value, class: 'probe' });
    },
  });
  const Root = defineComponent({
    setup() {
      return (): VNode => h(Comp, { id: 'custom' });
    },
  });

  const { host, teardown } = mount(Root);
  const probe = requireEl(host, '.probe');
  expect(probe.id).toBe('custom');
  teardown();
});

test('createBankai({ idGeneration: false }) disables id generation', () => {
  const Comp = defineComponent({
    setup() {
      const id = useBankaiId('bankai-probe');
      return (): VNode => h('div', { id: id.value, class: 'probe' });
    },
  });

  const { host, teardown } = mount(Comp, createBankai({ idGeneration: false }));
  const probe = requireEl(host, '.probe');
  expect(probe.hasAttribute('id')).toBe(false);
  teardown();
});

test('codeBlockCopiedDuration defaults to 2000', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp);
  expect(config?.codeBlockCopiedDuration).toBe(2000);
  teardown();
});

test('createBankai overrides codeBlockCopiedDuration', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ codeBlockCopiedDuration: 500 }));
  expect(config?.codeBlockCopiedDuration).toBe(500);
  teardown();
});

test('useBankaiConfig reflects the installed config', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ idGeneration: false }));
  expect(config?.idGeneration).toBe(false);
  teardown();
});
