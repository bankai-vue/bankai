<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-footer` class + `data-part="root"`.
// A standalone `<footer>` contentinfo region — the foot of the page (copyright, secondary links, meta).
// It renders the native `<footer>` element so the `contentinfo` landmark is carried by the element
// itself (SPEC.md §4.9); BankaiFooter only adds the themeable `bankai-footer` hook (the house foot look —
// inline/block padding + a top border, the mirror of `BankaiHeader`'s bottom border).
//
// `<footer>` is the `contentinfo` landmark ONLY when it is NOT nested inside `<article>`/`<aside>`/
// `<main>`/`<nav>`/`<section>` — so this standalone version is for a top-level page footer. `BankaiLayout`
// already emits its own `<footer>` for the `#footer` slot, so DON'T put a `BankaiFooter` inside that slot
// (it would nest `<footer>` in `<footer>` → a duplicate `contentinfo` landmark). Reach for `BankaiFooter`
// when you build a shell WITHOUT `BankaiLayout`.

/**
 * Slots of a {@link BankaiFooter}.
 */
export interface BankaiFooterSlots {
  /**
   * Footer content — typically copyright, secondary navigation, or site meta.
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * A standalone `<footer>` contentinfo region. Renders a native
 * `<footer class="bankai-footer" data-part="root">` so the element carries the `contentinfo` landmark;
 * the accompanying `@bankai-vue/theme-bankai` `:where()` rules give it the house foot look (inline/block
 * padding + a top border), which a consumer's utility classes override by plain specificity (SPEC.md
 * §4.4, §4.6). Merges consumer `class`/`style`/attributes onto the root; ships no CSS.
 *
 * The foot layer of a shell built WITHOUT `BankaiLayout` — do not place it inside `BankaiLayout`'s
 * `#footer` slot, which already emits a `<footer>` (landmark uniqueness).
 */
defineOptions({ name: 'BankaiFooter', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't
// be clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiFooterSlots>();
</script>

<template>
  <footer v-bind="attrs" class="bankai-footer" data-part="root"><slot /></footer>
</template>
