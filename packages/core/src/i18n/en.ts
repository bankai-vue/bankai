import type { BankaiMessages } from './types';

/**
 * The built-in English messages — the complete {@link BankaiMessages} base every locale bundle is
 * deep-merged over. It is always present (no import needed to use it), so a registered bundle may be
 * partial: any key it omits resolves here rather than to an empty string. It is also the ultimate
 * fallback at the end of the locale resolution chain.
 */
export const enMessages: BankaiMessages = {
  codeBlock: {
    copy: 'Copy',
    copied: 'Copied',
  },
};
