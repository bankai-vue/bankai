import type { BankaiCodeSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiCode's public type surface. BankaiCode is a pure wrapper today (no props),
// so the only exported shape is its slots — locking it here makes a rename or a dropped `?` a failing
// test rather than a silent breaking change. A future polymorphic `as` prop would add a `BankaiCodeProps`
// / `BankaiCodeAs` export, which is additive to this surface.

describe('BankaiCodeSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiCodeSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
