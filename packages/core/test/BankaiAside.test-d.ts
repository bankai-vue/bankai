import type { BankaiAsideProps, BankaiAsideSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiAside's public type surface. Locking the shape here makes a rename or a
// dropped `?` a failing test rather than a silent breaking change.

describe('BankaiAsideProps', () => {
  test('has an optional string label', () => {
    expectTypeOf<BankaiAsideProps>().toEqualTypeOf<{
      label?: string;
    }>();
  });

  test('label is optional (the component takes no required props)', () => {
    expectTypeOf<BankaiAsideProps['label']>().toEqualTypeOf<string | undefined>();
  });
});

describe('BankaiAsideSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiAsideSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
