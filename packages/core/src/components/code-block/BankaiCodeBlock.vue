<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-code-block` class + the `data-part`s
// (`root`/`pre`/`code`/`copy`/`status`) and the reflected `data-bankai-copied` state.
// The block, fenced counterpart to the inline `BankaiCode`: it renders a native `<pre><code>` so the
// block-code semantics live on the elements themselves (SPEC.md §4.9), and layers on a copy-to-clipboard
// button (composed from `BankaiButton`) with an accessible `role="status"` live region announcing the copy.
// Core highlights nothing (design-agnostic, SPEC.md §4.6): the `code` string renders verbatim as text, and
// the `language` prop is reflected as the de-facto `language-<lang>` class on the `<code>` so a consumer's
// BYO highlighter (Shiki, Prism, highlight.js) or CSS can key off it. To render already-highlighted markup,
// pass it through the default slot — the `code` prop stays the exact string the copy button writes.

/**
 * Slots of a {@link BankaiCodeBlock}.
 */
export interface BankaiCodeBlockSlots {
  /**
   * Rendered code body — an escape hatch for pre-highlighted markup (e.g. a BYO highlighter's output).
   * When omitted, the raw `code` prop renders verbatim as text. Either way the copy button writes the
   * `code` prop, so the copied text stays exact regardless of what is rendered.
   */
  default?: () => VNode[];
  /**
   * Copy-button content. Receives the current `copied` state so a consumer can swap label/icon. When
   * omitted, the button shows the `copyLabel` / `copiedLabel` text.
   */
  copy?: (props: { copied: boolean }) => VNode[];
}

/**
 * Props for {@link BankaiCodeBlock}.
 */
export interface BankaiCodeBlockProps {
  /**
   * The code as a string. It is the source of truth for the clipboard (the copy button writes exactly
   * this) and, when the default slot is not used, the text rendered inside the `<code>`.
   */
  code: string;
  /**
   * Language identifier. Reflected verbatim as the `language-<language>` class on the `<code>` — the
   * de-facto convention a BYO syntax highlighter (Shiki, Prism, highlight.js) or CSS keys off. Core
   * itself highlights nothing.
   */
  language?: string;
  /**
   * Render the copy-to-clipboard button (and its `role="status"` live region). Set `false` to omit it.
   *
   * @default true
   */
  copyable?: boolean;
  /**
   * The copy button's accessible name and its idle label text (when the `copy` slot is not used).
   *
   * @default 'Copy'
   */
  copyLabel?: string;
  /**
   * The button's label text after a successful copy (when the `copy` slot is not used) and the message
   * announced by the `role="status"` live region. Overriding both labels localizes the component with no
   * extra config surface.
   *
   * @default 'Copied'
   */
  copiedLabel?: string;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue';
import BankaiButton from '../button/BankaiButton.vue';

const {
  code,
  language,
  copyable = true,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
} = defineProps<BankaiCodeBlockProps>();

/**
 * A block code primitive: a native `<pre><code class="bankai-code-block" data-part="root">` plus an
 * optional copy-to-clipboard button (composed from `BankaiButton`) that announces success through a
 * `role="status"` live region. Core ships no CSS and highlights nothing — the `code` prop renders
 * verbatim (or pass pre-highlighted markup through the default slot), and `language` reflects as the
 * `language-<lang>` class on the `<code>` for a BYO highlighter. Exposes `data-part` hooks
 * (`pre`/`code`/`copy`/`status`), reflects the transient `data-bankai-copied` state, and merges consumer
 * `class`/`style`/attributes onto the root (SPEC.md §4.4, §4.6). Distinct from the inline `BankaiCode`.
 */
defineOptions({ name: 'BankaiCodeBlock', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part`/
// `data-bankai-copied` can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6). `class`/`style`
// still merge. Attrs land on the root only; the composed `BankaiButton` keeps its own anatomy.
const attrs = useAttrs();

// The de-facto highlighter hook: `language-<lang>` on the `<code>` (Prism/highlight.js read it), absent
// when no language is set so the DOM stays clean.
const languageClass = computed<string | undefined>(() =>
  language ? `language-${language}` : undefined,
);

// How long the "copied" feedback (button label swap + `data-bankai-copied` + the announced status)
// persists before reverting to the idle state.
const COPIED_RESET_MS = 2000;

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

// Presence flag (empty string on, absent off) so the theme can match `[data-bankai-copied]` regardless
// of value; Vue drops the attribute when the value is `undefined`.
const dataCopied = computed<'' | undefined>(() => (copied.value ? '' : undefined));

// The live-region message: the `copiedLabel` once copied (which fires the `role="status"` announcement),
// empty otherwise. Reverts when `copied` is reset, clearing the region.
const statusMessage = computed<string>(() => (copied.value ? copiedLabel : ''));

async function handleCopy(): Promise<void> {
  try {
    // The `code` prop is the exact clipboard source — independent of whatever the default slot renders.
    await navigator.clipboard.writeText(code);
    copied.value = true;
    if (resetTimer) {
      clearTimeout(resetTimer);
    }
    resetTimer = setTimeout(() => {
      copied.value = false;
    }, COPIED_RESET_MS);
  } catch {
    // Clipboard API unavailable (insecure context) or permission denied — leave the idle state, so the
    // component never claims a copy that did not happen.
  }
}

onBeforeUnmount(() => {
  if (resetTimer) {
    clearTimeout(resetTimer);
  }
});

defineSlots<BankaiCodeBlockSlots>();
</script>

<template>
  <div v-bind="attrs" class="bankai-code-block" data-part="root" :data-bankai-copied="dataCopied">
    <!-- No whitespace between `<pre>`/`<code>`/content: `<pre>` preserves it, so a stray newline would
      render as a blank line in the snippet. -->
    <pre
      data-part="pre"
    ><code data-part="code" :class="languageClass"><slot>{{ code }}</slot></code></pre>
    <div v-if="copyable" data-part="copy">
      <!-- `aria-label` gives the button a stable accessible name even when the `copy` slot renders an
        icon; the copy result is announced separately via the `role="status"` region below (so the
        button's name doesn't churn on every copy). -->
      <BankaiButton
        class="bankai-code-block-copy"
        variant="ghost"
        size="sm"
        :aria-label="copyLabel"
        @click="handleCopy"
      >
        <slot name="copy" :copied="copied">{{ copied ? copiedLabel : copyLabel }}</slot>
      </BankaiButton>
      <span data-part="status" role="status" aria-live="polite">{{ statusMessage }}</span>
    </div>
  </div>
</template>
