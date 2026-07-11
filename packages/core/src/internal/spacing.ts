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
  /**
   * Custom-property base of the named t-shirt gap tokens a semantic step (`xs`–`xl`) resolves to.
   * A dedicated family, distinct from the numbered `scale`, so the named gap steps can be tuned on
   * their own axis; the theme owns their absolute sizes (core bakes none).
   *
   * @default 'bankai-gap'
   */
  named?: string;
}

// A bare number (or a bare-numeric string, since a static `gap="4"` arrives as `'4'`) matches this;
// any other string is a verbatim CSS length and passes through untouched.
const NUMERIC = /^\d+(?:\.\d+)?$/u;

// The named t-shirt gap steps. A member resolves to a dedicated theme-owned `--bankai-gap-<name>`
// token (never an absolute size baked here — SPEC.md §4.4/§4.11), keeping it distinct from the
// numbered `--bankai-space-<n>` scale. Anything not in this set (and non-numeric) is a verbatim length.
const NAMED_STEPS = new Set<string>(['xs', 'sm', 'md', 'lg', 'xl']);

/**
 * Resolve a spacing prop (a {@link BankaiFlex}/{@link BankaiGrid} `gap`) to the CSS value carried by
 * a `--bankai-*-gap` custom property that the theme's `:where()` rule reads.
 *
 * A named t-shirt **step** (`xs`–`xl`) resolves to the theme-owned `--bankai-gap-<name>` token — a
 * dedicated semantic family, separate from the numbered scale below (the theme sets its absolute size).
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
    named = 'bankai-gap',
  } = options ?? {};

  if (typeof value === 'string') {
    // A named t-shirt step → its dedicated theme-owned token; nothing absolute is baked here.
    if (NAMED_STEPS.has(value)) {
      return `var(--${named}-${value})`;
    }

    // Any other non-numeric string is a verbatim CSS length.
    if (!NUMERIC.test(value)) {
      return value;
    }
  }

  const step = Number(value);
  const fallback = `calc(${step} * var(--${unit}, ${unitFallback}))`;
  return Number.isInteger(step) ? `var(--${scale}-${step}, ${fallback})` : fallback;
}
