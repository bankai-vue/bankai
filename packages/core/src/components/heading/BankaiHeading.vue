<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed part (`data-part`, the `bankai-heading` class) and the reflected
// level (`data-bankai-level`). The rendered element is always a native `<h1>`–`<h6>` (never polymorphic),
// so the tag itself carries the document-outline semantics screen readers navigate by (SPEC.md §4.9, §4.16).
//
// `level` is REQUIRED and has no default: there is no universally-safe heading level, and a wrong one
// silently breaks the document outline (a screen-reader navigation defect). Forcing the author to state
// the level is the accessibility-first stance.
//
// Visual size tracks the semantic level in v1. Decoupling the two (an `<h2>` that looks like an `<h1>`,
// the fix for "skipped a level to get the size I wanted") is deferred to a `size` prop — a non-breaking
// addition when dogfooding needs it (ROADMAP).

/**
 * Heading level of a {@link BankaiHeading} — `1`–`6`, rendered as the matching native `<h1>`–`<h6>`.
 * Drives both the document-outline semantics (screen-reader navigation) and, in v1, the visual size.
 */
export type BankaiHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Slots of a {@link BankaiHeading}.
 */
export interface BankaiHeadingSlots {
  /**
   * Heading content.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiHeading}.
 */
export interface BankaiHeadingProps {
  /**
   * Heading level `1`–`6` → renders the native `<h1>`–`<h6>` and reflects `data-bankai-level`.
   * Required — there is no safe default heading level, and a wrong one breaks the document outline
   * assistive tech navigates by, so the level is always an explicit, deliberate choice.
   */
  level: BankaiHeadingLevel;
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const { level } = defineProps<BankaiHeadingProps>();

/**
 * A native heading. `level` selects the `<h1>`–`<h6>` element (the document-outline semantics assistive
 * tech navigates by) and is reflected on the root as `data-bankai-level`; the accompanying
 * `@bankai-vue/theme-bankai` `:where()` rules paint the per-level type styles keyed on it — so a
 * consumer's utility classes override them by plain specificity (SPEC.md §4.4, §4.6).
 * Exposes a `bankai-heading` class plus `data-part="root"`, and merges consumer `class`/`style`/attributes
 * onto the root; ships no CSS of its own.
 */
defineOptions({ name: 'BankaiHeading', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part` and the
// reflected `data-bankai-level` can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6).
// `class`/`style` still merge, so consumer utility classes keep overriding the theme by ordinary specificity.
const attrs = useAttrs();

// The native element mirrors the level 1:1 (`level` 2 → `<h2>`), so the tag itself carries the outline
// semantics — the theme keys its type styles off the reflected `data-bankai-level`, not the tag name.
const tag = computed(() => `h${level}`);

defineSlots<BankaiHeadingSlots>();
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="bankai-heading"
    data-part="root"
    :data-bankai-level="level"
  >
    <slot />
  </component>
</template>
