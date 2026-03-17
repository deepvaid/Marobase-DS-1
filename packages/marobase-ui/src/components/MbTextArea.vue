<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MbTextAreaProps, MbTextAreaState } from './MbTextArea.types';
import '../styles/mb-text-area.css';

const props = withDefaults(defineProps<MbTextAreaProps>(), {
  modelValue: '',
  label: 'Label',
  placeholder: '',
  hint: 'Hint text',
  errorMessage: 'Error message',
  required: false,
  state: 'default',
  disabled: false,
  floatingLabel: false,
  rows: 6,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const hasFocus = ref(false);
const messageId = `mb-ta-msg-${Math.random().toString(36).slice(2, 10)}`;

const state = computed<MbTextAreaState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isError = computed(() => state.value === 'error');
const isDisabled = computed(() => state.value === 'disabled');

const visualState = computed<MbTextAreaState>(() => {
  if (state.value !== 'default') return state.value;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const currentValue = computed(() => props.modelValue ?? '');

const isFloating = computed(() => {
  if (!props.floatingLabel) return false;
  return hasFocus.value || currentValue.value.length > 0 || visualState.value === 'focus';
});

const showPlaceholder = computed(() => {
  if (!props.floatingLabel) return true;
  return hasFocus.value || currentValue.value.length > 0;
});

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null;
  if (!target) return;
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
    class="mb-ta"
    :data-state="visualState"
    :data-floating-label="floatingLabel ? 'true' : 'false'"
    :data-floating="isFloating ? 'true' : 'false'"
  >
    <label v-if="!floatingLabel" class="mb-ta__label" :aria-label="ariaLabel ?? label">
      <span>{{ label }}</span>
      <span v-if="required" class="mb-ta__required">*</span>
    </label>

    <div class="mb-ta__field">
      <div v-if="floatingLabel" class="mb-ta__floating-label">
        <span class="mb-ta__floating-label-text">{{ label }}</span>
        <span v-if="required" class="mb-ta__required">*</span>
      </div>

      <textarea
        class="mb-ta__input"
        :value="modelValue"
        :rows="rows"
        :placeholder="showPlaceholder ? placeholder : ''"
        :disabled="isDisabled"
        :aria-label="ariaLabel ?? label"
        :aria-invalid="isError ? 'true' : 'false'"
        :aria-describedby="messageId"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <p v-if="!isError" :id="messageId" class="mb-ta__hint">{{ hint }}</p>
    <p v-else :id="messageId" class="mb-ta__error">{{ errorMessage }}</p>
  </div>
</template>
