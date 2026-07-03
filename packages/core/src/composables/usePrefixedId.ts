import { useId } from 'vue';

/**
 * Returns a hydration-stable, prefixed id built on Vue's native `useId`
 * (SPEC.md §4.12 — `useId`-based IDs are the foundation for SSR-safe ARIA
 * relationships, and §4.13 ladder rung 2: prefer Vue core over a dependency).
 *
 * @param prefix - Prefix prepended to the generated id, for readable, namespaced ids.
 */
export function usePrefixedId(prefix = 'bankai'): string {
  return `${prefix}-${useId()}`;
}
