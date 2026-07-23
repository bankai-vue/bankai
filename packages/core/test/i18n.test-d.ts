import type { BankaiConfigInput, BankaiI18nConfig, BankaiMessages } from '../src/index';
import type { DeepPartial } from '../src/internal/types';
import { describe, expectTypeOf, test } from 'vitest';

// Type-level tests for the i18n config surface. Lock the public shapes so a rename or a widened field
// is a failing test rather than a silent breaking change.

describe('BankaiMessages', () => {
  test('is the namespaced registry of default UI strings', () => {
    expectTypeOf<BankaiMessages>().toEqualTypeOf<{
      codeBlock: { copy: string; copied: string };
      inputPassword: { show: string; hide: string };
    }>();
  });
});

describe('BankaiI18nConfig', () => {
  test('carries the locale, fallback, and the (partial-bundle) message registry', () => {
    expectTypeOf<BankaiI18nConfig>().toEqualTypeOf<{
      locale: string;
      fallbackLocale: string;
      messages: Record<string, DeepPartial<BankaiMessages>>;
    }>();
  });

  test('a registered bundle may be a deep-partial of BankaiMessages', () => {
    expectTypeOf<{ codeBlock: { copy: string } }>().toExtend<
      BankaiI18nConfig['messages'][string]
    >();
  });
});

describe('BankaiConfigInput', () => {
  test('accepts a partial i18n so a lone locale needs no fallbackLocale/messages', () => {
    expectTypeOf<{ i18n: { locale: 'de' } }>().toExtend<BankaiConfigInput>();
  });

  test('leaves every top-level field optional', () => {
    expectTypeOf<Record<string, never>>().toExtend<BankaiConfigInput>();
  });
});
