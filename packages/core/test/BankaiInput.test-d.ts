import type {
  BankaiInputDisabled,
  BankaiInputExposes,
  BankaiInputModelValue,
  BankaiInputProps,
  BankaiInputReadonly,
  BankaiInputSize,
  BankaiInputType,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiInput's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiInputType', () => {
  test('is the named text steps plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiInputType>().toEqualTypeOf<
      LiteralUnion<'text' | 'email' | 'search' | 'tel' | 'url', string>
    >();
    // Named types and any other string both type-check (the escape hatch).
    expectTypeOf<'text'>().toExtend<BankaiInputType>();
    expectTypeOf<'password'>().toExtend<BankaiInputType>();
    expectTypeOf<string>().toExtend<BankaiInputType>();
  });
});

describe('BankaiInputSize', () => {
  test('is the named steps plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiInputSize>().toEqualTypeOf<LiteralUnion<'sm' | 'md' | 'lg', string>>();
    expectTypeOf<'md'>().toExtend<BankaiInputSize>();
    expectTypeOf<'xl'>().toExtend<BankaiInputSize>();
    expectTypeOf<string>().toExtend<BankaiInputSize>();
  });
});

describe('BankaiInputModelValue', () => {
  test('is the string value type (undefined-when-unset comes from the optional binding)', () => {
    // The exported alias is the value type. The model resolves to `string | undefined` because the
    // v-model binding is optional (unset = undefined) — that undefined is not part of this value alias.
    expectTypeOf<BankaiInputModelValue>().toEqualTypeOf<string>();
  });
});

describe('BankaiInputDisabled', () => {
  test('mirrors the native disabled boolean', () => {
    expectTypeOf<BankaiInputDisabled>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputDisabled>().toEqualTypeOf<HTMLInputElement['disabled']>();
  });
});

describe('BankaiInputReadonly', () => {
  test('mirrors the native readOnly boolean', () => {
    expectTypeOf<BankaiInputReadonly>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiInputReadonly>().toEqualTypeOf<HTMLInputElement['readOnly']>();
  });
});

describe('BankaiInputProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    // Each prop is optional (`?`) and typed to its dedicated alias — a widened
    // union, a dropped `?`, or a rename all fail here. `modelValue` is provided
    // by `defineModel`, not this interface.
    expectTypeOf<BankaiInputProps>().toEqualTypeOf<{
      type?: BankaiInputType;
      size?: BankaiInputSize;
      disabled?: BankaiInputDisabled;
      readonly?: BankaiInputReadonly;
    }>();
  });
});

describe('BankaiInputExposes', () => {
  test('exposes the native element plus focus/blur/select', () => {
    expectTypeOf<BankaiInputExposes>().toEqualTypeOf<{
      readonly el: HTMLInputElement | null;
      focus: (options?: FocusOptions) => void;
      blur: () => void;
      select: () => void;
    }>();
  });
});
