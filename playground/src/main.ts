import { createApp } from 'vue';
import App from './App.vue';
import ButtonFixture from './fixtures/ButtonFixture.vue';
import '@bankai-vue/theme-bankai';

// `?fixture=button` mounts an isolated, deterministic fixture used by visual
// regression tests; everything else gets the normal demo app.
const fixture = new URLSearchParams(window.location.search).get('fixture');

createApp(fixture === 'button' ? ButtonFixture : App).mount('#app');
