import type {
  BankaiIconAs,
  BankaiIconElement,
  BankaiIconProps,
  BankaiIconSize,
  BankaiIconSlots,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiIcon's public type surface. These lock the exported shapes so a rename,
// widened union, or dropped `?` is a failing test rather than a silent breaking change for consumers.

describe('BankaiIconElement', () => {
  test('is the curated pair of conventional icon hosts', () => {
    expectTypeOf<'span'>().toExtend<BankaiIconElement>();
    expectTypeOf<'i'>().toExtend<BankaiIconElement>();
    // Not part of the suggested set.
    expectTypeOf<'div'>().not.toExtend<BankaiIconElement>();
    expectTypeOf<'svg'>().not.toExtend<BankaiIconElement>();
  });
});

describe('BankaiIconAs', () => {
  test('suggests the icon hosts but accepts any tag string (custom elements)', () => {
    expectTypeOf<BankaiIconAs>().toEqualTypeOf<LiteralUnion<BankaiIconElement, string>>();
    expectTypeOf<'span'>().toExtend<BankaiIconAs>();
    expectTypeOf<'i'>().toExtend<BankaiIconAs>();
    expectTypeOf<'iconify-icon'>().toExtend<BankaiIconAs>();
    expectTypeOf<string>().toExtend<BankaiIconAs>();
  });
});

describe('BankaiIconSize', () => {
  test('suggests the t-shirt scale but accepts any CSS length string', () => {
    expectTypeOf<BankaiIconSize>().toEqualTypeOf<
      LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
    >();
    expectTypeOf<'lg'>().toExtend<BankaiIconSize>();
    expectTypeOf<'20px'>().toExtend<BankaiIconSize>();
    expectTypeOf<string>().toExtend<BankaiIconSize>();
  });
});

describe('BankaiIconProps', () => {
  test('exposes as/name/size/label/noSquare as optional with their dedicated types', () => {
    // A widened union, a dropped `?`, or a rename fails here.
    expectTypeOf<BankaiIconProps>().toEqualTypeOf<{
      as?: BankaiIconAs;
      name?: string;
      size?: BankaiIconSize;
      label?: string;
      noSquare?: boolean;
    }>();
  });
});

describe('BankaiIconSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiIconSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
