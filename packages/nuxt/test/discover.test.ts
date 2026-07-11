import { expect, test } from 'vitest';
import { componentsFromExports } from '../src/discover';

// Unit tests for the module's component-discovery mapping — the one piece of real logic in the Nuxt
// module. It is pure (no I/O), so these feed it manifest `exports` fixtures directly; the module wires
// the result into `addComponent`. Note: `module.ts` itself is node-only (`node:module`, `@nuxt/kit`), so
// the testable logic deliberately lives in `discover.ts` with no such imports.

test('maps ./components/<dir>/Bankai<Name> exports to name + core subpath filePath', () => {
  const result = componentsFromExports({
    '.': { types: './dist/index.d.ts' },
    './package.json': './package.json',
    './components/text/BankaiText': { import: './dist/components/text/BankaiText.js' },
    './components/container/BankaiContainer': {},
  });

  expect(result).toStrictEqual([
    { name: 'BankaiText', filePath: '@bankai-vue/core/components/text/BankaiText' },
    { name: 'BankaiContainer', filePath: '@bankai-vue/core/components/container/BankaiContainer' },
  ]);
});

test('ignores non-component subpaths (root barrel, version, config, composables)', () => {
  const result = componentsFromExports({
    '.': {},
    './version': {},
    './config': {},
    './composables/useBankaiId': {},
    './package.json': './package.json',
  });

  expect(result).toStrictEqual([]);
});

test('ignores a components subpath whose leaf is not a Bankai* component', () => {
  const result = componentsFromExports({
    // e.g. a barrel export — not a component
    './components/index': {},
    './components/text/BankaiText': {},
  });

  expect(result).toStrictEqual([
    { name: 'BankaiText', filePath: '@bankai-vue/core/components/text/BankaiText' },
  ]);
});

test('takes the name from the last path segment, so a flatter components/ layout still works', () => {
  // Guards the "survives a components/ restructure" claim: no dependence on the two-segment shape.
  const result = componentsFromExports({ './components/BankaiText': {} });

  expect(result).toStrictEqual([
    { name: 'BankaiText', filePath: '@bankai-vue/core/components/BankaiText' },
  ]);
});

test('degrades to [] when exports is not an object', () => {
  // Covers both guard branches: `null` (typeof is "object") and a non-object value (a string, as an
  // unreadable manifest would surface). The module's reader also passes the missing-manifest case through
  // this same path.
  expect(componentsFromExports(null)).toStrictEqual([]);
  expect(componentsFromExports('./components/text/BankaiText')).toStrictEqual([]);
});
