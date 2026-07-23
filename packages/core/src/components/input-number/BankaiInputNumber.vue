<script lang="ts">
import type { LiteralUnion } from '../../internal/types';
import type { BankaiInputSize } from '../input/BankaiInput.vue';
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-input` field, the optional `bankai-input-number`
// wrapper + stepper controls (`data-part="decrement"`/`"increment"`), and hides the browser's native spin
// buttons on any `.bankai-input[type="number"]` (they are not themeable across engines — Firefox exposes no
// pseudo-element for them at all — so the component ships its own controls instead of trying to style them).
//
// BankaiInputNumber is the behavior-rich `type="number"` sibling of the generic `BankaiInput`. It renders
// its OWN native `<input type="number">` rather than composing `BankaiInput` — because Vue's `vModelText`
// auto-coerces a `type="number"` field to a `number` (via `looseToNumber`, no `.number` needed), so
// composing `BankaiInput`'s `string`-typed model would push a `number` through a String prop AND lose the
// raw entry (`1.50` → `1.5`) mid-type. Owning the element gives direct `value`/`valueAsNumber` + write-back
// control, so a decimal-in-progress survives; it reuses `BankaiInput`'s look through the shared
// `bankai-input` class only. It adds a `number` `v-model`, native `min`/`max`/`step`, a smart mobile
// `inputmode` default, and OPTIONAL stepper controls.
//
// Two DOM shapes, chosen by `buttons`:
//   - `buttons: false` (default) → JUST the bare `<input type="number">` (root) — the primitive a consumer
//     can wrap themselves. Keyboard/arrow-key stepping still works; native spin buttons hidden.
//   - `buttons` truthy → a `<div class="bankai-input-number">` wrapper (root) holding the field plus two
//     stepper controls, laid out by the theme via `grid-template-areas` keyed on the reflected
//     `data-bankai-buttons` (`stacked` = vertical pair on the trailing edge; `split` = ± flanking the field).
// Toggling `buttons` reactively re-creates the root node (bare input ↔ wrapper) — documented, rare in
// practice. The native input stays the accessible spinbutton; the ± controls are supplementary pointer
// helpers (`aria-hidden` + `tabindex="-1"`).
//
// When a 3rd input-family control lands, the shared id/focus/element bits here are the seam to extract into
// a `useBankaiInput` composable (don't pre-abstract before then).

/**
 * Size scale of a {@link BankaiInputNumber} — the same scale as {@link BankaiInput} (they share the
 * `data-bankai-size` metrics), re-used so the family stays consistent.
 */
export type BankaiInputNumberSize = BankaiInputSize;

/**
 * Native `disabled` of a {@link BankaiInputNumber} — a plain `boolean` (matching `HTMLInputElement.disabled`).
 * Declared directly as `boolean` rather than an indexed-access alias so the Vue compiler resolves it to a
 * runtime `Boolean` prop, which is what lets a bare `disabled` attribute cast to `true` for the
 * stepper-control disable logic (an indirect alias would arrive as `''` and silently skip that logic).
 */
export type BankaiInputNumberDisabled = boolean;

/**
 * Native `readonly` of a {@link BankaiInputNumber} — a plain `boolean` (matching `HTMLInputElement.readOnly`),
 * declared directly so the Vue compiler casts it to a runtime `Boolean` prop (see
 * {@link BankaiInputNumberDisabled}).
 */
export type BankaiInputNumberReadonly = boolean;

/**
 * The value type of a {@link BankaiInputNumber}'s `v-model`: a `number`. The model itself resolves to
 * `number | undefined` because the binding is optional — it is `undefined` while unset **and** whenever the
 * field is empty or holds an incomplete/invalid entry (a lone `-`, `1e`), so the "no number yet" state is
 * never coerced to `0`. A `null` from a backend is a future `BankaiField` concern, not this control's.
 */
export type BankaiInputNumberModelValue = number;

/**
 * Stepper-controls setting of a {@link BankaiInputNumber}, controlling whether the ± controls render and how
 * they are laid out. Also accepted as the `buttons` prop's non-boolean form:
 *
 * - `'stacked'` — a vertical increment/decrement pair on the trailing edge (each half the field height); the
 *   native-desktop look, and what `buttons` resolves to when set to `true`.
 * - `'split'` — decrement and increment flanking the field (`−` leading, `+` trailing).
 *
 * A named step is themed; any other string reflects verbatim as `data-bankai-buttons` (an escape hatch for a
 * consumer-defined layout styled via CSS).
 */
export type BankaiInputNumberButtons = LiteralUnion<'stacked' | 'split', string>;

/**
 * Mobile virtual-keyboard hint of a {@link BankaiInputNumber}, set as the native `inputmode` attribute.
 * `'numeric'` shows a digits-only keypad; `'decimal'` adds a decimal separator. Left unset, it defaults
 * smartly from `step` (`'numeric'` for an integer step, `'decimal'` otherwise); any other string reflects
 * verbatim as an escape hatch.
 */
export type BankaiInputNumberInputMode = LiteralUnion<'numeric' | 'decimal', string>;

/**
 * Props for {@link BankaiInputNumber}.
 */
export interface BankaiInputNumberProps {
  /**
   * Minimum value, set as the native `min` attribute — the platform clamps stepping and flags
   * out-of-range values. Also disables the decrement control once the value reaches it.
   */
  min?: number;
  /**
   * Maximum value, set as the native `max` attribute — the platform clamps stepping and flags
   * out-of-range values. Also disables the increment control once the value reaches it.
   */
  max?: number;
  /**
   * Step granularity, set as the native `step` attribute — the amount each stepper control and each
   * arrow-key press changes the value by, and the allowed value increments. Also drives the default
   * `inputmode` (integer → `'numeric'`, fractional → `'decimal'`).
   *
   * @default 1
   */
  step?: number;
  /**
   * Size scale, forwarded to the field and reflected as `data-bankai-size`. A named step (`sm`/`md`/`lg`)
   * is themed; any other string reflects verbatim as an escape hatch.
   *
   * @default 'md'
   */
  size?: BankaiInputNumberSize;
  /**
   * Disable the control via the native `disabled` attribute (also disables both stepper controls).
   *
   * @default false
   */
  disabled?: BankaiInputNumberDisabled;
  /**
   * Make the control read-only via the native `readonly` attribute — the value shows and can be
   * selected/copied but not edited, and both stepper controls are disabled. Unlike `disabled`, it still
   * submits with a form.
   *
   * @default false
   */
  readonly?: BankaiInputNumberReadonly;
  /**
   * The stepper controls. `false` (default) renders just the bare `<input>` — no wrapper, no controls
   * (keyboard/arrow-key stepping still works). `true` renders the controls in the default `'stacked'`
   * layout; a {@link BankaiInputNumberButtons} string (`'stacked'`/`'split'` or a custom value) picks the
   * layout explicitly. Any truthy value wraps the field in a `<div class="bankai-input-number">` and
   * reflects the resolved layout as `data-bankai-buttons`.
   *
   * @default false
   */
  buttons?: boolean | BankaiInputNumberButtons;
  /**
   * Mobile keyboard hint, set as the native `inputmode` attribute. Defaults smartly from `step`
   * (`'numeric'` for an integer step, `'decimal'` otherwise); set explicitly to override.
   */
  inputmode?: BankaiInputNumberInputMode;
}

/**
 * Slots of a {@link BankaiInputNumber}.
 */
export interface BankaiInputNumberSlots {
  /**
   * Content of the decrement control (defaults to a minus glyph). Swap in an icon (e.g. `BankaiIcon`).
   * Only rendered when `buttons` is truthy; the control is `aria-hidden`, so slot content is not announced.
   */
  decrement?: () => VNode[];
  /**
   * Content of the increment control (defaults to a plus glyph). Swap in an icon (e.g. `BankaiIcon`).
   * Only rendered when `buttons` is truthy; the control is `aria-hidden`, so slot content is not announced.
   */
  increment?: () => VNode[];
}

/**
 * The public instance API of a {@link BankaiInputNumber}, available through a template ref.
 */
export interface BankaiInputNumberExposes {
  /**
   * The underlying native `<input type="number">` element, or `null` before mount / after unmount.
   */
  readonly el: HTMLInputElement | null;
  /**
   * Focus the input.
   */
  focus: (options?: FocusOptions) => void;
  /**
   * Remove focus from the input.
   */
  blur: () => void;
  /**
   * Select the input's text.
   */
  select: () => void;
  /**
   * Increment the value by `count` steps (delegates to the native `HTMLInputElement.stepUp`, so it
   * honors `min`/`max`/`step`). No-op while disabled/readonly.
   *
   * @default count 1
   */
  stepUp: (count?: number) => void;
  /**
   * Decrement the value by `count` steps (delegates to the native `HTMLInputElement.stepDown`). No-op
   * while disabled/readonly.
   *
   * @default count 1
   */
  stepDown: (count?: number) => void;
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import { useBankaiInput } from '../../internal/useBankaiInput';

const {
  min,
  max,
  step = 1,
  size = 'md',
  disabled = false,
  readonly = false,
  buttons = false,
  inputmode,
} = defineProps<BankaiInputNumberProps>();

/**
 * The numeric value, bound with `v-model` — `number | undefined` (see {@link BankaiInputNumberModelValue}):
 * `undefined` while unset and whenever the field is empty or holds an incomplete/invalid entry. Never
 * coerced to `0`, so a wrapping field/validation layer can tell "no number yet" from an entered value.
 */
const model = defineModel<BankaiInputNumberModelValue>();

/**
 * A native `<input type="number">` with a `number` `v-model`, native `min`/`max`/`step`, a smart mobile
 * `inputmode` default, and optional stepper controls (`buttons`). Bare `<input>` by default; a
 * `bankai-input-number` wrapper + themed ± controls when `buttons` is set. Reuses the `bankai-input` field
 * theme, reflects `data-bankai-size` (+ `data-bankai-buttons` on the wrapper), exposes `data-part` hooks
 * (`root`/`field`/`decrement`/`increment`), and ships no CSS. Exposes the native element plus
 * `focus`/`blur`/`select`/`stepUp`/`stepDown`. The behavior-rich `type="number"` sibling of `BankaiInput`.
 */
defineOptions({ name: 'BankaiInputNumber', inheritAttrs: false });

const attrs = useAttrs();

// Whether the stepper controls (and thus the wrapper) render, and the resolved layout reflected as
// `data-bankai-buttons`. `buttons === true` maps to the default `'stacked'` layout; a string is used as-is.
const hasButtons = computed<boolean>(() => Boolean(buttons));
const resolvedButtons = computed<string | undefined>(() =>
  buttons === true ? 'stacked' : buttons || undefined,
);

// Smart mobile keyboard: an integer `step` wants a digits-only pad (`numeric`), a fractional one wants the
// decimal separator (`decimal`). An explicit `inputmode` prop overrides.
const effectiveInputMode = computed<string>(
  () => inputmode ?? (Number.isInteger(step) ? 'numeric' : 'decimal'),
);

// Attribute routing. When there are buttons, the wrapper is the root — `class`/`style` style that box, the
// rest reach the field `<input>`. When bare, the `<input>` IS the root, so every attribute lands on it.
const rootAttrs = computed<Record<string, unknown>>(() => ({
  class: attrs.class,
  style: attrs.style,
}));
const fieldAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

// Shared input-family wiring: the resolved `id`, the native-`<input>` ref, and `focus`/`blur`/`select`.
const { id, inputRef, focus, blur, select } = useBankaiInput('bankai-input-number');

// The string shown in the field — internal only. The native input value is always a string, so this bridges
// to/from the numeric `model`. It is kept byte-identical to the DOM on every keystroke (see `onInput`), so
// the number bridge never rewrites — and thus never clobbers — an in-progress entry like `1.50` or `-`.
const display = ref<string>('');

// Parse the current display string the way the model does: empty/invalid → undefined, else the number.
function parseDisplay(text: string): number | undefined {
  if (text === '') {
    return undefined;
  }

  const parsed = Number(text);
  return Number.isNaN(parsed) ? undefined : parsed;
}

// External `model` changes (a parent set, a programmatic step) reformat the field; a change that already
// matches what the field reads is skipped, so echoing a value the user just typed can't clobber their entry.
watch(
  model,
  (value) => {
    if (value !== parseDisplay(display.value)) {
      display.value = value === undefined ? '' : String(value);
    }
  },
  { immediate: true },
);

// A keystroke. Mirror the raw DOM string into `display` verbatim — this equals the element's value, so the
// `:value` patch is a no-op and the caret/entry is untouched, preserving an in-progress `1.50`/`-` — then
// emit the parsed number. `valueAsNumber` is `NaN` when empty/invalid, which maps to `undefined` (never `0`).
function onInput(event: Event): void {
  const el = event.target as HTMLInputElement;
  display.value = el.value;
  model.value = Number.isNaN(el.valueAsNumber) ? undefined : el.valueAsNumber;
}

// Drive the native stepper. `stepUp`/`stepDown` clamp to `min`/`max` and snap to `step` for free; we then
// resync `display` + `model` from the element.
function stepBy(direction: 1 | -1, count = 1): void {
  const el = inputRef.value;
  if (!el || disabled || readonly) {
    return;
  }

  if (direction === 1) {
    el.stepUp(count);
  } else {
    el.stepDown(count);
  }

  display.value = el.value;
  model.value = Number.isNaN(el.valueAsNumber) ? undefined : el.valueAsNumber;
}

// Bounds-aware disabling of the controls: also off while disabled/readonly. An unset value (`undefined`)
// leaves both enabled — stepping from empty lets the native input seed a starting value.
const decrementDisabled = computed<boolean>(
  () =>
    disabled || readonly || (min !== undefined && model.value !== undefined && model.value <= min),
);
const incrementDisabled = computed<boolean>(
  () =>
    disabled || readonly || (max !== undefined && model.value !== undefined && model.value >= max),
);

// Field `<input>` bindings, built once and reused for both DOM shapes (bare root vs wrapped field). A single
// merged object (not two `v-bind`s) keeps the component-owned keys winning over the consumer `source` and
// avoids the caret order pitfalls: the generated `id` is a fallback the consumer's `source.id` overrides
// (see `useBankaiId`); `class` merges as an array so a consumer class survives alongside `bankai-input`;
// everything else is owned and can't be clobbered (SPEC.md §4.4, §5.6). `source` is `attrs` when bare (the
// input is the root) or `fieldAttrs` when wrapped (the wrapper took `class`/`style`).
function buildFieldBindings(
  source: Record<string, unknown>,
  part: 'root' | 'field',
): Record<string, unknown> {
  const { class: consumerClass, id: consumerId, ...rest } = source;
  return {
    ...rest,
    // A consumer `id` (including an empty-string opt-out) wins over the generated fallback (see `useBankaiId`).
    id: consumerId ?? id.value,
    class: ['bankai-input', consumerClass],
    type: 'number',
    value: display.value,
    inputmode: effectiveInputMode.value,
    disabled,
    readonly,
    min,
    max,
    step,
    'data-part': part,
    'data-bankai-size': size,
  };
}
const bareBindings = computed(() => buildFieldBindings(attrs, 'root'));
const fieldBindings = computed(() => buildFieldBindings(fieldAttrs.value, 'field'));

defineExpose<BankaiInputNumberExposes>({
  get el() {
    return inputRef.value;
  },
  focus,
  blur,
  select,
  stepUp: (count?: number) => stepBy(1, count),
  stepDown: (count?: number) => stepBy(-1, count),
});

defineSlots<BankaiInputNumberSlots>();
</script>

<!--
  Template notes (kept out of the template so they don't render as DOM comment nodes):

  - Two shapes: bare `<input>` (root, `data-part="root"`) when `buttons` is falsy; a `<div>` wrapper (root)
    holding the field (`data-part="field"`) + two stepper controls when truthy. Each `<input>` binds a single
    pre-merged object (`bareBindings`/`fieldBindings`) — see `buildFieldBindings`, which already resolves the
    consumer-vs-owned precedence — so there is no fragile in-template `v-bind` ordering to get wrong.
  - Stepper controls: `type="button"` (never submit a form), `tabindex="-1"` + `aria-hidden="true"` so the
    native input stays the single accessible spinbutton; `@mousedown.prevent` keeps focus on the field.
-->
<template>
  <div
    v-if="hasButtons"
    v-bind="rootAttrs"
    class="bankai-input-number"
    data-part="root"
    :data-bankai-size="size"
    :data-bankai-buttons="resolvedButtons"
  >
    <button
      type="button"
      tabindex="-1"
      aria-hidden="true"
      data-part="decrement"
      :disabled="decrementDisabled"
      @mousedown.prevent
      @click="stepBy(-1)"
    >
      <slot name="decrement">&#8722;</slot>
    </button>
    <input ref="input" v-bind="fieldBindings" @input="onInput" />
    <button
      type="button"
      tabindex="-1"
      aria-hidden="true"
      data-part="increment"
      :disabled="incrementDisabled"
      @mousedown.prevent
      @click="stepBy(1)"
    >
      <slot name="increment">&#43;</slot>
    </button>
  </div>
  <input v-else ref="input" v-bind="bareBindings" @input="onInput" />
</template>
