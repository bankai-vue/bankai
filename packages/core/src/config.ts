import type { App, Component, InjectionKey, Plugin } from 'vue';
import { inject, reactive } from 'vue';

/**
 * Global configuration for bankai-vue.
 * Set initial values with {@link createBankai}; read or mutate at runtime with {@link useBankaiConfig}.
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
   * Component `BankaiLink` renders for internal (`to`) navigation. Leave unset to auto-detect the
   * router link: a globally-registered `NuxtLink` (preferred, under Nuxt), else `RouterLink` (vue-router),
   * else a plain `<a>`. Set this only to force a specific component when auto-detection is insufficient
   * (e.g. a custom router link, or SSR contexts where the global registration is unavailable at resolve time).
   *
   * @default undefined
   */
  linkComponent?: Component | string;
  /**
   * Whether `BankaiLink` auto-adds `rel="noopener noreferrer"` to a `target="_blank"` link (a security
   * default: without it the opened page can reach back through `window.opener`). A consumer-provided `rel`
   * always wins. Set `false` to opt out globally.
   *
   * @default true
   */
  linkNoopener: boolean;
}

function createDefaultConfig(): BankaiConfig {
  return { idGeneration: true, linkNoopener: true };
}

const injectionKey: InjectionKey<BankaiConfig> = Symbol('bankai:config');

// Shared reactive defaults used when `createBankai` was not installed.
const fallbackConfig = reactive<BankaiConfig>(createDefaultConfig());

/**
 * Creates the bankai-vue plugin. Install it to configure the library app-wide,
 * e.g. `app.use(createBankai({ idGeneration: false }))`.
 * The config is provided per-app, so it is SSR-safe (no cross-request leakage).
 *
 * @param options - Overrides merged over the defaults.
 */
export function createBankai(options: Partial<BankaiConfig> = {}): Plugin {
  const config = reactive<BankaiConfig>({ ...createDefaultConfig(), ...options });

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
