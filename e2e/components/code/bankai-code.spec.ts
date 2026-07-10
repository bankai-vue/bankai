import { expect, test } from '@playwright/test';

// e2e coverage for BankaiCode, complementing the Vitest browser tests: it exercises the component through
// the real Vite-served app and asserts (a) the anatomy the browser resolves and (b) the computed styles
// the theme's `:where()` rules produce — a monospace font, a chip background, a corner radius, and the
// `em`-relative sizing — across the OS matrix (ubuntu/macOS/windows).

test.describe('inline code (theme code.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=code');
    await expect(page.getByTestId('code-fixture')).toBeVisible();
  });

  test('renders as .bankai-code <code> roots exposing the anatomy', async ({ page }) => {
    const inline = page.getByTestId('code-inline');

    await expect(inline).toHaveClass(/bankai-code/u);
    expect(await inline.evaluate((el) => el.tagName)).toBe('CODE');
    expect(await inline.evaluate((el) => el.dataset.part)).toBe('root');
  });

  test('the theme applies a monospace font, a chip background, and a corner radius', async ({
    page,
  }) => {
    const styles = await page.getByTestId('code-inline').evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        fontFamily: s.fontFamily,
        backgroundColor: s.backgroundColor,
        borderRadius: s.borderTopLeftRadius,
      };
    });

    expect(styles.fontFamily.toLowerCase()).toMatch(/mono/u);
    // A visible chip: not the transparent default.
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.backgroundColor).not.toBe('transparent');
    // The house radius resolves to a non-zero px value.
    expect(styles.borderRadius).not.toBe('0px');
  });

  test('font-size is em-relative, so code in smaller text is smaller', async ({ page }) => {
    // Computed `font-size` is always `"<n>px"`, so drop the unit and coerce (avoids `parseFloat`, which
    // `Number()` can't replace here since `Number('14px')` is NaN).
    const fontSizePx = (testId: string): Promise<number> =>
      page.getByTestId(testId).evaluate((el) => Number(getComputedStyle(el).fontSize.slice(0, -2)));

    const inlineSize = await fontSizePx('code-inline');
    const smallSize = await fontSizePx('code-small');

    expect(smallSize).toBeLessThan(inlineSize);
  });
});
