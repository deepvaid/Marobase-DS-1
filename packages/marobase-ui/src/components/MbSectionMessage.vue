<script setup lang="ts">
import { computed } from 'vue';
import type { MbSectionMessageProps, MbSectionMessageTone } from './MbSectionMessage.types';
import '../styles/mb-section-message.css';

const props = withDefaults(defineProps<MbSectionMessageProps>(), {
  tone: 'additional',
  title: 'Quick start development',
  description:
    'Link this issue to your code by including issue keys when creating a branch, commit, or pull request below.',
  primaryLabel: 'Learn more',
  secondaryLabel: '',
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'primary-click', payload: MouseEvent): void;
  (event: 'secondary-click', payload: MouseEvent): void;
}>();

const tone = computed<MbSectionMessageTone>(() => props.tone);

const iconPath = computed(() => {
  switch (tone.value) {
    case 'info':
      return 'M12 10.2V16.2M12 7.8H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'success':
      return 'M8.6 12.1L11 14.5L15.4 10.1M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'warning':
      return 'M12 8V12.5M12 16.2H12.01M20.6 16.9L13.8 5.1C13 3.6 11 3.6 10.2 5.1L3.4 16.9C2.6 18.3 3.6 20 5.2 20H18.8C20.4 20 21.4 18.3 20.6 16.9Z';
    case 'danger':
      return 'M12 7.8V12.5M12 16.2H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
    case 'additional':
    default:
      return 'M12 8.5C10.4 8.5 9 9.7 9 11.2C9 12.4 9.8 13.2 10.8 13.9C11.8 14.6 12.1 15 12.1 15.7V16.1M12 18.1H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z';
  }
});

function onPrimary(event: MouseEvent) {
  emit('primary-click', event);
}

function onSecondary(event: MouseEvent) {
  emit('secondary-click', event);
}
</script>

<template>
  <section class="mb-secmsg" role="status" :data-tone="tone" :aria-label="ariaLabel ?? title">
    <span class="mb-secmsg__accent" aria-hidden="true" />

    <div class="mb-secmsg__content">
      <div class="mb-secmsg__icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="iconPath" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="mb-secmsg__text-wrap">
        <p class="mb-secmsg__title">{{ title }}</p>
        <p class="mb-secmsg__description">{{ description }}</p>

        <div class="mb-secmsg__actions">
          <button v-if="primaryLabel" type="button" class="mb-secmsg__link" @click="onPrimary">
            {{ primaryLabel }}
          </button>
          <button v-if="secondaryLabel" type="button" class="mb-secmsg__link mb-secmsg__link--secondary" @click="onSecondary">
            {{ secondaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
