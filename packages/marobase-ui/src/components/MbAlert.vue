<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbAlertProps, MbAlertTone } from './MbAlert.types';
import '../styles/mb-alert.css';

const props = withDefaults(defineProps<MbAlertProps>(), {
  modelValue: true,
  tone: 'info',
  title: 'This service not available with your plan',
  description: 'Upgrade to a pay-as-you-go account to use.',
  primaryLabel: 'Action',
  secondaryLabel: 'Action',
  dismissible: true,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'primary-click', payload: MouseEvent): void;
  (event: 'secondary-click', payload: MouseEvent): void;
  (event: 'close', payload: MouseEvent): void;
}>();

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value;
  }
);

const tone = computed<MbAlertTone>(() => props.tone);

const iconPath = computed(() => {
  switch (tone.value) {
    case 'success':
      return 'M8.6 12.1L11 14.5L15.4 10.1M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'warning':
      return 'M12 8V12.5M12 16.2H12.01M20.6 16.9L13.8 5.1C13 3.6 11 3.6 10.2 5.1L3.4 16.9C2.6 18.3 3.6 20 5.2 20H18.8C20.4 20 21.4 18.3 20.6 16.9Z';
    case 'danger':
      return 'M12 7.8V12.5M12 16.2H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'additional':
      return 'M12 8.5C10.4 8.5 9 9.7 9 11.2C9 12.4 9.8 13.2 10.8 13.9C11.8 14.6 12.1 15 12.1 15.7V16.1M12 18.1H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'info':
    default:
      return 'M12 10.2V16.2M12 7.8H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
  }
});

function onPrimaryClick(event: MouseEvent) {
  emit('primary-click', event);
}

function onSecondaryClick(event: MouseEvent) {
  emit('secondary-click', event);
}

function onClose(event: MouseEvent) {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close', event);
}
</script>

<template>
  <section
    v-if="visible"
    class="mb-alert"
    role="alert"
    :data-tone="tone"
    :aria-label="ariaLabel ?? title"
  >
    <span class="mb-alert__accent" aria-hidden="true" />

    <div class="mb-alert__content">
      <div class="mb-alert__icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="iconPath" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="mb-alert__text-wrap">
        <p class="mb-alert__title">{{ title }}</p>
        <p class="mb-alert__description">{{ description }}</p>

        <div class="mb-alert__actions">
          <button v-if="primaryLabel" type="button" class="mb-alert__btn mb-alert__btn--primary" @click="onPrimaryClick">
            {{ primaryLabel }}
          </button>
          <button
            v-if="secondaryLabel"
            type="button"
            class="mb-alert__btn mb-alert__btn--secondary"
            @click="onSecondaryClick"
          >
            {{ secondaryLabel }}
          </button>
        </div>
      </div>

      <button v-if="dismissible" type="button" class="mb-alert__close" aria-label="Close alert" @click="onClose">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </section>
</template>
