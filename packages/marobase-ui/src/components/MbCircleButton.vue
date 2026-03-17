<script setup lang="ts">
import { computed } from 'vue';
import type {
  MbCircleButtonMode,
  MbCircleButtonProps,
  MbCircleButtonState,
  MbCircleButtonVariant
} from './MbCircleButton.types';
import '../styles/mb-circle-button.css';

const props = withDefaults(defineProps<MbCircleButtonProps>(), {
  variant: 'neutral',
  state: 'default',
  mode: 'icon-only',
  label: 'Button',
  ariaLabel: undefined,
  disabled: false
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const variant = computed<MbCircleButtonVariant>(() => props.variant);
const mode = computed<MbCircleButtonMode>(() => props.mode);

const isDisabled = computed(() => props.disabled || props.state === 'disabled');
const resolvedState = computed<MbCircleButtonState>(() =>
  isDisabled.value ? 'disabled' : props.state
);

const iconOnlyAriaLabel = computed(() => {
  if (mode.value !== 'icon-only') {
    return undefined;
  }

  return props.ariaLabel ?? props.label;
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
    class="mb-circle-btn"
    :data-variant="variant"
    :data-state="resolvedState"
    :data-mode="mode"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-label="iconOnlyAriaLabel"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span class="mb-circle-btn__icon" aria-hidden="true">
      <slot name="icon">
        <span class="mb-circle-btn__icon-fallback" />
      </slot>
    </span>

    <span v-if="mode === 'with-label'" class="mb-circle-btn__label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
