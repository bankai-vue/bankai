import { expect, test } from '@playwright/test';

// e2e coverage for BankaiFooter, complementing the Vitest browser tests: it exercises the component
// through the real Vite-served app and asserts (a) the contentinfo landmark structure the browser
// resolves and (b) the computed foot look the theme's `:where()` rules produce (padding + a top border),
// across the OS matrix (ubuntu/macOS/windows).

test.describe('contentinfo region + theme (theme-bankai footer.css)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?fixture=footer');
    await expect(page.getByTestId('footer-fixture')).toBeVisible();
  });

  test('renders a native <footer> with the footer anatomy', async ({ page }) => {
    const footer = page.getByTestId('footer');

    // The native element itself carries the contentinfo landmark (SPEC §4.9).
    expect(await footer.evaluate((el) => el.tagName)).toBe('FOOTER');
    await expect(footer).toHaveAttribute('data-part', 'root');
    await expect(footer).toHaveClass(/bankai-footer/u);

    // Top-level <footer> resolves to the document's contentinfo landmark.
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('theme paints the foot look — padding + a top border', async ({ page }) => {
    const styles = await page.getByTestId('footer').evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        paddingBlock: s.paddingTop,
        paddingInline: s.paddingLeft,
        borderTopWidth: s.borderTopWidth,
        borderTopStyle: s.borderTopStyle,
      };
    });

    // House padding + a hairline solid top border resolved from the theme tokens (the computed px
    // string is non-zero — asserting against `0px` avoids parsing the unit).
    expect(styles.paddingBlock).not.toBe('0px');
    expect(styles.paddingInline).not.toBe('0px');
    expect(styles.borderTopWidth).not.toBe('0px');
    expect(styles.borderTopStyle).toBe('solid');
  });
});
