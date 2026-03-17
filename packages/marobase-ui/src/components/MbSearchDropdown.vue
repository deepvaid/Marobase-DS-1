<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbSearchDropdownOption,
  MbSearchDropdownProps,
  MbSearchDropdownState
} from './MbSearchDropdown.types';
import '../styles/mb-search-dropdown.css';

const defaultOptions: MbSearchDropdownOption[] = [
  { id: 'apple-store', prefix: 'Apple', label: 'store' },
  { id: 'apple-watch', prefix: 'Apple', label: 'watch' },
  { id: 'apple-music', prefix: 'Apple', label: 'music' },
  { id: 'apple-id', prefix: 'Apple', label: 'id' },
  { id: 'apple-iphone', prefix: 'Apple', label: 'iphone 14' }
];

const props = withDefaults(defineProps<MbSearchDropdownProps>(), {
  modelValue: 'Apple',
  options: () => [],
  placeholder: 'Search',
  open: false,
  state: 'default',
  disabled: false,
  ariaLabel: 'Search'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'update:open', value: boolean): void;
  (event: 'select-option', payload: MbSearchDropdownOption): void;
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

const options = computed<MbSearchDropdownOption[]>(() => {
  if (!props.options || props.options.length === 0) {
    return defaultOptions;
  }
  return props.options;
});

const state = computed<MbSearchDropdownState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');

const isOpen = computed(() => {
  if (isDisabled.value) return false;
  return isOpenControlled.value ? Boolean(props.open) : internalOpen.value;
});

const visualState = computed<MbSearchDropdownState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value || isOpen.value) return 'focus';
  return 'default';
});

const filteredOptions = computed(() => {
  const needle = (props.modelValue ?? '').trim().toLowerCase();
  if (!needle) return options.value;

  return options.value.filter((option) => {
    const value = `${option.prefix ?? ''} ${option.label}`.toLowerCase();
    return value.includes(needle);
  });
});

function setOpen(next: boolean) {
  if (!isOpenControlled.value) {
    internalOpen.value = next;
  }
  emit('update:open', next);
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  emit('update:modelValue', target.value);
  setOpen(true);
}

function onFocus() {
  if (isDisabled.value) return;
  hasFocus.value = true;
  setOpen(true);
}

function onBlur(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (rootRef.value?.contains(next)) {
    return;
  }

  hasFocus.value = false;
  setOpen(false);
}

function clearValue() {
  if (isDisabled.value) return;
  emit('update:modelValue', '');
  setOpen(true);
}

function onOptionClick(option: MbSearchDropdownOption) {
  if (isDisabled.value || option.disabled) return;

  const composed = `${option.prefix ?? ''}${option.prefix ? ' ' : ''}${option.label}`;
  emit('update:modelValue', composed.trim());
  emit('select-option', option);
  setOpen(false);
}
</script>

<template>
  <div
    ref="rootRef"
    class="mb-sd"
    :data-state="visualState"
    :data-open="isOpen ? 'true' : 'false'"
    @focusout="onBlur"
  >
    <div class="mb-sd__control">
      <span class="mb-sd__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M16 16L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>

      <input
        class="mb-sd__input"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :aria-label="ariaLabel"
        @input="onInput"
        @focus="onFocus"
      />

      <button
        v-if="modelValue"
        type="button"
        class="mb-sd__clear"
        :disabled="isDisabled"
        aria-label="Clear search"
        @click="clearValue"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 7L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M17 7L7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="mb-sd__menu" role="listbox">
      <button
        v-for="option in filteredOptions"
        :key="option.id ?? option.label"
        type="button"
        class="mb-sd__option"
        :disabled="option.disabled"
        @click="onOptionClick(option)"
      >
        <span class="mb-sd__option-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M16 16L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <span>
          <strong v-if="option.prefix">{{ option.prefix }}</strong>
          <span v-if="option.prefix">&nbsp;</span>
          <span>{{ option.label }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
