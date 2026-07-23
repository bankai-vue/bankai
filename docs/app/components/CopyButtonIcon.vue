<script setup lang="ts">
// The docs site ships no icon set, so — like the reveal toggle on the BankaiInputPassword page — this
// dogfoods BankaiIcon over an inline <svg> (a copy/document-duplicate glyph when idle ↔ a check when
// copied), the same dependency-free pattern the BankaiIcon page uses. BankaiIcon owns the 1:1 box, so the
// <svg> needs only a viewBox + currentColor fill — no width/height. The copy button keeps its accessible
// name ("Copy" / "Copied") from BankaiCodeBlock's aria-label, so the icon here is decorative (aria-hidden).
const { copied } = defineProps<{ copied: boolean }>();
</script>

<template>
  <BankaiIcon size="sm">
    <svg v-if="copied" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
      />
    </svg>
    <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.121A1.5 1.5 0 0 1 17 6.622V12.5A1.5 1.5 0 0 1 15.5 14h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z"
      />
      <path
        fill="currentColor"
        d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z"
      />
    </svg>
  </BankaiIcon>
</template>
