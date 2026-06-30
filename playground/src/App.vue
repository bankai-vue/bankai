<script setup lang="ts">
import { ref } from "vue";
import { version } from "@bankai-vue/core";

const count = ref(0);
</script>

<template>
  <main>
    <h1 data-testid="title">bankai-vue playground</h1>
    <p data-testid="core-version">core v{{ version }}</p>
    <button type="button" data-testid="counter" @click="count++">count is {{ count }}</button>
  </main>
</template>
