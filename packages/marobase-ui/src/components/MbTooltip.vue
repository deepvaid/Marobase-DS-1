<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbTooltipProps } from './MbTooltip.types';
import '../styles/mb-tooltip.css';

const props = withDefaults(defineProps<MbTooltipProps>(), {
  modelValue: undefined,
  text: 'It\'s a tooltip',
  placement: 'top',
  disabled: false,
  triggerAriaLabel: 'Show tooltip'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const tooltipId = `mb-tooltip-${Math.random().toString(36).slice(2, 10)}`;
const isControlled = computed(() => typeof props.modelValue === 'boolean');
const internalOpen = ref(false);

watch(
  () => props.modelValue,
  (next) => {
    if (typeof next === 'boolean') {
      internalOpen.value = next;
    }
  },
  { immediate: true }
);

const isOpen = computed(() => {
  const raw = isControlled.value ? Boolean(props.modelValue) : internalOpen.value;
  return !props.disabled && raw;
});

function setOpen(next: boolean) {
  if (props.disabled) {
    return;
  }

  if (!isControlled.value) {
    internalOpen.value = next;
  }

  emit('update:modelValue', next);
}

function open() {
  setOpen(true);
}

function close() {
  setOpen(false);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
}
</script>

<template>
  <span
    class="mb-tip"
    :data-placement="placement"
    @mouseenter="open"
    @mouseleave="close"
    @focusin="open"
    @focusout="close"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="mb-tip__trigger"
      :aria-label="triggerAriaLabel"
      :aria-describedby="isOpen ? tooltipId : undefined"
      :disabled="disabled"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
        <circle cx="12" cy="8" r="1.2" fill="currentColor" />
        <path
          d="M12 11.2V16"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <span v-if="isOpen" :id="tooltipId" class="mb-tip__bubble" role="tooltip">{{ text }}</span>
  </span>
</template>
