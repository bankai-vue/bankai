/**
 * Options for {@link resolveGap} — the custom-property names its output targets. Defaults produce
 * the house `--bankai-space-*` scale; a theme (or a future component) that keys off a different
 * token family can override them without forking the resolver (SPEC.md §4.11 share-or-hoist rule).
 */
export interface ResolveGapOptions {
  /**
   * Custom-property base of the numbered spacing scale a step resolves to.
   *
   * @default 'bankai-space'
   */
  scale?: string;
  /**
   * Custom property holding the theme's base spacing unit, used by the `calc()` fallback for
   * out-of-scale/no-token steps so it still tracks the *active* theme's grid.
   *
   * @default 'bankai-space-unit'
   */
  unit?: string;
  /**
   * Last-resort literal length for the `unit` var's own fallback — the only value baked when no
   * theme is loaded at all. Core ships no base unit; this is purely the no-theme default.
   *
   * @default '0.125rem'
   */
  unitFallback?: string;
}

// A bare number (or a bare-numeric string, since a static `gap="4"` arrives as `'4'`) matches this;
// any other string is a verbatim CSS length and passes through untouched.
const NUMERIC = /^\d+(?:\.\d+)?$/u;

/**
 * Resolve a spacing prop (a {@link BankaiFlex}/{@link BankaiGrid} `gap`) to the CSS value carried by
 * a `--bankai-*-gap` custom property that the theme's `:where()` rule reads.
 *
 * A `number` — or a bare-numeric `string` — is a spacing-scale **step**: it resolves to the rem-based
 * `--bankai-space-<n>` token, with a `calc(n × var(--bankai-space-unit))` fallback for out-of-scale or
 * no-theme steps. The base unit is theme-owned, so the fallback tracks the *active* theme's grid — a
 * hardcoded base here would silently apply `theme-bankai`'s 2px grid under `theme-tailwind`. Only whole
 * steps have a token (fractional names aren't valid identifiers), so those use the fallback directly.
 *
 * Any other `string` is a verbatim CSS length (`'1rem'`, `'1rem 2rem'`, `'var(--x)'`, `'clamp(…)'`).
 *
 * Shared by `BankaiFlex` + `BankaiGrid` (and the Stack/Group presets that build on Flex); see the
 * SPEC.md §4.11 share-or-hoist rule. Kept internal until a public meta-component API is planned.
 */
export function resolveGap(value: number | string, options?: ResolveGapOptions): string {
  const {
    scale = 'bankai-space',
    unit = 'bankai-space-unit',
    unitFallback = '0.125rem',
  } = options ?? {};

  if (typeof value === 'string' && !NUMERIC.test(value)) {
    return value;
  }

  const step = Number(value);
  const fallback = `calc(${step} * var(--${unit}, ${unitFallback}))`;
  return Number.isInteger(step) ? `var(--${scale}-${step}, ${fallback})` : fallback;
}
