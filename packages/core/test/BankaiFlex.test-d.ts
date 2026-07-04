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
  test('is the closed set of align-items shorthands', () => {
    expectTypeOf<BankaiFlexAlign>().toEqualTypeOf<
      'start' | 'end' | 'center' | 'baseline' | 'stretch'
    >();
  });
});

describe('BankaiFlexJustify', () => {
  test('is the closed set of justify-content shorthands', () => {
    expectTypeOf<BankaiFlexJustify>().toEqualTypeOf<
      'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
    >();
  });
});

describe('BankaiFlexWrap', () => {
  test('is the closed set of flex-wrap keywords', () => {
    expectTypeOf<BankaiFlexWrap>().toEqualTypeOf<'nowrap' | 'wrap' | 'wrap-reverse'>();
  });
});

describe('BankaiFlexGap', () => {
  test('accepts a number (spacing-scale step) or a string (verbatim CSS length)', () => {
    expectTypeOf<BankaiFlexGap>().toEqualTypeOf<number | string>();
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
