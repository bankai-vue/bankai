import type { BankaiPageSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiPage's public type surface. BankaiPage is a pure wrapper today (no props),
// so the only exported shape is its slots — locking it here makes a rename or a dropped `?` a failing
// test rather than a silent breaking change.

describe('BankaiPageSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiPageSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
