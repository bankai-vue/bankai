import type { Slots } from 'vue';
import { afterEach, expect, test, vi } from 'vitest';
import { createApp, h } from 'vue';
import { BankaiCodeBlock } from '../src/index';

interface Mounted {
  root: HTMLElement;
  teardown: () => void;
}

// Mount props: the required `code` plus arbitrary fallthrough attributes. Declared locally (rather than
// imported from the SFC's `BankaiCodeBlockProps`) so the `h()` call is precisely typed — `code` is
// required, unlike the all-optional sibling components — without the linter's TS resolver choking on the
// `.vue` type.
interface CodeBlockMountProps {
  code: string;
  [key: string]: unknown;
}

// Mounts BankaiCodeBlock into the real browser DOM and returns the rendered root element plus a
// teardown. Dependency-free (no test-utils). `slots` accepts a Vue slots object so the default /
// `copy` slots can be exercised.
function mountCodeBlock(props: CodeBlockMountProps, slots?: Slots): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const app = createApp(() => h(BankaiCodeBlock, props, slots));

  app.mount(host);

  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) {
    throw new Error('BankaiCodeBlock did not render an element');
  }

  return {
    root,
    teardown: () => {
      app.unmount();
      host.remove();
    },
  };
}

// Replaces `navigator.clipboard` with a spy so the copy path is deterministic across engines (the real
// API needs a secure context + user gesture). Returns the `writeText` mock. Restored in `afterEach`.
function stubClipboard(): ReturnType<typeof vi.fn> {
  const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.resolve());
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  return writeText;
}

afterEach(() => {
  // Drop the own-property override so the platform accessor is visible again for the next test.
  Reflect.deleteProperty(navigator, 'clipboard');
});

test('renders a <pre><code> exposing the code-block anatomy', () => {
  const { root, teardown } = mountCodeBlock({ code: 'const x = 1' });

  expect(root.tagName).toBe('DIV');
  expect(root.classList.contains('bankai-code-block')).toBe(true);
  expect(root.dataset.part).toBe('root');

  const pre = root.querySelector('pre');
  const codeEl = root.querySelector('code');
  expect(pre?.dataset.part).toBe('pre');
  expect(codeEl?.dataset.part).toBe('code');
  // The raw `code` prop renders verbatim as the code body.
  expect(codeEl?.textContent).toBe('const x = 1');

  teardown();
});

test('reflects language as the `language-<lang>` class on the <code>', () => {
  const { root, teardown } = mountCodeBlock({ code: 'x', language: 'ts' });

  expect(root.querySelector('code')?.classList.contains('language-ts')).toBe(true);

  teardown();
});

test('omits the language class when no language is given', () => {
  const { root, teardown } = mountCodeBlock({ code: 'x' });

  const codeEl = root.querySelector('code');
  expect(codeEl?.className).toBe('');

  teardown();
});

test('renders the copy button and status region by default', () => {
  const { root, teardown } = mountCodeBlock({ code: 'x' });

  const button = root.querySelector('.bankai-code-block-copy');
  expect(button).not.toBeNull();
  expect(button?.getAttribute('aria-label')).toBe('Copy');
  expect(button?.textContent).toBe('Copy');

  const status = root.querySelector('[data-part="status"]');
  expect(status?.getAttribute('role')).toBe('status');
  expect(status?.getAttribute('aria-live')).toBe('polite');
  // Idle: the live region is empty so nothing is announced until a copy happens.
  expect(status?.textContent).toBe('');

  teardown();
});

test('omits the copy button and status region when copyable is false', () => {
  const { root, teardown } = mountCodeBlock({ code: 'x', copyable: false });

  expect(root.querySelector('.bankai-code-block-copy')).toBeNull();
  expect(root.querySelector('[data-part="status"]')).toBeNull();
  expect(Object.hasOwn(root.dataset, 'bankaiCopied')).toBe(false);

  teardown();
});

test('copies the code, flips the copied state, and announces it', async () => {
  const writeText = stubClipboard();
  const { root, teardown } = mountCodeBlock({ code: 'pnpm add @bankai-vue/core' });

  const button = root.querySelector<HTMLButtonElement>('.bankai-code-block-copy');
  button?.click();

  await vi.waitFor(() => {
    // Exactly the `code` prop is written to the clipboard.
    expect(writeText).toHaveBeenCalledWith('pnpm add @bankai-vue/core');
    // Copied state reflected + button label swapped + live region announces.
    expect(root.dataset.bankaiCopied).toBe('');
    expect(button?.textContent).toBe('Copied');
    expect(root.querySelector('[data-part="status"]')?.textContent).toBe('Copied');
  });

  teardown();
});

test('copies the `code` prop verbatim even when the default slot renders custom markup', async () => {
  const writeText = stubClipboard();
  const { root, teardown } = mountCodeBlock(
    { code: 'const x = 1' },
    {
      default: () => [h('span', { class: 'hl' }, 'const x = 1 // highlighted')],
    },
  );

  // The rendered body is the slot markup...
  expect(root.querySelector('.hl')?.textContent).toBe('const x = 1 // highlighted');

  root.querySelector<HTMLButtonElement>('.bankai-code-block-copy')?.click();

  // ...but the clipboard gets the exact `code` prop, not the rendered text.
  await vi.waitFor(() => {
    expect(writeText).toHaveBeenCalledWith('const x = 1');
  });

  teardown();
});

test('customizes the copy button via the `copy` slot, exposing `copied`', () => {
  const { root, teardown } = mountCodeBlock(
    { code: 'x' },
    {
      copy: ({ copied }: { copied: boolean }) => [h('span', { class: 'icon' }, `copied:${copied}`)],
    },
  );

  // The slot receives the current `copied` state (idle here).
  expect(root.querySelector('.bankai-code-block-copy .icon')?.textContent).toBe('copied:false');

  teardown();
});

test('merges consumer class/style/attributes onto the root', () => {
  const { root, teardown } = mountCodeBlock({
    code: 'x',
    class: 'my-block',
    style: { margin: '4px' },
    'data-testid': 'cb',
  });

  expect(root.classList.contains('bankai-code-block')).toBe(true);
  expect(root.classList.contains('my-block')).toBe(true);
  expect(root.dataset.testid).toBe('cb');
  expect(root.style.margin).toBe('4px');

  teardown();
});
