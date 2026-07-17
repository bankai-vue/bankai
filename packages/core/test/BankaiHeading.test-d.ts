import type { BankaiHeadingLevel, BankaiHeadingProps, BankaiHeadingSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiHeading's public type surface. These lock the exported shapes so a rename,
// widened union, or a `level` that stops being required is a failing test rather than a silent breaking
// change for consumers.

describe('BankaiHeadingLevel', () => {
  test('is exactly the numeric literals 1–6', () => {
    expectTypeOf<BankaiHeadingLevel>().toEqualTypeOf<1 | 2 | 3 | 4 | 5 | 6>();
    // Out-of-range and non-numeric levels are rejected.
    expectTypeOf<0>().not.toExtend<BankaiHeadingLevel>();
    expectTypeOf<7>().not.toExtend<BankaiHeadingLevel>();
    expectTypeOf<number>().not.toExtend<BankaiHeadingLevel>();
    expectTypeOf<'1'>().not.toExtend<BankaiHeadingLevel>();
  });
});

describe('BankaiHeadingProps', () => {
  test('exposes level as a REQUIRED BankaiHeadingLevel — the only prop', () => {
    // `level` is required (no `?`): there is no safe default heading level, so the author must state it.
    // A dropped `required`, a widened type, or an added prop all fail here.
    expectTypeOf<BankaiHeadingProps>().toEqualTypeOf<{
      level: BankaiHeadingLevel;
    }>();
  });
});

describe('BankaiHeadingSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiHeadingSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
