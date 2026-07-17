import type { BankaiHeaderSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiHeader's public type surface. BankaiHeader is a pure region wrapper today
// (no props), so the only exported shape is its slots — locking it here makes a rename or a dropped `?`
// a failing test rather than a silent breaking change. A future prop would add a `BankaiHeaderProps`
// export, which is additive to this surface.

describe('BankaiHeaderSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiHeaderSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
