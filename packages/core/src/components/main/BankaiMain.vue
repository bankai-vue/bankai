<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-main` class + `data-part="root"`.
// A standalone `<main>` content region — the primary content of the document. It renders the native
// `<main>` element so the `main` landmark is carried by the element itself (SPEC.md §4.9); BankaiMain
// adds the themeable `bankai-main` hook (a content-region overflow-floor; no padding — that is
// `BankaiContainer`'s job — and no background, since it IS the page surface).
//
// The `main` landmark must be UNIQUE per document — so a page has exactly one `<main>`, and it takes no
// accessible-name prop (unlike `BankaiAside`, of which there can be several). `BankaiLayout`'s default
// slot already emits the sole `<main>`, so DON'T put a `BankaiMain` inside a `BankaiLayout` (it would
// nest `<main>` in `<main>`, a duplicate `main` landmark). Reach for `BankaiMain` when you build a shell
// WITHOUT `BankaiLayout`.

/**
 * Slots of a {@link BankaiMain}.
 */
export interface BankaiMainSlots {
  /**
   * The document's primary content — typically a `BankaiPage` / `BankaiContainer` and the page body.
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * A standalone `<main>` content region. Renders a native
 * `<main class="bankai-main" data-part="root">` so the element carries the (unique) `main` landmark;
 * the accompanying `@bankai-vue/theme-bankai` `:where()` rule floors its min inline size at `0` so wide
 * content shrinks with its container instead of forcing horizontal overflow, which a consumer's utility
 * classes override by plain specificity (SPEC.md §4.4, §4.6). Merges consumer `class`/`style`/attributes
 * onto the root; ships no CSS.
 *
 * For a shell built WITHOUT `BankaiLayout` — do not place it inside a `BankaiLayout`, whose default slot
 * already emits the sole `<main>` (landmark uniqueness).
 */
defineOptions({ name: 'BankaiMain', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't
// be clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiMainSlots>();
</script>

<template>
  <main v-bind="attrs" class="bankai-main" data-part="root"><slot /></main>
</template>
