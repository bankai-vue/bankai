import type { BankaiConfig } from '../src/config';
import type { BankaiMessages } from '../src/i18n/types';
import type { App, Component, ComputedRef, Plugin, VNode } from 'vue';
import { expect, test } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { useBankaiId } from '../src/composables/useBankaiId';
import { useBankaiMessage } from '../src/composables/useBankaiMessage';
import { usePrefixedId } from '../src/composables/usePrefixedId';
import { createBankai, useBankaiConfig } from '../src/config';
import de from '../src/i18n/locales/de';

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

test('codeBlock.copiedDuration defaults to 2000', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp);
  expect(config?.codeBlock.copiedDuration).toBe(2000);
  teardown();
});

test('createBankai overrides codeBlock.copiedDuration', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ codeBlock: { copiedDuration: 500 } }));
  expect(config?.codeBlock.copiedDuration).toBe(500);
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

test('i18n defaults to English messages', () => {
  let messages: ComputedRef<BankaiMessages> | undefined;
  const Comp = defineComponent({
    setup() {
      messages = useBankaiMessage();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp);
  expect(messages?.value.codeBlock.copy).toBe('Copy');
  teardown();
});

test('a partial i18n override keeps the fallbackLocale/messages defaults', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ i18n: { locale: 'de' } }));
  expect(config?.i18n.locale).toBe('de');
  expect(config?.i18n.fallbackLocale).toBe('en');
  expect(config?.i18n.messages).toEqual({});
  teardown();
});

test('a partial link override keeps the noopener default', () => {
  let config: BankaiConfig | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ link: { origin: 'https://example.com' } }));
  expect(config?.link.origin).toBe('https://example.com');
  expect(config?.link.noopener).toBe(true);
  teardown();
});

test('useBankaiMessage resolves a registered locale bundle', () => {
  let messages: ComputedRef<BankaiMessages> | undefined;
  const Comp = defineComponent({
    setup() {
      messages = useBankaiMessage();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ i18n: { locale: 'de', messages: { de } } }));
  expect(messages?.value.codeBlock.copy).toBe('Kopieren');
  teardown();
});

test('switching config.i18n.locale re-resolves messages reactively', () => {
  let config: BankaiConfig | undefined;
  let messages: ComputedRef<BankaiMessages> | undefined;
  const Comp = defineComponent({
    setup() {
      config = useBankaiConfig();
      messages = useBankaiMessage();
      return (): VNode => h('div');
    },
  });

  const { teardown } = mount(Comp, createBankai({ i18n: { messages: { de } } }));
  expect(messages?.value.codeBlock.copy).toBe('Copy');

  config!.i18n.locale = 'de';
  expect(messages?.value.codeBlock.copy).toBe('Kopieren');
  teardown();
});
