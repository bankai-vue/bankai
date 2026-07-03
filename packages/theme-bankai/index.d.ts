// Type shim so `import '@bankai-vue/theme-bankai'` resolves for TS consumers.
// The package's runtime entry is CSS (see `index.css`); there is nothing to import.
declare const theme: void;
export default theme;
