import { expect, test } from '@playwright/test';
import { computedRgb, tokenRgb } from '../../helpers/color';

// e2e coverage for BankaiLink, complementing the Vitest browser tests: it exercises the component through
// the real Vite-served app and asserts (a) the rendered anatomy and (b) the computed link styles the
// browser resolves from the theme's `:where()` rules, across the OS matrix. No router is installed in the
// playground, so every link renders a native <a> (the internal-vs-router resolution is unit-tested).

test.describe('anatomy + reflected state', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/?fixture=link');
    await expect(page.getByTestId('link-fixture')).toBeVisible();
  });

  test('renders native <a> roots exposing the link anatomy', async ({ page }) => {
    const link = page.getByTestId('link-default');
    await expect(link).toHaveClass(/bankai-link/u);
    expect(await link.evaluate((el) => el.tagName)).toBe('A');
    expect(await link.evaluate((el) => el.dataset.part)).toBe('root');
    expect(await link.evaluate((el) => el.getAttribute('href'))).toBe('/getting-started');
    // A plain internal-looking link is not external.
    expect(await link.evaluate((el) => 'bankaiExternal' in el.dataset)).toBe(false);
  });

  test('marks a new-tab link external and adds a safe rel', async ({ page }) => {
    const external = page.getByTestId('link-external');
    expect(await external.evaluate((el) => el.dataset.bankaiExternal)).toBe('');
    expect(await external.evaluate((el) => el.getAttribute('rel'))).toBe('noopener noreferrer');
    expect(await external.evaluate((el) => el.getAttribute('target'))).toBe('_blank');
  });
});

test.describe('theme link.css computed styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/?fixture=link');
    await expect(page.getByTestId('link-fixture')).toBeVisible();
  });

  test('link color wires to the accent role and is underlined', async ({ page }) => {
    const link = page.getByTestId('link-default');
    // Token-wiring: the link color aliases the foundation `--bankai-color-accent` (survives a retune).
    expect(await computedRgb(link, 'color')).toBe(await tokenRgb(page.locator('html'), 'accent'));
    // The underline is the accessible link signal, independent of color.
    expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe('underline');
    expect(await link.evaluate((el) => getComputedStyle(el).cursor)).toBe('pointer');
  });

  test('focus-visible paints an outline in the focus-ring color', async ({ page }) => {
    const link = page.getByTestId('link-default');
    // `:focus-visible` needs the keyboard modality, but a bare `Tab` can't be relied on to LAND on the
    // link: WebKit on macOS/Windows doesn't tab to links by default (Linux WebKit does). So press `Tab` to
    // set the keyboard modality, then focus the link explicitly — programmatic focus under an active
    // keyboard modality still matches `:focus-visible`, and works across every browser/OS.
    await page.keyboard.press('Tab');
    await link.focus();
    await expect(link).toBeFocused();

    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
    expect(await computedRgb(link, 'outline-color')).toBe(
      await tokenRgb(page.locator('html'), 'accent'),
    );
  });
});
