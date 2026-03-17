<script setup lang="ts">
import { computed } from 'vue';
import type {
  MbSocialButtonProps,
  MbSocialButtonProvider,
  MbSocialButtonState
} from './MbSocialButton.types';
import '../styles/mb-social-button.css';

const props = withDefaults(defineProps<MbSocialButtonProps>(), {
  provider: 'google',
  state: 'default',
  label: 'Continue with Google',
  iconOnly: false,
  width: 320,
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const provider = computed<MbSocialButtonProvider>(() => props.provider);
const isDisabled = computed(() => props.disabled || props.state === 'disabled');
const resolvedState = computed<MbSocialButtonState>(() => (isDisabled.value ? 'disabled' : props.state));
const buttonWidthStyle = computed(() => ({ width: `${props.width}px` }));
const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel) {
    return props.ariaLabel;
  }

  if (props.iconOnly) {
    return props.label;
  }

  return undefined;
});

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <button
    type="button"
    class="mb-social-btn"
    :data-provider="provider"
    :data-state="resolvedState"
    :data-icon-only="iconOnly ? 'true' : 'false'"
    :disabled="isDisabled"
    :aria-label="resolvedAriaLabel"
    :style="buttonWidthStyle"
    @click="onClick"
  >
    <span class="mb-social-btn__icon-wrapper" aria-hidden="true">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="mb-social-btn__google-icon">
        <path
          d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.8454H13.8436C13.635 11.9704 13.0009 12.9231 12.0482 13.5613V15.8195H14.9564C16.6582 14.2522 17.64 11.9418 17.64 9.2045Z"
          fill="#4285F4"
        />
        <path
          d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0482 13.5613C11.2423 14.1013 10.2118 14.4204 9 14.4204C6.6559 14.4204 4.6718 12.8372 3.9641 10.71H0.9573V13.0418C2.4382 15.9831 5.4818 18 9 18Z"
          fill="#34A853"
        />
        <path
          d="M3.9641 10.71C3.7841 10.17 3.6818 9.5931 3.6818 9C3.6818 8.4068 3.7841 7.8299 3.9641 7.2899V4.9581H0.9573C0.3477 6.1722 0 7.5481 0 9C0 10.4518 0.3477 11.8277 0.9573 13.0418L3.9641 10.71Z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.5795C10.3227 3.5795 11.5105 4.0341 12.4445 4.9268L15.0218 2.3495C13.4632 0.8977 11.4259 0 9 0C5.4818 0 2.4382 2.0168 0.9573 4.9581L3.9641 7.2899C4.6718 5.1627 6.6559 3.5795 9 3.5795Z"
          fill="#EA4335"
        />
      </svg>
    </span>

    <span v-if="!iconOnly" class="mb-social-btn__label">{{ label }}</span>
  </button>
</template>
