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
   * Overrides the resolved `codeBlock.copy` message for this block; unset, it resolves through the
   * global i18n config ({@link BankaiI18nConfig}), defaulting to the English `'Copy'`.
   *
   * @default 'Copy'
   */
  copyLabel?: string;
  /**
   * The button's label text after a successful copy (when the `copy` slot is not used) and the message
   * announced by the `role="status"` live region. Overrides the resolved `codeBlock.copied` message
   * for this block; unset, it resolves through the global i18n config ({@link BankaiI18nConfig}),
   * defaulting to the English `'Copied'`.
   *
   * @default 'Copied'
   */
  copiedLabel?: string;
  /**
   * How long (ms) the copy button stays in its "copied" state after a successful copy before reverting
   * to idle. Overrides the global `codeBlock.copiedDuration` config ({@link BankaiConfig}) for this block.
   *
   * @default 2000
   */
  copiedDuration?: number;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs } from 'vue';
import { useBankaiMessage } from '../../composables/useBankaiMessage';
import { useBankaiConfig } from '../../config';
import BankaiButton from '../button/BankaiButton.vue';

const {
  code,
  language,
  copyable = true,
  copyLabel,
  copiedLabel,
  copiedDuration,
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
const config = useBankaiConfig();
const messages = useBankaiMessage();

// Label precedence: per-instance prop → resolved locale bundle → English default (via `messages`).
// `??` (not `||`) so an explicit empty-string prop is honored rather than falling back.
const resolvedCopyLabel = computed<string>(() => copyLabel ?? messages.value.codeBlock.copy);
const resolvedCopiedLabel = computed<string>(() => copiedLabel ?? messages.value.codeBlock.copied);

// The de-facto highlighter hook: `language-<lang>` on the `<code>` (Prism/highlight.js read it), absent
// when no language is set so the DOM stays clean.
const languageClass = computed<string | undefined>(() =>
  language ? `language-${language}` : undefined,
);

const copied = ref(false);

// The `role="status"` live-region text, driven imperatively rather than as a `computed` mirror of
// `copied`. A computed would yield byte-identical text on a repeat copy within the window — no DOM
// mutation, so assistive tech would stay silent on the second copy. Snapshotting `copiedLabel` at copy
// time (rather than reading it reactively) also keeps a mid-window prop change from re-announcing.
const announcement = ref('');
let resetTimer: ReturnType<typeof setTimeout> | undefined;

// Presence flag (empty string on, absent off) so the theme can match `[data-bankai-copied]` regardless
// of value; Vue drops the attribute when the value is `undefined`.
const dataCopied = computed<'' | undefined>(() => (copied.value ? '' : undefined));

async function handleCopy(): Promise<void> {
  try {
    // The `code` prop is the exact clipboard source — independent of whatever the default slot renders.
    await navigator.clipboard.writeText(code);
    copied.value = true;
    // Re-announce on every copy, including a repeat within the window: clear the region, then set it on
    // the next tick so the text node genuinely changes and `role="status"` speaks it again.
    announcement.value = '';
    await nextTick();
    announcement.value = resolvedCopiedLabel.value;
    if (resetTimer) {
      clearTimeout(resetTimer);
    }
    // Per-instance `copiedDuration` overrides the global config; `??` (not `||`) so an explicit `0`
    // (revert on the next tick) is honored rather than falling back to the default.
    resetTimer = setTimeout(() => {
      copied.value = false;
      announcement.value = '';
    }, copiedDuration ?? config.codeBlock.copiedDuration);
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
      <!-- `aria-label` gives the button an accessible name even when the `copy` slot renders only an
        icon, and tracks the visible label so the accessible name matches it (WCAG 2.5.3 Label in Name);
        the copy is also announced via the `role="status"` region below. -->
      <BankaiButton
        class="bankai-code-block-copy"
        variant="ghost"
        size="sm"
        :aria-label="copied ? resolvedCopiedLabel : resolvedCopyLabel"
        @click="handleCopy"
      >
        <slot name="copy" :copied="copied">{{
          copied ? resolvedCopiedLabel : resolvedCopyLabel
        }}</slot>
      </BankaiButton>
      <span data-part="status" role="status" aria-live="polite">{{ announcement }}</span>
    </div>
  </div>
</template>
