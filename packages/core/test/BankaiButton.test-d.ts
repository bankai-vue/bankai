import type {
  BankaiButtonDisabled,
  BankaiButtonProps,
  BankaiButtonSize,
  BankaiButtonSlots,
  BankaiButtonType,
  BankaiButtonVariant,
} from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiButton's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiButtonVariant', () => {
  test('is the closed set of visual variants', () => {
    expectTypeOf<BankaiButtonVariant>().toEqualTypeOf<'solid' | 'outline' | 'ghost'>();
  });
});

describe('BankaiButtonSize', () => {
  test('is the closed set of sizes', () => {
    expectTypeOf<BankaiButtonSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>();
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
