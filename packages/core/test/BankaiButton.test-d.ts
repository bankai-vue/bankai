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
  test('suggests the shipped variants but accepts any string (custom data-variant rules)', () => {
    expectTypeOf<BankaiButtonVariant>().toEqualTypeOf<
      LiteralUnion<'solid' | 'outline' | 'ghost', string>
    >();
    // Shipped variants are first-class members.
    expectTypeOf<'solid'>().toExtend<BankaiButtonVariant>();
    expectTypeOf<'ghost'>().toExtend<BankaiButtonVariant>();
    // The escape hatch accepts any string (a consumer-defined `[data-variant='brand']`).
    expectTypeOf<'brand'>().toExtend<BankaiButtonVariant>();
    expectTypeOf<string>().toExtend<BankaiButtonVariant>();
  });
});

describe('BankaiButtonSize', () => {
  test('suggests the shipped sizes but accepts any string (custom data-size rules)', () => {
    expectTypeOf<BankaiButtonSize>().toEqualTypeOf<LiteralUnion<'sm' | 'md' | 'lg', string>>();
    // Shipped steps are first-class members.
    expectTypeOf<'md'>().toExtend<BankaiButtonSize>();
    // The escape hatch accepts any string (a consumer-defined `[data-size='xl']`).
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
