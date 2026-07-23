<script lang="ts">
import type { BankaiInputSize } from '../input/BankaiInput.vue';
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-input` field, the optional `bankai-input-password`
// wrapper, and the reveal toggle (`data-part="toggle"`), keyed on the reflected `data-bankai-revealed` state.
//
// BankaiInputPassword is the reveal-toggle sibling of the generic `BankaiInput` — a native single-line
// `<input>` whose `type` flips between `password` (masked) and `text` (revealed). It renders its OWN
// `<input>` (reusing `BankaiInput`'s look through the shared `bankai-input` class) rather than composing
// `BankaiInput`, so it can own the `type` toggle and the two DOM shapes below directly. `type="password"`
// without a reveal toggle is already `<BankaiInput type="password">`; this component exists for the toggle.
//
// The reveal state is a named `v-model:revealed` (secondary state ⇒ named model, per the family
// convention), so it drives the `type` whether or not the built-in button renders — a consumer can bind it
// to their own control. The reveal button is a REAL, focusable, tab-order control (unlike
// `BankaiInputNumber`'s decorative `aria-hidden` steppers): its accessible name swaps between the localized
// `inputPassword.show` / `inputPassword.hide` messages so it announces both the action and the current
// state (the GOV.UK show/hide pattern), overridable per-instance via `showLabel`/`hideLabel`.
//
// Two DOM shapes, chosen by `toggle`:
//   - `toggle: true` (default) → a `<div class="bankai-input-password">` wrapper (root) holding the field
//     (`data-part="field"`) plus the reveal button (`data-part="toggle"`).
//   - `toggle: false` → JUST the bare `<input>` (root) — no wrapper, no button (revealing then needs a
//     consumer-driven `v-model:revealed`). Toggling `toggle` reactively re-creates the root node.
//
// The real-screen-reader pass on the reveal toggle (NVDA / JAWS / VoiceOver, ROADMAP DoD) is still OWED.

/**
 * Size scale of a {@link BankaiInputPassword} — the same scale as {@link BankaiInput} (they share the
 * `data-bankai-size` metrics), re-used so the family stays consistent.
 */
export type BankaiInputPasswordSize = BankaiInputSize;

/**
 * Native `disabled` of a {@link BankaiInputPassword} — a plain `boolean` (matching `HTMLInputElement.disabled`).
 * Declared directly as `boolean` rather than an indexed-access alias so the Vue compiler resolves it to a
 * runtime `Boolean` prop, which is what lets a bare `disabled` attribute cast to `true` for the reveal-button
 * disable logic (an indirect alias would arrive as `''` and silently skip it).
 */
export type BankaiInputPasswordDisabled = boolean;

/**
 * Native `readonly` of a {@link BankaiInputPassword} — a plain `boolean` (matching `HTMLInputElement.readOnly`),
 * declared directly so the Vue compiler casts it to a runtime `Boolean` prop (see
 * {@link BankaiInputPasswordDisabled}). Unlike `disabled`, a read-only field can still be revealed.
 */
export type BankaiInputPasswordReadonly = boolean;

/**
 * The value type of a {@link BankaiInputPassword}'s default `v-model`: a `string` (the native input value is
 * always a string). The model itself resolves to `string | undefined` because the binding is optional — it
 * is `undefined` while unset, and the component never coerces an unset model to `''`, so the "never entered"
 * (`undefined`) vs "entered then cleared" (`''`) distinction is preserved for a wrapping field/validation
 * layer. Mirrors {@link BankaiInputModelValue}.
 */
export type BankaiInputPasswordModelValue = string;

/**
 * Props for {@link BankaiInputPassword}.
 */
export interface BankaiInputPasswordProps {
  /**
   * Size scale, forwarded to the field and reflected as `data-bankai-size`. A named step (`sm`/`md`/`lg`)
   * is themed; any other string reflects verbatim as an escape hatch.
   *
   * @default 'md'
   */
  size?: BankaiInputPasswordSize;
  /**
   * Disable the control via the native `disabled` attribute (also disables the reveal button).
   *
   * @default false
   */
  disabled?: BankaiInputPasswordDisabled;
  /**
   * Make the control read-only via the native `readonly` attribute — the value shows and can be
   * selected/copied but not edited (the reveal button still works). Unlike `disabled`, it still submits
   * with a form.
   *
   * @default false
   */
  readonly?: BankaiInputPasswordReadonly;
  /**
   * Render the built-in reveal toggle. `true` (default) wraps the field in a `<div class="bankai-input-password">`
   * and adds a reveal `<button data-part="toggle">`. `false` renders just the bare `<input>` with no wrapper
   * or button — revealing then requires driving `v-model:revealed` from a consumer control (the reveal
   * still flips the input `type`). The reveal state itself is `v-model:revealed`, independent of this prop.
   *
   * @default true
   */
  toggle?: boolean;
  /**
   * The reveal button's accessible name (and its visible label, when the `toggle` slot is not used) while
   * the password is masked — activating it reveals the value. Overrides the resolved `inputPassword.show`
   * message for this instance; unset, it resolves through the global i18n config
   * ({@link BankaiI18nConfig}), defaulting to the English `'Show password'`.
   *
   * @default 'Show password'
   */
  showLabel?: string;
  /**
   * The reveal button's accessible name (and its visible label, when the `toggle` slot is not used) while
   * the value is revealed — activating it masks the value again. Overrides the resolved `inputPassword.hide`
   * message for this instance; unset, it resolves through the global i18n config
   * ({@link BankaiI18nConfig}), defaulting to the English `'Hide password'`.
   *
   * @default 'Hide password'
   */
  hideLabel?: string;
}

/**
 * Slots of a {@link BankaiInputPassword}.
 */
export interface BankaiInputPasswordSlots {
  /**
   * Content of the reveal button (defaults to the current `showLabel` / `hideLabel` text). Receives the
   * current `revealed` state so a consumer can swap the icon/label (e.g. an eye ↔ eye-off `BankaiIcon`).
   * The button keeps its accessible name from the labels regardless of what this slot renders. Only
   * rendered when `toggle` is `true`.
   */
  toggle?: (props: { revealed: boolean }) => VNode[];
}

/**
 * The public instance API of a {@link BankaiInputPassword}, available through a template ref.
 */
export interface BankaiInputPasswordExposes {
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
import { computed, useAttrs } from 'vue';
import { useBankaiMessage } from '../../composables/useBankaiMessage';
import { useBankaiInput } from '../../internal/useBankaiInput';

const {
  size = 'md',
  disabled = false,
  readonly = false,
  toggle = true,
  showLabel,
  hideLabel,
} = defineProps<BankaiInputPasswordProps>();

/**
 * The password value, bound with the default `v-model` — `string | undefined` (see
 * {@link BankaiInputPasswordModelValue}): a string once set, `undefined` while unset.
 */
const model = defineModel<BankaiInputPasswordModelValue>();

/**
 * Whether the value is revealed, bound with `v-model:revealed` (default `false`). Drives the input `type`
 * (`text` when revealed, `password` when masked) and the reveal button's label/state — independent of the
 * `toggle` prop, so a consumer can drive it from their own control even with the built-in button off.
 */
const revealed = defineModel<boolean>('revealed', { default: false });

/**
 * A native single-line `<input>` for passwords with a `string` `v-model` and a reveal toggle that flips its
 * `type` between `password` and `text` via `v-model:revealed`. Bare `<input>` with `toggle="false"`; a
 * `bankai-input-password` wrapper + reveal button by default. Reuses the `bankai-input` field theme,
 * reflects `data-bankai-size` (+ `data-bankai-revealed` on the wrapper), exposes `data-part` hooks
 * (`root`/`field`/`toggle`), and ships no CSS. Exposes the native element plus `focus`/`blur`/`select`. The
 * reveal-toggle sibling of `BankaiInput`.
 */
defineOptions({ name: 'BankaiInputPassword', inheritAttrs: false });

const attrs = useAttrs();
const messages = useBankaiMessage();

// Shared input-family wiring: the resolved `id`, the native-`<input>` ref, and `focus`/`blur`/`select`.
const { id, inputRef, focus, blur, select } = useBankaiInput('bankai-input-password');

// The field `type` follows the reveal state: `text` shows the value, `password` masks it.
const fieldType = computed<'text' | 'password'>(() => (revealed.value ? 'text' : 'password'));

// Label precedence: per-instance prop → resolved locale bundle → English default (via `messages`).
// `??` (not `||`) so an explicit empty-string prop is honored rather than falling back.
const resolvedShowLabel = computed<string>(() => showLabel ?? messages.value.inputPassword.show);
const resolvedHideLabel = computed<string>(() => hideLabel ?? messages.value.inputPassword.hide);
// The reveal button's current accessible name + visible label: "hide" while revealed, "show" while masked.
const toggleLabel = computed<string>(() =>
  revealed.value ? resolvedHideLabel.value : resolvedShowLabel.value,
);

// Presence flag (empty string on, absent off) so the theme can match `[data-bankai-revealed]` regardless
// of value; Vue drops the attribute when the value is `undefined`.
const dataRevealed = computed<'' | undefined>(() => (revealed.value ? '' : undefined));

// Attribute routing. With the toggle, the wrapper is the root — `class`/`style` style that box, the rest
// reach the field `<input>`. When bare, the `<input>` IS the root, so every attribute lands on it.
const rootAttrs = computed<Record<string, unknown>>(() => ({
  class: attrs.class,
  style: attrs.style,
}));
const fieldAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

// Field `<input>` bindings (everything except the value — `v-model` provides that on the element so text
// composition/IME is handled). A single merged object keeps the component-owned keys winning over the
// consumer `source` and avoids in-template `v-bind` ordering pitfalls: the generated `id` is a fallback the
// consumer's `source.id` overrides (see `useBankaiId`); `class` merges as an array so a consumer class
// survives alongside `bankai-input`; everything else is owned and can't be clobbered (SPEC.md §4.4, §5.6).
// `source` is `attrs` when bare (the input is the root) or `fieldAttrs` when wrapped (the wrapper took
// `class`/`style`).
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
    type: fieldType.value,
    disabled,
    readonly,
    'data-part': part,
    'data-bankai-size': size,
  };
}
const bareBindings = computed(() => buildFieldBindings(attrs, 'root'));
const fieldBindings = computed(() => buildFieldBindings(fieldAttrs.value, 'field'));

defineExpose<BankaiInputPasswordExposes>({
  get el() {
    return inputRef.value;
  },
  focus,
  blur,
  select,
});

defineSlots<BankaiInputPasswordSlots>();
</script>

<!--
  Template notes (kept out of the template so they don't render as DOM comment nodes):

  - Two shapes: bare `<input>` (root, `data-part="root"`) when `toggle` is `false`; a `<div>` wrapper (root)
    holding the field (`data-part="field"`) + the reveal button when `true`. Each `<input>` binds a single
    pre-merged object (`bareBindings`/`fieldBindings`) plus `v-model` for the value — see `buildFieldBindings`,
    which already resolves the consumer-vs-owned precedence — so there is no fragile in-template `v-bind`
    ordering to get wrong.
  - Reveal button: `type="button"` (never submit a form) and a REAL tab-order control (no `tabindex="-1"`,
    no `aria-hidden`); `:aria-label` gives it an accessible name that swaps with the reveal state and matches
    its visible label (WCAG 2.5.3 Label in Name). Disabled only with the field's `disabled` (a read-only
    field can still be revealed).
-->
<template>
  <div
    v-if="toggle"
    v-bind="rootAttrs"
    class="bankai-input-password"
    data-part="root"
    :data-bankai-size="size"
    :data-bankai-revealed="dataRevealed"
  >
    <input ref="input" v-model="model" v-bind="fieldBindings" />
    <button
      type="button"
      data-part="toggle"
      :aria-label="toggleLabel"
      :disabled="disabled"
      @click="revealed = !revealed"
    >
      <slot name="toggle" :revealed="revealed">{{ toggleLabel }}</slot>
    </button>
  </div>
  <input v-else ref="input" v-model="model" v-bind="bareBindings" />
</template>
