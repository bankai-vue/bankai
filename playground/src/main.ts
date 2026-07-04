import type { Component } from 'vue';
import { createApp } from 'vue';
import App from './App.vue';
import ButtonFixture from './fixtures/ButtonFixture.vue';
import FlexFixture from './fixtures/FlexFixture.vue';
import FlexMappingFixture from './fixtures/FlexMappingFixture.vue';

// `?fixture=<name>` mounts an isolated, deterministic fixture used by e2e/visual
// tests; everything else gets the normal demo app.
const fixtures: Record<string, Component> = {
  button: ButtonFixture,
  flex: FlexFixture,
  'flex-mapping': FlexMappingFixture,
};

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
