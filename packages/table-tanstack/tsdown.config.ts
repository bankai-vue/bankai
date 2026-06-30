import { defineConfig } from "tsdown";

// Adapter package — both `vue` and the TanStack engine are peerDependencies and
// stay external automatically. TanStack is an OPTIONAL peer (SPEC.md §4.10):
// installing bankai-vue without it must not break, so it is never bundled in.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["es"],
  dts: true,
  clean: true,
  // ESM-only project — CommonJS is out of scope. With "type": "module", plain
  // `.js`/`.d.ts` is unambiguously ESM, so skip tsdown's `.mjs`/`.d.mts` default.
  fixedExtension: false,
});
