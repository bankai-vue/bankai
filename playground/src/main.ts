import type { Component } from 'vue';
import { createApp } from 'vue';
import App from './App.vue';

// `?fixture=<name>` mounts an isolated, deterministic fixture used by e2e/visual tests; everything
// else gets the normal demo app. Fixtures auto-register: every `fixtures/*Fixture.vue` is picked up
// by Vite's eager glob and keyed by its filename (camelCase → kebab, `Fixture.vue` dropped), so
// `ButtonFixture.vue` → `button` and `FlexMappingFixture.vue` → `flex-mapping`. Adding a fixture file
// is all it takes — no import/registration line to touch (and no growing dependency list here).
const modules = import.meta.glob<{ default: Component }>('./fixtures/*Fixture.vue', {
  eager: true,
});

const fixtures: Record<string, Component> = {};
for (const [path, module] of Object.entries(modules)) {
  const key = path
    .slice('./fixtures/'.length)
    .replace(/Fixture\.vue$/u, '')
    .replaceAll(/([a-z0-9])([A-Z])/gu, '$1-$2')
    .toLowerCase();
  fixtures[key] = module.default;
}

const name = new URLSearchParams(window.location.search).get('fixture');
const fixture = name === null ? undefined : fixtures[name];

if (fixture) {
  // Fixtures pin the house theme for stable baselines. Load it before mounting so the
  // screenshot never races the styles. The demo app instead lets ThemeSwitcher pick a theme,
  // so no theme CSS is imported globally here (only one theme is ever loaded at a time).
  await import('@bankai-vue/theme-bankai');
  createApp(fixture).mount('#app');
} else {
  createApp(App).mount('#app');
}
