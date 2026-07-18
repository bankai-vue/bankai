<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-app` class + `data-part="root"`.
// The infra singleton at the root of an application (à la Nuxt UI `UApp` / Vuetify `v-app`, SPEC.md
// §5.6): the outermost layer of the App › Layout › Page › Container structure. It renders a plain `<div>`
// and is deliberately NOT a landmark.
//
// It lands THIN today: its one concrete job is the embedded-mode theme SURFACE. The accompanying
// theme `:where()` rule carries `color-scheme` + the foundation `--bankai-color-bg`/`-fg` tokens on the
// App's OWN box, so a bankai island dropped into a foreign page is self-contained — it paints the house
// light/dark surface for its subtree without relying on the global `html` page-surface paint (which an
// embedded consumer can sever; see the themes' `base.css`).
//
// The richer infra role — a single overlay/portal mount target + toast host + app-config context — is
// deferred to foundation F1 (the overlay core), when the overlay root it would provide first has
// consumers; there is nothing to mount yet, so shipping it now would be speculative (SPEC.md §5.6).
//
// SINGLETON at the root: those future services will be `provide/inject`, so App-in-App nesting would
// silently shadow the outer's host — ancestor/descendant nesting is discouraged, but SIDE-BY-SIDE is
// legitimate (embedded micro-frontends, split-screen). The thin surface-only landing carries no such
// state yet, so no runtime guard is wired today.

/**
 * Slots of a {@link BankaiApp}.
 */
export interface BankaiAppSlots {
  /**
   * The whole application — typically a `BankaiLayout` (or a standalone region shell) and its routes.
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * The infra singleton at the root of an application. Renders a plain
 * `<div class="bankai-app" data-part="root">` — the outermost layer of App › Layout › Page › Container
 * and deliberately NOT a landmark. Its accompanying `@bankai-vue/theme-bankai` `:where()` rule carries
 * `color-scheme` + the foundation surface tokens on the App's own box, so an embedded bankai island is a
 * self-contained light/dark surface without the global `html` page paint. Merges consumer
 * `class`/`style`/attributes onto the root; ships no CSS.
 *
 * Lands thin by design (SPEC.md §5.6): the overlay/portal root, toast host and app-config context are
 * deferred to foundation F1, when the overlay core first gives them consumers. Singleton at the root —
 * side-by-side is fine (embedded / split-screen), ancestor/descendant App-in-App nesting is discouraged.
 */
defineOptions({ name: 'BankaiApp', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't
// be clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiAppSlots>();
</script>

<template>
  <div v-bind="attrs" class="bankai-app" data-part="root"><slot /></div>
</template>
