import type { BankaiConfigInput } from '@bankai-vue/core';
import type { NuxtModule } from '@nuxt/schema';
import { availableLocales } from '@bankai-vue/core/locales';
import {
  addComponent,
  addImports,
  addPluginTemplate,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';
import { createRequire } from 'node:module';
import { componentsFromExports } from './discover';
import { localesToInject, renderPluginContents } from './plugin';

/**
 * Options for the bankai-vue Nuxt module. Set them under the `bankai` key in `nuxt.config`.
 */
export interface ModuleOptions {
  /**
   * Auto-register every `@bankai-vue/core` component for template use (`<BankaiText>` with no import).
   * Nuxt tree-shakes the ones a build never references.
   *
   * @default true
   */
  components: boolean;
  /**
   * Auto-import the bankai-vue composables (`useBankaiId`, `usePrefixedId`, `useBankaiConfig`) so they
   * need no explicit import, like Nuxt's own composables.
   *
   * @default true
   */
  composables: boolean;
  /**
   * Initial config for the library (e.g. `{ idGeneration: false }`). The module installs it per Nuxt
   * app via `createBankai`, so it is applied per-request under SSR (no cross-request leakage). Mirrors
   * core's config input directly, so new config fields need no module change. Typed as
   * {@link BankaiConfigInput} — the same partial-accepting shape `createBankai` takes — so a nested
   * object like `i18n` can be given partially (e.g. `{ i18n: { locale: 'de' } }`), since Nuxt's own
   * shallow `Partial` wrapper does not reach inside nested config objects.
   *
   * @default { idGeneration: true }
   */
  config: BankaiConfigInput;
}

const nodeRequire = createRequire(import.meta.url);
const logger = useLogger('@bankai-vue/nuxt');

// Composables re-exported by `@bankai-vue/core` (named exports). Hand-listed because there are few and
// they change rarely — unlike components, which are discovered from the manifest below.
const COMPOSABLES = [
  'useBankaiId',
  'usePrefixedId',
  'useBankaiConfig',
  'useBankaiMessage',
] as const;

/**
 * Reads `@bankai-vue/core`'s package.json `exports` at the CONSUMER's build time (so it tracks their
 * installed core). Returns `undefined` if the manifest cannot be resolved/read or is not the expected
 * shape; the pure mapping in `componentsFromExports` then degrades to registering nothing. Core is a
 * hard dependency of this module, so resolution should never fail in a correct install — the guard is
 * defense in depth against a broken/partial `node_modules`, not the happy path.
 */
function readCoreExports(): unknown {
  try {
    const pkg: unknown = nodeRequire('@bankai-vue/core/package.json');
    if (typeof pkg === 'object' && pkg !== null && 'exports' in pkg) {
      return pkg.exports;
    }
  } catch (error) {
    logger.debug('Failed to read @bankai-vue/core/package.json', error);
  }

  return undefined;
}

/**
 * First-party Nuxt module for bankai-vue: auto-imports and SSR-safe registration for
 * `@bankai-vue/core` across SSR / SSG / client-only modes. The components are already SSR-safe on their
 * own (hydration-stable `useId`-based ids, no `window`/`document` at setup); this module wires them into
 * Nuxt's auto-import and provides the config per app so it stays per-request under SSR.
 *
 * It is deliberately theme-agnostic — it registers `@bankai-vue/core` only. The consumer picks and loads
 * a theme's CSS themselves (`css: ['@bankai-vue/theme-bankai']`).
 */
const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@bankai-vue/nuxt',
    configKey: 'bankai',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    components: true,
    composables: true,
    config: { idGeneration: true },
  },
  setup(options) {
    // 1. Auto-register components discovered from core's manifest (Nuxt tree-shakes any a build never
    //    references). The exports read is node-only; the mapping is a pure, unit-tested helper.
    if (options.components) {
      const discovered = componentsFromExports(readCoreExports());
      if (discovered.length === 0) {
        logger.warn(
          'No @bankai-vue/core components were discovered — none are auto-registered, so `<Bankai*>` tags will not resolve. Is `@bankai-vue/core` installed and its package.json `exports` readable?',
        );
      }

      for (const { name, filePath } of discovered) {
        addComponent({ name, export: 'default', filePath });
      }
    }

    // 2. Auto-import the composables from core's barrel.
    if (options.composables) {
      for (const name of COMPOSABLES) {
        addImports({ name, from: '@bankai-vue/core' });
      }
    }

    // 3. Install `createBankai` per Nuxt app via a generated plugin, so the config is provided per-request
    //    under SSR (each request's `vueApp` gets its own reactive config — no shared module-level fallback,
    //    hence no cross-request leakage). The build-time `config` option is baked into the plugin.
    //    A built-in locale named by `config.i18n` but not registered in `messages` is auto-injected as a
    //    static import of its `@bankai-vue/core/locales/<code>` bundle — so a Nuxt consumer just sets
    //    `locale` and the bundle follows (a plain-Vue app registers bundles explicitly). Static, so it
    //    tree-shakes to only the configured locale and stays SSR-safe.
    const injectedLocales = localesToInject(options.config, availableLocales);
    addPluginTemplate({
      filename: 'bankai-vue.plugin.mjs',
      getContents: () => renderPluginContents(options.config, injectedLocales),
    });
  },
});

export default module;
