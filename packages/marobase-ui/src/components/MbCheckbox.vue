<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MbCheckboxProps, MbCheckboxState } from './MbCheckbox.types';
import '../styles/mb-checkbox.css';

const props = withDefaults(defineProps<MbCheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  size: 'lg',
  state: 'default',
  label: 'Label',
  caption: '',
  hint: 'Hint text',
  errorMessage: 'Error message',
  disabled: false,
  required: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'update:indeterminate', value: boolean): void;
  (event: 'change', value: boolean): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const hasFocus = ref(false);

const checked = computed(() => Boolean(props.modelValue));
const isMixed = computed(() => Boolean(props.indeterminate) && !checked.value);
const state = computed<MbCheckboxState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});
const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');

const visualState = computed<MbCheckboxState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const message = computed(() => (isError.value ? props.errorMessage : props.hint));

function onToggle() {
  if (isDisabled.value) return;

  if (isMixed.value) {
    emit('update:indeterminate', false);
    emit('update:modelValue', true);
    emit('change', true);
    return;
  }

  const next = !checked.value;
  emit('update:modelValue', next);
  emit('change', next);
}

function onFocus(event: FocusEvent) {
  if (isDisabled.value) return;
  hasFocus.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return;

  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    onToggle();
  }
}
</script>

<template>
  <div
    class="mb-ch"
    :data-size="size"
    :data-state="visualState"
    :data-checked="checked ? 'true' : 'false'"
    :data-indeterminate="isMixed ? 'true' : 'false'"
  >
    <button
      type="button"
      class="mb-ch__button"
      role="checkbox"
      :aria-label="ariaLabel ?? label"
      :aria-checked="isMixed ? 'mixed' : checked ? 'true' : 'false'"
      :disabled="isDisabled"
      @click="onToggle"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <span class="mb-ch__control" aria-hidden="true">
        <svg v-if="checked && !isMixed" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.5 12.4L10.1 16.9L18.5 8.6"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-else-if="isMixed" class="mb-ch__indeterminate" />
      </span>

      <span class="mb-ch__content">
        <span class="mb-ch__label">
          {{ label }}
          <span v-if="required" class="mb-ch__required">*</span>
        </span>
        <span v-if="caption" class="mb-ch__caption">{{ caption }}</span>
      </span>
    </button>

    <p v-if="message" class="mb-ch__message" :class="isError ? 'mb-ch__message--error' : 'mb-ch__message--hint'">
      {{ message }}
    </p>
  </div>
</template>
