import type { BankaiMessages } from './i18n/types';
import type { DeepPartial } from './internal/types';
import type { App, Component, InjectionKey, Plugin } from 'vue';
import { inject, reactive } from 'vue';

/**
 * Localization surface for bankai-vue: the active locale, a cross-family fallback, and the registered
 * message bundles the components' default strings resolve through (read with {@link useBankaiMessage}).
 * Component defaults are English out of the box; register a bundle and set a `locale` to localize them
 * app-wide, while a per-instance prop (e.g. `BankaiCodeBlock`'s `copyLabel`) still overrides per block.
 */
export interface BankaiI18nConfig {
  /**
   * The active locale, e.g. `'de'` or a regional variant like `'de-AT'` (which inherits `'de'`).
   * Selects which registered {@link BankaiI18nConfig.messages} bundle resolves the component strings.
   *
   * @default 'en'
   */
  locale: string;
  /**
   * Cross-family fallback tried before the English base when the active locale has no bundle for a
   * key (e.g. `locale: 'gsw'`, `fallbackLocale: 'de'`). Regional parents (`'de-AT'` → `'de'`) are
   * already walked automatically, so this is for unrelated-family fallbacks. English is always the
   * ultimate base regardless.
   *
   * @default 'en'
   */
  fallbackLocale: string;
  /**
   * Registered message bundles keyed by locale (e.g. `{ de }` from `@bankai-vue/core/locales`). Each
   * bundle may be partial — any key it omits falls through to the English base — so a consumer can
   * register a full shipped bundle or hand-write just the strings they want to override.
   *
   * @default {}
   */
  messages: Record<string, DeepPartial<BankaiMessages>>;
}

/**
 * `BankaiLink` configuration: which component it renders for internal navigation, the origin its
 * external-host check resolves against, and the `noopener` security default. See {@link BankaiConfig.link}.
 */
export interface BankaiLinkConfig {
  /**
   * Component `BankaiLink` renders for internal (`to`) navigation. Leave unset to auto-detect the
   * router link: a globally-registered `NuxtLink` (preferred, under Nuxt), else `RouterLink` (vue-router),
   * else a plain `<a>`. Set this only to force a specific component when auto-detection is insufficient
   * (e.g. a custom router link, or SSR contexts where the global registration is unavailable at resolve time).
   *
   * @default undefined
   */
  component?: Component | string;
  /**
   * Site origin (e.g. `https://example.com`) `BankaiLink` compares an `href` against to decide it is
   * external: an absolute `http(s)` URL to a *different* host reflects `data-bankai-external`. Set this so
   * the check is accurate and hydration-safe under SSR/SSG, where the current origin is not knowable at
   * render time. A client-only app can leave it unset — it falls back to `window.location`; with no origin
   * available at all, any absolute URL is treated as external.
   *
   * @default undefined
   */
  origin?: string;
  /**
   * Whether `BankaiLink` auto-adds `rel="noopener noreferrer"` to a `target="_blank"` link (a security
   * default: without it the opened page can reach back through `window.opener`). A consumer-provided `rel`
   * always wins. Set `false` to opt out globally.
   *
   * @default true
   */
  noopener: boolean;
}

/**
 * `BankaiCodeBlock` configuration. See {@link BankaiConfig.codeBlock}.
 */
export interface BankaiCodeBlockConfig {
  /**
   * How long (ms) `BankaiCodeBlock`'s copy button stays in its "copied" state after a successful copy —
   * the window during which it reflects `data-bankai-copied`, shows `copiedLabel`, and its `role="status"`
   * region announces the copy — before reverting to idle. A per-instance `copiedDuration` prop overrides
   * it for a single block.
   *
   * @default 2000
   */
  copiedDuration: number;
}

/**
 * `BankaiIcon` configuration. See {@link BankaiConfig.icon}.
 */
export interface BankaiIconConfig {
  /**
   * Resolver mapping a `BankaiIcon` `name` token to the CSS class(es) that render it — for icon systems
   * whose class differs from the token you want to write (a Font Awesome family/style, or normalizing
   * `'mdi:home'` to a UnoCSS/Iconify-CSS `i-*` class). Leave unset to apply `name` verbatim as a class,
   * which already works for UnoCSS / Iconify-CSS (`name="i-mdi-home"`).
   *
   * @default undefined
   */
  class?: (name: string) => string;
}

/**
 * Global configuration for bankai-vue.
 * Set initial values with {@link createBankai}; read or mutate at runtime with {@link useBankaiConfig}.
 *
 * Component-scoped settings are grouped under a namespace named for the component/feature they configure
 * (`link`, `codeBlock`, `icon`, `i18n`); truly app-wide switches (`idGeneration`, `warnings`) stay flat.
 */
export interface BankaiConfig {
  /**
   * Whether components generate a stable `id` when the consumer does not supply one.
   * A consumer-provided `id` always takes precedence, regardless of this setting.
   *
   * @default true
   */
  idGeneration: boolean;
  /**
   * Whether bankai-vue emits development warnings for likely-mistaken usage (e.g. a `BankaiLink` with an
   * object `to` and no router to resolve it). Warnings are already stripped from production builds; set
   * `false` to silence them in development too. A single global switch covers every component's warnings.
   *
   * @default true
   */
  warnings: boolean;
  /**
   * `BankaiLink` configuration: the component it renders for internal navigation, the origin its
   * external-host check resolves against, and the `noopener` security default. See {@link BankaiLinkConfig}.
   */
  link: BankaiLinkConfig;
  /**
   * `BankaiCodeBlock` configuration. See {@link BankaiCodeBlockConfig}.
   */
  codeBlock: BankaiCodeBlockConfig;
  /**
   * `BankaiIcon` configuration. See {@link BankaiIconConfig}.
   */
  icon: BankaiIconConfig;
  /**
   * Localization: active locale, fallback, and registered message bundles the components' default
   * strings resolve through ({@link useBankaiMessage}). See {@link BankaiI18nConfig}.
   */
  i18n: BankaiI18nConfig;
}

function createDefaultConfig(): BankaiConfig {
  return {
    idGeneration: true,
    warnings: true,
    link: { noopener: true },
    codeBlock: { copiedDuration: 2000 },
    icon: {},
    i18n: { locale: 'en', fallbackLocale: 'en', messages: {} },
  };
}

/**
 * Input accepted by {@link createBankai}: every top-level field optional, and each nested config group
 * (`link`, `codeBlock`, `icon`, `i18n`) itself partial — so a consumer can pass `i18n: { locale: 'de' }`
 * or `link: { origin }` without restating the group's other fields. {@link createBankai} merges each
 * group over the defaults.
 */
export type BankaiConfigInput = Partial<
  Omit<BankaiConfig, 'link' | 'codeBlock' | 'icon' | 'i18n'>
> & {
  link?: Partial<BankaiLinkConfig>;
  codeBlock?: Partial<BankaiCodeBlockConfig>;
  icon?: Partial<BankaiIconConfig>;
  i18n?: Partial<BankaiI18nConfig>;
};

const injectionKey: InjectionKey<BankaiConfig> = Symbol('bankai:config');

// Shared reactive defaults used when `createBankai` was not installed.
const fallbackConfig = reactive<BankaiConfig>(createDefaultConfig());

/**
 * Creates the bankai-vue plugin. Install it to configure the library app-wide,
 * e.g. `app.use(createBankai({ idGeneration: false }))`.
 * The config is provided per-app, so it is SSR-safe (no cross-request leakage).
 *
 * @param options - Overrides merged over the defaults. Each nested config group (`link`, `codeBlock`,
 *   `icon`, `i18n`) is merged one level deep, so a partial group keeps that group's untouched defaults.
 */
export function createBankai(options: BankaiConfigInput = {}): Plugin {
  const defaults = createDefaultConfig();
  const config = reactive<BankaiConfig>({
    ...defaults,
    ...options,
    // Each group is one level deep; a shallow spread would drop the untouched defaults, so merge each.
    // Explicit per-group merges (not a generic deepmerge) keep function/component leaf values — e.g.
    // `icon.class`, `link.component` — as opaque leaves rather than recursing into them.
    link: { ...defaults.link, ...options.link },
    codeBlock: { ...defaults.codeBlock, ...options.codeBlock },
    icon: { ...defaults.icon, ...options.icon },
    i18n: { ...defaults.i18n, ...options.i18n },
  });

  return {
    install(app: App): void {
      app.provide(injectionKey, config);
    },
  };
}

/**
 * Returns the reactive bankai-vue configuration for the current app.
 * Read its fields or assign to them to change behavior at runtime.
 * Falls back to the defaults when {@link createBankai} was not installed.
 * Must be called during a component's `setup`.
 */
export function useBankaiConfig(): BankaiConfig {
  return inject(injectionKey, fallbackConfig);
}
