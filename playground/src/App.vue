<script setup lang="ts">
import {
  BankaiApp,
  BankaiAside,
  BankaiButton,
  BankaiCode,
  BankaiCodeBlock,
  BankaiContainer,
  BankaiFlex,
  BankaiFooter,
  BankaiGrid,
  BankaiHeader,
  BankaiHeading,
  BankaiIcon,
  BankaiInput,
  BankaiInputNumber,
  BankaiInputPassword,
  BankaiLayout,
  BankaiLink,
  BankaiMain,
  BankaiPage,
  BankaiText,
  version,
} from '@bankai-vue/core';
import { ref } from 'vue';
import ColorSchemeSwitcher from './components/ColorSchemeSwitcher.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';

const count = ref(0);

const inputValue = ref('');
const numberValue = ref<number | undefined>(3);
const passwordValue = ref<string | undefined>('hunter2');
const passwordRevealed = ref(false);

const variants = ['solid', 'outline', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const textSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const weights = [
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
] as const;
const tones = ['default', 'muted', 'subtle'] as const;

const levels = [1, 2, 3, 4, 5, 6] as const;

const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const codeBlockExample = `pnpm add @bankai-vue/core @bankai-vue/theme-bankai
# then import a theme's index.css and start composing`;
</script>

<template>
  <div class="controls">
    <ThemeSwitcher />
    <ColorSchemeSwitcher />
  </div>

  <main>
    <h1 data-testid="title">bankai-vue playground</h1>
    <p data-testid="core-version">core v{{ version }}</p>

    <section>
      <h2>BankaiButton</h2>

      <p>Reactivity smoke (also drives the e2e test):</p>
      <BankaiButton data-testid="counter" @click="count++">count is {{ count }}</BankaiButton>

      <h3>Variants</h3>
      <div class="row">
        <BankaiButton v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </BankaiButton>
      </div>

      <h3>Sizes</h3>
      <div class="row">
        <BankaiButton v-for="size in sizes" :key="size" :size="size">{{ size }}</BankaiButton>
      </div>

      <h3>States</h3>
      <div class="row">
        <BankaiButton disabled>disabled</BankaiButton>
      </div>
    </section>

    <section>
      <h2>BankaiInput</h2>

      <p>
        Raw native <BankaiCode>&lt;input&gt;</BankaiCode> with a <BankaiCode>string</BankaiCode>
        <BankaiCode>v-model</BankaiCode>. Behavior-rich types get dedicated components — see
        <BankaiCode>BankaiInputNumber</BankaiCode> below (password is planned); the field wrapper
        (label + help + error) is a future <BankaiCode>BankaiField</BankaiCode>.
      </p>

      <p data-testid="input-model">Model: {{ inputValue || '(empty)' }}</p>
      <div class="col">
        <BankaiInput
          v-model="inputValue"
          placeholder="Type here…"
          data-testid="input-model-field"
        />
      </div>

      <h3>Sizes</h3>
      <div class="col">
        <BankaiInput
          v-for="size in sizes"
          :key="size"
          :size="size"
          :model-value="`${size} value`"
        />
      </div>

      <h3>States</h3>
      <div class="col">
        <BankaiInput model-value="Disabled" disabled />
        <BankaiInput model-value="Read-only" readonly />
      </div>
    </section>

    <section>
      <h2>BankaiInputNumber</h2>

      <p>
        The behavior-rich <BankaiCode>type="number"</BankaiCode> sibling: a
        <BankaiCode>number</BankaiCode> <BankaiCode>v-model</BankaiCode>, native
        <BankaiCode>min</BankaiCode>/<BankaiCode>max</BankaiCode>/<BankaiCode>step</BankaiCode>, a
        smart mobile <BankaiCode>inputmode</BankaiCode> default, and opt-in stepper controls via
        <BankaiCode>buttons</BankaiCode>. Bare <BankaiCode>&lt;input&gt;</BankaiCode> by default.
      </p>

      <p data-testid="input-number-model">
        Model: {{ numberValue === undefined ? '(empty)' : numberValue }}
      </p>
      <div class="col">
        <BankaiInputNumber
          v-model="numberValue"
          :min="0"
          :max="10"
          buttons
          placeholder="0–10"
          data-testid="input-number-model-field"
        />
      </div>

      <h3>Bare (default) — sizes</h3>
      <div class="col">
        <BankaiInputNumber v-for="size in sizes" :key="size" :size="size" :model-value="42" />
      </div>

      <h3>Button layouts</h3>
      <div class="col">
        <BankaiInputNumber :model-value="7" buttons="stacked" />
        <BankaiInputNumber :model-value="7" buttons="split" />
      </div>

      <h3>States (with buttons)</h3>
      <div class="col">
        <BankaiInputNumber :model-value="5" buttons disabled />
        <BankaiInputNumber :model-value="5" buttons readonly />
      </div>

      <h3>Mobile keyboard (inputmode)</h3>
      <div class="col">
        <BankaiInputNumber :model-value="1" placeholder="integer step → numeric" />
        <BankaiInputNumber :model-value="1.5" :step="0.5" placeholder="fractional step → decimal" />
        <BankaiInputNumber :model-value="1" inputmode="decimal" placeholder="explicit inputmode" />
      </div>
    </section>

    <section>
      <h2>BankaiInputPassword</h2>

      <p>
        The reveal-toggle sibling: a masked <BankaiCode>&lt;input&gt;</BankaiCode> whose
        <BankaiCode>type</BankaiCode> flips between <BankaiCode>password</BankaiCode> and
        <BankaiCode>text</BankaiCode> via a reveal button (a real, focusable control) and
        <BankaiCode>v-model:revealed</BankaiCode>. Opt out of the built-in button with
        <BankaiCode>:toggle="false"</BankaiCode>.
      </p>

      <p data-testid="input-password-model">
        Model: {{ passwordValue || '(empty)' }} · revealed: {{ passwordRevealed }}
      </p>
      <div class="col">
        <BankaiInputPassword
          v-model="passwordValue"
          v-model:revealed="passwordRevealed"
          autocomplete="current-password"
          placeholder="Password"
          data-testid="input-password-model-field"
        />
      </div>

      <h3>Sizes</h3>
      <div class="col">
        <BankaiInputPassword
          v-for="size in sizes"
          :key="size"
          :size="size"
          :model-value="`${size} secret`"
        />
      </div>

      <h3>Bare (no toggle) & states</h3>
      <div class="col">
        <BankaiInputPassword :model-value="'bare'" :toggle="false" placeholder="no reveal button" />
        <BankaiInputPassword :model-value="'secret'" disabled />
        <BankaiInputPassword :model-value="'secret'" readonly />
      </div>
    </section>

    <section>
      <h2>BankaiFlex</h2>

      <p>Prop-driven layout via data-* + theme CSS (utility classes can override):</p>
      <BankaiFlex data-testid="flex-row" :gap="4" align="center">
        <BankaiButton>one</BankaiButton>
        <BankaiButton variant="outline">two</BankaiButton>
        <BankaiButton variant="ghost">three</BankaiButton>
      </BankaiFlex>
    </section>

    <section>
      <h2>BankaiGrid</h2>

      <p>2D prop-driven layout via data-* + <code>--bankai-grid-*</code> + theme CSS:</p>

      <h3>Equal columns (track count) + gap</h3>
      <BankaiGrid data-testid="grid-cols" :columns="3" :gap="4">
        <BankaiButton>one</BankaiButton>
        <BankaiButton variant="outline">two</BankaiButton>
        <BankaiButton variant="ghost">three</BankaiButton>
      </BankaiGrid>

      <h3>Template areas</h3>
      <BankaiGrid :areas="['header header', 'sidebar main']" columns="6rem 1fr" :gap="2">
        <BankaiButton style="grid-area: header">header</BankaiButton>
        <BankaiButton variant="outline" style="grid-area: sidebar">side</BankaiButton>
        <BankaiButton variant="ghost" style="grid-area: main">main</BankaiButton>
      </BankaiGrid>
    </section>

    <section>
      <h2>BankaiApp</h2>

      <p>
        Infra singleton at the root of the App › Layout › Page › Container structure. It lands thin:
        its one job today is the embedded-mode surface — it carries the house
        <code>color-scheme</code> and <code>--bankai-color-bg</code>/<code>-fg</code> on its own
        box, so a bankai island in a foreign page is self-contained (the box below sits on a
        non-house gray to show its own painted surface):
      </p>

      <div class="app-demo">
        <BankaiApp data-testid="app" class="app-box">
          <p style="margin: 0">Self-contained bankai island</p>
        </BankaiApp>
      </div>
    </section>

    <section>
      <h2>BankaiLayout</h2>

      <p>App shell emitting native landmark regions (header/aside/main/footer) on a CSS grid:</p>

      <!-- Bounded here (the theme defaults to min-block-size: 100dvh) so the demo stays inline. -->
      <BankaiLayout data-testid="layout" class="layout-demo">
        <template #header><div class="region">header</div></template>
        <template #sidebar><div class="region">sidebar</div></template>
        <div class="region">main</div>
        <template #footer><div class="region">footer</div></template>
      </BankaiLayout>
    </section>

    <section>
      <h2>BankaiHeader</h2>

      <p>
        Standalone <code>&lt;header&gt;</code> banner region (the top-level landmark), for a shell
        built without <code>BankaiLayout</code>. The theme paints the house banner look — padding
        and a bottom border:
      </p>

      <BankaiHeader data-testid="header" class="header-demo">
        <div class="header-bar">
          <strong>bankai-vue</strong>
          <nav class="header-nav"><span>Guide</span><span>Components</span></nav>
        </div>
      </BankaiHeader>
    </section>

    <section>
      <h2>BankaiAside</h2>

      <p>
        Standalone <code>&lt;aside&gt;</code> complementary region (a side rail), for a shell built
        without <code>BankaiLayout</code>. The <code>label</code> prop names the landmark; the theme
        paints padding and an inline-end divider:
      </p>

      <BankaiAside data-testid="aside" label="Secondary navigation" class="aside-demo">
        <nav class="aside-nav">
          <strong>Section</strong>
          <span>Overview</span>
          <span>Guides</span>
          <span>API</span>
        </nav>
      </BankaiAside>
    </section>

    <!-- Note: this gallery also emits a <main> in the BankaiLayout demo above, so the sandbox has two
         main landmarks — fine for a component gallery, not a pattern for a real page. -->
    <section>
      <h2>BankaiMain</h2>

      <p>
        Standalone <code>&lt;main&gt;</code> content region (the unique main landmark), for a shell
        built without <code>BankaiLayout</code>. It paints nothing — no padding
        (<code>BankaiContainer</code>'s job) and no background — but floors
        <code>min-inline-size</code> so wide content shrinks with its container:
      </p>

      <BankaiMain data-testid="main" class="main-demo">
        <strong>Primary content</strong>
        <p class="main-wide">A_very_long_unbreakable_token_that_would_overflow_without_the_floor</p>
      </BankaiMain>
    </section>

    <section>
      <h2>BankaiFooter</h2>

      <p>
        Standalone <code>&lt;footer&gt;</code> contentinfo region (the page foot), for a shell built
        without <code>BankaiLayout</code>. Mirrors <code>BankaiHeader</code> with a top border:
      </p>

      <BankaiFooter data-testid="footer" class="footer-demo">
        <div class="footer-bar">
          <small>© 2026 bankai-vue</small>
          <nav class="footer-links"><span>Privacy</span><span>Terms</span></nav>
        </div>
      </BankaiFooter>
    </section>

    <section>
      <h2>BankaiContainer</h2>

      <p>
        Width utility — centered max-width by default, edge-to-edge with <code>fluid</code>. The
        max-width is shrunk here (via <code>--bankai-container-max-width</code>) so the centered
        bars are visible inline:
      </p>

      <div class="container-demo">
        <BankaiContainer data-testid="container" class="container-box"
          >centered (default)</BankaiContainer
        >
        <BankaiContainer fluid class="container-box">fluid (full width)</BankaiContainer>
      </div>
    </section>

    <section>
      <h2>BankaiPage</h2>

      <p>
        Per-route content host — the box at the top of every route file. It is not a landmark (it
        sits inside <code>&lt;main&gt;</code>) and paints nothing, but its min-block-size fills the
        content region so a short route still occupies the full height (the frame is bounded here so
        the fill is visible; the outlined box is the page):
      </p>

      <div class="page-demo">
        <BankaiPage data-testid="page" class="page-box">
          <p style="margin: 0">Short route content</p>
        </BankaiPage>
      </div>
    </section>

    <section>
      <h2>BankaiLink</h2>

      <p>
        Renders a native <code>&lt;a&gt;</code> here (no router installed); with vue-router/Nuxt it
        resolves <code>RouterLink</code>/<code>NuxtLink</code> for internal <code>to</code>.
        External (new-tab) links reflect <code>data-bankai-external</code> and get a safe
        <code>rel</code>:
      </p>

      <div class="row">
        <BankaiLink href="/getting-started">Internal link</BankaiLink>
        <BankaiLink href="https://example.com" target="_blank">External (new tab)</BankaiLink>
      </div>
    </section>

    <section>
      <h2>BankaiCode</h2>

      <p>
        Inline code primitive — a native <BankaiCode>&lt;code&gt;</BankaiCode> with a monospace font
        and a subtle chip background. It scales with its surrounding text, so
        <BankaiCode>pnpm add @bankai-vue/core</BankaiCode> reads the same in a
        <BankaiText as="span" size="sm">smaller line (<BankaiCode>sm</BankaiCode>)</BankaiText> as
        in this one.
      </p>
    </section>

    <section>
      <h2>BankaiCodeBlock</h2>

      <p>
        Block code — a native <BankaiCode>&lt;pre&gt;&lt;code&gt;</BankaiCode> with a copy button.
        The <BankaiCode>code</BankaiCode> prop is the exact clipboard source; core highlights
        nothing, so <BankaiCode>language</BankaiCode> only reflects as a
        <BankaiCode>language-*</BankaiCode> class for a BYO highlighter.
      </p>
      <BankaiCodeBlock language="bash" :code="codeBlockExample" />
    </section>

    <section>
      <h2>BankaiIcon</h2>

      <p>
        Agnostic icon wrapper — a consistent 1:1 box + a11y layer over whatever icon mechanism you
        use (inline SVG, a CSS icon font, UnoCSS/Iconify-CSS masks). Core ships no icons. Pick your
        input style; here the demo glyph is a data-URI mask class so it renders without any icon
        dependency.
      </p>

      <h3>Three input styles</h3>
      <div class="row">
        <!-- 1) default slot: an inline <svg> -->
        <BankaiIcon size="lg" label="home (slot svg)">
          <svg viewBox="0 0 24 24"><path d="M12 3 3 10v11h6v-6h6v6h6V10z" /></svg>
        </BankaiIcon>
        <!-- 2) class: a CSS icon class straight through -->
        <BankaiIcon size="lg" class="demo-mask-icon" label="home (class)" />
        <!-- 3) name: the same, but through the resolver seam (verbatim by default) -->
        <BankaiIcon size="lg" name="demo-mask-icon" label="home (name)" />
      </div>

      <h3>Size scale</h3>
      <div class="row">
        <BankaiIcon
          v-for="size in iconSizes"
          :key="size"
          :size="size"
          class="demo-mask-icon"
          :label="`home ${size}`"
        />
      </div>

      <h3>1:1 box vs `no-square` (wide 2:1 glyph)</h3>
      <div class="row">
        <BankaiIcon size="xl" label="wide, square" class="demo-boxed">
          <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
        </BankaiIcon>
        <BankaiIcon size="xl" no-square label="wide, intrinsic" class="demo-boxed">
          <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
        </BankaiIcon>
      </div>
    </section>

    <section>
      <h2>BankaiText</h2>

      <h3>Type scale</h3>
      <BankaiFlex direction="column" align="start" :gap="2">
        <BankaiText v-for="size in textSizes" :key="size" :size="size">
          {{ size }} — the quick brown fox
        </BankaiText>
      </BankaiFlex>

      <h3>Weights</h3>
      <BankaiFlex :gap="4" wrap="wrap" align="baseline">
        <BankaiText v-for="weight in weights" :key="weight" :weight="weight">
          {{ weight }}
        </BankaiText>
      </BankaiFlex>

      <h3>Tones</h3>
      <BankaiFlex :gap="4" align="center">
        <BankaiText v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</BankaiText>
      </BankaiFlex>

      <h3>Inline semantics via `as`</h3>
      <BankaiText>
        plain with <BankaiText as="strong" weight="bold">strong</BankaiText>,
        <BankaiText as="em">em</BankaiText>, <BankaiText as="mark">mark</BankaiText>,
        <BankaiText as="code">code()</BankaiText>, and <BankaiText as="kbd">Ctrl</BankaiText>
      </BankaiText>

      <h3>Escape hatches (verbatim CSS)</h3>
      <BankaiFlex :gap="4" align="baseline" wrap="wrap">
        <BankaiText size="1.75rem">custom size</BankaiText>
        <BankaiText :weight="350">weight 350</BankaiText>
        <BankaiText tone="rgb(220, 38, 38)">custom color</BankaiText>
      </BankaiFlex>
    </section>

    <section>
      <h2>BankaiHeading</h2>

      <p>
        Native <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code> via a required <code>level</code>;
        the theme paints the per-level type scale keyed on <code>data-bankai-level</code>:
      </p>

      <BankaiFlex direction="column" align="start" :gap="2">
        <BankaiHeading v-for="level in levels" :key="level" :level="level">
          Heading level {{ level }}
        </BankaiHeading>
      </BankaiFlex>
    </section>
  </main>
</template>

<!-- Component styling comes from the selected theme (ThemeSwitcher); only playground layout lives here. -->
<style>
.controls {
  position: fixed;
  z-index: 1;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-block: 0.5rem 1rem;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-inline-size: 20rem;
  margin-block: 0.5rem 1rem;
}

/* A dependency-free demo glyph for the BankaiIcon section: a data-URI mask painted with currentColor,
   so `class`/`name` icon usage renders a real (monochrome) glyph without pulling in an icon set. */
.demo-mask-icon {
  background-color: currentcolor;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3 3 10v11h6v-6h6v6h6V10z"/></svg>')
    center / contain no-repeat;
}

/* Outlines the BankaiIcon box so the square (letterboxed) vs `no-square` (intrinsic) difference shows. */
.demo-boxed {
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

/* Bound the BankaiLayout demo (the theme defaults to min-block-size: 100dvh). */
.layout-demo {
  block-size: 12rem;
  min-block-size: 0;
  border: 1px solid color-mix(in oklch, currentcolor 20%, transparent);
  border-radius: 0.5rem;
  overflow: hidden;
}

.layout-demo .region {
  display: grid;
  place-items: center;
  padding: 0.5rem;
  background: color-mix(in oklch, currentcolor 8%, transparent);
}

/* The BankaiHeader demo lays out its own content as a brand + nav bar. */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-nav {
  display: flex;
  gap: 1rem;
}

/* Bound the BankaiAside demo so the rail reads as a fixed column. */
.aside-demo {
  inline-size: 12rem;
}

.aside-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Bound the BankaiMain demo so the min-inline-size floor is observable (the wide token clips instead
   of pushing the box wider). */
.main-demo {
  inline-size: 20rem;
  padding: 0.75rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.main-wide {
  margin: 0.5rem 0 0;
  overflow: hidden;
  font-family: monospace;
}

/* The BankaiFooter demo lays out its own content as a copyright + links bar. */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

/* Bound the BankaiContainer demo and shrink the max-width so the centered container's side bars are
   visible; the dashed outline marks the available width the containers lay out within. */
.container-demo {
  --bankai-container-max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-block: 0.5rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.container-box {
  padding-block: 0.5rem;
  text-align: center;
  border-radius: 0.375rem;
  background: color-mix(in oklch, currentcolor 8%, transparent);
}

/* Bound the BankaiPage demo with a definite block size so the min-block-size fill is observable (the
   short one-line page stretches to the full frame height). */
.page-demo {
  block-size: 12rem;
  padding: 0.5rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.page-box {
  padding: 0.75rem;
  outline: 2px solid color-mix(in oklch, currentcolor 20%, transparent);
}

/* A non-house "foreign host" surface so the embedded BankaiApp's own painted surface stands out. */
.app-demo {
  padding: 1.5rem;
  background-color: oklch(70% 0.03 250);
}

.app-box {
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
