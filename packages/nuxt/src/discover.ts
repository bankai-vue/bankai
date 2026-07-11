/**
 * A `@bankai-vue/core` component to auto-register: the global tag `name` and the `filePath` it imports
 * from (a core subpath export).
 */
export interface DiscoveredComponent {
  name: string;
  filePath: string;
}

/**
 * Maps `@bankai-vue/core`'s package.json `exports` to the components the Nuxt module auto-registers:
 * every `./components/<dir>/Bankai<Name>` subpath becomes
 * `{ name: 'Bankai<Name>', filePath: '@bankai-vue/core/components/<dir>/Bankai<Name>' }`.
 *
 * Pure (no I/O) so it is unit-testable in isolation — the module reads the manifest and hands the raw
 * `exports` value here. The component name is taken from the LAST path segment, so a `components/`
 * directory restructure (e.g. flattening) needs no change here. Returns `[]` when `exports` is not an
 * object (a malformed or unreadable manifest degrades to registering nothing rather than throwing).
 */
export function componentsFromExports(exports: unknown): DiscoveredComponent[] {
  if (typeof exports !== 'object' || exports === null) {
    return [];
  }

  const components: DiscoveredComponent[] = [];
  for (const subpath of Object.keys(exports)) {
    if (!subpath.startsWith('./components/')) {
      continue;
    }

    const name = subpath.slice(subpath.lastIndexOf('/') + 1);
    if (!name.startsWith('Bankai')) {
      continue;
    }

    // `./components/text/BankaiText` → `@bankai-vue/core/components/text/BankaiText`.
    components.push({ name, filePath: `@bankai-vue/core${subpath.slice(1)}` });
  }

  return components;
}
