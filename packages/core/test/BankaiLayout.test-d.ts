import type { BankaiLayoutSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiLayout's public type surface. It is a pure structural landmark emitter
// with no configuration props (the grid is consumer-controlled via CSS, SPEC.md §5.6), so its only
// exported type is the slots shape. Locking it means a renamed or dropped region slot is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiLayoutSlots', () => {
  test('exposes the four region slots, each optional and returning a VNode array', () => {
    expectTypeOf<BankaiLayoutSlots>().toEqualTypeOf<{
      header?: () => VNode[];
      sidebar?: () => VNode[];
      footer?: () => VNode[];
      default?: () => VNode[];
    }>();
  });
});
