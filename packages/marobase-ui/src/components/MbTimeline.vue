<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbTimelineItem,
  MbTimelineItemState,
  MbTimelineProps
} from './MbTimeline.types';
import '../styles/mb-timeline.css';

const defaultItems: MbTimelineItem[] = [
  { id: 'order', label: 'Order placed', state: 'completed' },
  { id: 'packed', label: 'Packed', state: 'completed' },
  { id: 'shipping', label: 'Shipping', state: 'active' },
  { id: 'delivered', label: 'Delivered', state: 'upcoming' }
];

const props = withDefaults(defineProps<MbTimelineProps>(), {
  items: () => [],
  modelValue: '',
  ariaLabel: 'Timeline'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'select', payload: MbTimelineItem): void;
}>();

const items = computed(() => (props.items.length > 0 ? props.items : defaultItems));
const internalValue = ref(props.modelValue || '');

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      internalValue.value = value;
    }
  }
);

const activeId = computed(() => {
  if (props.modelValue) {
    return props.modelValue;
  }

  if (internalValue.value) {
    return internalValue.value;
  }

  const firstActive = items.value.find((item) => item.state === 'active');
  if (firstActive) {
    return firstActive.id;
  }

  return items.value[0]?.id ?? '';
});

function stateFor(item: MbTimelineItem): MbTimelineItemState {
  if (item.state) {
    return item.state;
  }

  if (item.id === activeId.value) {
    return 'active';
  }

  const activeIndex = items.value.findIndex((row) => row.id === activeId.value);
  const index = items.value.findIndex((row) => row.id === item.id);

  return index >= 0 && activeIndex >= 0 && index < activeIndex ? 'completed' : 'upcoming';
}

function onSelect(item: MbTimelineItem) {
  internalValue.value = item.id;
  emit('update:modelValue', item.id);
  emit('select', item);
}
</script>

<template>
  <div class="mb-tl" role="list" :aria-label="ariaLabel">
    <article
      v-for="(item, index) in items"
      :key="item.id"
      class="mb-tl__item"
      role="listitem"
      :data-state="stateFor(item)"
      :data-first="index === 0 ? 'true' : 'false'"
      :data-last="index === items.length - 1 ? 'true' : 'false'"
    >
      <div class="mb-tl__track" aria-hidden="true">
        <span class="mb-tl__line mb-tl__line--left" />
        <button
          type="button"
          class="mb-tl__dot"
          :aria-label="item.label"
          :aria-current="item.id === activeId ? 'step' : undefined"
          @click="onSelect(item)"
        />
        <span class="mb-tl__line mb-tl__line--right" />
      </div>
      <div class="mb-tl__content">
        <span class="mb-tl__label">{{ item.label }}</span>
        <span v-if="item.detail" class="mb-tl__detail">{{ item.detail }}</span>
      </div>
    </article>
  </div>
</template>
