import { expect, test } from 'vitest';
import { localesToInject, renderPluginContents } from '../src/plugin';

// Unit tests for the module's i18n auto-injection + plugin rendering — the pure logic behind the
// generated `createBankai` plugin. Kept node-free (like `discover.ts`) so these feed it config +
// available-locale fixtures directly; `module.ts` wires the result into `addPluginTemplate`.

// Core ships a `de` bundle in these tests; the real list comes from `@bankai-vue/core`'s `availableLocales`.
const AVAILABLE = ['de'] as const;

test('injects nothing when no i18n is configured', () => {
  expect(localesToInject({ idGeneration: true }, AVAILABLE)).toStrictEqual([]);
});

test('injects the bundle for a configured built-in locale', () => {
  expect(localesToInject({ i18n: { locale: 'de' } }, AVAILABLE)).toStrictEqual(['de']);
});

test('a regional locale pulls in its base-language bundle (de-AT → de)', () => {
  expect(localesToInject({ i18n: { locale: 'de-AT' } }, AVAILABLE)).toStrictEqual(['de']);
});

test('fallbackLocale also triggers injection', () => {
  expect(
    localesToInject({ i18n: { locale: 'gsw', fallbackLocale: 'de' } }, AVAILABLE),
  ).toStrictEqual(['de']);
});

test('does not inject a locale the consumer already registered', () => {
  const injected = localesToInject(
    { i18n: { locale: 'de', messages: { de: { codeBlock: { copy: 'Kopieren' } } } } },
    AVAILABLE,
  );
  expect(injected).toStrictEqual([]);
});

test('does not inject a locale core ships no bundle for', () => {
  expect(localesToInject({ i18n: { locale: 'fr' } }, AVAILABLE)).toStrictEqual([]);
  // English is the built-in base, not a registrable bundle.
  expect(localesToInject({ i18n: { locale: 'en' } }, AVAILABLE)).toStrictEqual([]);
});

test('renders the plain serialized config when nothing is injected', () => {
  const contents = renderPluginContents({ idGeneration: true }, []);
  expect(contents).toContain('import { createBankai }');
  expect(contents).toContain('createBankai({"idGeneration":true})');
  // No locale imports emitted.
  expect(contents).not.toContain('@bankai-vue/core/locales/');
});

test('emits a static bundle import and splices it into i18n.messages', () => {
  const contents = renderPluginContents({ i18n: { locale: 'de' } }, ['de']);
  expect(contents).toContain("import bankaiLocale_de from '@bankai-vue/core/locales/de';");
  expect(contents).toContain('"de": bankaiLocale_de');
  expect(contents).toContain('"locale":"de"');
  // The identifier is spliced in unquoted (a live import), not serialized as a string.
  expect(contents).not.toContain('"bankaiLocale_de"');
});

test('keeps a consumer-registered bundle alongside an injected one', () => {
  const contents = renderPluginContents(
    { i18n: { locale: 'de-AT', messages: { 'de-AT': { codeBlock: { copy: 'Kopiern' } } } } },
    ['de'],
  );
  // Registered de-AT stays (serialized), injected de is spliced in (identifier).
  expect(contents).toContain('"de-AT":{"codeBlock":{"copy":"Kopiern"}}');
  expect(contents).toContain('"de": bankaiLocale_de');
});
