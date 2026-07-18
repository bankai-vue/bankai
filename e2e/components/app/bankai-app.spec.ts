import { expect, test } from '@playwright/test';
import { computedRgb, tokenRgb } from '../../helpers/color';

// e2e coverage for BankaiApp, complementing the Vitest browser tests: it exercises the component through
// the real Vite-served app and asserts (a) the app-root anatomy the browser resolves and (b) the
// embedded-mode surface the theme's `:where()` rule produces — the App box paints the foundation
// `--bankai-color-bg`/`-fg` tokens on itself, across the OS matrix (ubuntu/macOS/windows).

test.describe('app root + theme (theme-bankai app.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=app');
    await expect(page.getByTestId('app-fixture')).toBeVisible();
  });

  test('renders a plain <div> with the app anatomy — not a landmark', async ({ page }) => {
    const host = page.getByTestId('app');

    expect(await host.evaluate((el) => el.tagName)).toBe('DIV');
    await expect(host).toHaveAttribute('data-part', 'root');
    await expect(host).toHaveClass(/bankai-app/u);

    // BankaiApp is deliberately NOT a landmark — it is the infra root wrapper, not a region.
    await expect(page.getByRole('main')).toHaveCount(0);
  });

  test('paints a self-contained surface wired to the foundation color tokens', async ({ page }) => {
    const host = page.getByTestId('app');

    // The embedded-mode surface: the App box carries `--bankai-color-bg`/`-fg` on itself, so an island
    // in a foreign host is self-contained. Assert the computed paint is WIRED to the tokens (both sides
    // resolved through the same canvas path), so the check survives an intentional token retune.
    expect(await computedRgb(host, 'background-color')).toBe(await tokenRgb(host, 'bg'));
    expect(await computedRgb(host, 'color')).toBe(await tokenRgb(host, 'fg'));

    // The local `color-scheme` re-establishes the light/dark context on this box (SPEC.md §4.18).
    expect(await host.evaluate((el) => getComputedStyle(el).colorScheme)).toBe('light dark');
  });
});
