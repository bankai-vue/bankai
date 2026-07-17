import { expect, test } from '@playwright/test';

// e2e coverage for BankaiHeader, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the banner landmark structure the browser resolves
// and (b) the computed banner look the theme's `:where()` rules produce (padding + bottom border),
// across the OS matrix (ubuntu/macOS/windows).

test.describe('banner region + theme (theme-bankai header.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=header');
    await expect(page.getByTestId('header-fixture')).toBeVisible();
  });

  test('renders a native <header> with the header anatomy', async ({ page }) => {
    const header = page.getByTestId('header');

    // The native element itself carries the banner landmark (SPEC §4.9).
    expect(await header.evaluate((el) => el.tagName)).toBe('HEADER');
    await expect(header).toHaveAttribute('data-part', 'root');
    await expect(header).toHaveClass(/bankai-header/u);

    // Top-level <header> resolves to the document's banner landmark.
    await expect(page.getByRole('banner')).toHaveCount(1);
  });

  test('theme paints the banner look — padding + a bottom border', async ({ page }) => {
    const styles = await page.getByTestId('header').evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        paddingBlock: s.paddingTop,
        paddingInline: s.paddingLeft,
        borderBottomWidth: s.borderBottomWidth,
        borderBottomStyle: s.borderBottomStyle,
      };
    });

    // House padding + a hairline solid bottom border resolved from the theme tokens (the computed
    // px string is non-zero — asserting against `0px` avoids parsing the unit).
    expect(styles.paddingBlock).not.toBe('0px');
    expect(styles.paddingInline).not.toBe('0px');
    expect(styles.borderBottomWidth).not.toBe('0px');
    expect(styles.borderBottomStyle).toBe('solid');
  });
});
