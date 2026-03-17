<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  MbFloatingInputFieldProps,
  MbFloatingInputFieldState
} from './MbFloatingInputField.types';
import '../styles/mb-floating-input-field.css';

const props = withDefaults(defineProps<MbFloatingInputFieldProps>(), {
  size: 'lg',
  state: 'default',
  label: 'Label',
  required: false,
  hint: 'Hint text',
  errorMessage: 'Error message',
  placeholder: 'Placeholder',
  trailingIcon: 'rhombus',
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const state = computed<MbFloatingInputFieldState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isControlled = computed(() => props.modelValue !== undefined);
const internalValue = ref('');
const hasFocus = ref(false);

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');
const uid = `mb-fif-${Math.random().toString(36).slice(2, 10)}`;
const messageId = computed(() => `${uid}-${isError.value ? 'error' : 'hint'}`);
const currentValue = computed(() => {
  if (isControlled.value) return props.modelValue ?? '';
  return internalValue.value;
});
const visualState = computed<MbFloatingInputFieldState>(() => {
  if (state.value !== 'default') return state.value;
  if (hasFocus.value) return 'focus';
  return 'default';
});
const isFloating = computed(
  () =>
    hasFocus.value ||
    state.value === 'focus' ||
    state.value === 'filled' ||
    state.value === 'error' ||
    currentValue.value.length > 0
);
const showPlaceholder = computed(() => visualState.value === 'focus' && currentValue.value.length === 0);
const displayValue = computed(() => {
  if (currentValue.value.length > 0) return currentValue.value;
  if (state.value === 'filled') return 'Filled';
  return '';
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  if (!isControlled.value) {
    internalValue.value = target.value;
  }
  emit('update:modelValue', target.value);
}

function onFocus(event: FocusEvent) {
  hasFocus.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}
</script>

<template>
  <div
    class="mb-fif"
    :data-size="size"
    :data-state="visualState"
    :data-floating="isFloating ? 'true' : 'false'"
  >
    <label class="mb-fif__control" :aria-label="ariaLabel ?? label">
      <span class="mb-fif__floating-label">
        <span class="mb-fif__floating-label-text">{{ label }}</span>
        <span v-if="required" class="mb-fif__required">*</span>
      </span>

      <input
        class="mb-fif__input"
        :value="displayValue"
        :placeholder="showPlaceholder ? placeholder : ''"
        :disabled="isDisabled"
        :aria-invalid="isError ? 'true' : 'false'"
        :aria-describedby="messageId"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <span v-if="trailingIcon === 'rhombus'" class="mb-fif__trailing" aria-hidden="true">
        <span class="mb-fif__rhombus" />
      </span>

      <slot name="trailing" />
    </label>

    <p v-if="!isError" :id="messageId" class="mb-fif__hint">{{ hint }}</p>
    <p v-else :id="messageId" class="mb-fif__error">
      <span class="mb-fif__error-icon" aria-hidden="true">!</span>
      <span>{{ errorMessage }}</span>
    </p>
  </div>
</template>
