import type {
  BankaiInputNumberButtons,
  BankaiInputNumberDisabled,
  BankaiInputNumberExposes,
  BankaiInputNumberInputMode,
  BankaiInputNumberModelValue,
  BankaiInputNumberProps,
  BankaiInputNumberReadonly,
  BankaiInputNumberSize,
  BankaiInputNumberSlots,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiInputNumber's public type surface. These lock the exported shapes so a
// rename, widened union, or dropped `?` is a failing test rather than a silent breaking change.

describe('BankaiInputNumberSize', () => {
  test('re-uses the shared input size scale (named steps + verbatim escape hatch)', () => {
    expectTypeOf<BankaiInputNumberSize>().toEqualTypeOf<LiteralUnion<'sm' | 'md' | 'lg', string>>();
    expectTypeOf<'md'>().toExtend<BankaiInputNumberSize>();
    expectTypeOf<'xl'>().toExtend<BankaiInputNumberSize>();
    expectTypeOf<string>().toExtend<BankaiInputNumberSize>();
  });
});

describe('BankaiInputNumberModelValue', () => {
  test('is the number value type (undefined-when-unset comes from the optional binding)', () => {
    expectTypeOf<BankaiInputNumberModelValue>().toEqualTypeOf<number>();
  });
});

describe('BankaiInputNumberDisabled', () => {
  test('mirrors the native disabled boolean', () => {
    expectTypeOf<BankaiInputNumberDisabled>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputNumberDisabled>().toEqualTypeOf<HTMLInputElement['disabled']>();
  });
});

describe('BankaiInputNumberReadonly', () => {
  test('mirrors the native readOnly boolean', () => {
    expectTypeOf<BankaiInputNumberReadonly>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputNumberReadonly>().toEqualTypeOf<HTMLInputElement['readOnly']>();
  });
});

describe('BankaiInputNumberButtons', () => {
  test('is the named layouts plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiInputNumberButtons>().toEqualTypeOf<
      LiteralUnion<'stacked' | 'split', string>
    >();
    expectTypeOf<'stacked'>().toExtend<BankaiInputNumberButtons>();
    expectTypeOf<'split'>().toExtend<BankaiInputNumberButtons>();
    expectTypeOf<string>().toExtend<BankaiInputNumberButtons>();
  });
});

describe('BankaiInputNumberInputMode', () => {
  test('is the named keyboard hints plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiInputNumberInputMode>().toEqualTypeOf<
      LiteralUnion<'numeric' | 'decimal', string>
    >();
    expectTypeOf<'numeric'>().toExtend<BankaiInputNumberInputMode>();
    expectTypeOf<string>().toExtend<BankaiInputNumberInputMode>();
  });
});

describe('BankaiInputNumberProps', () => {
  test('exposes every prop as optional with its dedicated type', () => {
    // A widened type, a dropped `?`, or a rename fails here. `buttons` is checked separately below — a
    // `boolean | <LiteralUnion>` union in this object literal trips oxlint's type-aware pass (it can't
    // resolve the alias). `modelValue` is provided by `defineModel`, not this interface.
    expectTypeOf<Omit<BankaiInputNumberProps, 'buttons'>>().toEqualTypeOf<{
      min?: number;
      max?: number;
      step?: number;
      size?: BankaiInputNumberSize;
      disabled?: BankaiInputNumberDisabled;
      readonly?: BankaiInputNumberReadonly;
      inputmode?: BankaiInputNumberInputMode;
    }>();
  });

  test('buttons accepts a boolean, the named layouts, and any string, but nothing else', () => {
    type Buttons = NonNullable<BankaiInputNumberProps['buttons']>;
    expectTypeOf<boolean>().toExtend<Buttons>();
    expectTypeOf<'stacked'>().toExtend<Buttons>();
    expectTypeOf<'split'>().toExtend<Buttons>();
    expectTypeOf<string>().toExtend<Buttons>();
    expectTypeOf<Buttons>().toExtend<boolean | string>();
    expectTypeOf<undefined>().toExtend<BankaiInputNumberProps['buttons']>();
  });
});

describe('BankaiInputNumberSlots', () => {
  test('exposes optional decrement/increment control slots', () => {
    expectTypeOf<BankaiInputNumberSlots>().toEqualTypeOf<{
      decrement?: () => VNode[];
      increment?: () => VNode[];
    }>();
  });
});

describe('BankaiInputNumberExposes', () => {
  test('exposes the native element plus focus/blur/select and stepUp/stepDown', () => {
    expectTypeOf<BankaiInputNumberExposes>().toEqualTypeOf<{
      readonly el: HTMLInputElement | null;
      focus: (options?: FocusOptions) => void;
      blur: () => void;
      select: () => void;
      stepUp: (count?: number) => void;
      stepDown: (count?: number) => void;
    }>();
  });
});
