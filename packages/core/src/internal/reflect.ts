/**
 * The two mutually-exclusive rendering channels of a "named set plus escape hatch" styling prop
 * (SPEC.md §4.4/§4.6): exactly one is set for a given value, or both are `undefined` when the prop
 * is unset. A component binds {@link ReflectedProp.data} to a `data-*` attribute (the theme maps the
 * short keyword to a CSS value) and {@link ReflectedProp.escape} to a `--bankai-*` custom property
 * (the theme's base `:where()` rule applies it verbatim) — Vue drops the `undefined` side, so the
 * DOM stays clean.
 */
export interface ReflectedProp {
  /** The value when it's a recognised named keyword (reflect as `data-*`), else `undefined`. */
  readonly data: string | undefined;
  /** The value when it's NOT a recognised keyword (ride the escape hatch), else `undefined`. */
  readonly escape: string | undefined;
}

/**
 * Split a named-set-plus-escape-hatch prop value into its `data-*` vs custom-property channels, so
 * the widened prop type never lies: a value in `named` reflects as its `data-*` (theme-mapped short
 * keyword), while any other value rides the verbatim escape hatch (SPEC.md §4.4/§4.6).
 *
 * Shared by `BankaiFlex`/`BankaiGrid`'s `align`/`justify` (the `named` sets differ per component and
 * mirror each theme's `[data-bankai-*]` rules); see the SPEC.md §4.11 share-or-hoist rule.
 */
export function reflectNamed(value: string | undefined, named: ReadonlySet<string>): ReflectedProp {
  if (value !== undefined && named.has(value)) {
    return { data: value, escape: undefined };
  }

  // Unset (`value === undefined`) collapses to both-`undefined` since `escape` is just `value`.
  return { data: undefined, escape: value };
}
