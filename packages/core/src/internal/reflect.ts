/**
 * The two mutually-exclusive rendering channels of a "named set plus escape hatch" styling prop
 * (SPEC.md §4.4/§4.6): exactly one is set for a given value, or both are `undefined` when the prop
 * is unset. A component binds {@link ReflectedProp.data} to a `data-*` attribute (the theme maps the
 * short keyword to a CSS value) and {@link ReflectedProp.escape} to a `--bankai-*` custom property
 * (the theme's base `:where()` rule applies it verbatim) — Vue drops the `undefined` side, so the
 * DOM stays clean.
 *
 * Generic over the value type `T` so a `number`-carrying prop (e.g. `BankaiText`'s `weight`, whose
 * verbatim values are variable-font `wght` axis numbers) keeps its `escape` typed as `number` rather
 * than being flattened to `string`; the `data` channel is always the recognised keyword, so it stays
 * `string`.
 */
export interface ReflectedProp<T extends string | number = string> {
  /** The value when it's a recognised named keyword (reflect as `data-*`), else `undefined`. */
  readonly data: string | undefined;
  /** The value when it's NOT a recognised keyword (ride the escape hatch), else `undefined`. */
  readonly escape: T | undefined;
}

/**
 * Split a named-set-plus-escape-hatch prop value into its `data-*` vs custom-property channels, so
 * the widened prop type never lies: a value in `named` reflects as its `data-*` (theme-mapped short
 * keyword), while any other value rides the verbatim escape hatch (SPEC.md §4.4/§4.6).
 *
 * Only a `string` can match a `named` keyword; a `number` (or any non-string) always rides the escape
 * hatch. So a `number`-valued prop passes through untouched onto its custom property.
 *
 * Shared by `BankaiFlex`/`BankaiGrid`'s `align`/`justify` and `BankaiText`'s `size`/`weight`/`tone`
 * (the `named` sets differ per component and mirror each theme's `[data-bankai-*]` rules); see the
 * SPEC.md §4.11 share-or-hoist rule.
 */
export function reflectNamed<T extends string | number>(
  value: T | undefined,
  named: ReadonlySet<string>,
): ReflectedProp<T> {
  // Guard on `string` before the `Set` lookup: a `number` can't be a keyword, and `undefined` (unset)
  // falls through to both-`undefined` since `escape` is just `value`.
  if (typeof value === 'string' && named.has(value)) {
    return { data: value, escape: undefined };
  }

  return { data: undefined, escape: value };
}
