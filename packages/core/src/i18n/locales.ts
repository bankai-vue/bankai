// Named-export barrel for the shipped locale bundles — the ergonomic entry point
// (`import { de } from '@bankai-vue/core/locales'`). Named exports from this ESM barrel tree-shake,
// so registering one locale never pulls the others into a build. Each bundle also has its own
// subpath (`@bankai-vue/core/locales/de`) for a default import.
export { default as de } from './locales/de';
export { enMessages as en } from './en';

/**
 * The locale codes bankai-vue ships a built-in bundle for (English is the always-present base, so it
 * is not listed here). The Nuxt module reads this to know which locales it can auto-inject from a
 * configured `locale`/`fallbackLocale`.
 */
export const availableLocales = ['de'] as const;
