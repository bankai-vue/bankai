<script lang="ts">
import type { LiteralUnion } from '../../internal/types';
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-button` class) and the reflected state (`data-variant`, `data-size`, native `:disabled`).
// `variant`/`size` are an open named set: the shipped members reflect verbatim as `data-variant`/`data-size` (the theme styles them), and any other string is carried through the same way — a consumer extends the anatomy with their own `:where(.bankai-button[data-variant='brand'])` rule (SPEC.md §4.4). Unlike BankaiText's continuous props, a variant/size is a whole bundle of declarations, so there is no single-custom-property escape hatch — the escape hatch *is* the reflected `data-*` extension point.

/**
 * Visual variant of a {@link BankaiButton}, reflected on the root as `data-variant`.
 * Suggests the shipped variants (`solid`/`outline`/`ghost`) but accepts any string: a consumer
 * adds a custom variant by defining its own `[data-variant='…']` rule against the anatomy.
 */
export type BankaiButtonVariant = LiteralUnion<'solid' | 'outline' | 'ghost', string>;

/**
 * Size scale of a {@link BankaiButton}, reflected on the root as `data-size`.
 * Suggests the shipped steps (`sm`/`md`/`lg`) but accepts any string: a consumer adds a custom
 * size by defining its own `[data-size='…']` rule against the anatomy.
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
   * Visual variant. Reflected verbatim on the root as `data-variant` for styling. Suggests the
   * shipped variants ({@link BankaiButtonVariant}); any other string works if a matching
   * `[data-variant='…']` rule exists.
   *
   * @default 'solid'
   */
  variant?: BankaiButtonVariant;
  /**
   * Size scale. Reflected verbatim on the root as `data-size` for styling. Suggests the shipped
   * steps ({@link BankaiButtonSize}); any other string works if a matching `[data-size='…']` rule exists.
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
defineOptions({ name: 'BankaiButton', inheritAttrs: true });

const id = useBankaiId('bankai-button');

defineSlots<BankaiButtonSlots>();
</script>

<template>
  <button
    :id="id"
    class="bankai-button"
    :type="type"
    :disabled="disabled"
    data-part="root"
    :data-variant="variant"
    :data-size="size"
  >
    <slot />
  </button>
</template>
