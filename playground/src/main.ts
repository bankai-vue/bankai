import { createApp } from 'vue';
import App from './App.vue';
import ButtonFixture from './fixtures/ButtonFixture.vue';

// `?fixture=button` mounts an isolated, deterministic fixture used by visual
// regression tests; everything else gets the normal demo app.
const fixture = new URLSearchParams(window.location.search).get('fixture');

if (fixture === 'button') {
  // The fixture pins the house theme for stable baselines. Load it before mounting so the
  // screenshot never races the styles. The demo app instead lets ThemeSwitcher pick a theme,
  // so no theme CSS is imported globally here (only one theme is ever loaded at a time).
  await import('@bankai-vue/theme-bankai');
  createApp(ButtonFixture).mount('#app');
} else {
  createApp(App).mount('#app');
}
