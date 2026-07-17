<script lang="ts">
import type { VNode } from 'vue';

// The app-shell layer of the App › Layout › Page › Container structure (SPEC.md §5.6).
// BankaiLayout is a CSS-grid root that COMPOSES the standalone region components — `BankaiHeader`,
// `BankaiAside`, `BankaiMain`, `BankaiFooter` — one per slot, so the document keeps a correct,
// unique-per-page landmark set (`<header>`/`<aside>`/`<main>`/`<footer>`) for free AND the regions
// carry the same house paint they get standalone. It is styled by `@bankai-vue/theme-bankai`
// (`components/layout.css`): the theme's `:where()` rules place `.bankai-layout` on a grid and assign
// each region to a named area BY ITS CLASS (`.bankai-header` → `header`, …), so a consumer's own CSS
// (or utility classes) targeting `.bankai-layout` / the region classes override the default track
// sizing by ordinary specificity — no `!important` (SPEC.md §4.4, §4.6). There is deliberately **no
// `view`-string track DSL** (unlike Quasar `QLayout`): the consumer controls the grid tracks with
// plain CSS against the root class + the region classes.
//
// Its default slot is the SOLE emitter of `<main>` (via `BankaiMain`), so nothing nested inside (a
// `BankaiPage`, `BankaiContainer`, …) renders its own `<main>` — `<main>` must be unique per document.
// For the same reason `BankaiLayout` must not be nested inside another `BankaiLayout` (SPEC.md §5.6),
// and a consumer must not drop a `BankaiHeader`/`BankaiAside`/`BankaiFooter` into the matching slot
// (the slot is already wrapped in that region — it would duplicate the landmark).

/**
 * Slots of a {@link BankaiLayout}. Each optional region slot is wrapped in its matching region
 * component; a region is emitted only when its slot is provided, so an app with no sidebar simply
 * omits the `<aside>`. The `default` slot is always rendered — it is the sole `<main>`.
 */
export interface BankaiLayoutSlots {
  /**
   * Top region — wrapped in a `BankaiHeader` (`<header class="bankai-header">`, the `banner`
   * landmark). Typically holds a navbar. Omitted from the DOM when not provided.
   */
  header?: () => VNode[];
  /**
   * Side region — wrapped in a `BankaiAside` (`<aside class="bankai-aside">`, the `complementary`
   * landmark). Typically holds a sidebar nav. Omitted from the DOM when not provided.
   */
  sidebar?: () => VNode[];
  /**
   * Bottom region — wrapped in a `BankaiFooter` (`<footer class="bankai-footer">`, the `contentinfo`
   * landmark). Omitted from the DOM when not provided.
   */
  footer?: () => VNode[];
  /**
   * Main content region — wrapped in a `BankaiMain` (`<main class="bankai-main">`, the `main`
   * landmark), always rendered. The per-route host (`BankaiPage`) and content go here; nothing inside
   * should render its own `<main>` (landmark uniqueness).
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import BankaiAside from '../aside/BankaiAside.vue';
import BankaiFooter from '../footer/BankaiFooter.vue';
import BankaiHeader from '../header/BankaiHeader.vue';
import BankaiMain from '../main/BankaiMain.vue';

/**
 * The persistent app shell. Renders a `.bankai-layout` CSS-grid `<div data-part="root">` that wraps
 * each provided slot in its region component (`#header` → `BankaiHeader`, `#sidebar` → `BankaiAside`,
 * default → `BankaiMain`, `#footer` → `BankaiFooter`), so an application gets a correct, unique
 * landmark set — and the house region paint — without markup ceremony. Optional regions are omitted
 * when their slot is absent; `BankaiMain` always renders and is the sole emitter of the `main`
 * landmark. The grid track layout comes from `@bankai-vue/theme-bankai`'s zero-specificity `:where()`
 * rules keyed on the region classes, so consumer CSS/utility classes targeting `.bankai-layout` (or a
 * region class) override it by plain specificity (SPEC.md §4.4, §4.6). Consumer `class`/`style`/
 * attributes merge onto the root. The shell layer of App › Layout › Page › Container (SPEC.md §5.6) —
 * don't nest it inside another `BankaiLayout`, and don't drop a region component into its own slot
 * (landmark uniqueness).
 */
defineOptions({ name: 'BankaiLayout', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part` can't be
// clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge. Attrs
// land on the root only; the child region components keep their own anatomy.
const attrs = useAttrs();

const slots = defineSlots<BankaiLayoutSlots>();
</script>

<template>
  <div v-bind="attrs" class="bankai-layout" data-part="root">
    <BankaiHeader v-if="slots.header">
      <slot name="header" />
    </BankaiHeader>
    <BankaiAside v-if="slots.sidebar">
      <slot name="sidebar" />
    </BankaiAside>
    <BankaiMain>
      <slot />
    </BankaiMain>
    <BankaiFooter v-if="slots.footer">
      <slot name="footer" />
    </BankaiFooter>
  </div>
</template>
