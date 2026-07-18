/**
 * The typed registry of every user-facing default string bankai-vue components ship, namespaced by
 * component. It is the source of truth an English base ({@link enMessages}) and every locale bundle
 * (e.g. `@bankai-vue/core/locales/de`) conform to, and what {@link useBankaiMessage} resolves against.
 *
 * A component that ships default UI text adds its namespace here as a nested object of message keys —
 * designed once, so a locale bundle typo is a type error rather than a silent English fallback. A
 * bundle may be a {@link DeepPartial} of this shape; missing keys fall through to the English base.
 */
export interface BankaiMessages {
  /**
   * Messages for {@link BankaiCodeBlock}. `copy` is the copy button's idle label and accessible name;
   * `copied` is its post-copy label and the text its `role="status"` region announces.
   */
  codeBlock: {
    copy: string;
    copied: string;
  };
}
