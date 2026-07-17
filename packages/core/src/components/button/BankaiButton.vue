<script lang="ts">
import type { LiteralUnion } from '../../internal/types';
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-button` class) and the reflected state (`data-bankai-variant`, `data-bankai-size`, native `:disabled`).

/**
 * Visual variant of a {@link BankaiButton}, reflected on the root as `data-bankai-variant`.
 * A named house variant (`solid`/`outline`/`ghost`) is styled by the theme; any other string is an
 * escape hatch — it reflects verbatim as `data-bankai-variant` so a consumer's `[data-bankai-variant='…']`
 * rule can style a custom variant. Unlike the `--bankai-*` custom-property escape
 * hatches on `BankaiText`/`BankaiFlex`/`BankaiGrid`, a variant is a whole bundle of declarations, so the
 * raw `data-*` string is itself the hatch — there is no single custom property to carry.
 */
export type BankaiButtonVariant = LiteralUnion<'solid' | 'outline' | 'ghost', string>;

/**
 * Size scale of a {@link BankaiButton}, reflected on the root as `data-bankai-size`.
 * A named step (`sm`/`md`/`lg`) is styled by the theme; any other string is an escape hatch — it reflects
 * verbatim as `data-bankai-size` for a consumer's `[data-bankai-size='…']` rule.
 */
export type BankaiButtonSize = LiteralUnion<'sm' | 'md' | 'lg', string>;

/**
 * Native `type` of a {@link BankaiButton}.
 * Aliases the DOM's own `"submit" | "reset" | "button"` union so it stays in sync with the platform.
 */
export type BankaiButtonType = HTMLButtonElement['type'];

/**
 * Native `disabled` of a {@link BankaiButton}.
 * Aliases the DOM's own `boolean` so it stays in sync with the platform.
 */
export type BankaiButtonDisabled = HTMLButtonElement['disabled'];

/**
 * Slots of a {@link BankaiButton}.
 */
export interface BankaiButtonSlots {
  /**
   * Button content — label and/or icons.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiButton}.
 */
export interface BankaiButtonProps {
  /**
   * Visual variant. A named house variant (`solid`/`outline`/`ghost`) is themed; any other string
   * reflects verbatim as `data-bankai-variant` as an escape hatch for a custom consumer-styled variant.
   *
   * @default 'solid'
   */
  variant?: BankaiButtonVariant;
  /**
   * Size scale. A named step (`sm`/`md`/`lg`) is themed; any other string reflects verbatim as
   * `data-bankai-size` as an escape hatch for a custom consumer-styled size.
   *
   * @default 'md'
   */
  size?: BankaiButtonSize;
  /**
   * Native button `type`. Defaults to `'button'` rather than the HTML default `'submit'`,
   * so the button never submits a surrounding form by accident.
   *
   * @default 'button'
   */
  type?: BankaiButtonType;
  /**
   * Disable the button via the native `disabled` attribute.
   *
   * @default false
   */
  disabled?: BankaiButtonDisabled;
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { useBankaiId } from '../../composables/useBankaiId';

const {
  variant = 'solid',
  size = 'md',
  type = 'button',
  disabled = false,
} = defineProps<BankaiButtonProps>();

/**
 * A native `<button>` with typed `variant`, `size`, `type`, and `disabled` props.
 * Reflects its state on the root as `data-*` and exposes a `bankai-button` class plus `data-part` hooks for styling; ships no CSS of its own.
 * Auto-generates a stable `id` unless the consumer supplies one.
 */
defineOptions({ name: 'BankaiButton', inheritAttrs: false });

const attrs = useAttrs();
const id = useBankaiId('bankai-button');

defineSlots<BankaiButtonSlots>();
</script>

<template>
  <!--
    `:id` comes BEFORE `v-bind="attrs"` so a consumer `id` (including an empty-string opt-out) still wins by
    fallthrough — `id` is the consumer's to set (see `useBankaiId`). Everything AFTER `v-bind="attrs"` is
    component-owned and must win instead: `data-part` (anatomy) and the reflected `data-bankai-*` state can't
    be clobbered by a consumer same-named attribute (SPEC.md §4.4, §5.6). `class` merges regardless of order.
  -->
  <button
    :id="id"
    v-bind="attrs"
    class="bankai-button"
    :type="type"
    :disabled="disabled"
    data-part="root"
    :data-bankai-variant="variant"
    :data-bankai-size="size"
  >
    <slot />
  </button>
</template>
