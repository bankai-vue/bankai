<script setup lang="ts">
import { BankaiCodeBlock } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural/interaction e2e. BankaiCodeBlock ships no
// CSS; the theme paints the panel and positions the copy toolbar. The `.bounds` wrapper is narrower than
// the longest line so the `<pre>` shows its horizontal scroll, and the block sits in one column for a
// clean snapshot. The block is idle (not copied) on load, so the copy button reads "Copy".
const code = `import { createBankai } from '@bankai-vue/core';

const app = createApp(App);
app.use(createBankai());
app.mount('#app'); // a deliberately long line so the <pre> scrolls horizontally`;
</script>

<template>
  <div class="fixture" data-testid="code-block-fixture">
    <div class="bounds">
      <BankaiCodeBlock data-testid="code-block" language="ts" :code="code" />
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Fixed narrower than the longest code line so the `<pre>` shows its horizontal scroll. */
.bounds {
  inline-size: 32rem;
}
</style>
