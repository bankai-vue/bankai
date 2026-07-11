import type { VNode } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import {
  BankaiButton,
  BankaiCode,
  BankaiContainer,
  BankaiFlex,
  BankaiGrid,
  BankaiLayout,
  BankaiLink,
  BankaiText,
} from '../src/index';

// Component-owned attributes — `data-part` (anatomy) and every reflected `data-bankai-*` state — are the
// component's identity and MUST NOT be clobberable by a consumer-passed same-named attribute: consumers style
// and target those hooks, so a fallthrough that silently wins would break the theme's `[data-part]` /
// `[data-bankai-*]` selectors with no error (SPEC.md §4.4, §5.6 no-silent-death). Each component enforces this
// with `inheritAttrs: false` + `v-bind="attrs"` placed FIRST in the template, so the owned bindings that
// follow win. `class`/`style` are exempt (Vue merges them regardless of order).
//
// This is the cross-component regression guard the fix set up for the whole library: it fails the moment any
// component regresses to `inheritAttrs: true` (fallthrough wins) or places an owned attr before
// `v-bind="attrs"`. A per-component test would only guard the one component it lives beside.

interface OwnedCase {
  name: string;
  // The root's `bankai-*` class — always present (Vue merges `class`), so it's a stable root selector even
  // when a `data-part` clobber is (incorrectly) succeeding.
  className: string;
  // Renders the component with the given attributes (real props merged with the consumer clobber attempt).
  // The component is referenced inside `h` rather than stored, since a `.vue` default export has no
  // resolvable type at lint time.
  render: (attributes: Record<string, unknown>) => VNode;
  // Props that force each reflected value, so we can assert the reflected `data-bankai-*` survives a clobber.
  props: Record<string, unknown>;
  // Reflected state keyed by its `dataset` name → the value that must survive (derived from `props`, never
  // the consumer's). Empty for components that reflect no state beyond `data-part`.
  reflected: Record<string, string>;
  // The mirror image of `reflected`: attributes the component intentionally DEFERS to the consumer by binding
  // them BEFORE `v-bind="attrs"`, keyed by attribute name → the consumer value that must win. This is what
  // keeps the ordering load-bearing — reorder such a binding after `v-bind` and its consumer value would lose.
  // Only `BankaiButton` has one today (`id`, see `useBankaiId`); `{}` for the rest.
  deferred: Record<string, string>;
}

// A consumer `class` is added to every mount: Vue special-cases `class`/`style` so they MERGE with the
// component's own regardless of `v-bind` order — the exemption the owned-attr ordering relies on. Asserting
// it here documents that guarantee alongside the ones it depends on.
const CONSUMER_CLASS = 'consumer-probe';

const CASES: OwnedCase[] = [
  {
    name: 'BankaiButton',
    className: 'bankai-button',
    render: (attributes) => h(BankaiButton, attributes, () => 'content'),
    props: { variant: 'outline', size: 'lg' },
    reflected: { bankaiVariant: 'outline', bankaiSize: 'lg' },
    // The empty-string `id` opt-out is the case that actually exercises the ordering: `useBankaiId` resolves
    // `id=""` to the *generated* id, so only `:id` being bound before `v-bind="attrs"` lets the consumer's
    // `""` win on the root. A non-empty consumer id would pass regardless of order (useBankaiId returns it).
    deferred: { id: '' },
  },
  {
    name: 'BankaiCode',
    className: 'bankai-code',
    render: (attributes) => h(BankaiCode, attributes, () => 'content'),
    props: {},
    reflected: {},
    deferred: {},
  },
  {
    name: 'BankaiContainer',
    className: 'bankai-container',
    render: (attributes) => h(BankaiContainer, attributes, () => 'content'),
    props: { fluid: true },
    reflected: { bankaiFluid: '' },
    deferred: {},
  },
  {
    name: 'BankaiFlex',
    className: 'bankai-flex',
    render: (attributes) => h(BankaiFlex, attributes, () => 'content'),
    props: { direction: 'column', align: 'center', justify: 'between', wrap: 'wrap', inline: true },
    reflected: {
      bankaiDirection: 'column',
      bankaiAlign: 'center',
      bankaiJustify: 'between',
      bankaiWrap: 'wrap',
      bankaiInline: '',
    },
    deferred: {},
  },
  {
    name: 'BankaiGrid',
    className: 'bankai-grid',
    render: (attributes) => h(BankaiGrid, attributes, () => 'content'),
    props: { flow: 'row', align: 'center', justify: 'center', inline: true },
    reflected: {
      bankaiFlow: 'row',
      bankaiAlign: 'center',
      bankaiJustify: 'center',
      bankaiInline: '',
    },
    deferred: {},
  },
  {
    name: 'BankaiLayout',
    className: 'bankai-layout',
    render: (attributes) => h(BankaiLayout, attributes, () => 'content'),
    props: {},
    reflected: {},
    deferred: {},
  },
  {
    name: 'BankaiLink',
    className: 'bankai-link',
    render: (attributes) => h(BankaiLink, attributes, () => 'content'),
    // A cross-host new-tab link is genuinely external, so `data-bankai-external` is set and can be probed.
    props: { href: 'https://example.com', target: '_blank' },
    reflected: { bankaiExternal: '' },
    deferred: {},
  },
  {
    name: 'BankaiText',
    className: 'bankai-text',
    render: (attributes) => h(BankaiText, attributes, () => 'content'),
    props: { size: 'lg', weight: 'bold', tone: 'muted', truncate: true },
    reflected: {
      bankaiSize: 'lg',
      bankaiWeight: 'bold',
      bankaiTone: 'muted',
      bankaiTruncate: '',
    },
    deferred: {},
  },
];

// The DOM attribute name a `dataset` key reflects to: `bankaiVariant` → `data-bankai-variant`. Used to build
// the consumer clobber attempt (consumers write the hyphenated attribute).
function datasetKeyToAttr(key: string): string {
  return `data-${key.replaceAll(/[A-Z]/gu, (char) => `-${char.toLowerCase()}`)}`;
}

// Mounts a case with a consumer fallthrough that tries to clobber `data-part` and every reflected state at
// once. The null-check lives here (not in the test body) so the test itself stays branch-free.
function mountOwnedCase(testCase: OwnedCase): { root: HTMLElement; teardown: () => void } {
  const host = document.createElement('div');
  document.body.append(host);

  const clobbers: Record<string, string> = { 'data-part': 'HACKED', class: CONSUMER_CLASS };
  for (const key of Object.keys(testCase.reflected)) {
    clobbers[datasetKeyToAttr(key)] = 'HACKED';
  }
  // Deferred attrs carry their intended consumer value (not `HACKED`): these must win, not survive.
  Object.assign(clobbers, testCase.deferred);

  const app = createApp(() => testCase.render({ ...testCase.props, ...clobbers }));
  app.mount(host);

  const root = host.querySelector<HTMLElement>(`.${testCase.className}`);
  if (root === null) {
    throw new Error(`${testCase.name} did not render its root element`);
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

for (const testCase of CASES) {
  test(`${testCase.name} does not let consumer attrs clobber owned data-* attributes`, () => {
    const { root, teardown } = mountOwnedCase(testCase);

    // The anatomy hook is owned — a consumer `data-part` must not win.
    expect(root.dataset.part).toBe('root');
    // Every reflected state keeps the value derived from props, never the consumer's `HACKED`.
    for (const [key, expected] of Object.entries(testCase.reflected)) {
      expect(root.dataset[key]).toBe(expected);
    }
    // The consumer `class` merges with the component's own, regardless of `v-bind` order (the exemption
    // the owned-attr ordering depends on) — both are present, neither clobbers the other.
    expect(root.classList.contains(testCase.className)).toBe(true);
    expect(root.classList.contains(CONSUMER_CLASS)).toBe(true);
    // The mirror case: attrs the component defers (bound before `v-bind="attrs"`) keep the consumer's value.
    for (const [attr, expected] of Object.entries(testCase.deferred)) {
      expect(root.getAttribute(attr)).toBe(expected);
    }

    teardown();
  });
}
