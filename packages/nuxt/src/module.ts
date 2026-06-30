import { defineNuxtModule } from "@nuxt/kit";

export interface ModuleOptions {}

/**
 * First-party Nuxt module for bankai-vue (SPEC.md §4.12).
 *
 * Stub: the real module will provide SSR-safe registration and auto-imports for
 * `@bankai-vue/core` across SSR / SSG / client-only modes. No wiring yet.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bankai-vue/nuxt",
    configKey: "bankaiVue",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  defaults: {},
  setup() {
    // Placeholder — component registration / auto-imports land in a later step.
  },
});
