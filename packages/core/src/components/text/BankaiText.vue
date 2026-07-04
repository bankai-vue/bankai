<script lang="ts">
import type { LiteralUnion } from '../../internal/types';
import type { CSSProperties, VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-text` class) and the reflected state (`data-size`, `data-weight`, `data-tone`, `data-truncate`).
// Inline text semantics (`<strong>`, `<em>`, `<mark>`, `<code>`, `<kbd>`, `<del>`, …) are reached through the polymorphic `as` prop, so the native element carries the meaning (SPEC.md §4.9); BankaiText only styles it.
// Each styling prop is a named set plus an escape hatch: a named member reflects as `data-*` (the theme maps it to a value), while any other value is carried verbatim on a `--bankai-text-*` custom property that the theme's zero-specificity base rule applies — so the value still lands at a specificity a consumer's utility class can override (SPEC.md §4.4, §4.6).

/**
 * Non-interactive phrasing (text-level) elements a {@link BankaiText} can render as — the curated set
 * `as` suggests: generic `'span'` plus the inline text semantics (`'strong'`, `'em'`, `'mark'`, `'code'`,
 * `'kbd'`, `'del'`, …). Excludes flow/block elements, interactive phrasing (`'a'`, `'button'` — those
 * have dedicated components), headings/paragraphs, and void elements, none of which fit a text primitive.
 */
export type BankaiTextElement =
  | 'span'
  | 'strong'
  | 'em'
  | 'b'
  | 'i'
  | 'u'
  | 's'
  | 'small'
  | 'mark'
  | 'code'
  | 'kbd'
  | 'samp'
  | 'var'
  | 'del'
  | 'ins'
  | 'sub'
  | 'sup'
  | 'abbr'
  | 'cite'
  | 'q'
  | 'dfn'
  | 'data'
  | 'time'
  | 'bdi'
  | 'bdo';

/**
 * Element the {@link BankaiText} root renders as (`as` prop).
 * Suggests the phrasing/text elements in {@link BankaiTextElement} (defaults to `'span'`);
 * any other tag string (e.g. a custom element) is still accepted.
 */
export type BankaiTextAs = LiteralUnion<BankaiTextElement, string>;

/**
 * Type size of a {@link BankaiText}.
 * A named `xs`–`2xl` t-shirt step reflects as `data-size` and resolves to the theme's `--bankai-text-size-*` tokens;
 * any other string is a verbatim CSS `font-size` (`'1.5rem'`, `'clamp(1rem, 2vw, 2rem)'`, `'var(--x)'`).
 */
export type BankaiTextSize = LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>;

/**
 * Font weight of a {@link BankaiText}.
 * A named step (`thin` = 100 … `black` = 900) reflects as `data-weight` and the theme maps it to a numeric `font-weight`;
 * a `number` is a verbatim `font-weight` (e.g. `350`), which a variable font renders along its `wght` axis.
 */
export type BankaiTextWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

/**
 * Text tone of a {@link BankaiText}.
 * A named neutral tone in descending prominence (`default` → `muted` → `subtle`) reflects as `data-tone` and resolves to a theme color (themed via `light-dark()`);
 * any other string is a verbatim CSS `color` (`'#ff8800'`, `'oklch(70% 0.15 40)'`, `'var(--brand)'`).
 */
export type BankaiTextTone = LiteralUnion<'default' | 'muted' | 'subtle', string>;

/**
 * Slots of a {@link BankaiText}.
 */
export interface BankaiTextSlots {
  /**
   * Text content.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiText}.
 */
export interface BankaiTextProps {
  /**
   * Element to render as. Polymorphic — suggests the phrasing/text elements ({@link BankaiTextElement}); any tag string (e.g. a custom element) is also accepted.
   * Use an inline-semantic element (`'strong'`, `'em'`, `'mark'`, `'code'`, `'kbd'`, `'del'`, …) to carry that meaning natively.
   *
   * @default 'span'
   */
  as?: BankaiTextAs;
  /**
   * Type size. A named `xs`–`2xl` step (`--bankai-text-size-*`) reflects as `data-size`; any other string is a verbatim CSS `font-size`.
   * Omitted when unset (inherits the ambient font size).
   */
  size?: BankaiTextSize;
  /**
   * Font weight. A named step ({@link BankaiTextWeight}) reflects as `data-weight`; a `number` or any other
   * string (`'var(--wght)'`, `'calc(…)'`, `'lighter'`) is a verbatim `font-weight` — a variable font renders
   * a numeric value along its `wght` axis.
   * Omitted when unset (inherits the ambient weight).
   */
  weight?: LiteralUnion<BankaiTextWeight, string> | number;
  /**
   * Text tone. A named neutral tone reflects as `data-tone`; any other string is a verbatim CSS `color`.
   * Omitted when unset (inherits the ambient color).
   */
  tone?: BankaiTextTone;
  /**
   * Truncate overflowing text to a single line with an ellipsis. Reflected on the root as `data-truncate`.
   * The theme rule makes the element block-level, so it truncates against the available width.
   *
   * @default false
   */
  truncate?: boolean;
}

// Named members of the open props — a value in these sets reflects as `data-*` (theme-mapped);
// anything else takes the verbatim custom-property escape hatch. Module scope, so allocated once.
const NAMED_SIZES = new Set<string>(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);
const NAMED_TONES = new Set<string>(['default', 'muted', 'subtle']);
const NAMED_WEIGHTS = new Set<string>([
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
]);
</script>

<script setup lang="ts">
import { computed } from 'vue';

const { as = 'span', size, weight, tone, truncate = false } = defineProps<BankaiTextProps>();

/**
 * A polymorphic text primitive. `size`/`weight`/`tone`/`truncate` are reflected on the root as `data-*`
 * (named values) or carried on `--bankai-text-*` custom properties (verbatim values); the accompanying
 * `@bankai-vue/theme-bankai` `:where()` rules turn those into type styles — so a consumer's utility classes
 * override them by plain specificity (SPEC.md §4.4, §4.6).
 * Renders a `<span>` by default (override via `as` for inline semantics), exposes a `bankai-text` class plus
 * `data-part="root"`, and merges consumer `class`/`style`/attributes onto the root; ships no CSS of its own.
 */
defineOptions({ name: 'BankaiText', inheritAttrs: true });

// A named member reflects verbatim as its `data-*` attribute; any other value takes the custom-property
// escape hatch below, so `data-*` is omitted for it (Vue drops `undefined` bindings, keeping the DOM clean).
const dataSize = computed(() => (size !== undefined && NAMED_SIZES.has(size) ? size : undefined));
const dataTone = computed(() => (tone !== undefined && NAMED_TONES.has(tone) ? tone : undefined));
// `weight` can be a number, so guard the Set lookup on a string first; a named string → `data-weight`,
// a number or any other string → the escape hatch below.
const weightIsNamed = computed(() => typeof weight === 'string' && NAMED_WEIGHTS.has(weight));
const dataWeight = computed(() => (weightIsNamed.value ? (weight as string) : undefined));

// The escape-hatch values ride custom properties that the theme's base `:where(.bankai-text)` rule applies.
// Each is set only for a non-named value; when all are unset the object is all-`undefined`, so Vue emits no
// `style` attribute at all (the clean default).
const rootStyle = computed<CSSProperties>(() => ({
  '--bankai-text-size': size !== undefined && !NAMED_SIZES.has(size) ? size : undefined,
  '--bankai-text-weight': weight !== undefined && !weightIsNamed.value ? weight : undefined,
  '--bankai-text-tone': tone !== undefined && !NAMED_TONES.has(tone) ? tone : undefined,
}));

// `data-truncate` is a presence flag (empty string when on, absent when off) so the CSS can match `[data-truncate]`.
const dataTruncate = computed<'' | undefined>(() => (truncate ? '' : undefined));

defineSlots<BankaiTextSlots>();
</script>

<template>
  <component
    :is="as"
    class="bankai-text"
    data-part="root"
    :data-size="dataSize"
    :data-weight="dataWeight"
    :data-tone="dataTone"
    :data-truncate="dataTruncate"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
