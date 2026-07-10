<script lang="ts">
import type { VNode } from 'vue';

// The app-shell layer of the App › Layout › Page › Container structure (SPEC.md §5.6).
// BankaiLayout is a CSS-grid root that emits the app's native landmark regions — `<header>`,
// `<aside>`, `<main>`, `<footer>` — one per slot, so the document keeps a correct, unique-per-page
// landmark set for free. It is styled by `@bankai-vue/theme-bankai` (`components/layout.css`): the
// theme's `:where()` rules place `.bankai-layout` on a grid and assign each region to a named area,
// so a consumer's own CSS (or utility classes) targeting `.bankai-layout` / the `data-part`s override
// the default track sizing by ordinary specificity — no `!important` (SPEC.md §4.4, §4.6). There is
// deliberately **no `view`-string track DSL** (unlike Quasar `QLayout`): the consumer controls the
// grid tracks with plain CSS against the root class + `data-part`s.
//
// Its default slot is the SOLE emitter of `<main>`, so nothing nested inside (a `BankaiPage`,
// `BankaiContainer`, …) renders its own `<main>` — `<main>` must be unique per document. For the same
// reason `BankaiLayout` must not be nested inside another `BankaiLayout` (SPEC.md §5.6).

/**
 * Slots of a {@link BankaiLayout}. Each optional region slot is wrapped in its matching native
 * landmark element; a region is emitted only when its slot is provided, so an app with no sidebar
 * simply omits the `<aside>`. The `default` slot is always rendered — it is the sole `<main>`.
 */
export interface BankaiLayoutSlots {
  /**
   * Top region — wrapped in `<header data-part="header">` (the `banner` landmark).
   * Typically holds a navbar. Omitted from the DOM when not provided.
   */
  header?: () => VNode[];
  /**
   * Side region — wrapped in `<aside data-part="sidebar">` (the `complementary` landmark).
   * Typically holds a sidebar nav. Omitted from the DOM when not provided.
   */
  sidebar?: () => VNode[];
  /**
   * Bottom region — wrapped in `<footer data-part="footer">` (the `contentinfo` landmark).
   * Omitted from the DOM when not provided.
   */
  footer?: () => VNode[];
  /**
   * Main content region — wrapped in `<main data-part="main">` (the `main` landmark), always
   * rendered. The per-route host (`BankaiPage`) and content go here; nothing inside should render
   * its own `<main>` (landmark uniqueness).
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
/**
 * The persistent app shell. Renders a `.bankai-layout` CSS-grid `<div data-part="root">` that wraps
 * each provided slot in its native landmark region (`#header` → `<header>`, `#sidebar` → `<aside>`,
 * default → `<main>`, `#footer` → `<footer>`), so an application gets a correct, unique landmark set
 * without markup ceremony. Optional regions are omitted when their slot is absent; `<main>` always
 * renders and is the sole emitter of the `main` landmark. The grid track layout comes from
 * `@bankai-vue/theme-bankai`'s zero-specificity `:where()` rules, so consumer CSS/utility classes
 * targeting `.bankai-layout` override it by plain specificity (SPEC.md §4.4, §4.6). Consumer
 * `class`/`style`/attributes merge onto the root. The shell layer of App › Layout › Page › Container
 * (SPEC.md §5.6) — don't nest it inside another `BankaiLayout` (landmark uniqueness).
 */
defineOptions({ name: 'BankaiLayout', inheritAttrs: true });

const slots = defineSlots<BankaiLayoutSlots>();
</script>

<template>
  <div class="bankai-layout" data-part="root">
    <header v-if="slots.header" data-part="header">
      <slot name="header" />
    </header>
    <aside v-if="slots.sidebar" data-part="sidebar">
      <slot name="sidebar" />
    </aside>
    <main data-part="main">
      <slot />
    </main>
    <footer v-if="slots.footer" data-part="footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
