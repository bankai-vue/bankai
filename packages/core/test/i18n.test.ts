import type { BankaiMessages } from '../src/i18n/types';
import type { DeepPartial } from '../src/internal/types';
import { expect, test } from 'vitest';
import de from '../src/i18n/locales/de';
import { resolveMessages } from '../src/i18n/resolve';

// Pure resolution algorithm: locale/fallback chains, regional walk, and partial-bundle fallthrough
// over the English base. No Vue involved — see config.browser.test.ts for the reactive integration.

const fr: DeepPartial<BankaiMessages> = { codeBlock: { copy: 'Copier', copied: 'Copié' } };

test('with no bundles, resolves the English base', () => {
  const messages = resolveMessages('en', 'en', {});
  expect(messages.codeBlock.copy).toBe('Copy');
  expect(messages.codeBlock.copied).toBe('Copied');
});

test('resolves a registered bundle for the active locale', () => {
  const messages = resolveMessages('de', 'en', { de });
  expect(messages.codeBlock.copy).toBe('Kopieren');
  expect(messages.codeBlock.copied).toBe('Kopiert');
});

test('an unknown active locale falls through to the English base', () => {
  const messages = resolveMessages('es', 'en', { de });
  expect(messages.codeBlock.copy).toBe('Copy');
});

test('a partial bundle keeps the English base for omitted keys', () => {
  const messages = resolveMessages('de', 'en', { de: { codeBlock: { copy: 'Kopieren' } } });
  expect(messages.codeBlock.copy).toBe('Kopieren');
  expect(messages.codeBlock.copied).toBe('Copied');
});

test('a regional locale inherits its base-language bundle (de-AT → de)', () => {
  const messages = resolveMessages('de-AT', 'en', { de });
  expect(messages.codeBlock.copy).toBe('Kopieren');
});

test('a regional bundle overrides its base language for matching keys', () => {
  const messages = resolveMessages('de-AT', 'en', {
    de,
    'de-AT': { codeBlock: { copy: 'Kopiern' } },
  });
  // Regional key wins; the untouched key still inherits `de`.
  expect(messages.codeBlock.copy).toBe('Kopiern');
  expect(messages.codeBlock.copied).toBe('Kopiert');
});

test('fallbackLocale is tried for an active locale with no bundle (gsw → de)', () => {
  const messages = resolveMessages('gsw', 'de', { de });
  expect(messages.codeBlock.copy).toBe('Kopieren');
});

test('the active locale outranks fallbackLocale where both have a bundle', () => {
  const messages = resolveMessages('de', 'fr', { de, fr });
  expect(messages.codeBlock.copy).toBe('Kopieren');
});

test('a broader fallback fills keys the active bundle omits', () => {
  const messages = resolveMessages('de', 'fr', {
    de: { codeBlock: { copy: 'Kopieren' } },
    fr,
  });
  // `copy` from de (active), `copied` from fr (fallback), neither from English.
  expect(messages.codeBlock.copy).toBe('Kopieren');
  expect(messages.codeBlock.copied).toBe('Copié');
});
