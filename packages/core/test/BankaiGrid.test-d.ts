import type {
  BankaiGridAlign,
  BankaiGridAreas,
  BankaiGridAs,
  BankaiGridColumns,
  BankaiGridFlow,
  BankaiGridGap,
  BankaiGridJustify,
  BankaiGridProps,
  BankaiGridRows,
  BankaiGridSlots,
} from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiGrid's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiGridAs', () => {
  test('is any non-void HTML tag name', () => {
    expectTypeOf<'div'>().toExtend<BankaiGridAs>();
    expectTypeOf<'section'>().toExtend<BankaiGridAs>();
    // It's a subset of all tag names...
    expectTypeOf<BankaiGridAs>().toExtend<keyof HTMLElementTagNameMap>();
    // ...but void elements are excluded, since a grid container holds children.
    expectTypeOf<'input'>().not.toExtend<BankaiGridAs>();
    expectTypeOf<'br'>().not.toExtend<BankaiGridAs>();
    expectTypeOf<'img'>().not.toExtend<BankaiGridAs>();
  });
});

describe('BankaiGridColumns', () => {
  test('accepts a number (track count) or a string (verbatim template)', () => {
    expectTypeOf<BankaiGridColumns>().toEqualTypeOf<number | string>();
  });
});

describe('BankaiGridRows', () => {
  test('accepts a number (track count) or a string (verbatim template)', () => {
    expectTypeOf<BankaiGridRows>().toEqualTypeOf<number | string>();
  });
});

describe('BankaiGridAreas', () => {
  test('accepts a string (verbatim) or a string array (one row per entry)', () => {
    expectTypeOf<BankaiGridAreas>().toEqualTypeOf<string | string[]>();
  });
});

describe('BankaiGridGap', () => {
  test('accepts a number (spacing-scale step) or a string (verbatim CSS length)', () => {
    expectTypeOf<BankaiGridGap>().toEqualTypeOf<number | string>();
  });
});

describe('BankaiGridFlow', () => {
  test('is the closed set of grid-auto-flow keywords', () => {
    expectTypeOf<BankaiGridFlow>().toEqualTypeOf<
      'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'
    >();
  });
});

describe('BankaiGridAlign', () => {
  test('is the closed set of align-items box-alignment keywords', () => {
    expectTypeOf<BankaiGridAlign>().toEqualTypeOf<
      'start' | 'end' | 'center' | 'baseline' | 'stretch'
    >();
  });
});

describe('BankaiGridJustify', () => {
  test('is the closed set of justify-items box-alignment keywords', () => {
    expectTypeOf<BankaiGridJustify>().toEqualTypeOf<'start' | 'end' | 'center' | 'stretch'>();
  });
});

describe('BankaiGridProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    // Each prop is optional (`?`) and typed to its dedicated alias — a widened
    // union, a dropped `?`, or a rename all fail here.
    expectTypeOf<BankaiGridProps>().toEqualTypeOf<{
      as?: BankaiGridAs;
      columns?: BankaiGridColumns;
      rows?: BankaiGridRows;
      areas?: BankaiGridAreas;
      gap?: BankaiGridGap;
      flow?: BankaiGridFlow;
      align?: BankaiGridAlign;
      justify?: BankaiGridJustify;
      inline?: boolean;
    }>();
  });
});

describe('BankaiGridSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiGridSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
