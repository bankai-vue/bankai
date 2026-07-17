import { useId } from 'vue';

/**
 * Returns a hydration-stable, prefixed id built on Vue's native `useId` —
 * `useId`-based IDs are the foundation for SSR-safe ARIA relationships, and
 * preferring Vue core over a dependency keeps the package lean.
 *
 * @param prefix - Prefix prepended to the generated id, for readable, namespaced ids.
 */
export function usePrefixedId(prefix = 'bankai'): string {
  return `${prefix}-${useId()}`;
}
