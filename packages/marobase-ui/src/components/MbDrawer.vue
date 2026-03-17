<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbDrawerActionPayload,
  MbDrawerCloseReason,
  MbDrawerProps
} from './MbDrawer.types';
import '../styles/mb-drawer.css';

const props = withDefaults(defineProps<MbDrawerProps>(), {
  modelValue: undefined,
  title: 'Add new card',
  subtitle: 'Visible only for you',
  primaryLabel: 'Save changes',
  secondaryLabel: 'Cancel',
  width: 424,
  showBackdrop: false,
  closeOnBackdrop: true,
  dismissible: true,
  ariaLabel: 'Drawer'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'primary-click', payload: MbDrawerActionPayload): void;
  (event: 'secondary-click', payload: MbDrawerActionPayload): void;
  (event: 'close', payload: MbDrawerActionPayload): void;
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

function close(reason: MbDrawerCloseReason, event: MouseEvent | KeyboardEvent) {
  if (reason === 'close' && !props.dismissible) {
    return;
  }

  setOpen(false);
  emit('close', { reason, event });
}

function onBackdropClick(event: MouseEvent) {
  if (!props.showBackdrop || !props.closeOnBackdrop) {
    return;
  }

  close('backdrop', event);
}

function onCloseClick(event: MouseEvent) {
  close('close', event);
}

function onSecondaryClick(event: MouseEvent) {
  emit('secondary-click', { reason: 'cancel', event });
}

function onPrimaryClick(event: MouseEvent) {
  emit('primary-click', { reason: 'primary', event });
}

function onRootKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close('escape', event);
  }
}
</script>

<template>
  <div v-if="isOpen" class="mb-drawer" :data-backdrop="showBackdrop ? 'true' : 'false'" @keydown="onRootKeydown">
    <button
      v-if="showBackdrop"
      type="button"
      class="mb-drawer__backdrop"
      aria-label="Close drawer"
      @click="onBackdropClick"
    />

    <aside class="mb-drawer__panel" :style="panelStyle" role="dialog" aria-modal="true" :aria-label="ariaLabel">
      <header class="mb-drawer__header">
        <span class="mb-drawer__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4.5" y="7" width="15" height="10" rx="2" stroke="currentColor" stroke-width="1.8" />
            <path d="M4.8 10H19.2" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </span>

        <div class="mb-drawer__title-wrap">
          <h2 class="mb-drawer__title">{{ title }}</h2>
          <p class="mb-drawer__subtitle">{{ subtitle }}</p>
        </div>

        <button
          v-if="dismissible"
          type="button"
          class="mb-drawer__close"
          aria-label="Close drawer"
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

      <div class="mb-drawer__divider" />

      <div class="mb-drawer__content">
        <form class="mb-drawer__form" @submit.prevent>
          <div class="mb-drawer__row mb-drawer__row--3">
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Card number</span>
              <span class="mb-drawer__input-wrap">
                <input class="mb-drawer__input" type="text" placeholder="0000 0000 0000 0000" />
                <span class="mb-drawer__input-chip" aria-hidden="true">mc</span>
              </span>
            </label>

            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Expiry date</span>
              <input class="mb-drawer__input" type="text" placeholder="01 / 02" />
            </label>

            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">CVV</span>
              <input class="mb-drawer__input" type="text" placeholder="" />
            </label>
          </div>

          <label class="mb-drawer__field">
            <span class="mb-drawer__field-label">Cardholder name</span>
            <input class="mb-drawer__input" type="text" placeholder="Enter your name" />
          </label>

          <label class="mb-drawer__check">
            <input type="checkbox" checked />
            <span>Make default</span>
          </label>

          <section class="mb-drawer__note" aria-label="Section message">
            <div class="mb-drawer__note-body">
              <strong>Confirmation link sent</strong>
              <p>Click the link in your email to approve this action</p>
              <button type="button" class="mb-drawer__note-link">Resend</button>
            </div>
            <button type="button" class="mb-drawer__note-close" aria-label="Dismiss message">×</button>
          </section>

          <label class="mb-drawer__check">
            <input type="checkbox" />
            <span>Use my default address</span>
          </label>

          <label class="mb-drawer__field">
            <span class="mb-drawer__field-label">Country</span>
            <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
              <span class="mb-drawer__flag" aria-hidden="true">🇺🇸</span>
              <span class="mb-drawer__select-value">United States</span>
              <span class="mb-drawer__chevron" aria-hidden="true">⌄</span>
            </span>
          </label>

          <label class="mb-drawer__field">
            <span class="mb-drawer__field-label">City</span>
            <input class="mb-drawer__input" type="text" placeholder="Enter your name" />
          </label>

          <label class="mb-drawer__field">
            <span class="mb-drawer__field-label">Billing address</span>
            <input class="mb-drawer__input" type="text" placeholder="Enter your name" />
          </label>

          <div class="mb-drawer__row mb-drawer__row--2">
            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">State</span>
              <span class="mb-drawer__input-wrap mb-drawer__input-wrap--select">
                <span class="mb-drawer__select-value">CA</span>
                <span class="mb-drawer__chevron" aria-hidden="true">⌄</span>
              </span>
            </label>

            <label class="mb-drawer__field">
              <span class="mb-drawer__field-label">Postal code</span>
              <input class="mb-drawer__input" type="text" placeholder="Enter your name" />
            </label>
          </div>

          <label class="mb-drawer__check">
            <input type="checkbox" checked />
            <span>Make default</span>
          </label>
        </form>
      </div>

      <footer class="mb-drawer__footer">
        <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--secondary" @click="onSecondaryClick">
          {{ secondaryLabel }}
        </button>
        <button type="button" class="mb-drawer__footer-btn mb-drawer__footer-btn--primary" @click="onPrimaryClick">
          {{ primaryLabel }}
        </button>
      </footer>
    </aside>
  </div>
</template>
