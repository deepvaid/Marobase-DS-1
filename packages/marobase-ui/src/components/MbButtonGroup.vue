<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbButtonGroupClickPayload,
  MbButtonGroupIcon,
  MbButtonGroupItem,
  MbButtonGroupMode,
  MbButtonGroupProps
} from './MbButtonGroup.types';
import '../styles/mb-button-group.css';

const defaultItems: MbButtonGroupItem[] = [
  { id: 'view', icon: 'eye', ariaLabel: 'View' },
  { id: 'edit', icon: 'pencil', ariaLabel: 'Edit' },
  { id: 'delete', icon: 'trash', ariaLabel: 'Delete' }
];

const props = withDefaults(defineProps<MbButtonGroupProps>(), {
  size: 'lg',
  mode: 'icon-only',
  hug: false,
  disabled: false,
  ariaLabel: 'Button group'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'item-click', payload: MbButtonGroupClickPayload): void;
}>();

const items = computed<MbButtonGroupItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items;
  }

  return defaultItems;
});

const mode = computed<MbButtonGroupMode>(() => props.mode);

function clampIndex(raw: number): number {
  const max = Math.max(items.value.length - 1, 0);
  return Math.min(Math.max(raw, 0), max);
}

const internalSelected = ref(0);

watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      internalSelected.value = clampIndex(value);
    }
  },
  { immediate: true }
);

watch(
  () => items.value.length,
  () => {
    internalSelected.value = clampIndex(internalSelected.value);
  }
);

const selectedIndex = computed(() => {
  if (typeof props.modelValue === 'number' && Number.isFinite(props.modelValue)) {
    return clampIndex(props.modelValue);
  }
  return clampIndex(internalSelected.value);
});

function resolveItemIcon(item: MbButtonGroupItem, index: number): MbButtonGroupIcon {
  if (item.icon) {
    return item.icon;
  }

  if (index === 0) {
    return 'eye';
  }

  if (index === 1) {
    return 'pencil';
  }

  if (index === 2) {
    return 'trash';
  }

  return 'rhombus';
}

function resolveItemLabel(item: MbButtonGroupItem, index: number): string {
  if (item.label && item.label.trim().length > 0) {
    return item.label;
  }

  if (index === 0) {
    return 'View';
  }

  if (index === 1) {
    return 'Edit';
  }

  if (index === 2) {
    return 'Delete';
  }

  return 'Button';
}

function resolveItemAriaLabel(item: MbButtonGroupItem, index: number): string {
  if (item.ariaLabel && item.ariaLabel.trim().length > 0) {
    return item.ariaLabel;
  }

  return resolveItemLabel(item, index);
}

function isItemDisabled(item: MbButtonGroupItem): boolean {
  return props.disabled || Boolean(item.disabled);
}

function select(index: number, event: MouseEvent) {
  const item = items.value[index];
  if (!item || isItemDisabled(item)) {
    return;
  }

  const next = clampIndex(index);
  if (!(typeof props.modelValue === 'number' && Number.isFinite(props.modelValue))) {
    internalSelected.value = next;
  }
  emit('update:modelValue', next);
  emit('item-click', { index, item, event });
}

function selectFromKeyboard(index: number) {
  const item = items.value[index];
  if (!item || isItemDisabled(item)) {
    return;
  }

  const next = clampIndex(index);
  if (!(typeof props.modelValue === 'number' && Number.isFinite(props.modelValue))) {
    internalSelected.value = next;
  }
  emit('update:modelValue', next);
}

function onItemKeydown(index: number, event: KeyboardEvent) {
  const target = event.currentTarget as HTMLButtonElement | null;
  const container = target?.closest('[data-mb-button-group]') as HTMLElement | null;
  if (!container) {
    return;
  }

  const enabledButtons = Array.from(
    container.querySelectorAll<HTMLButtonElement>('.mb-btg__item:not(:disabled)')
  );

  if (enabledButtons.length === 0) {
    return;
  }

  const currentEnabledIndex = target ? enabledButtons.indexOf(target) : -1;
  let nextButton: HTMLButtonElement | null = null;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown': {
      event.preventDefault();
      const nextIndex =
        currentEnabledIndex >= 0 ? (currentEnabledIndex + 1) % enabledButtons.length : 0;
      nextButton = enabledButtons[nextIndex] ?? null;
      break;
    }
    case 'ArrowLeft':
    case 'ArrowUp': {
      event.preventDefault();
      const nextIndex =
        currentEnabledIndex >= 0
          ? (currentEnabledIndex - 1 + enabledButtons.length) % enabledButtons.length
          : enabledButtons.length - 1;
      nextButton = enabledButtons[nextIndex] ?? null;
      break;
    }
    case 'Home': {
      event.preventDefault();
      nextButton = enabledButtons[0] ?? null;
      break;
    }
    case 'End': {
      event.preventDefault();
      nextButton = enabledButtons[enabledButtons.length - 1] ?? null;
      break;
    }
    default:
      return;
  }

  if (!nextButton) {
    return;
  }

  nextButton.focus();
  const nextIndex = Number(nextButton.dataset.index);
  if (Number.isFinite(nextIndex)) {
    selectFromKeyboard(nextIndex);
  }
}
</script>

<template>
  <div
    data-mb-button-group
    class="mb-btg"
    :data-size="size"
    :data-mode="mode"
    :data-hug="hug ? 'true' : 'false'"
    role="group"
    :aria-label="ariaLabel"
  >
    <button
      v-for="(item, index) in items"
      :key="item.id ?? index"
      type="button"
      class="mb-btg__item"
      :data-index="index"
      :data-active="selectedIndex === index ? 'true' : 'false'"
      :aria-label="resolveItemAriaLabel(item, index)"
      :aria-pressed="selectedIndex === index ? 'true' : 'false'"
      :disabled="isItemDisabled(item)"
      @click="select(index, $event)"
      @keydown="onItemKeydown(index, $event)"
    >
      <span class="mb-btg__icon" aria-hidden="true">
        <slot
          name="icon"
          :item="item"
          :index="index"
          :active="selectedIndex === index"
          :icon="resolveItemIcon(item, index)"
        >
          <svg
            v-if="resolveItemIcon(item, index) === 'eye'"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2.75 12C4.3 8.7 7.7 6.5 12 6.5C16.3 6.5 19.7 8.7 21.25 12C19.7 15.3 16.3 17.5 12 17.5C7.7 17.5 4.3 15.3 2.75 12Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>

          <svg
            v-else-if="resolveItemIcon(item, index) === 'pencil'"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4.5 19.5L8.25 18.75L18.56 8.44C19.15 7.85 19.15 6.9 18.56 6.31L17.69 5.44C17.1 4.85 16.15 4.85 15.56 5.44L5.25 15.75L4.5 19.5Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path d="M14.75 6.25L17.75 9.25" stroke="currentColor" stroke-width="1.8" />
          </svg>

          <svg
            v-else-if="resolveItemIcon(item, index) === 'trash'"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5.25 7.5H18.75M9.5 7.5V5.75C9.5 5.2 9.95 4.75 10.5 4.75H13.5C14.05 4.75 14.5 5.2 14.5 5.75V7.5M8.5 10V17.25C8.5 17.8 8.95 18.25 9.5 18.25H14.5C15.05 18.25 15.5 17.8 15.5 17.25V10"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span v-else class="mb-btg__icon-fallback" />
        </slot>
      </span>

      <span v-if="mode === 'with-label'" class="mb-btg__label">
        {{ resolveItemLabel(item, index) }}
      </span>
    </button>
  </div>
</template>
