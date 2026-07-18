import type { BankaiAppSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiApp's public type surface. BankaiApp is a pure wrapper today (no props),
// so the only exported shape is its slots — locking it here makes a rename or a dropped `?` a failing
// test rather than a silent breaking change.

describe('BankaiAppSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiAppSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
