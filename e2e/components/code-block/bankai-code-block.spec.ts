import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

// e2e coverage for BankaiCodeBlock, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the anatomy the browser resolves, (b) the computed
// styles the theme's `:where()` rules produce (the panel scrolls, the copy toolbar is pinned, the status
// region is sr-only), and (c) the copy interaction end-to-end — across the OS/engine matrix.
//
// The clipboard is stubbed via an init script (writing to `sessionStorage`) so the copy path is
// deterministic on every engine — the real API needs a secure context + granted permissions, which
// differ across Chromium/Firefox/WebKit.

const box = async (
  loc: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const b = await loc.boundingBox();
  if (!b) {
    throw new Error('code-block element has no bounding box');
  }
  return b;
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          sessionStorage.setItem('copiedText', text);
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto('/?fixture=code-block');
  await expect(page.getByTestId('code-block-fixture')).toBeVisible();
});

test('renders the <pre><code> anatomy with the language class reflected', async ({ page }) => {
  const root = page.getByTestId('code-block');

  await expect(root).toHaveClass(/bankai-code-block/u);
  expect(await root.evaluate((el) => el.dataset.part)).toBe('root');

  const pre = root.locator('[data-part="pre"]');
  const code = root.locator('[data-part="code"]');
  await expect(pre).toHaveJSProperty('tagName', 'PRE');
  await expect(code).toHaveJSProperty('tagName', 'CODE');
  // The `language` prop reflects as the de-facto `language-<lang>` highlighter hook.
  await expect(code).toHaveClass(/language-ts/u);
});

test('the theme makes the panel a positioning context and scrolls the <pre>', async ({ page }) => {
  const root = page.getByTestId('code-block');

  // Root is the positioning context for the pinned copy toolbar.
  expect(await root.evaluate((el) => getComputedStyle(el).position)).toBe('relative');
  // A non-transparent panel surface resolves from the theme token (exact color is locked by the visual baseline).
  expect(await root.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(
    'rgba(0, 0, 0, 0)',
  );
  // The <pre> scrolls horizontally so a long line never widens the layout.
  const pre = root.locator('[data-part="pre"]');
  expect(await pre.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
  expect(await pre.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
});

test('the copy toolbar is pinned and the status region is sr-only', async ({ page }) => {
  const root = page.getByTestId('code-block');
  const toolbar = root.locator('[data-part="copy"]');
  const status = root.locator('[data-part="status"]');

  // The toolbar is absolutely positioned within the root, near its inline-end/top corner.
  expect(await toolbar.evaluate((el) => getComputedStyle(el).position)).toBe('absolute');

  const rootBox = await box(root);
  const toolbarBox = await box(toolbar);
  // Pinned to the top of the block and to the right half of it.
  expect(toolbarBox.y - rootBox.y).toBeLessThan(rootBox.height / 2);
  expect(toolbarBox.x - rootBox.x).toBeGreaterThan(rootBox.width / 2);

  // The live region is present but visually hidden (sr-only clip to 1px).
  expect(await status.evaluate((el) => getComputedStyle(el).width)).toBe('1px');
});

test('clicking copy writes the code and announces the copied state', async ({ page }) => {
  const root = page.getByTestId('code-block');

  // Idle: no copied flag, empty live region.
  expect(await root.evaluate((el) => 'bankaiCopied' in el.dataset)).toBe(false);
  await expect(root.locator('[data-part="copy"] .bankai-button')).toHaveText('Copy');

  await root.locator('.bankai-code-block-copy').click();

  // The exact `code` string reached the (stubbed) clipboard.
  const copied = await page.evaluate(() => sessionStorage.getItem('copiedText'));
  expect(copied).toContain('createBankai');

  // Copied state reflected, button label swapped, live region announces.
  await expect(root).toHaveAttribute('data-bankai-copied', '');
  await expect(root.locator('[data-part="copy"] .bankai-button')).toHaveText('Copied');
  await expect(root.locator('[data-part="status"]')).toHaveText('Copied');
});
