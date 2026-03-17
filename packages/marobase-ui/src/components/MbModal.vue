<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbModalActionPayload,
  MbModalCloseReason,
  MbModalProps
} from './MbModal.types';
import '../styles/mb-modal.css';

const props = withDefaults(defineProps<MbModalProps>(), {
  modelValue: undefined,
  title: 'Popup header',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  primaryLabel: 'Button',
  secondaryLabel: 'Button',
  dismissible: true,
  closeOnOverlay: true,
  closeOnAction: false,
  width: 400,
  ariaLabel: 'Modal'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'primary-click', payload: MbModalActionPayload): void;
  (event: 'secondary-click', payload: MbModalActionPayload): void;
  (event: 'close', payload: MbModalActionPayload): void;
}>();

const isControlled = computed(() => typeof props.modelValue === 'boolean');
const internalOpen = ref(isControlled.value ? Boolean(props.modelValue) : true);
const panelStyle = computed(() => ({ width: `${props.width}px` }));

watch(
  () => props.modelValue,
  (next) => {
    if (typeof next === 'boolean') {
      internalOpen.value = next;
    }
  }
);

const isOpen = computed(() => {
  if (isControlled.value) {
    return Boolean(props.modelValue);
  }

  return internalOpen.value;
});

function setOpen(next: boolean) {
  if (!isControlled.value) {
    internalOpen.value = next;
  }

  emit('update:modelValue', next);
}

function close(reason: MbModalCloseReason, event: MouseEvent | KeyboardEvent) {
  if (reason === 'close' && !props.dismissible) {
    return;
  }

  setOpen(false);
  emit('close', { reason, event });
}

function onOverlayClick(event: MouseEvent) {
  if (!props.closeOnOverlay || event.target !== event.currentTarget) {
    return;
  }

  close('overlay', event);
}

function onPrimaryClick(event: MouseEvent) {
  emit('primary-click', { reason: 'primary', event });
  if (props.closeOnAction) {
    setOpen(false);
  }
}

function onSecondaryClick(event: MouseEvent) {
  emit('secondary-click', { reason: 'secondary', event });
  if (props.closeOnAction) {
    setOpen(false);
  }
}

function onCloseClick(event: MouseEvent) {
  close('close', event);
}

function onRootKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close('escape', event);
  }
}
</script>

<template>
  <div v-if="isOpen" class="mb-modal" role="presentation" @click="onOverlayClick" @keydown="onRootKeydown">
    <section class="mb-modal__panel" :style="panelStyle" role="dialog" aria-modal="true" :aria-label="ariaLabel">
      <header class="mb-modal__header">
        <h2 class="mb-modal__title">{{ title }}</h2>
        <button
          v-if="dismissible"
          type="button"
          class="mb-modal__close"
          aria-label="Close modal"
          @click="onCloseClick"
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
      </header>

      <div class="mb-modal__body">
        <p class="mb-modal__description">{{ description }}</p>
      </div>

      <footer class="mb-modal__footer">
        <button type="button" class="mb-modal__button mb-modal__button--secondary" @click="onSecondaryClick">
          {{ secondaryLabel }}
        </button>
        <button type="button" class="mb-modal__button mb-modal__button--primary" @click="onPrimaryClick">
          {{ primaryLabel }}
        </button>
      </footer>
    </section>
  </div>
</template>
