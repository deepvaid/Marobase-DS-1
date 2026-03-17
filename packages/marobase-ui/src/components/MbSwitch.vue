<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MbSwitchProps, MbSwitchState } from './MbSwitch.types';
import '../styles/mb-switch.css';

const props = withDefaults(defineProps<MbSwitchProps>(), {
  modelValue: false,
  indeterminate: false,
  loading: false,
  size: 'md',
  state: 'default',
  label: 'Label',
  caption: '',
  hint: 'Hint text',
  errorMessage: 'Error message',
  disabled: false,
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
const state = computed<MbSwitchState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');

const visualState = computed<MbSwitchState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const message = computed(() => (isError.value ? props.errorMessage : props.hint));

function onToggle() {
  if (isDisabled.value || props.loading) return;

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
  if (isDisabled.value || props.loading) return;

  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    onToggle();
  }
}
</script>

<template>
  <div
    class="mb-sw"
    :data-size="size"
    :data-state="visualState"
    :data-checked="checked ? 'true' : 'false'"
    :data-indeterminate="isMixed ? 'true' : 'false'"
    :data-loading="loading ? 'true' : 'false'"
  >
    <button
      type="button"
      class="mb-sw__button"
      role="switch"
      :aria-label="ariaLabel ?? label"
      :aria-checked="checked ? 'true' : 'false'"
      :disabled="isDisabled"
      @click="onToggle"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <span class="mb-sw__track" aria-hidden="true">
        <span class="mb-sw__thumb">
          <span v-if="loading" class="mb-sw__spinner" />
          <span v-else-if="isMixed" class="mb-sw__minus" />
        </span>
      </span>

      <span v-if="label" class="mb-sw__content">
        <span class="mb-sw__label">{{ label }}</span>
        <span v-if="caption" class="mb-sw__caption">{{ caption }}</span>
      </span>
    </button>

    <p v-if="message" class="mb-sw__message" :class="isError ? 'mb-sw__message--error' : 'mb-sw__message--hint'">
      {{ message }}
    </p>
  </div>
</template>
