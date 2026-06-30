import { defineConfig } from "tsdown";

// Per-entry, tree-shakeable, side-effect-free ESM output (SPEC.md §4.5).
// Each entry maps 1:1 to an export in package.json so consumers only pull what
// they import. `vue` is a peerDependency, so tsdown keeps it external
// automatically — never bundled into core (SPEC.md §4.13).
export default defineConfig({
  entry: ["src/index.ts", "src/version.ts", "src/composables/usePrefixedId.ts"],
  format: ["es"],
  dts: true,
  clean: true,
  // ESM-only project — CommonJS is out of scope. With "type": "module", plain
  // `.js`/`.d.ts` is unambiguously ESM, so skip tsdown's `.mjs`/`.d.mts` default.
  fixedExtension: false,
});
