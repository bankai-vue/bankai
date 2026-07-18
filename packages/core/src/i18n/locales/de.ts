import type { DeepPartial } from '../../internal/types';
import type { BankaiMessages } from '../types';

/**
 * German (`de`) message bundle. Register it under {@link BankaiI18nConfig.messages} and set
 * `locale: 'de'` (or a regional variant like `de-AT`, which falls back to `de`). It is a
 * {@link DeepPartial} of {@link BankaiMessages}: keys it omits fall through to the English base.
 *
 * @example
 * import { de } from '@bankai-vue/core/locales';
 * createBankai({ i18n: { locale: 'de', messages: { de } } });
 */
const de: DeepPartial<BankaiMessages> = {
  codeBlock: {
    copy: 'Kopieren',
    copied: 'Kopiert',
  },
};

export default de;
