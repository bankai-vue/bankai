import type { ReflectedProp } from '../src/internal/reflect';
import { describe, expectTypeOf, test } from 'vitest';
import { reflectNamed } from '../src/internal/reflect';

// Type-level contract of `reflectNamed`'s number-aware generic. `data` is always
// the recognised keyword, so it stays `string | undefined`; `escape` carries the
// verbatim value, so its type tracks the input `T` — a numeric `weight` stays
// `number` rather than being flattened to `string`. Locked in as a test.

const NAMED = new Set<string>(['start', 'center', 'end']);

describe('ReflectedProp', () => {
  test('`data` is always `string | undefined`, regardless of the value type', () => {
    expectTypeOf<ReflectedProp['data']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ReflectedProp<number>['data']>().toEqualTypeOf<string | undefined>();
  });

  test('`escape` tracks the value type `T`, defaulting to `string`', () => {
    expectTypeOf<ReflectedProp['escape']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ReflectedProp<number>['escape']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<ReflectedProp<string | number>['escape']>().toEqualTypeOf<
      string | number | undefined
    >();
  });
});

describe('reflectNamed', () => {
  test('accepts a string or number value, and returns a `ReflectedProp`', () => {
    // The Flex/Grid `align`/`justify` (string) and BankaiText `weight` (number) cases.
    expectTypeOf(reflectNamed).toBeCallableWith('center', NAMED);
    expectTypeOf(reflectNamed).toBeCallableWith(350, NAMED);
    expectTypeOf(reflectNamed).returns.toExtend<ReflectedProp<string | number>>();
  });

  test('constrains the value to `string | number`', () => {
    expectTypeOf(reflectNamed).parameter(0).toEqualTypeOf<string | number | undefined>();
    // @ts-expect-error — a boolean is outside `T extends string | number`.
    reflectNamed(true, NAMED);
  });
});
