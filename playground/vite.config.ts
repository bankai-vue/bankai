import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// Resolve @bankai-vue/core to its source for a build-free dev loop. The built
// `dist` exports map is validated separately (post-build packaging check).
// Tailwind powers the runtime theme switcher's `@bankai-vue/theme-tailwind` demo.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@bankai-vue/core': fileURLToPath(new URL('../packages/core/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
