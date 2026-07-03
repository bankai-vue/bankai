import type { ComputedRef } from 'vue';
import { computed, useAttrs } from 'vue';
import { useBankaiConfig } from '../config';
import { usePrefixedId } from './usePrefixedId';

/**
 * Resolves the `id` for a Bankai component.
 * A consumer-supplied `id` always wins; otherwise a hydration-stable id is generated
 * from Vue's `useId` (see {@link usePrefixedId}), unless id generation is disabled via
 * {@link useBankaiConfig}, in which case the resolved id is `undefined`.
 *
 * @param prefix - Prefix for the generated id, typically the component's kebab-case name.
 */
export function useBankaiId(prefix: string): ComputedRef<string | undefined> {
  const attrs = useAttrs();
  const config = useBankaiConfig();
  const generatedId = usePrefixedId(prefix);

  return computed<string | undefined>(() => {
    const provided = attrs.id;
    if (typeof provided === 'string' && provided.length > 0) {
      return provided;
    }

    return config.idGeneration ? generatedId : undefined;
  });
}
