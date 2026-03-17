<script setup lang="ts">
import type { MbChipProps } from './MbChip.types';
import '../styles/mb-chip.css';

const props = withDefaults(defineProps<MbChipProps>(), {
  label: 'Tag with Dismiss',
  tone: 'neutral',
  selected: false,
  dismissible: true,
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
  (event: 'dismiss', payload: MouseEvent): void;
}>();

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('click', event);
}

function onDismiss(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  event.stopPropagation();
  emit('dismiss', event);
}
</script>

<template>
  <div
    class="mb-chip"
    :data-tone="tone"
    :data-selected="selected ? 'true' : 'false'"
    :data-disabled="disabled ? 'true' : 'false'"
  >
    <button
      type="button"
      class="mb-chip__main"
      :disabled="disabled"
      :aria-label="ariaLabel ?? label"
      @click="onClick"
    >
      <span class="mb-chip__label">{{ label }}</span>
    </button>

    <button
      v-if="dismissible"
      type="button"
      class="mb-chip__dismiss"
      :disabled="disabled"
      aria-label="Dismiss"
      @click="onDismiss"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M7 7L17 17M17 7L7 17"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>
