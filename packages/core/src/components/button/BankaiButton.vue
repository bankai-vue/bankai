<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-button` class) and the reflected state (`data-bankai-variant`, `data-bankai-size`, native `:disabled`).

/**
 * Visual variant of a {@link BankaiButton}, reflected on the root as `data-bankai-variant`.
 */
export type BankaiButtonVariant = 'solid' | 'outline' | 'ghost';

/**
 * Size scale of a {@link BankaiButton}, reflected on the root as `data-bankai-size`.
 */
export type BankaiButtonSize = 'sm' | 'md' | 'lg';

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
   * Visual variant. Reflected on the root as `data-bankai-variant` for styling.
   *
   * @default 'solid'
   */
  variant?: BankaiButtonVariant;
  /**
   * Size scale. Reflected on the root as `data-bankai-size` for styling.
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
