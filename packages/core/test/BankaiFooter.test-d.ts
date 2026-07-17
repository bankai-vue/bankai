import type { BankaiFooterSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiFooter's public type surface. BankaiFooter is a pure wrapper today (no
// props), so the only exported shape is its slots — locking it here makes a rename or a dropped `?` a
// failing test rather than a silent breaking change.

describe('BankaiFooterSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiFooterSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
