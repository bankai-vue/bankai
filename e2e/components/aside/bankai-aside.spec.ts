import { expect, test } from '@playwright/test';

// e2e coverage for BankaiAside, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the complementary landmark structure the browser
// resolves and (b) the computed side-rail look the theme's `:where()` rules produce (padding + an
// inline-end divider border), across the OS matrix (ubuntu/macOS/windows).

test.describe('complementary region + theme (theme-bankai aside.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=aside');
    await expect(page.getByTestId('aside-fixture')).toBeVisible();
  });

  test('renders a native <aside> with the aside anatomy + labelled landmark', async ({ page }) => {
    const aside = page.getByTestId('aside');

    // The native element itself carries the complementary landmark (SPEC §4.9).
    expect(await aside.evaluate((el) => el.tagName)).toBe('ASIDE');
    await expect(aside).toHaveAttribute('data-part', 'root');
    await expect(aside).toHaveClass(/bankai-aside/u);

    // The `label` prop names the complementary landmark so multiple asides stay distinguishable.
    await expect(page.getByRole('complementary', { name: 'Secondary navigation' })).toHaveCount(1);
  });

  test('theme paints the side-rail look — padding + an inline-end divider', async ({ page }) => {
    const styles = await page.getByTestId('aside').evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        paddingBlock: s.paddingTop,
        paddingInline: s.paddingLeft,
        // In the LTR fixture the inline-end edge is the right border.
        borderInlineEndWidth: s.borderRightWidth,
        borderInlineEndStyle: s.borderRightStyle,
      };
    });

    // House padding + a hairline solid inline-end divider resolved from the theme tokens (the computed
    // px string is non-zero — asserting against `0px` avoids parsing the unit).
    expect(styles.paddingBlock).not.toBe('0px');
    expect(styles.paddingInline).not.toBe('0px');
    expect(styles.borderInlineEndWidth).not.toBe('0px');
    expect(styles.borderInlineEndStyle).toBe('solid');
  });
});
