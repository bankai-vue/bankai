import type { BankaiConfigInput } from '@bankai-vue/core';

// Pure logic for the generated `createBankai` plugin — locale auto-injection + the plugin file text.
// No I/O and no node-only imports (unlike `module.ts`), so it is unit-testable in isolation: the module
// hands it the build-time `config` and core's `availableLocales`, and installs the returned string via
// `addPluginTemplate`. Mirrors the `discover.ts` split.

/**
 * Expands a locale into itself plus its broader parents (`de-AT` → `['de', 'de-AT']`), mirroring core's
 * resolution (`resolve.ts`): a regional locale can be satisfied by its base-language bundle. Order does
 * not matter here — the result only feeds a membership check. An empty/undefined locale expands to `[]`.
 */
function localeChain(locale: string | undefined): string[] {
  if (locale === undefined) {
    return [];
  }

  const parts = locale.split('-').filter((part) => part.length > 0);
  return parts.map((_, index) => parts.slice(0, index + 1).join('-'));
}

/**
 * The identifier a locale's injected import binds to (`de` → `bankaiLocale_de`, `de-AT` →
 * `bankaiLocale_de_AT`). `-` is not valid in an identifier, so it becomes `_`.
 */
function localeVar(code: string): string {
  return `bankaiLocale_${code.replaceAll('-', '_')}`;
}

/**
 * The built-in locale bundles to auto-inject for a Nuxt config: every `available` (core-shipped) locale
 * that the configured `locale`/`fallbackLocale` (or a regional parent) needs but the consumer has not
 * already registered in `messages`. A consumer's own bundle for a locale therefore always wins — it is
 * excluded here, so the injected import never overwrites it.
 *
 * @param config - The module's build-time `bankai.config`.
 * @param available - Locale codes core ships a bundle for (`availableLocales` from `@bankai-vue/core/locales`).
 */
export function localesToInject(
  config: BankaiConfigInput,
  available: ReadonlyArray<string>,
): string[] {
  const i18n = config.i18n;
  if (i18n === undefined) {
    return [];
  }

  const wanted = new Set([...localeChain(i18n.locale), ...localeChain(i18n.fallbackLocale)]);
  const registered = i18n.messages ?? {};

  return available.filter((code) => wanted.has(code) && !Object.hasOwn(registered, code));
}

const STATIC_IMPORTS = [
  "import { createBankai } from '@bankai-vue/core';",
  "import { defineNuxtPlugin } from '#app';",
];

/**
 * Builds the `createBankai` config argument as a JS expression, splicing the injected locale bundles
 * (module identifiers — not serializable) into `i18n.messages` alongside the consumer's own serializable
 * config. The consumer's registered `messages` are spread first; the injected entries never collide with
 * them (see {@link localesToInject}).
 */
function renderConfigArg(config: BankaiConfigInput, injected: ReadonlyArray<string>): string {
  if (injected.length === 0) {
    return JSON.stringify(config);
  }

  const { i18n = {}, ...rest } = config;
  const { messages = {}, ...i18nRest } = i18n;
  const messageParts = [
    ...(Object.keys(messages).length > 0 ? [`...${JSON.stringify(messages)}`] : []),
    ...injected.map((code) => `${JSON.stringify(code)}: ${localeVar(code)}`),
  ];

  return `{ ...${JSON.stringify(rest)}, i18n: { ...${JSON.stringify(i18nRest)}, messages: { ${messageParts.join(', ')} } } }`;
}

/**
 * Renders the generated Nuxt plugin that installs `createBankai` per app (SSR-safe, per-request config).
 * Adds a static `import` for each auto-injected locale bundle — static so the bundle is tree-shaken to
 * only the configured locale and resolves synchronously (no SSR hydration flash a dynamic import would
 * cause). With no injected locales the output is the plain serialized config.
 */
export function renderPluginContents(
  config: BankaiConfigInput,
  injected: ReadonlyArray<string>,
): string {
  const imports = [
    ...STATIC_IMPORTS,
    ...injected.map((code) => `import ${localeVar(code)} from '@bankai-vue/core/locales/${code}';`),
  ];

  return [
    ...imports,
    '',
    'export default defineNuxtPlugin((nuxtApp) => {',
    `  nuxtApp.vueApp.use(createBankai(${renderConfigArg(config, injected)}));`,
    '});',
    '',
  ].join('\n');
}
