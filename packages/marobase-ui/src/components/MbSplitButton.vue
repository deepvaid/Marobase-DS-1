<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbSplitButtonOption,
  MbSplitButtonProps,
  MbSplitButtonSelectPayload,
  MbSplitButtonSize,
  MbSplitButtonTogglePayload
} from './MbSplitButton.types';
import '../styles/mb-split-button.css';

const defaultOptions: MbSplitButtonOption[] = [
  { id: 'menu-1', label: 'Menu Option' },
  { id: 'menu-2', label: 'Menu Option' },
  { id: 'menu-3', label: 'Menu Option' },
  { id: 'menu-4', label: 'Menu Option' },
  { id: 'menu-5', label: 'Menu Option' },
  { id: 'menu-6', label: 'Menu Option' }
];

const props = withDefaults(defineProps<MbSplitButtonProps>(), {
  label: 'Button',
  open: true,
  size: 'md',
  disabled: false,
  ariaLabel: 'Split button',
  menuAriaLabel: 'Menu options'
});

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void;
  (event: 'primary-click', payload: MouseEvent): void;
  (event: 'toggle', payload: MbSplitButtonTogglePayload): void;
  (event: 'select-option', payload: MbSplitButtonSelectPayload): void;
}>();

const size = computed<MbSplitButtonSize>(() => props.size);
const isDisabled = computed(() => props.disabled);
const options = computed<MbSplitButtonOption[]>(() => {
  if (props.options && props.options.length > 0) {
    return props.options;
  }
  return defaultOptions;
});

const internalOpen = ref(Boolean(props.open));
watch(
  () => props.open,
  (value) => {
    internalOpen.value = Boolean(value);
  }
);

const isOpen = computed(() => internalOpen.value && options.value.length > 0);
const menuId = `mb-sb-menu-${Math.random().toString(36).slice(2, 10)}`;

function setOpen(next: boolean) {
  internalOpen.value = next;
  emit('update:open', next);
}

function onPrimaryClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit('primary-click', event);
}

function onToggleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const next = !isOpen.value;
  setOpen(next);
  emit('toggle', { open: next, event });
}

function onOptionClick(index: number, event: MouseEvent) {
  const option = options.value[index];
  if (!option || isDisabled.value || option.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('select-option', { index, option, event });
  setOpen(false);
}

function onMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    setOpen(false);
  }
}
</script>

<template>
  <div class="mb-sb" :data-size="size" :data-open="isOpen ? 'true' : 'false'">
    <div class="mb-sb__controls">
      <button
        type="button"
        class="mb-sb__primary"
        :aria-label="ariaLabel"
        :disabled="isDisabled"
        @click="onPrimaryClick"
      >
        <span class="mb-sb__primary-label">{{ label }}</span>
      </button>

      <button
        type="button"
        class="mb-sb__toggle"
        :aria-label="isOpen ? 'Collapse menu' : 'Expand menu'"
        aria-haspopup="menu"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="menuId"
        :disabled="isDisabled"
        @click="onToggleClick"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

    <ul
      v-if="isOpen"
      :id="menuId"
      class="mb-sb__menu"
      role="menu"
      :aria-label="menuAriaLabel"
      @keydown="onMenuKeydown"
    >
      <li
        v-for="(option, index) in options"
        :key="option.id ?? index"
        class="mb-sb__menu-item-wrap"
        role="none"
      >
        <button
          type="button"
          class="mb-sb__menu-item"
          role="menuitem"
          :disabled="isDisabled || option.disabled"
          @click="onOptionClick(index, $event)"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
