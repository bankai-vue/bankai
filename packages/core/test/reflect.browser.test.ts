import { describe, expect, test } from 'vitest';
import { reflectNamed } from '../src/internal/reflect';

// Runtime contract of the shared `reflectNamed` helper (SPEC.md §4.4/§4.6, §4.11).
// It powers the named-keyword-vs-escape-hatch split behind BankaiFlex/BankaiGrid
// (`align`/`justify`) and BankaiText (`size`/`weight`/`tone`), so its branches are
// pinned here in isolation rather than only transitively through those components.
// Pure logic — no DOM — but runs under the shared browser provider like every test.

const NAMED = new Set<string>(['start', 'center', 'end']);

describe('reflectNamed', () => {
  test('a recognised keyword reflects as `data`, with no escape', () => {
    expect(reflectNamed('center', NAMED)).toEqual({ data: 'center', escape: undefined });
  });

  test('an unrecognised string rides the escape hatch, with no `data`', () => {
    // e.g. a verbatim native CSS value like `space-between` / `flex-start`.
    expect(reflectNamed('space-between', NAMED)).toEqual({
      data: undefined,
      escape: 'space-between',
    });
  });

  test('a number always rides the escape hatch (only a string can be a keyword)', () => {
    // The BankaiText `weight` case: a variable-font `wght` axis number.
    expect(reflectNamed(350, NAMED)).toEqual({ data: undefined, escape: 350 });
  });

  test('`undefined` (unset prop) collapses to both channels undefined', () => {
    expect(reflectNamed(undefined, NAMED)).toEqual({ data: undefined, escape: undefined });
  });

  test('the `typeof` guard runs before the Set lookup: number 400 never matches a "400" keyword', () => {
    // A numeric-looking keyword in the set must NOT be matched by the number `400`;
    // the number skips the lookup entirely and escapes, while the string `'400'` matches.
    const numericNamed = new Set<string>(['400']);
    expect(reflectNamed(400, numericNamed)).toEqual({ data: undefined, escape: 400 });
    expect(reflectNamed('400', numericNamed)).toEqual({ data: '400', escape: undefined });
  });

  test('the empty string is treated as any other string (not conflated with unset)', () => {
    expect(reflectNamed('', NAMED)).toEqual({ data: undefined, escape: '' });
  });
});
