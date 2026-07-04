/**
 * A union of literal members that also accepts any value of `BaseType`, without the members
 * collapsing into it — so editors keep suggesting the named literals while arbitrary values of
 * `BaseType` still type-check. Use it for a prop that has a set of first-class named values plus
 * an escape hatch (e.g. named size steps plus any CSS length, named tones plus any CSS color).
 *
 * The `& Record<never, never>` brands `BaseType` so the compiler won't fold the literals into it
 * (`'a' | string` would otherwise widen to `string` and lose the suggestions).
 *
 * Vendored from type-fest to keep `@bankai-vue/core` dependency-free (SPEC.md §4.13):
 * https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts
 */
export type LiteralUnion<LiteralType, BaseType extends string | number> =
  | LiteralType
  | (BaseType & Record<never, never>);
