import type { BankaiCodeBlockProps, BankaiCodeBlockSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiCodeBlock's public type surface. These lock the exported shapes so a
// rename, a widened type, or a dropped/added `?` is a failing test rather than a silent breaking change.

describe('BankaiCodeBlockProps', () => {
  test('exposes the expected props with `code` required and the rest optional', () => {
    expectTypeOf<BankaiCodeBlockProps>().toEqualTypeOf<{
      code: string;
      language?: string;
      copyable?: boolean;
      copyLabel?: string;
      copiedLabel?: string;
      copiedDuration?: number;
    }>();
  });

  test('`code` is required — omitting it is a type error', () => {
    expectTypeOf<BankaiCodeBlockProps>().toHaveProperty('code');
    // A props object without `code` does not satisfy the type.
    expectTypeOf<{ language: 'ts' }>().not.toExtend<BankaiCodeBlockProps>();
  });
});

describe('BankaiCodeBlockSlots', () => {
  test('has an optional default slot and a `copy` slot receiving the copied state', () => {
    expectTypeOf<BankaiCodeBlockSlots>().toEqualTypeOf<{
      default?: () => VNode[];
      copy?: (props: { copied: boolean }) => VNode[];
    }>();
  });
});
