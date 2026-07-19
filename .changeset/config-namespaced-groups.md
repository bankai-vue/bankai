---
'@bankai-vue/core': minor
---

**Breaking:** group component-scoped config under a namespace named for the component/feature it configures, so the config surface stays legible as it grows (mirroring the existing `i18n` group). Truly app-wide switches (`idGeneration`, `warnings`) stay flat.

- `linkComponent` → `link.component`
- `linkOrigin` → `link.origin`
- `linkNoopener` → `link.noopener`
- `codeBlockCopiedDuration` → `codeBlock.copiedDuration`
- `iconClass` → `icon.class`

Each group is accepted partially by `createBankai` (and the Nuxt module's `config`), e.g. `createBankai({ link: { origin: 'https://example.com' } })` keeps the group's other defaults. New exported types: `BankaiLinkConfig`, `BankaiCodeBlockConfig`, `BankaiIconConfig`.

Migration: move each flat key into its group, e.g. `createBankai({ linkOrigin })` → `createBankai({ link: { origin } })`.
