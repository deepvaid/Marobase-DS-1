<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbSelectOption, MbSelectProps, MbSelectState } from './MbSelect.types';
import '../styles/mb-select.css';

const defaultOptions: MbSelectOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' }
];

const props = withDefaults(defineProps<MbSelectProps>(), {
  modelValue: '',
  options: () => [],
  label: 'Label',
  placeholder: 'Select options',
  hint: 'Hint text',
  errorMessage: 'Error message',
  required: false,
  open: false,
  state: 'default',
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'update:open', value: boolean): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const hasFocus = ref(false);
const internalOpen = ref(Boolean(props.open));

const isOpenControlled = computed(() => typeof props.open === 'boolean');

watch(
  () => props.open,
  (next) => {
    if (typeof next === 'boolean') {
      internalOpen.value = next;
    }
  }
);

const options = computed<MbSelectOption[]>(() => {
  if (!props.options || props.options.length === 0) {
    return defaultOptions;
  }
  return props.options;
});

const state = computed<MbSelectState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');

const isOpen = computed(() => {
  if (isDisabled.value) return false;
  return isOpenControlled.value ? Boolean(props.open) : internalOpen.value;
});

const selectedOption = computed(() => {
  return options.value.find((option) => option.label === props.modelValue);
});

const visualState = computed<MbSelectState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value || isOpen.value) return 'focus';
  return 'default';
});

const displayValue = computed(() => selectedOption.value?.label ?? props.modelValue ?? '');

function setOpen(next: boolean) {
  if (!isOpenControlled.value) {
    internalOpen.value = next;
  }
  emit('update:open', next);
}

function toggleOpen() {
  if (isDisabled.value) return;
  setOpen(!isOpen.value);
}

function onOptionClick(option: MbSelectOption) {
  if (isDisabled.value || option.disabled) return;
  emit('update:modelValue', option.label);
  setOpen(false);
}

function onFocusIn(event: FocusEvent) {
  if (isDisabled.value) return;
  hasFocus.value = true;
  emit('focus', event);
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (rootRef.value?.contains(next)) {
    return;
  }

  hasFocus.value = false;
  setOpen(false);
  emit('blur', event);
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return;

  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    setOpen(true);
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    setOpen(false);
  }
}
</script>

<template>
  <div
    ref="rootRef"
    class="mb-sl"
    :data-state="visualState"
    :data-open="isOpen ? 'true' : 'false'"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <label class="mb-sl__label" :aria-label="ariaLabel ?? label">
      <span>{{ label }}</span>
      <span v-if="required" class="mb-sl__required">*</span>
    </label>

    <button
      type="button"
      class="mb-sl__trigger"
      :aria-label="ariaLabel ?? label"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :disabled="isDisabled"
      @click="toggleOpen"
      @keydown="onTriggerKeydown"
    >
      <span class="mb-sl__value" :data-placeholder="displayValue ? 'false' : 'true'">
        {{ displayValue || placeholder }}
      </span>
      <span class="mb-sl__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    <div v-if="isOpen" class="mb-sl__menu" role="listbox">
      <button
        v-for="option in options"
        :key="option.id ?? option.label"
        type="button"
        class="mb-sl__option"
        :data-selected="option.label === displayValue ? 'true' : 'false'"
        :disabled="option.disabled"
        @click="onOptionClick(option)"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="!isError" class="mb-sl__hint">{{ hint }}</p>
    <p v-else class="mb-sl__error">{{ errorMessage }}</p>
  </div>
</template>
