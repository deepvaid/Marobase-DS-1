<script setup lang="ts">
import { computed } from 'vue';
import type {
  MbInputFieldProps,
  MbInputFieldState,
  MbInputFieldTrailingIcon
} from './MbInputField.types';
import '../styles/mb-input-field.css';

const props = withDefaults(defineProps<MbInputFieldProps>(), {
  modelValue: '',
  state: 'default',
  label: 'Label',
  required: false,
  hint: 'Hint text',
  errorMessage: 'Error message',
  placeholder: 'Placeholder',
  leftAddon: 'Text',
  trailingIcon: 'rhombus',
  width: 320,
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const state = computed<MbInputFieldState>(() => {
  if (props.disabled) {
    return 'disabled';
  }
  return props.state;
});

const trailingIcon = computed<MbInputFieldTrailingIcon>(() => props.trailingIcon);
const isError = computed(() => state.value === 'error');
const messageId = `mb-if-msg-${Math.random().toString(36).slice(2, 10)}`;
const inputWidthStyle = computed(() => ({ width: `${props.width}px` }));

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }
  emit('update:modelValue', target.value);
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  emit('blur', event);
}
</script>

<template>
  <div class="mb-if" :data-state="state" :style="inputWidthStyle">
    <label class="mb-if__label" :aria-label="ariaLabel ?? label">
      <span class="mb-if__label-text">{{ label }}</span>
      <span v-if="required" class="mb-if__required">*</span>
    </label>

    <div class="mb-if__control">
      <span v-if="leftAddon" class="mb-if__left-addon">{{ leftAddon }}</span>

      <input
        class="mb-if__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="state === 'disabled'"
        :aria-invalid="isError ? 'true' : 'false'"
        :aria-describedby="messageId"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <span v-if="trailingIcon === 'rhombus'" class="mb-if__trailing" aria-hidden="true">
        <span class="mb-if__rhombus" />
      </span>
    </div>

    <p v-if="!isError" :id="messageId" class="mb-if__hint">{{ hint }}</p>
    <p v-else :id="messageId" class="mb-if__error">{{ errorMessage }}</p>
  </div>
</template>
