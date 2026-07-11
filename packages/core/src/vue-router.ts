import type { RouteLocationRaw } from 'vue-router';

// Opt-in types augmentation: reference this entry (e.g. `tsconfig.json` → `compilerOptions.types:
// ["@bankai-vue/core/vue-router"]`, or a one-off `/// <reference types="@bankai-vue/core/vue-router" />`)
// to type `BankaiLink`'s `to` prop as vue-router's `RouteLocationRaw` instead of the router-agnostic
// fallback. It is intentionally NOT re-exported from the barrel: a router-free consumer never loads it, so
// core stays dependency-free and type-checks under `skipLibCheck: false` with no `vue-router` installed.
//
// `BankaiLinkTypeRegistry` is a GLOBAL interface (see `./components/link/registry`), so this merges by name
// in global scope — surviving the type-bundling that would break a module-scoped augmentation.
declare global {
  interface BankaiLinkTypeRegistry {
    /** vue-router navigation target — see `BankaiLink`'s `to` prop. */
    to: RouteLocationRaw;
  }
}
