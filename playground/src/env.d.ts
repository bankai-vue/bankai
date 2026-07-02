/// <reference types="vite/client" />

// tsgo (TS 7 preview) can't parse `.vue` SFCs, so give it an ambient type for
// `*.vue` imports. vue-tsc still resolves the real component types separately.
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
