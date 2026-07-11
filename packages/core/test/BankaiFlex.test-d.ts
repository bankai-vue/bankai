import type {
  BankaiFlexAlign,
  BankaiFlexAs,
  BankaiFlexDirection,
  BankaiFlexGap,
  BankaiFlexJustify,
  BankaiFlexProps,
  BankaiFlexSlots,
  BankaiFlexWrap,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiFlex's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiFlexAs', () => {
  test('is any non-void HTML tag name', () => {
    expectTypeOf<'div'>().toExtend<BankaiFlexAs>();
    expectTypeOf<'section'>().toExtend<BankaiFlexAs>();
    // It's a subset of all tag names...
    expectTypeOf<BankaiFlexAs>().toExtend<keyof HTMLElementTagNameMap>();
    // ...but void elements are excluded, since a flex container holds children.
    expectTypeOf<'input'>().not.toExtend<BankaiFlexAs>();
    expectTypeOf<'br'>().not.toExtend<BankaiFlexAs>();
    expectTypeOf<'img'>().not.toExtend<BankaiFlexAs>();
  });
});

describe('BankaiFlexDirection', () => {
  test('is the closed set of flex-direction keywords', () => {
    expectTypeOf<BankaiFlexDirection>().toEqualTypeOf<
      'row' | 'row-reverse' | 'column' | 'column-reverse'
    >();
  });
});

describe('BankaiFlexAlign', () => {
  test('suggests the align-items shorthands but accepts any verbatim CSS value', () => {
    expectTypeOf<BankaiFlexAlign>().toEqualTypeOf<
      LiteralUnion<'start' | 'end' | 'center' | 'baseline' | 'stretch', string>
    >();
    expectTypeOf<'start'>().toExtend<BankaiFlexAlign>();
    expectTypeOf<'flex-start'>().toExtend<BankaiFlexAlign>();
    expectTypeOf<string>().toExtend<BankaiFlexAlign>();
  });
});

describe('BankaiFlexJustify', () => {
  test('suggests the justify-content shorthands but accepts any verbatim CSS value', () => {
    expectTypeOf<BankaiFlexJustify>().toEqualTypeOf<
      LiteralUnion<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly', string>
    >();
    expectTypeOf<'between'>().toExtend<BankaiFlexJustify>();
    expectTypeOf<'space-between'>().toExtend<BankaiFlexJustify>();
    expectTypeOf<string>().toExtend<BankaiFlexJustify>();
  });
});

describe('BankaiFlexWrap', () => {
  test('is the closed set of flex-wrap keywords', () => {
    expectTypeOf<BankaiFlexWrap>().toEqualTypeOf<'nowrap' | 'wrap' | 'wrap-reverse'>();
  });
});

describe('BankaiFlexGap', () => {
  test('suggests named t-shirt steps; accepts any number (scale step) and any string (verbatim length)', () => {
    // A `LiteralUnion<…, string> | number` union in a `toEqualTypeOf` type arg trips oxlint's
    // type-aware pass (it can't resolve the alias), so assert the shape with `toExtend` instead.
    expectTypeOf<'md'>().toExtend<BankaiFlexGap>();
    expectTypeOf<number>().toExtend<BankaiFlexGap>();
    expectTypeOf<string>().toExtend<BankaiFlexGap>();
    expectTypeOf<BankaiFlexGap>().toExtend<string | number>();
  });
});

describe('BankaiFlexProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    // Each prop is optional (`?`) and typed to its dedicated alias — a widened
    // union, a dropped `?`, or a rename all fail here.
    expectTypeOf<BankaiFlexProps>().toEqualTypeOf<{
      as?: BankaiFlexAs;
      direction?: BankaiFlexDirection;
      align?: BankaiFlexAlign;
      justify?: BankaiFlexJustify;
      gap?: BankaiFlexGap;
      wrap?: BankaiFlexWrap;
      inline?: boolean;
    }>();
  });
});

describe('BankaiFlexSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiFlexSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
