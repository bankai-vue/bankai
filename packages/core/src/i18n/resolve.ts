import type { DeepPartial } from '../internal/types';
import type { BankaiMessages } from './types';
import { enMessages } from './en';

// Pure message-resolution logic (no Vue): given the active locale, a cross-family fallback, and a
// registry of (possibly partial) bundles, produce a complete `BankaiMessages` by merging the matching
// bundles over the English base. Kept framework-free so it is trivially unit-testable and
// `useBankaiMessage` is a thin reactive wrapper over it.

/**
 * Merges one (possibly partial) bundle over a complete message set, per namespace. A `BankaiMessages`
 * namespace is a flat map of string keys (the SPEC convention), so a shallow spread per namespace is a
 * complete merge — a key the patch omits keeps the base value. Each namespace is listed explicitly so
 * the merge stays assertion-free and the compiler flags a namespace added to `BankaiMessages` but not
 * handled here (the returned object would be missing a required property).
 */
function mergeMessages(base: BankaiMessages, patch: DeepPartial<BankaiMessages>): BankaiMessages {
  return {
    codeBlock: { ...base.codeBlock, ...patch.codeBlock },
  };
}

/**
 * Expands a locale into itself plus its broader parents, broadest first: `de-AT` → `['de', 'de-AT']`.
 * Broadest-first is the low→high merge order — a `de-AT` app inherits every `de` string, and its own
 * `de-AT` bundle (applied last) wins the overlap. An empty/falsy locale expands to `[]`.
 */
function expandLocale(locale: string): string[] {
  const parts = locale.split('-').filter((part) => part.length > 0);
  const chain: string[] = [];
  for (let end = 1; end <= parts.length; end++) {
    chain.push(parts.slice(0, end).join('-'));
  }

  return chain;
}

/**
 * Resolves the complete {@link BankaiMessages} for an active locale.
 *
 * Bundles are applied broadest → most specific over the English base, so the most specific match
 * wins and any unmatched key falls through: active `locale` (and its regional parents) →
 * `fallbackLocale` (and its parents) → English base. A locale in the chain with no registered bundle
 * is skipped. Registered bundles may be partial ({@link DeepPartial}).
 *
 * @param locale - The active locale (e.g. `'de'`, `'de-AT'`).
 * @param fallbackLocale - Cross-family fallback tried before the English base (e.g. `'gsw'` → `'de'`).
 * @param messages - Registered bundles keyed by locale.
 */
export function resolveMessages(
  locale: string,
  fallbackLocale: string,
  messages: Record<string, DeepPartial<BankaiMessages>>,
): BankaiMessages {
  // Priority low → high: fallback chain (broad→specific), then the active-locale chain, so the active
  // locale outranks the fallback and, within each, the most specific bundle is applied last and wins.
  const priorityLowToHigh = [...expandLocale(fallbackLocale), ...expandLocale(locale)];

  // Keep each code at its HIGHEST-priority (last) position, so a code shared by both chains asserts
  // the active locale's priority rather than being pinned by its first, lower-priority occurrence.
  const seen = new Set<string>();
  const order: string[] = [];
  for (let index = priorityLowToHigh.length - 1; index >= 0; index--) {
    const code = priorityLowToHigh[index]!;
    if (!seen.has(code)) {
      seen.add(code);
      order.unshift(code);
    }
  }

  let resolved = enMessages;
  for (const code of order) {
    const bundle = messages[code];
    if (bundle !== undefined) {
      resolved = mergeMessages(resolved, bundle);
    }
  }

  return resolved;
}
