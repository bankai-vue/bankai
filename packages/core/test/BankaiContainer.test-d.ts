import type { BankaiContainerAs, BankaiContainerProps, BankaiContainerSlots } from '../src/index';
import type { VNode } from 'vue';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for BankaiContainer's public type surface. These lock the
// exported shapes so a rename, widened union, or dropped `?` is a failing
// test rather than a silent breaking change for consumers.

describe('BankaiContainerAs', () => {
  test('is any non-void HTML tag name', () => {
    expectTypeOf<'div'>().toExtend<BankaiContainerAs>();
    expectTypeOf<'section'>().toExtend<BankaiContainerAs>();
    // It's a subset of all tag names...
    expectTypeOf<BankaiContainerAs>().toExtend<keyof HTMLElementTagNameMap>();
    // ...but void elements are excluded, since a container holds children.
    expectTypeOf<'input'>().not.toExtend<BankaiContainerAs>();
    expectTypeOf<'br'>().not.toExtend<BankaiContainerAs>();
    expectTypeOf<'img'>().not.toExtend<BankaiContainerAs>();
  });
});

describe('BankaiContainerProps', () => {
  test('exposes every prop as optional with the expected type', () => {
    // Each prop is optional (`?`) and typed to its dedicated alias — a widened
    // union, a dropped `?`, or a rename all fail here. When `size` lands it will
    // arrive as the mutually-exclusive branch of a discriminated union (keeping
    // `fluid`), which is additive to this shape.
    expectTypeOf<BankaiContainerProps>().toEqualTypeOf<{
      as?: BankaiContainerAs;
      fluid?: boolean;
    }>();
  });
});

describe('BankaiContainerSlots', () => {
  test('has an optional default slot returning a VNode array', () => {
    expectTypeOf<BankaiContainerSlots>().toEqualTypeOf<{
      default?: () => VNode[];
    }>();
  });
});
