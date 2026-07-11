declare global {
  /**
   * Augmentation point for {@link BankaiLinkTo}. Empty by default, so `@bankai-vue/core` type-checks with
   * no router installed — including under a consumer's `skipLibCheck: false`, since nothing here pulls in
   * `vue-router`. Reference the optional `@bankai-vue/core/vue-router` entry to augment it with vue-router's
   * `RouteLocationRaw`, giving `BankaiLink`'s `to` prop first-class router typing.
   *
   * It is a **global** interface (not a module export) on purpose: `BankaiLink`'s types are bundled into a
   * hashed chunk at build time, so a module-scoped registry could not be augmented by a stable specifier.
   * Global declaration-merging is keyed by name, so it survives bundling.
   *
   * vue-router is the standard Vue router, so its types ship first-class — but as an opt-in augmentation
   * rather than a hard import, so the router-free (`<a>`-only) path stays dependency-free (SPEC.md §5.5).
   *
   * @example
   * ```jsonc
   * // tsconfig.json — opt in to vue-router types for BankaiLink's `to`
   * { "compilerOptions": { "types": ["@bankai-vue/core/vue-router"] } }
   * ```
   *
   * @example
   * ```ts
   * // Or augment with your own target type, no router required:
   * declare global {
   *   interface BankaiLinkTypeRegistry {
   *     to: MyRouteTarget;
   *   }
   * }
   * ```
   */

  interface BankaiLinkTypeRegistry {}
}

/**
 * Navigation target of a {@link BankaiLink} `to` prop. Resolves to vue-router's `RouteLocationRaw` when the
 * `@bankai-vue/core/vue-router` augmentation is active (see {@link BankaiLinkTypeRegistry}), otherwise a
 * router-agnostic fallback: a `string` path, or a route-location-like object.
 */
export type BankaiLinkTo = BankaiLinkTypeRegistry extends { to: infer TTarget }
  ? TTarget
  : string | Record<string, unknown>;
