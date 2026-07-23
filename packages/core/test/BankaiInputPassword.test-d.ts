import type {
  BankaiInputPasswordDisabled,
  BankaiInputPasswordExposes,
  BankaiInputPasswordModelValue,
  BankaiInputPasswordProps,
  BankaiInputPasswordReadonly,
  BankaiInputPasswordSize,
  BankaiInputPasswordSlots,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiInputPassword's public type surface. These lock the exported shapes so a
// rename, widened union, or dropped `?` is a failing test rather than a silent breaking change.

describe('BankaiInputPasswordSize', () => {
  test('re-uses the shared input size scale (named steps + verbatim escape hatch)', () => {
    expectTypeOf<BankaiInputPasswordSize>().toEqualTypeOf<
      LiteralUnion<'sm' | 'md' | 'lg', string>
    >();
    expectTypeOf<'md'>().toExtend<BankaiInputPasswordSize>();
    expectTypeOf<'xl'>().toExtend<BankaiInputPasswordSize>();
    expectTypeOf<string>().toExtend<BankaiInputPasswordSize>();
  });
});

describe('BankaiInputPasswordModelValue', () => {
  test('is the string value type (undefined-when-unset comes from the optional binding)', () => {
    expectTypeOf<BankaiInputPasswordModelValue>().toEqualTypeOf<string>();
  });
});

describe('BankaiInputPasswordDisabled', () => {
  test('mirrors the native disabled boolean', () => {
    expectTypeOf<BankaiInputPasswordDisabled>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputPasswordDisabled>().toEqualTypeOf<HTMLInputElement['disabled']>();
  });
});

describe('BankaiInputPasswordReadonly', () => {
  test('mirrors the native readOnly boolean', () => {
    expectTypeOf<BankaiInputPasswordReadonly>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputPasswordReadonly>().toEqualTypeOf<HTMLInputElement['readOnly']>();
  });
});

describe('BankaiInputPasswordProps', () => {
  test('exposes every prop as optional with its dedicated type', () => {
    // A widened type, a dropped `?`, or a rename fails here. `modelValue`/`revealed` are provided by
    // `defineModel`, not this interface.
    expectTypeOf<BankaiInputPasswordProps>().toEqualTypeOf<{
      size?: BankaiInputPasswordSize;
      disabled?: BankaiInputPasswordDisabled;
      readonly?: BankaiInputPasswordReadonly;
      toggle?: boolean;
      showLabel?: string;
      hideLabel?: string;
    }>();
  });
});

describe('BankaiInputPasswordSlots', () => {
  test('exposes an optional reveal-button slot receiving the revealed state', () => {
    expectTypeOf<BankaiInputPasswordSlots>().toEqualTypeOf<{
      toggle?: (props: { revealed: boolean }) => VNode[];
    }>();
  });
});

describe('BankaiInputPasswordExposes', () => {
  test('exposes the native element plus focus/blur/select', () => {
    expectTypeOf<BankaiInputPasswordExposes>().toEqualTypeOf<{
      readonly el: HTMLInputElement | null;
      focus: (options?: FocusOptions) => void;
      blur: () => void;
      select: () => void;
    }>();
  });
});
