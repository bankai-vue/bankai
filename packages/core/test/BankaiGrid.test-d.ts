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
import type { LiteralUnion } from '../src/internal/types';
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
  test('suggests named t-shirt steps; accepts any number (scale step) and any string (verbatim length)', () => {
    // A `LiteralUnion<…, string> | number` union in a `toEqualTypeOf` type arg trips oxlint's
    // type-aware pass (it can't resolve the alias), so assert the shape with `toExtend` instead.
    expectTypeOf<'md'>().toExtend<BankaiGridGap>();
    expectTypeOf<number>().toExtend<BankaiGridGap>();
    expectTypeOf<string>().toExtend<BankaiGridGap>();
    expectTypeOf<BankaiGridGap>().toExtend<string | number>();
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
  test('suggests the align-items keywords but accepts any verbatim CSS value', () => {
    expectTypeOf<BankaiGridAlign>().toEqualTypeOf<
      LiteralUnion<'start' | 'end' | 'center' | 'baseline' | 'stretch', string>
    >();
    expectTypeOf<'start'>().toExtend<BankaiGridAlign>();
    expectTypeOf<'flex-start'>().toExtend<BankaiGridAlign>();
    expectTypeOf<string>().toExtend<BankaiGridAlign>();
  });
});

describe('BankaiGridJustify', () => {
  test('suggests the justify-items keywords but accepts any verbatim CSS value', () => {
    expectTypeOf<BankaiGridJustify>().toEqualTypeOf<
      LiteralUnion<'start' | 'end' | 'center' | 'stretch', string>
    >();
    expectTypeOf<'center'>().toExtend<BankaiGridJustify>();
    expectTypeOf<'left'>().toExtend<BankaiGridJustify>();
    expectTypeOf<string>().toExtend<BankaiGridJustify>();
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
