/**
 * A union of literal members that also accepts any value of `BaseType`, without the members
 * collapsing into it — so editors keep suggesting the named literals while arbitrary values of
 * `BaseType` still type-check. Use it for a prop that has a set of first-class named values plus
 * an escape hatch (e.g. named size steps plus any CSS length, named tones plus any CSS color).
 *
 * The `& Record<never, never>` brands `BaseType` so the compiler won't fold the literals into it
 * (`'a' | string` would otherwise widen to `string` and lose the suggestions).
 *
 * Vendored from type-fest to keep `@bankai-vue/core` dependency-free:
 * https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts
 */
export type LiteralUnion<LiteralType, BaseType extends string | number> =
  | LiteralType
  | (BaseType & Record<never, never>);

/**
 * Recursively makes every property of `T` optional. Used for message bundles, where a locale may
 * override only some of the {@link BankaiMessages} keys and let the rest fall through to the English
 * base. Plain-object properties recurse; anything else (string leaves) is left as-is.
 *
 * A deliberately minimal local type — it only recurses plain objects, which is all message bundles
 * (nested string maps) need. It is NOT type-fest's `PartialDeep`, which additionally handles arrays,
 * tuples, `Map`/`Set`, `readonly`, and recursion options; reach for that (and vendor it, like
 * {@link LiteralUnion}) if a future use needs those:
 * https://github.com/sindresorhus/type-fest/blob/main/source/partial-deep.d.ts
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
