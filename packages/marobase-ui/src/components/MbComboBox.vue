<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbComboBoxOption, MbComboBoxProps, MbComboBoxState } from './MbComboBox.types';
import '../styles/mb-combo-box.css';

const defaultOptions: MbComboBoxOption[] = [
  { id: 'chrome', label: 'Chrome' },
  { id: 'edge', label: 'Edge' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'safari', label: 'Safari' }
];

const props = withDefaults(defineProps<MbComboBoxProps>(), {
  modelValue: '',
  options: () => [],
  label: 'Browser',
  placeholder: '',
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

const options = computed<MbComboBoxOption[]>(() => {
  if (!props.options || props.options.length === 0) {
    return defaultOptions;
  }
  return props.options;
});

const state = computed<MbComboBoxState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');

const isOpen = computed(() => {
  if (isDisabled.value) return false;
  return isOpenControlled.value ? Boolean(props.open) : internalOpen.value;
});

const filteredOptions = computed(() => {
  const needle = (props.modelValue ?? '').trim().toLowerCase();
  if (!needle) return options.value;

  return options.value.filter((option) => option.label.toLowerCase().includes(needle));
});

const visualState = computed<MbComboBoxState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value || isOpen.value) return 'focus';
  return 'default';
});

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

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  emit('update:modelValue', target.value);
  setOpen(true);
}

function onOptionClick(option: MbComboBoxOption) {
  if (isDisabled.value || option.disabled) return;
  emit('update:modelValue', option.label);
  setOpen(false);
}

function onFocusIn(event: FocusEvent) {
  if (isDisabled.value) return;
  hasFocus.value = true;
  setOpen(true);
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
</script>

<template>
  <div
    ref="rootRef"
    class="mb-cb"
    :data-state="visualState"
    :data-open="isOpen ? 'true' : 'false'"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <label class="mb-cb__label" :aria-label="ariaLabel ?? label">
      <span>{{ label }}</span>
      <span v-if="required" class="mb-cb__required">*</span>
    </label>

    <div class="mb-cb__control">
      <input
        class="mb-cb__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :aria-label="ariaLabel ?? label"
        :aria-invalid="isError ? 'true' : 'false'"
        @input="onInput"
      />

      <button
        type="button"
        class="mb-cb__toggle"
        :disabled="isDisabled"
        aria-label="Toggle options"
        @click="toggleOpen"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="mb-cb__menu" role="listbox">
      <button
        v-for="option in filteredOptions"
        :key="option.id ?? option.label"
        type="button"
        class="mb-cb__option"
        :data-selected="option.label === modelValue ? 'true' : 'false'"
        :disabled="option.disabled"
        @click="onOptionClick(option)"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="!isError" class="mb-cb__hint">{{ hint }}</p>
    <p v-else class="mb-cb__error">{{ errorMessage }}</p>
  </div>
</template>
