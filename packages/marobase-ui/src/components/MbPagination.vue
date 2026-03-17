<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbPaginationChangePayload,
  MbPaginationItem,
  MbPaginationProps,
  MbPaginationState
} from './MbPagination.types';
import '../styles/mb-pagination.css';

const defaultItems: MbPaginationItem[] = [1, 2, 3, 4, 5, 6, 'ellipsis', 1024];

const props = withDefaults(defineProps<MbPaginationProps>(), {
  items: () => [],
  modelValue: undefined,
  state: 'default',
  disabled: false,
  prevLabel: 'Previous',
  nextLabel: 'Next',
  ariaLabel: 'Pagination'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'change', payload: MbPaginationChangePayload): void;
  (event: 'previous', payload: MbPaginationChangePayload): void;
  (event: 'next', payload: MbPaginationChangePayload): void;
}>();

const hasFocus = ref(false);

const items = computed<MbPaginationItem[]>(() => {
  if (props.items.length > 0) {
    return props.items;
  }

  return defaultItems;
});

const pages = computed(() => items.value.filter((item): item is number => typeof item === 'number'));

const firstPage = computed(() => pages.value[0] ?? 1);
const lastPage = computed(() => pages.value[pages.value.length - 1] ?? firstPage.value);

const internalPage = ref(firstPage.value);
const isControlled = computed(() => typeof props.modelValue === 'number' && Number.isFinite(props.modelValue));

watch(
  () => props.modelValue,
  (next) => {
    if (typeof next === 'number' && Number.isFinite(next)) {
      internalPage.value = next;
    }
  },
  { immediate: true }
);

watch(
  () => items.value,
  () => {
    if (!pages.value.includes(internalPage.value)) {
      internalPage.value = firstPage.value;
    }
  },
  { deep: true }
);

const activePage = computed(() => {
  const candidate = isControlled.value ? Number(props.modelValue) : internalPage.value;
  if (pages.value.includes(candidate)) {
    return candidate;
  }

  return firstPage.value;
});

const state = computed<MbPaginationState>(() => {
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

const previousPage = computed(() => {
  const candidates = pages.value.filter((page) => page < activePage.value);
  return candidates[candidates.length - 1];
});

const nextPage = computed(() => pages.value.find((page) => page > activePage.value));

function commit(page: number, event: MouseEvent | KeyboardEvent) {
  if (props.disabled || !pages.value.includes(page)) {
    return;
  }

  if (!isControlled.value) {
    internalPage.value = page;
  }

  emit('update:modelValue', page);
  emit('change', { page, event });
}

function selectPage(item: MbPaginationItem, event: MouseEvent | KeyboardEvent) {
  if (item === 'ellipsis' || props.disabled) {
    return;
  }

  commit(item, event);
}

function goPrevious(event: MouseEvent | KeyboardEvent) {
  if (previousPage.value === undefined || props.disabled) {
    return;
  }

  commit(previousPage.value, event);
  emit('previous', { page: previousPage.value, event });
}

function goNext(event: MouseEvent | KeyboardEvent) {
  if (nextPage.value === undefined || props.disabled) {
    return;
  }

  commit(nextPage.value, event);
  emit('next', { page: nextPage.value, event });
}

function onKeydown(item: MbPaginationItem, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectPage(item, event);
    return;
  }

  const target = event.currentTarget as HTMLButtonElement | null;
  if (!target) {
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    const next = target.nextElementSibling as HTMLButtonElement | null;
    next?.focus();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = target.previousElementSibling as HTMLButtonElement | null;
    prev?.focus();
  }
}
</script>

<template>
  <nav
    class="mb-pg"
    :data-state="state"
    :aria-label="ariaLabel"
    @focusin="hasFocus = true"
    @focusout="hasFocus = false"
  >
    <button
      class="mb-pg__nav"
      type="button"
      :disabled="disabled || previousPage === undefined"
      aria-label="Go to previous page"
      @click="goPrevious($event)"
    >
      <span class="mb-pg__chevron" aria-hidden="true">‹</span>
      {{ prevLabel }}
    </button>

    <button
      v-for="(item, index) in items"
      :key="`${item}-${index}`"
      class="mb-pg__page"
      type="button"
      :data-active="item !== 'ellipsis' && activePage === item ? 'true' : 'false'"
      :disabled="disabled || item === 'ellipsis'"
      :aria-current="item !== 'ellipsis' && activePage === item ? 'page' : undefined"
      :aria-label="item === 'ellipsis' ? 'More pages' : `Go to page ${item}`"
      @click="selectPage(item, $event)"
      @keydown="onKeydown(item, $event)"
    >
      {{ item === 'ellipsis' ? '...' : item }}
    </button>

    <button
      class="mb-pg__nav"
      type="button"
      :disabled="disabled || nextPage === undefined"
      aria-label="Go to next page"
      @click="goNext($event)"
    >
      {{ nextLabel }}
      <span class="mb-pg__chevron" aria-hidden="true">›</span>
    </button>
  </nav>
</template>
