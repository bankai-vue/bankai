import type {
  BankaiTextAs,
  BankaiTextElement,
  BankaiTextProps,
  BankaiTextSize,
  BankaiTextSlots,
  BankaiTextTone,
  BankaiTextWeight,
} from '../src/index';
import type { LiteralUnion } from '../src/internal/types';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiText's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiTextElement', () => {
  test('is the curated non-interactive phrasing set', () => {
    expectTypeOf<'span'>().toExtend<BankaiTextElement>();
    expectTypeOf<'strong'>().toExtend<BankaiTextElement>();
    expectTypeOf<'code'>().toExtend<BankaiTextElement>();
    // Flow/block, interactive phrasing, headings, and void elements are excluded from the set.
    expectTypeOf<'div'>().not.toExtend<BankaiTextElement>();
    expectTypeOf<'a'>().not.toExtend<BankaiTextElement>();
    expectTypeOf<'button'>().not.toExtend<BankaiTextElement>();
    expectTypeOf<'h1'>().not.toExtend<BankaiTextElement>();
    expectTypeOf<'br'>().not.toExtend<BankaiTextElement>();
  });
});

describe('BankaiTextAs', () => {
  test('suggests the phrasing set but accepts any tag string (custom elements)', () => {
    expectTypeOf<BankaiTextAs>().toEqualTypeOf<LiteralUnion<BankaiTextElement, string>>();
    // Phrasing elements are first-class members.
    expectTypeOf<'span'>().toExtend<BankaiTextAs>();
    expectTypeOf<'mark'>().toExtend<BankaiTextAs>();
    // The escape hatch accepts any tag string (e.g. a custom element).
    expectTypeOf<'my-widget'>().toExtend<BankaiTextAs>();
    expectTypeOf<string>().toExtend<BankaiTextAs>();
  });
});

describe('BankaiTextSize', () => {
  test('suggests the t-shirt scale but accepts any CSS length string', () => {
    expectTypeOf<BankaiTextSize>().toEqualTypeOf<
      LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>
    >();
    expectTypeOf<'lg'>().toExtend<BankaiTextSize>();
    expectTypeOf<'1.5rem'>().toExtend<BankaiTextSize>();
    expectTypeOf<string>().toExtend<BankaiTextSize>();
  });
});

describe('BankaiTextWeight', () => {
  test('is the closed set of named weights (thin…black); the numeric escape hatch lives on the prop', () => {
    expectTypeOf<BankaiTextWeight>().toEqualTypeOf<
      | 'thin'
      | 'extralight'
      | 'light'
      | 'normal'
      | 'medium'
      | 'semibold'
      | 'bold'
      | 'extrabold'
      | 'black'
    >();
  });
});

describe('BankaiTextTone', () => {
  test('suggests the neutral tones but accepts any CSS color string', () => {
    expectTypeOf<BankaiTextTone>().toEqualTypeOf<
      LiteralUnion<'default' | 'muted' | 'subtle', string>
    >();
    expectTypeOf<'muted'>().toExtend<BankaiTextTone>();
    expectTypeOf<'#ff8800'>().toExtend<BankaiTextTone>();
    expectTypeOf<string>().toExtend<BankaiTextTone>();
  });
});

describe('BankaiTextProps', () => {
  test('exposes as/size/tone/truncate as optional with their dedicated types', () => {
    // A widened union, a dropped `?`, or a rename fails here. `weight` is checked
    // separately below — a `<imported alias> | number` union in this object literal
    // trips oxlint's type-aware pass (`typeCheck: false`, so it can't resolve the alias).
    expectTypeOf<Omit<BankaiTextProps, 'weight'>>().toEqualTypeOf<{
      as?: BankaiTextAs;
      size?: BankaiTextSize;
      tone?: BankaiTextTone;
      truncate?: boolean;
    }>();
  });

  test('weight accepts the named scale, any number, and any string (var/calc), but nothing else', () => {
    type Weight = NonNullable<BankaiTextProps['weight']>;
    // Accepts every named step, any number (wght axis), and any string (var/calc/…);
    // nothing beyond `string | number`; and `undefined` keeps the prop optional.
    expectTypeOf<BankaiTextWeight>().toExtend<Weight>();
    expectTypeOf<number>().toExtend<Weight>();
    expectTypeOf<string>().toExtend<Weight>();
    expectTypeOf<Weight>().toExtend<string | number>();
    expectTypeOf<undefined>().toExtend<BankaiTextProps['weight']>();
  });
});

describe('BankaiTextSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiTextSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
