<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbInputDropdownOption,
  MbInputDropdownProps,
  MbInputDropdownState
} from './MbInputDropdown.types';
import '../styles/mb-input-dropdown.css';

const defaultOptions: MbInputDropdownOption[] = [
  { id: 'en', label: 'English', meta: '+1', icon: '🇺🇸' },
  { id: 'bg', label: 'Български' },
  { id: 'cz', label: 'Čeština', meta: '+355', icon: '🇦🇱' },
  { id: 'dk', label: 'Dansk', meta: '+213', icon: '🇩🇿' },
  { id: 'de', label: 'Deutsch', meta: '+1684', icon: '🇦🇸' },
  { id: 'fr', label: 'Français', meta: '+376', icon: '🇦🇩' }
];

const props = withDefaults(defineProps<MbInputDropdownProps>(), {
  modelValue: 'English',
  searchValue: '',
  options: () => [],
  label: 'Language',
  placeholder: 'Select option',
  leftAddon: 'Text',
  hint: 'Hint text',
  errorMessage: 'Error message',
  required: false,
  open: false,
  showSearch: true,
  state: 'default',
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'update:searchValue', value: string): void;
  (event: 'update:open', value: boolean): void;
  (event: 'select-option', payload: MbInputDropdownOption): void;
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

const options = computed(() => (props.options.length > 0 ? props.options : defaultOptions));

const state = computed<MbInputDropdownState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');
const isError = computed(() => state.value === 'error');

const isOpen = computed(() => {
  if (isDisabled.value) return false;
  return isOpenControlled.value ? Boolean(props.open) : internalOpen.value;
});

const visualState = computed<MbInputDropdownState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value || isOpen.value) return 'focus';
  return 'default';
});

const filteredOptions = computed(() => {
  const query = props.searchValue.trim().toLowerCase();
  if (!query) return options.value;
  return options.value.filter((option) => option.label.toLowerCase().includes(query));
});

const selectedOption = computed(() => {
  return options.value.find((option) => option.label === props.modelValue);
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

function onOptionClick(option: MbInputDropdownOption) {
  if (isDisabled.value || option.disabled) return;
  emit('update:modelValue', option.label);
  emit('select-option', option);
  setOpen(false);
}

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  emit('update:searchValue', target.value);
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
  <section
    ref="rootRef"
    class="mb-idd"
    :data-state="visualState"
    :data-open="isOpen ? 'true' : 'false'"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <label class="mb-idd__label" :aria-label="ariaLabel ?? label">
      <span>{{ label }}</span>
      <span v-if="required" class="mb-idd__required">*</span>
    </label>

    <button
      type="button"
      class="mb-idd__trigger"
      :aria-label="ariaLabel ?? label"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :disabled="isDisabled"
      @click="toggleOpen"
      @keydown="onTriggerKeydown"
    >
      <span v-if="leftAddon" class="mb-idd__addon">{{ leftAddon }}</span>
      <span class="mb-idd__value" :data-placeholder="displayValue ? 'false' : 'true'">
        {{ displayValue || placeholder }}
      </span>
      <span class="mb-idd__icon" aria-hidden="true">
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

    <div v-if="isOpen" class="mb-idd__menu" role="listbox">
      <div v-if="showSearch" class="mb-idd__search-wrap">
        <span class="mb-idd__search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8" />
            <path d="M16 16L20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <input
          class="mb-idd__search-input"
          type="text"
          placeholder="Search"
          :value="searchValue"
          :disabled="isDisabled"
          @input="onSearchInput"
        />
      </div>

      <button
        v-for="option in filteredOptions"
        :key="option.id ?? option.label"
        type="button"
        class="mb-idd__option"
        :data-selected="option.label === displayValue ? 'true' : 'false'"
        :disabled="option.disabled"
        @click="onOptionClick(option)"
      >
        <span class="mb-idd__option-left">
          <span v-if="option.icon" class="mb-idd__option-icon" aria-hidden="true">{{ option.icon }}</span>
          <span>{{ option.label }}</span>
        </span>
        <span v-if="option.meta" class="mb-idd__option-meta">{{ option.meta }}</span>
      </button>
    </div>

    <p v-if="!isError" class="mb-idd__hint">{{ hint }}</p>
    <p v-else class="mb-idd__error">{{ errorMessage }}</p>
  </section>
</template>
