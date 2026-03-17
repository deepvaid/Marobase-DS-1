<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbAccordionItem,
  MbAccordionProps,
  MbAccordionState,
  MbAccordionTogglePayload
} from './MbAccordion.types';
import '../styles/mb-accordion.css';

const defaultItems: MbAccordionItem[] = [
  { id: 'item-1', title: 'Title', description: 'Description' },
  { id: 'item-2', title: 'Title', description: 'Description' },
  { id: 'item-3', title: 'Title' },
  { id: 'item-4', title: 'Title' },
  { id: 'item-5', title: 'Title' }
];

const props = withDefaults(defineProps<MbAccordionProps>(), {
  items: () => [],
  modelValue: undefined,
  multiple: false,
  state: 'default',
  disabled: false,
  ariaLabel: 'Accordion'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void;
  (event: 'toggle', payload: MbAccordionTogglePayload): void;
}>();

const items = computed(() => (props.items.length > 0 ? props.items : defaultItems));
const isControlled = computed(() => Array.isArray(props.modelValue));

const internalOpenIds = ref<string[]>([]);

watch(
  () => props.modelValue,
  (value) => {
    if (Array.isArray(value)) {
      internalOpenIds.value = value;
    }
  },
  { immediate: true }
);

const openIds = computed(() => {
  if (isControlled.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }

  return internalOpenIds.value;
});

const state = computed<MbAccordionState>(() => {
  if (props.disabled) {
    return 'disabled';
  }

  return props.state;
});

function isOpen(id: string): boolean {
  return openIds.value.includes(id);
}

function isItemDisabled(item: MbAccordionItem): boolean {
  return state.value === 'disabled' || Boolean(item.disabled);
}

function commit(next: string[]) {
  if (!isControlled.value) {
    internalOpenIds.value = next;
  }

  emit('update:modelValue', next);
}

function toggle(item: MbAccordionItem, event: MouseEvent | KeyboardEvent) {
  if (isItemDisabled(item)) {
    return;
  }

  const currentlyOpen = isOpen(item.id);

  if (currentlyOpen) {
    const next = openIds.value.filter((id) => id !== item.id);
    commit(next);
    emit('toggle', { id: item.id, open: false, item, event });
    return;
  }

  const next = props.multiple ? [...openIds.value, item.id] : [item.id];
  commit(next);
  emit('toggle', { id: item.id, open: true, item, event });
}

function onHeaderKeydown(item: MbAccordionItem, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle(item, event);
  }
}
</script>

<template>
  <section class="mb-acc" :data-state="state" role="presentation" :aria-label="ariaLabel">
    <article
      v-for="item in items"
      :key="item.id"
      class="mb-acc__item"
      :data-open="isOpen(item.id) ? 'true' : 'false'"
      :data-disabled="isItemDisabled(item) ? 'true' : 'false'"
    >
      <button
        type="button"
        class="mb-acc__trigger"
        :disabled="isItemDisabled(item)"
        :aria-expanded="isOpen(item.id) ? 'true' : 'false'"
        :aria-controls="`${item.id}-panel`"
        @click="toggle(item, $event)"
        @keydown="onHeaderKeydown(item, $event)"
      >
        <span class="mb-acc__title">{{ item.title }}</span>
        <span class="mb-acc__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 10L12 14L16 10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        :id="`${item.id}-panel`"
        class="mb-acc__panel"
        role="region"
        :aria-hidden="isOpen(item.id) ? 'false' : 'true'"
      >
        <p v-if="item.description" class="mb-acc__description">{{ item.description }}</p>
      </div>
    </article>
  </section>
</template>
