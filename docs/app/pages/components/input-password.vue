<script setup lang="ts">
import { ref } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiInputPassword · bankai-vue' });

const value = ref<string | undefined>('hunter2');
const revealed = ref(false);
const iconValue = ref<string | undefined>('s3cr3t');
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiInputPassword</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.input-password.lede" tag="span" scope="global">
          <template #input><BankaiCode>&lt;input&gt;</BankaiCode></template>
          <template #password><BankaiCode>password</BankaiCode></template>
          <template #text><BankaiCode>text</BankaiCode></template>
          <template #model><BankaiCode>v-model</BankaiCode></template>
          <template #revealed><BankaiCode>v-model:revealed</BankaiCode></template>
          <template #cls><BankaiCode>bankai-input</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiInputPassword
              v-model="value"
              v-model:revealed="revealed"
              autocomplete="current-password"
              placeholder="Password"
            />
            <BankaiText as="p" size="sm" tone="muted">
              {{ t('comp.input-password.modelLabel') }}:
              {{ value === undefined ? t('comp.input-password.empty') : value }} ·
              {{ t('comp.input-password.revealedLabel') }}: {{ revealed }}
            </BankaiText>
          </div>

          <div class="field">
            <BankaiInputPassword
              v-for="size in sizes"
              :key="size"
              :size="size"
              :model-value="`${size} secret`"
            />
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          {{ t('comp.input-password.toggleHeading') }}
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input-password.toggleBody" tag="span" scope="global">
            <template #revealed><BankaiCode>v-model:revealed</BankaiCode></template>
            <template #toggle><BankaiCode>:toggle="false"</BankaiCode></template>
            <template #slot><BankaiCode>#toggle</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiText as="p" size="sm" tone="subtle">
              {{ t('comp.input-password.toggleIconLabel') }}
            </BankaiText>
            <!-- The docs site ships no icon set, so this dogfoods BankaiIcon over an inline <svg>
              (eye when masked ↔ eye-slash when revealed), the same dependency-free pattern the BankaiIcon
              page uses. BankaiIcon owns the 1:1 box, so the <svg> needs only a viewBox + currentColor fill —
              no width/height. The button keeps its "Show password"/"Hide password" accessible name from the
              labels, so the icon is decorative (aria-hidden). -->
            <BankaiInputPassword v-model="iconValue" autocomplete="current-password">
              <template #toggle="{ revealed: shown }">
                <BankaiIcon size="sm">
                  <svg v-if="shown" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M3.46999 3.46973C3.76289 3.17696 4.23769 3.17688 4.53054 3.46973L16.5306 15.4697C16.8233 15.7626 16.8233 16.2374 16.5306 16.5303C16.2377 16.8231 15.7629 16.823 15.47 16.5303L14.4124 15.4727C13.1972 16.2508 11.7234 16.7499 10.0003 16.75C6.99409 16.75 4.80642 15.079 3.40944 13.4961C2.70716 12.7003 2.18616 11.9074 1.84108 11.3145C1.66819 11.0174 1.5383 10.7679 1.45045 10.5908C1.40658 10.5024 1.37291 10.4317 1.34987 10.3818C1.33842 10.357 1.32886 10.3374 1.32252 10.3232C1.31939 10.3162 1.31755 10.3099 1.31569 10.3057C1.31482 10.3037 1.31338 10.3021 1.31276 10.3008L1.31178 10.2988V10.2979C1.31454 10.2963 1.35767 10.2774 2.00026 10L1.31178 10.2969C1.23111 10.1098 1.23009 9.89788 1.30885 9.70996V9.70801C1.30923 9.70724 1.31035 9.70614 1.3108 9.70508C1.31174 9.70289 1.31329 9.69961 1.31471 9.69629C1.3177 9.68931 1.32131 9.67964 1.32643 9.66797C1.33705 9.64374 1.35256 9.60942 1.37233 9.56641C1.4119 9.48031 1.47048 9.35783 1.54713 9.20703C1.70032 8.90569 1.92898 8.48733 2.23463 8.01172C2.73213 7.23767 3.44493 6.29106 4.38601 5.44629L3.46999 4.53027C3.1771 4.23738 3.1771 3.76262 3.46999 3.46973ZM5.45046 6.51074C4.61173 7.25038 3.95951 8.10258 3.49636 8.82324C3.22238 9.24956 3.01835 9.62252 2.88405 9.88672C2.86458 9.92502 2.84684 9.96165 2.83034 9.99512C2.90415 10.1407 3.00634 10.3344 3.13796 10.5605C3.44755 11.0925 3.91225 11.8 4.53347 12.5039C5.784 13.9209 7.59663 15.25 10.0003 15.25C11.2833 15.25 12.3869 14.9161 13.3206 14.3809L11.7083 12.7686C10.4536 13.5457 8.7907 13.3904 7.70047 12.3008C6.61016 11.2105 6.45322 9.5459 7.23074 8.29102L5.45046 6.51074ZM10.0003 3.25C13.0064 3.2501 15.1942 4.921 16.5911 6.50391C17.2934 7.2997 17.8144 8.0926 18.1595 8.68555C18.3324 8.98265 18.4623 9.23211 18.5501 9.40918C18.594 9.49764 18.6277 9.56829 18.6507 9.61816C18.6621 9.64297 18.6717 9.66258 18.678 9.67676C18.6812 9.68379 18.683 9.69008 18.6849 9.69434C18.6858 9.69631 18.6872 9.69786 18.6878 9.69922L18.6888 9.70117V9.70215C18.6888 9.7025 18.6795 9.7068 18.0003 10L18.6888 10.2969L18.6858 10.3027C18.6844 10.3061 18.6824 10.3109 18.68 10.3164C18.675 10.3276 18.6683 10.3439 18.6595 10.3633C18.6417 10.4022 18.6158 10.4575 18.5823 10.5264C18.5151 10.6647 18.4162 10.8603 18.2845 11.0967C18.0212 11.569 17.6251 12.2106 17.0911 12.8926C16.8359 13.2186 16.3645 13.2755 16.0384 13.0205C15.7123 12.7652 15.6543 12.2939 15.9095 11.9678C16.3854 11.36 16.7397 10.7863 16.9739 10.3662C17.0526 10.225 17.1162 10.1008 17.1673 10C17.0937 9.85507 16.9927 9.66301 16.8626 9.43945C16.553 8.90753 16.0883 8.20004 15.4671 7.49609C14.2166 6.07911 12.4039 4.7501 10.0003 4.75C9.52755 4.75 9.07986 4.80351 8.65652 4.89355C8.25151 4.97973 7.85325 4.72132 7.76687 4.31641C7.68069 3.91134 7.93901 3.51306 8.34402 3.42676C8.86049 3.31689 9.41325 3.25 10.0003 3.25ZM8.34891 9.40918C8.12692 10.0272 8.26402 10.7432 8.76102 11.2402C9.25783 11.7366 9.9724 11.8719 10.5901 11.6504L8.34891 9.40918ZM18.6888 9.70312C18.7703 9.89221 18.7709 10.1067 18.6898 10.2959L18.0003 10L18.6888 9.70312Z"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M10 3.25C13.0062 3.25008 15.1939 4.92099 16.5908 6.50391C17.2931 7.2997 17.8141 8.09259 18.1592 8.68555C18.3321 8.98266 18.462 9.2321 18.5498 9.40918C18.5937 9.49765 18.6274 9.56828 18.6504 9.61816C18.6619 9.64298 18.6714 9.66258 18.6778 9.67676C18.6809 9.68379 18.6827 9.69008 18.6846 9.69434C18.6855 9.69632 18.6869 9.69786 18.6875 9.69922L18.6885 9.70117V9.70215C18.6885 9.7025 18.6793 9.70678 18 10C18.6793 10.2932 18.6885 10.2975 18.6885 10.2979V10.2988L18.6875 10.3008C18.6869 10.3021 18.6855 10.3037 18.6846 10.3057C18.6827 10.3099 18.6809 10.3162 18.6778 10.3232C18.6714 10.3374 18.6619 10.357 18.6504 10.3818C18.6274 10.4317 18.5937 10.5024 18.5498 10.5908C18.462 10.7679 18.3321 11.0173 18.1592 11.3145C17.8141 11.9074 17.2931 12.7003 16.5908 13.4961C15.1939 15.079 13.0062 16.7499 10 16.75C6.99381 16.75 4.80615 15.079 3.40917 13.4961C2.70689 12.7003 2.18589 11.9074 1.84081 11.3145C1.66792 11.0173 1.53804 10.7679 1.45019 10.5908C1.40631 10.5024 1.37264 10.4317 1.3496 10.3818C1.33814 10.357 1.32859 10.3374 1.32226 10.3232C1.31912 10.3162 1.31728 10.3099 1.31542 10.3057C1.31455 10.3037 1.31311 10.3021 1.31249 10.3008L1.31151 10.2988V10.2979C1.31398 10.2965 1.35491 10.2785 1.99999 10C1.35491 9.72154 1.31398 9.70354 1.31151 9.70215V9.70117L1.31249 9.69922C1.31311 9.69786 1.31455 9.69632 1.31542 9.69434C1.31728 9.69007 1.31912 9.68378 1.32226 9.67676C1.32859 9.66257 1.33814 9.64297 1.3496 9.61816C1.37264 9.56827 1.40631 9.49764 1.45019 9.40918C1.53804 9.23209 1.66792 8.98265 1.84081 8.68555C2.18589 8.09258 2.70689 7.2997 3.40917 6.50391C4.80615 4.92098 6.99381 3.25 10 3.25ZM10 4.75C7.59635 4.75 5.78373 6.0791 4.5332 7.49609C3.91198 8.20004 3.44728 8.90751 3.13769 9.43945C3.00747 9.66322 2.90566 9.85501 2.83202 10C2.90566 10.145 3.00747 10.3368 3.13769 10.5605C3.44728 11.0925 3.91198 11.8 4.5332 12.5039C5.78373 13.9209 7.59635 15.25 10 15.25C12.4036 15.2499 14.2163 13.9209 15.4668 12.5039C16.088 11.7999 16.5527 11.0925 16.8623 10.5605C16.9924 10.337 17.0934 10.1449 17.167 10C17.0934 9.85507 16.9924 9.66302 16.8623 9.43945C16.5527 8.90752 16.088 8.20005 15.4668 7.49609C14.2163 6.0791 12.4036 4.75008 10 4.75ZM10 6.75C11.7948 6.75012 13.25 8.20515 13.25 10C13.25 11.7949 11.7948 13.2499 10 13.25C8.20508 13.25 6.75 11.7949 6.75 10C6.75 8.20507 8.20508 6.75 10 6.75ZM10 8.25C9.03351 8.25 8.25 9.0335 8.25 10C8.25 10.9665 9.03351 11.75 10 11.75C10.9664 11.7499 11.75 10.9664 11.75 10C11.75 9.03358 10.9664 8.25012 10 8.25ZM1.99999 10L1.31151 10.2969C1.22978 10.1073 1.22978 9.89267 1.31151 9.70312L1.99999 10ZM18.6885 9.70312C18.7702 9.89262 18.7702 10.1074 18.6885 10.2969L18 10L18.6885 9.70312Z"
                    />
                  </svg>
                </BankaiIcon>
              </template>
            </BankaiInputPassword>
          </div>

          <div class="field">
            <BankaiText as="p" size="sm" tone="subtle">
              {{ t('comp.input-password.toggleBareLabel') }}
            </BankaiText>
            <BankaiInputPassword :model-value="'no reveal button'" :toggle="false" />
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          {{ t('comp.input-password.a11yHeading') }}
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input-password.a11yBody" tag="span" scope="global">
            <template #show><BankaiCode>inputPassword.show</BankaiCode></template>
            <template #hide><BankaiCode>inputPassword.hide</BankaiCode></template>
            <template #showLabel><BankaiCode>showLabel</BankaiCode></template>
            <template #hideLabel><BankaiCode>hideLabel</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiInputPassword" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-inline-size: 24rem;
}
</style>
