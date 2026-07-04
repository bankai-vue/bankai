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
import type { VoidElementTagName } from '../src/internal/dom';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiFlex's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiFlexAs', () => {
  test('suggests non-void HTML tag names but accepts any tag string (custom elements)', () => {
    expectTypeOf<BankaiFlexAs>().toEqualTypeOf<
      LiteralUnion<Exclude<keyof HTMLElementTagNameMap, VoidElementTagName>, string>
    >();
    // Non-void tags are first-class members...
    expectTypeOf<'div'>().toExtend<BankaiFlexAs>();
    expectTypeOf<'section'>().toExtend<BankaiFlexAs>();
    // ...void elements are excluded from the *suggestions* (a flex container holds children),
    // but the string escape hatch still accepts any tag — including a custom element.
    expectTypeOf<'input'>().not.toExtend<
      Exclude<keyof HTMLElementTagNameMap, VoidElementTagName>
    >();
    expectTypeOf<'my-widget'>().toExtend<BankaiFlexAs>();
    expectTypeOf<string>().toExtend<BankaiFlexAs>();
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
  test('suggests the t-shirt scale and accepts any number or CSS length string', () => {
    // `number` is a numeric spacing-scale step; a named `xs`–`2xl` step is a named token;
    // any other string is a verbatim CSS length/keyword. Nothing beyond `string | number`.
    expectTypeOf<BankaiFlexGap>().toEqualTypeOf<
      LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string> | number
    >();
    expectTypeOf<'md'>().toExtend<BankaiFlexGap>();
    expectTypeOf<number>().toExtend<BankaiFlexGap>();
    expectTypeOf<'1rem'>().toExtend<BankaiFlexGap>();
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
