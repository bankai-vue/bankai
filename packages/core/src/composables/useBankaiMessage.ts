import type { BankaiMessages } from '../i18n/types';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { useBankaiConfig } from '../config';
import { resolveMessages } from '../i18n/resolve';

/**
 * Resolves the active {@link BankaiMessages} for the current app — the complete, English-based message
 * set for the configured `i18n.locale`, `i18n.fallbackLocale`, and registered `i18n.messages` bundles
 * (see {@link BankaiI18nConfig}). Every key is guaranteed present (unmatched keys fall through to the
 * English base), so a component reads e.g. `messages.value.codeBlock.copy` without a `?.`.
 *
 * Reactive: switching `i18n.locale` at runtime recomputes and re-renders every consumer's labels.
 * A per-instance prop should still take precedence over the resolved message
 * (`copyLabel ?? messages.value.codeBlock.copy`). Must be called during a component's `setup`.
 */
export function useBankaiMessage(): ComputedRef<BankaiMessages> {
  const config = useBankaiConfig();

  return computed<BankaiMessages>(() =>
    resolveMessages(config.i18n.locale, config.i18n.fallbackLocale, config.i18n.messages),
  );
}
