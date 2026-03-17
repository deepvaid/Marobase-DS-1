<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  MbDropdownMenuOption,
  MbDropdownMenuProps,
  MbDropdownMenuState
} from './MbDropdownMenu.types';
import '../styles/mb-dropdown-menu.css';

const defaultOptions: MbDropdownMenuOption[] = [
  { id: '1', label: 'Menu Option' },
  { id: '2', label: 'Menu Option' },
  { id: '3', label: 'Menu Option', meta: 'Text' },
  { id: '4', label: 'Menu Option', meta: 'Text' },
  { id: '5', label: 'Menu Option' },
  { id: '6', label: 'Menu Option' }
];

const props = withDefaults(defineProps<MbDropdownMenuProps>(), {
  header: 'Header',
  footer: 'Footer',
  options: () => [],
  selectedId: '',
  state: 'default',
  disabled: false,
  width: 260,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'select-option', payload: MbDropdownMenuOption): void;
}>();

const hasFocus = ref(false);

const options = computed(() => (props.options.length > 0 ? props.options : defaultOptions));

const state = computed<MbDropdownMenuState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const visualState = computed<MbDropdownMenuState>(() => {
  if (state.value === 'disabled') return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const widthStyle = computed(() => ({ width: `${props.width}px` }));

function onOptionClick(option: MbDropdownMenuOption) {
  if (state.value === 'disabled' || option.disabled) return;
  emit('select-option', option);
}
</script>

<template>
  <section
    class="mb-dm"
    :style="widthStyle"
    :data-state="visualState"
    :aria-label="ariaLabel ?? header"
    @focusin="hasFocus = true"
    @focusout="hasFocus = false"
  >
    <header class="mb-dm__header">{{ header }}</header>

    <div class="mb-dm__options" role="menu">
      <button
        v-for="option in options"
        :key="option.id ?? option.label"
        class="mb-dm__option"
        type="button"
        role="menuitem"
        :disabled="state === 'disabled' || option.disabled"
        :data-selected="selectedId && selectedId === option.id ? 'true' : 'false'"
        @click="onOptionClick(option)"
      >
        <span class="mb-dm__option-label">{{ option.label }}</span>
        <span v-if="option.meta" class="mb-dm__option-meta">{{ option.meta }}</span>
      </button>
    </div>

    <footer class="mb-dm__footer">{{ footer }}</footer>
  </section>
</template>
