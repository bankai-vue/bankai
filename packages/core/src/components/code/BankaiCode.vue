<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-code` class + `data-part="root"`.
// A minimal inline-code primitive — it renders a native `<code>` so the phrasing semantics are carried by
// the element itself (SPEC.md §4.9); BankaiCode only adds the themeable `bankai-code` hook (a monospace
// font + a subtle chip background). Distinct from the future block `BankaiCodeBlock` (fenced `<pre><code>`
// + copy button, ROADMAP). No props today; a polymorphic `as` (to reach the sibling monospace phrasing
// elements `<kbd>`/`<samp>`/`<var>`) is a possible non-breaking addition later if dogfooding wants it.

/**
 * Slots of a {@link BankaiCode}.
 */
export interface BankaiCodeSlots {
  /**
   * Inline code content — an identifier, token, path, or short snippet.
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * A minimal inline code primitive. Renders a native `<code class="bankai-code" data-part="root">` so the
 * element carries the phrasing semantics; the accompanying `@bankai-vue/theme-bankai` `:where()` rule gives
 * it a monospace font and a subtle chip background, which a consumer's utility classes override by plain
 * specificity (SPEC.md §4.4, §4.6). Merges consumer `class`/`style`/attributes onto the root; ships no CSS.
 */
defineOptions({ name: 'BankaiCode', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't be
// clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiCodeSlots>();
</script>

<template>
  <code v-bind="attrs" class="bankai-code" data-part="root"><slot /></code>
</template>
