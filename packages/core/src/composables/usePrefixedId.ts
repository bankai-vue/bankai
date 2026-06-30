import { useId } from "vue";

/**
 * Returns a hydration-stable, prefixed id built on Vue's native `useId`
 * (SPEC.md §4.12 — `useId`-based IDs are the foundation for SSR-safe ARIA
 * relationships, and §4.13 ladder rung 2: prefer Vue core over a dependency).
 *
 * Stub composable — exists only to exercise the build/typecheck pipeline against
 * a real `vue` import. Not part of the eventual public API.
 */
export function usePrefixedId(prefix = "bankai"): string {
  return `${prefix}-${useId()}`;
}
