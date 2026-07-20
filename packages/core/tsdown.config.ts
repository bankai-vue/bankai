import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

// Per-entry, tree-shakeable, side-effect-free ESM output (SPEC.md §4.5).
// Each entry maps 1:1 to an export in package.json so consumers only pull what
// they import. `vue` is a peerDependency, so tsdown keeps it external
// automatically — never bundled into core (SPEC.md §4.13).
export default defineConfig({
  entry: [
    'src/index.ts',
    'src/version.ts',
    'src/config.ts',
    'src/vue-router.ts',
    'src/i18n/locales.ts',
    'src/i18n/locales/de.ts',
    'src/composables/usePrefixedId.ts',
    'src/composables/useBankaiId.ts',
    'src/composables/useBankaiMessage.ts',
    'src/components/app/BankaiApp.vue',
    'src/components/aside/BankaiAside.vue',
    'src/components/button/BankaiButton.vue',
    'src/components/code/BankaiCode.vue',
    'src/components/code-block/BankaiCodeBlock.vue',
    'src/components/container/BankaiContainer.vue',
    'src/components/flex/BankaiFlex.vue',
    'src/components/footer/BankaiFooter.vue',
    'src/components/grid/BankaiGrid.vue',
    'src/components/header/BankaiHeader.vue',
    'src/components/heading/BankaiHeading.vue',
    'src/components/icon/BankaiIcon.vue',
    'src/components/input/BankaiInput.vue',
    'src/components/layout/BankaiLayout.vue',
    'src/components/link/BankaiLink.vue',
    'src/components/main/BankaiMain.vue',
    'src/components/page/BankaiPage.vue',
    'src/components/text/BankaiText.vue',
  ],
  format: ['es'],
  // `.vue` SFCs: unplugin-vue compiles the runtime; `dts: { vue: true }` runs
  // vue-tsc to emit accurate component/prop declarations (SPEC.md §4.8).
  dts: { vue: true },
  clean: true,
  // ESM-only project — CommonJS is out of scope. With "type": "module", plain
  // `.js`/`.d.ts` is unambiguously ESM, so skip tsdown's `.mjs`/`.d.mts` default.
  fixedExtension: false,
  plugins: [Vue()],
});
