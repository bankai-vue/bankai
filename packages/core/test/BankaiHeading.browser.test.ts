import type { VNodeChild } from 'vue';
import { expect, test } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiHeading } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Default-slot content for a mount: a render function for rich content (multiple children), a plain
// string, or `null` to omit the slot entirely.
type Slot = string | null | (() => VNodeChild);

// Mount props: the required `level` plus arbitrary fallthrough attributes. Declared locally rather than
// imported from the SFC's `BankaiHeadingProps` so the `h()` call is precisely typed (`level` is required,
// unlike the all-optional sibling components) without the linter's TS resolver choking on the `.vue` type.
interface HeadingMountProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  [key: string]: unknown;
}

// Mounts BankaiHeading into the real browser DOM and returns the rendered root element plus a teardown.
// Dependency-free (no test-utils).
function mountHeading(props: HeadingMountProps, slot: Slot = 'Title'): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const renderSlot = typeof slot === 'function' ? slot : (): VNodeChild => slot;
  const app = createApp(() =>
    slot === null ? h(BankaiHeading, props) : h(BankaiHeading, props, renderSlot),
  );

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiHeading did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// BankaiHeading ships no CSS — the theme styles the `bankai-heading` class keyed on `data-bankai-level`.
// These unit tests assert the rendered anatomy (the native `<hN>` element, class, `data-part`, the
// reflected level); the per-level type styles the theme resolves are covered by the e2e/visual tests.
test('renders the native <hN> element matching the level, exposing the heading anatomy', () => {
  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    const { root, teardown } = mountHeading({ level });

    expect(root.tagName).toBe(`H${level}`);
    expect(root.classList.contains('bankai-heading')).toBe(true);
    expect(root.dataset.part).toBe('root');
    expect(root.dataset.bankaiLevel).toBe(String(level));
    expect(root.textContent).toBe('Title');

    teardown();
  }
});

test('renders rich slot content', () => {
  const { root, teardown } = mountHeading({ level: 2 }, () => [
    h('span', { class: 'a' }, 'one'),
    h('span', { class: 'b' }, 'two'),
  ]);

  expect(root.tagName).toBe('H2');
  expect(root.querySelector('.a')?.textContent).toBe('one');
  expect(root.querySelector('.b')?.textContent).toBe('two');

  teardown();
});

test('renders without slot content', () => {
  const { root, teardown } = mountHeading({ level: 3 }, null);

  expect(root.tagName).toBe('H3');
  expect(root.textContent).toBe('');

  teardown();
});

test('merges consumer class/style/attributes onto the root without clobbering owned attrs', () => {
  const { root, teardown } = mountHeading(
    {
      level: 1,
      class: 'my-heading',
      style: { color: 'red' },
      'data-testid': 'heading',
      id: 'page-title',
    },
    'Welcome',
  );

  // Consumer class merges with the component's own `bankai-heading`.
  expect(root.classList.contains('bankai-heading')).toBe(true);
  expect(root.classList.contains('my-heading')).toBe(true);
  expect(root.dataset.testid).toBe('heading');
  // A consumer `id` (e.g. for `aria-labelledby`) rides through the fallthrough.
  expect(root.id).toBe('page-title');
  expect(root.style.color).toBe('red');

  // The owned anatomy is intact — the fallthrough can't overwrite `data-part`/`data-bankai-level`.
  expect(root.dataset.part).toBe('root');
  expect(root.dataset.bankaiLevel).toBe('1');

  teardown();
});

test('a consumer cannot clobber the owned data-* via fallthrough', () => {
  const { root, teardown } = mountHeading({
    level: 2,
    'data-part': 'hacked',
    'data-bankai-level': '9',
  });

  // `v-bind="attrs"` sits FIRST on the root, so the component-owned attrs win (SPEC.md §4.4, §5.6).
  expect(root.dataset.part).toBe('root');
  expect(root.dataset.bankaiLevel).toBe('2');

  teardown();
});
