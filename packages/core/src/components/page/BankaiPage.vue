<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-page` class + `data-part="root"`.
// The per-route content host — the box you put at the top of every route file (the "every route starts
// with <BankaiPage>" DX convention, SPEC.md §5.6). It renders a plain `<div>` and is deliberately NOT a
// landmark: `BankaiLayout`'s default slot (or a standalone `BankaiMain`) already emits the sole `<main>`,
// so `BankaiPage` sits INSIDE that `<main>` and hosts the route content — it must never render its own
// `<main>` (landmark uniqueness).
//
// It lands thin: its one house default is a min-block-size fill so a short route still occupies the full
// content region (see `theme-bankai/components/page.css`). It owns NO implicit child-rewriting — no auto
// heading-level context, no magic (SPEC.md §5.6, §4.16); `BankaiHeading` levels stay explicit via `:level`.
// Per-route scroll and route-transition concerns are deferred until there is real routing to dogfood.
//
// Width/gutter is `BankaiContainer`'s job and page-content layout is `BankaiGrid`/`BankaiFlex`'s — a Page
// carries neither. The typical nesting is: Layout (or Main) › Page › Container › content.

/**
 * Slots of a {@link BankaiPage}.
 */
export interface BankaiPageSlots {
  /**
   * The route's content — typically a `BankaiContainer` (or several, at different widths) and the page body.
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * The per-route content host. Renders a plain `<div class="bankai-page" data-part="root">` that sits
 * inside the document's `<main>` (emitted by `BankaiLayout`'s default slot or a standalone `BankaiMain`)
 * and hosts a route's content — it is deliberately NOT a landmark and never renders its own `<main>`
 * (landmark uniqueness). The accompanying `@bankai-vue/theme-bankai` `:where()` rule fills the content
 * region (a `min-block-size` floor) so a short route still pushes a footer down, which a consumer's
 * utility classes override by plain specificity (SPEC.md §4.4, §4.6). Merges consumer
 * `class`/`style`/attributes onto the root; ships no CSS.
 *
 * Lands thin by design (SPEC.md §5.6): per-route scroll and route-transition concerns are deferred until
 * there is routing to dogfood, and it does NO implicit child-rewriting (no auto heading-levels — levels
 * stay explicit on `BankaiHeading`). The per-route layer of App › Layout › Page › Container.
 */
defineOptions({ name: 'BankaiPage', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't
// be clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiPageSlots>();
</script>

<template>
  <div v-bind="attrs" class="bankai-page" data-part="root"><slot /></div>
</template>
