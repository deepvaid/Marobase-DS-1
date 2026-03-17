<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  MbBreadcrumbItem,
  MbBreadcrumbNavigatePayload,
  MbBreadcrumbsProps,
  MbBreadcrumbsState
} from './MbBreadcrumbs.types';
import '../styles/mb-breadcrumbs.css';

const defaultItems: MbBreadcrumbItem[] = [
  { id: 'home', label: 'Home', icon: 'home', iconOnly: true, ariaLabel: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'more', label: '...' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'hiking', label: 'Hiking' }
];

const props = withDefaults(defineProps<MbBreadcrumbsProps>(), {
  items: () => [],
  modelValue: undefined,
  state: 'default',
  disabled: false,
  ariaLabel: 'Breadcrumb'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'navigate', payload: MbBreadcrumbNavigatePayload): void;
}>();

const hasFocus = ref(false);

const items = computed<MbBreadcrumbItem[]>(() => {
  if (props.items.length > 0) {
    return props.items;
  }

  return defaultItems;
});

const activeId = computed(() => {
  if (props.modelValue && items.value.some((item) => item.id === props.modelValue)) {
    return props.modelValue;
  }

  const fallback = items.value[items.value.length - 1];
  return fallback?.id ?? '';
});

const state = computed<MbBreadcrumbsState>(() => {
  if (props.disabled) {
    return 'disabled';
  }

  if (props.state !== 'default') {
    return props.state;
  }

  if (hasFocus.value) {
    return 'focus';
  }

  return 'default';
});

function isItemDisabled(item: MbBreadcrumbItem): boolean {
  return props.disabled || Boolean(item.disabled);
}

function isActive(item: MbBreadcrumbItem): boolean {
  return item.id === activeId.value;
}

function isInteractive(item: MbBreadcrumbItem): boolean {
  return !isActive(item) && !isItemDisabled(item);
}

function emitNavigate(item: MbBreadcrumbItem, index: number, event: MouseEvent | KeyboardEvent) {
  if (!isInteractive(item)) {
    return;
  }

  emit('update:modelValue', item.id);
  emit('navigate', { item, index, event });
}

function onItemClick(item: MbBreadcrumbItem, index: number, event: MouseEvent) {
  if (!isInteractive(item)) {
    event.preventDefault();
    return;
  }

  emitNavigate(item, index, event);
}

function moveFocus(current: HTMLElement, direction: 1 | -1) {
  const nav = current.closest('[data-mb-breadcrumbs]');
  if (!nav) {
    return;
  }

  const controls = Array.from(
    nav.querySelectorAll<HTMLElement>('[data-mb-bc-control]:not([aria-disabled="true"])')
  );

  if (controls.length === 0) {
    return;
  }

  const currentIndex = controls.indexOf(current);
  if (currentIndex < 0) {
    return;
  }

  const nextIndex = (currentIndex + direction + controls.length) % controls.length;
  controls[nextIndex]?.focus();
}

function onItemKeydown(item: MbBreadcrumbItem, index: number, event: KeyboardEvent) {
  const target = event.currentTarget as HTMLElement | null;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emitNavigate(item, index, event);
    return;
  }

  if (!target) {
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveFocus(target, 1);
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveFocus(target, -1);
  }
}
</script>

<template>
  <nav
    class="mb-bc"
    data-mb-breadcrumbs
    :data-state="state"
    :aria-label="ariaLabel"
    @focusin="hasFocus = true"
    @focusout="hasFocus = false"
  >
    <ol class="mb-bc__list">
      <li v-for="(item, index) in items" :key="item.id" class="mb-bc__item">
        <component
          :is="item.href ? 'a' : 'button'"
          v-if="isInteractive(item)"
          class="mb-bc__link"
          data-mb-bc-control
          :href="item.href"
          :aria-label="item.ariaLabel ?? item.label"
          :aria-disabled="isItemDisabled(item) ? 'true' : 'false'"
          type="button"
          @click="onItemClick(item, index, $event)"
          @keydown="onItemKeydown(item, index, $event)"
        >
          <span v-if="item.icon === 'home'" class="mb-bc__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.75 10.2L12 3.5L20.25 10.2V20.5H14.75V14H9.25V20.5H3.75V10.2Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span v-if="!item.iconOnly" class="mb-bc__label">{{ item.label }}</span>
        </component>

        <span
          v-else
          class="mb-bc__current"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <span v-if="item.icon === 'home'" class="mb-bc__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.75 10.2L12 3.5L20.25 10.2V20.5H14.75V14H9.25V20.5H3.75V10.2Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span v-if="!item.iconOnly" class="mb-bc__label">{{ item.label }}</span>
        </span>

        <span v-if="index < items.length - 1" class="mb-bc__separator" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.5 6.75L14.75 12L9.5 17.25"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>
