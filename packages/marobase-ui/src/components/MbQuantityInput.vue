<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbQuantityInputProps, MbQuantityInputState } from './MbQuantityInput.types';
import '../styles/mb-quantity-input.css';

const props = withDefaults(defineProps<MbQuantityInputProps>(), {
  modelValue: 99,
  state: 'focus',
  label: 'Label',
  hint: 'Hint text',
  errorMessage: 'Error message',
  min: 0,
  max: 999,
  step: 1,
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'increment', value: number): void;
  (event: 'decrement', value: number): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const internalValue = ref(Number.isFinite(props.modelValue) ? Number(props.modelValue) : 99);

watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      internalValue.value = value;
    }
  }
);

const state = computed<MbQuantityInputState>(() => {
  if (props.disabled) {
    return 'disabled';
  }
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');
const messageId = `mb-qi-msg-${Math.random().toString(36).slice(2, 10)}`;
const displayValue = computed(() => internalValue.value);

function clampValue(value: number): number {
  const min = Number.isFinite(props.min) ? Number(props.min) : 0;
  const max = Number.isFinite(props.max) ? Number(props.max) : 999;
  return Math.min(Math.max(value, min), max);
}

function commitValue(value: number) {
  const next = clampValue(value);
  internalValue.value = next;
  emit('update:modelValue', next);
}

function increment() {
  if (isDisabled.value) {
    return;
  }

  const step = Number.isFinite(props.step) ? Number(props.step) : 1;
  const next = internalValue.value + step;
  commitValue(next);
  emit('increment', internalValue.value);
}

function decrement() {
  if (isDisabled.value) {
    return;
  }

  const step = Number.isFinite(props.step) ? Number(props.step) : 1;
  const next = internalValue.value - step;
  commitValue(next);
  emit('decrement', internalValue.value);
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }

  const parsed = Number.parseInt(target.value, 10);
  if (Number.isFinite(parsed)) {
    commitValue(parsed);
    return;
  }

  target.value = String(internalValue.value);
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  emit('blur', event);
}
</script>

<template>
  <div class="mb-qi" :data-state="state">
    <label class="mb-qi__label" :aria-label="ariaLabel ?? label">{{ label }}</label>

    <div class="mb-qi__control">
      <button
        type="button"
        class="mb-qi__step mb-qi__step--minus"
        :disabled="isDisabled"
        aria-label="Decrease quantity"
        @click="decrement"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M5 12H19"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="mb-qi__value-wrap">
        <input
          class="mb-qi__value"
          type="text"
          inputmode="numeric"
          :value="displayValue"
          :disabled="isDisabled"
          :aria-invalid="isError ? 'true' : 'false'"
          :aria-describedby="messageId"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>

      <button
        type="button"
        class="mb-qi__step mb-qi__step--plus"
        :disabled="isDisabled"
        aria-label="Increase quantity"
        @click="increment"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <p v-if="!isError" :id="messageId" class="mb-qi__hint">{{ hint }}</p>
    <p v-else :id="messageId" class="mb-qi__error">{{ errorMessage }}</p>
  </div>
</template>
