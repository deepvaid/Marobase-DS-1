<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbPopoverActionPayload,
  MbPopoverProps
} from './MbPopover.types';
import '../styles/mb-popover.css';

const props = withDefaults(defineProps<MbPopoverProps>(), {
  modelValue: undefined,
  title: 'Popover Header',
  description: 'Helpful description for popover',
  primaryLabel: 'Accept',
  secondaryLabel: 'Cancel',
  dismissible: true,
  closeOnAction: false,
  showArrow: true,
  width: 300,
  ariaLabel: 'Popover'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'primary-click', payload: MbPopoverActionPayload): void;
  (event: 'secondary-click', payload: MbPopoverActionPayload): void;
  (event: 'close', payload: MbPopoverActionPayload): void;
}>();

const isControlled = computed(() => typeof props.modelValue === 'boolean');
const internalOpen = ref(isControlled.value ? Boolean(props.modelValue) : true);

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

const widthStyle = computed(() => ({ width: `${props.width}px` }));

function setOpen(next: boolean) {
  if (!isControlled.value) {
    internalOpen.value = next;
  }

  emit('update:modelValue', next);
}

function close(action: MbPopoverActionPayload['action'], event: MouseEvent | KeyboardEvent) {
  if (!props.dismissible) {
    return;
  }

  setOpen(false);
  emit('close', { action, event });
}

function onPrimaryClick(event: MouseEvent) {
  emit('primary-click', { action: 'primary', event });
  if (props.closeOnAction) {
    setOpen(false);
  }
}

function onSecondaryClick(event: MouseEvent) {
  emit('secondary-click', { action: 'secondary', event });
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
  <section
    v-if="isOpen"
    class="mb-pop"
    :style="widthStyle"
    :aria-label="ariaLabel"
    @keydown="onRootKeydown"
  >
    <div class="mb-pop__content" role="dialog" aria-modal="false">
      <header class="mb-pop__header">
        <h3 class="mb-pop__title">{{ title }}</h3>
        <button
          v-if="dismissible"
          type="button"
          class="mb-pop__close"
          aria-label="Close popover"
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

      <div class="mb-pop__body">
        <p class="mb-pop__description">{{ description }}</p>
      </div>

      <footer class="mb-pop__footer">
        <button type="button" class="mb-pop__button mb-pop__button--primary" @click="onPrimaryClick">
          {{ primaryLabel }}
        </button>
        <button type="button" class="mb-pop__button mb-pop__button--secondary" @click="onSecondaryClick">
          {{ secondaryLabel }}
        </button>
      </footer>
    </div>

    <span v-if="showArrow" class="mb-pop__arrow" aria-hidden="true" />
  </section>
</template>
