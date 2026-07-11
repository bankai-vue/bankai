import type { BankaiLinkProps, BankaiLinkSlots, BankaiLinkTo } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiLink's public type surface. These lock the exported shapes so a rename, a
// dropped `?`, or a changed prop type is a failing test rather than a silent breaking change.
//
// NOTE on `BankaiLinkTo`: it resolves through the global `BankaiLinkTypeRegistry`, which THIS repo's own
// program augments with vue-router's `RouteLocationRaw` (via `src/vue-router.ts`, part of the typecheck).
// So in-repo `BankaiLinkTo` is the router type; a router-free consumer's dist gets the loose fallback
// instead (verified against the built dist, not here). The assertions below hold under either resolution.

describe('BankaiLinkTo', () => {
  test('accepts a string path target', () => {
    expectTypeOf<string>().toExtend<BankaiLinkTo>();
  });

  test('accepts an object route target', () => {
    // A path-style location object is valid under both the router type and the fallback.
    expectTypeOf<{ path: string }>().toExtend<BankaiLinkTo>();
  });
});

describe('BankaiLinkProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    expectTypeOf<BankaiLinkProps>().toEqualTypeOf<{
      to?: BankaiLinkTo;
      href?: string;
      external?: boolean;
    }>();
  });
});

describe('BankaiLinkSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiLinkSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
