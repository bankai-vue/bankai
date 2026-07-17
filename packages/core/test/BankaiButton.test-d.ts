import type {
  BankaiButtonDisabled,
  BankaiButtonProps,
  BankaiButtonSize,
  BankaiButtonSlots,
  BankaiButtonType,
  BankaiButtonVariant,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiButton's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiButtonVariant', () => {
  test('is the named house variants plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiButtonVariant>().toEqualTypeOf<
      LiteralUnion<'solid' | 'outline' | 'ghost', string>
    >();
    // Named variants and any other string both type-check (the escape hatch).
    expectTypeOf<'solid'>().toExtend<BankaiButtonVariant>();
    expectTypeOf<'brand'>().toExtend<BankaiButtonVariant>();
    expectTypeOf<string>().toExtend<BankaiButtonVariant>();
  });
});

describe('BankaiButtonSize', () => {
  test('is the named steps plus a verbatim escape hatch', () => {
    expectTypeOf<BankaiButtonSize>().toEqualTypeOf<LiteralUnion<'sm' | 'md' | 'lg', string>>();
    expectTypeOf<'md'>().toExtend<BankaiButtonSize>();
    expectTypeOf<'xl'>().toExtend<BankaiButtonSize>();
    expectTypeOf<string>().toExtend<BankaiButtonSize>();
  });
});

describe('BankaiButtonType', () => {
  test('mirrors the native button type union', () => {
    expectTypeOf<BankaiButtonType>().toEqualTypeOf<'submit' | 'reset' | 'button'>();
    expectTypeOf<BankaiButtonType>().toEqualTypeOf<HTMLButtonElement['type']>();
  });
});

describe('BankaiButtonDisabled', () => {
  test('mirrors the native disabled boolean', () => {
    expectTypeOf<BankaiButtonDisabled>().toEqualTypeOf<boolean>();
    expectTypeOf<BankaiButtonDisabled>().toEqualTypeOf<HTMLButtonElement['disabled']>();
  });
});

describe('BankaiButtonProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    // Each prop is optional (`?`) and typed to its dedicated alias — a widened
    // union, a dropped `?`, or a rename all fail here.
    expectTypeOf<BankaiButtonProps>().toEqualTypeOf<{
      variant?: BankaiButtonVariant;
      size?: BankaiButtonSize;
      type?: BankaiButtonType;
      disabled?: BankaiButtonDisabled;
    }>();
  });
});

describe('BankaiButtonSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiButtonSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
