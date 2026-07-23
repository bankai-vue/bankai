<script lang="ts">
import type { LiteralUnion } from '../../internal/types';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-input` class) and the reflected state (`data-bankai-size`, native `:disabled`/`:read-only`).

/**
 * Native `type` of a {@link BankaiInput}, reflected verbatim as the input's `type` attribute.
 * The named steps (`text`/`email`/`search`/`tel`/`url`) are the plain text-with-a-hint types this
 * component is meant for; any other string is an escape hatch that still passes through. The
 * behavior-rich types get dedicated components instead — `type="number"` → `BankaiInputNumber`,
 * `type="password"` → `BankaiInputPassword` (planned) — so their extra UI/parsing lives there,
 * not behind a bare attribute here. Unlike `variant`/`size`, `type` is a real native attribute, so it
 * is set as `type` directly (no `data-bankai-type` mirror — a `[type='…']` selector already works).
 *
 * @default 'text'
 */
export type BankaiInputType = LiteralUnion<'text' | 'email' | 'search' | 'tel' | 'url', string>;

/**
 * Size scale of a {@link BankaiInput}, reflected on the root as `data-bankai-size`.
 * A named step (`sm`/`md`/`lg`) is styled by the theme; any other string is an escape hatch — it reflects
 * verbatim as `data-bankai-size` for a consumer's `[data-bankai-size='…']` rule.
 */
export type BankaiInputSize = LiteralUnion<'sm' | 'md' | 'lg', string>;

/**
 * Native `disabled` of a {@link BankaiInput}.
 * Aliases the DOM's own `boolean` so it stays in sync with the platform.
 */
export type BankaiInputDisabled = HTMLInputElement['disabled'];

/**
 * Native `readonly` of a {@link BankaiInput}.
 * Aliases the DOM's own `readOnly` boolean so it stays in sync with the platform.
 */
export type BankaiInputReadonly = HTMLInputElement['readOnly'];

/**
 * The value type of a {@link BankaiInput}'s `v-model`: a `string` (the native input value is always a
 * string). The model itself resolves to `string | undefined` because the binding is optional — it is
 * `undefined` while unset, and the component never coerces an unset model to `''`, so the "never entered"
 * (`undefined`) vs "entered then cleared" (`''`) distinction is preserved for a wrapping field/validation
 * layer. Backend-shaped `null` and numeric values are intentionally out of scope for the raw input: a
 * `null` (e.g. from a Java/SQL backend) is a future `BankaiField` concern, and numbers belong to the
 * dedicated `BankaiInputNumber`.
 */
export type BankaiInputModelValue = string;

/**
 * Props for {@link BankaiInput}.
 */
export interface BankaiInputProps {
  /**
   * Native input `type`. A named text step (`text`/`email`/`search`/`tel`/`url`) is what this component
   * is for; any other string still passes through. Behavior-rich types have dedicated components
   * (`BankaiInputNumber`, `BankaiInputPassword`).
   *
   * @default 'text'
   */
  type?: BankaiInputType;
  /**
   * Size scale. A named step (`sm`/`md`/`lg`) is themed; any other string reflects verbatim as
   * `data-bankai-size` as an escape hatch for a custom consumer-styled size.
   *
   * @default 'md'
   */
  size?: BankaiInputSize;
  /**
   * Disable the input via the native `disabled` attribute.
   *
   * @default false
   */
  disabled?: BankaiInputDisabled;
  /**
   * Make the input read-only via the native `readonly` attribute — the value shows and can be
   * selected/copied but not edited (and, unlike `disabled`, it still submits with a form).
   *
   * @default false
   */
  readonly?: BankaiInputReadonly;
}

/**
 * The public instance API of a {@link BankaiInput}, available through a template ref.
 */
export interface BankaiInputExposes {
  /**
   * The underlying native `<input>` element, or `null` before mount / after unmount.
   */
  readonly el: HTMLInputElement | null;
  /**
   * Focus the input (delegates to the native `HTMLInputElement.focus`).
   */
  focus: (options?: FocusOptions) => void;
  /**
   * Remove focus from the input (delegates to the native `HTMLInputElement.blur`).
   */
  blur: () => void;
  /**
   * Select all editable text in the input (delegates to the native `HTMLInputElement.select`).
   */
  select: () => void;
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { useBankaiInput } from '../../internal/useBankaiInput';

const {
  type = 'text',
  size = 'md',
  disabled = false,
  readonly = false,
} = defineProps<BankaiInputProps>();

/**
 * The input's value, bound with `v-model` — `string | undefined` (see {@link BankaiInputModelValue}):
 * a string once set, `undefined` while unset. An unset model is never coerced to `''`, which preserves
 * the "never entered" vs "entered then cleared" distinction a future field/validation layer relies on.
 */
const model = defineModel<BankaiInputModelValue>();

/**
 * A native `<input>` with typed `type`, `size`, `disabled`, and `readonly` props and a `string` `v-model`.
 * Reflects its state on the root as `data-*` and exposes a `bankai-input` class plus `data-part` hooks for styling; ships no CSS of its own.
 * Auto-generates a stable `id` unless the consumer supplies one, and exposes the native element plus `focus`/`blur`/`select` through a template ref.
 */
defineOptions({ name: 'BankaiInput', inheritAttrs: false });

const attrs = useAttrs();

// Shared input-family wiring: the resolved `id`, the native-`<input>` ref, and `focus`/`blur`/`select`.
const { id, inputRef, focus, blur, select } = useBankaiInput('bankai-input');

defineExpose<BankaiInputExposes>({
  get el() {
    return inputRef.value;
  },
  focus,
  blur,
  select,
});
</script>

<!--
  `:id` comes BEFORE `v-bind="attrs"` so a consumer `id` (including an empty-string opt-out) still wins by
  fallthrough — `id` is the consumer's to set (see `useBankaiId`). Everything AFTER `v-bind="attrs"` is
  component-owned and must win instead: `v-model` (the input's value binding), the prop-backed native
  attributes (`type`/`disabled`/`readonly`), `data-part` (anatomy), and the reflected `data-bankai-*` state
  can't be clobbered by a consumer same-named attribute (SPEC.md §4.4, §5.6). `class` merges regardless of order.
-->
<template>
  <input
    :id="id"
    ref="input"
    v-bind="attrs"
    v-model="model"
    class="bankai-input"
    :type="type"
    :disabled="disabled"
    :readonly="readonly"
    data-part="root"
    :data-bankai-size="size"
  />
</template>
