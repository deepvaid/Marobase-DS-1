<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  MbStepperChangePayload,
  MbStepperItem,
  MbStepperItemState,
  MbStepperProps,
  MbStepperState
} from './MbStepper.types';
import '../styles/mb-stepper.css';

const defaultItems: MbStepperItem[] = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'phone', title: 'Phone' },
  { id: 'email', title: 'E-mail' },
  { id: 'password', title: 'Password' }
];

const props = withDefaults(defineProps<MbStepperProps>(), {
  items: () => [],
  modelValue: undefined,
  clickable: true,
  state: 'default',
  disabled: false,
  ariaLabel: 'Stepper'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'step-change', payload: MbStepperChangePayload): void;
}>();

const items = computed<MbStepperItem[]>(() => {
  if (props.items.length > 0) {
    return props.items;
  }

  return defaultItems;
});

const isControlled = computed(() => typeof props.modelValue === 'number' && Number.isFinite(props.modelValue));

function clampIndex(raw: number): number {
  const max = Math.max(items.value.length - 1, 0);
  return Math.min(Math.max(raw, 0), max);
}

const internalActive = ref(clampIndex(typeof props.modelValue === 'number' ? props.modelValue : 1));

watch(
  () => props.modelValue,
  (next) => {
    if (typeof next === 'number' && Number.isFinite(next)) {
      internalActive.value = clampIndex(next);
    }
  },
  { immediate: true }
);

watch(
  () => items.value.length,
  () => {
    internalActive.value = clampIndex(internalActive.value);
  }
);

const activeIndex = computed(() => {
  if (isControlled.value) {
    return clampIndex(Number(props.modelValue));
  }

  return clampIndex(internalActive.value);
});

const state = computed<MbStepperState>(() => {
  if (props.disabled) {
    return 'disabled';
  }

  return props.state;
});

function isItemDisabled(item: MbStepperItem): boolean {
  return state.value === 'disabled' || Boolean(item.disabled);
}

function resolveItemState(item: MbStepperItem, index: number): MbStepperItemState {
  if (item.state) {
    return item.state;
  }

  if (index < activeIndex.value) {
    return 'complete';
  }

  if (index === activeIndex.value) {
    return 'active';
  }

  return 'upcoming';
}

function select(index: number, event: MouseEvent | KeyboardEvent) {
  const item = items.value[index];
  if (!item || isItemDisabled(item) || !props.clickable) {
    return;
  }

  const next = clampIndex(index);

  if (!isControlled.value) {
    internalActive.value = next;
  }

  emit('update:modelValue', next);
  emit('step-change', { index: next, item, event });
}

function onStepKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    select(index, event);
    return;
  }

  const target = event.currentTarget as HTMLButtonElement | null;
  if (!target) {
    return;
  }

  const controls = Array.from(
    target.closest('[data-mb-stepper]')?.querySelectorAll<HTMLButtonElement>('.mb-stepper__trigger:not(:disabled)') ??
      []
  );

  if (controls.length === 0) {
    return;
  }

  const current = controls.indexOf(target);

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    controls[(current + 1) % controls.length]?.focus();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    controls[(current - 1 + controls.length) % controls.length]?.focus();
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    controls[0]?.focus();
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    controls[controls.length - 1]?.focus();
  }
}
</script>

<template>
  <ol class="mb-stepper" data-mb-stepper :data-state="state" :aria-label="ariaLabel">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="mb-stepper__item"
      :data-item-state="resolveItemState(item, index)"
    >
      <button
        class="mb-stepper__trigger"
        type="button"
        :disabled="isItemDisabled(item) || !clickable"
        @click="select(index, $event)"
        @keydown="onStepKeydown(index, $event)"
      >
        <span class="mb-stepper__indicator" aria-hidden="true">
          <svg
            v-if="resolveItemState(item, index) === 'complete'"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 12.2L10.8 15.4L16.8 8.9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </span>

        <span class="mb-stepper__text">
          <span class="mb-stepper__title">{{ item.title }}</span>
          <span v-if="item.description" class="mb-stepper__description">{{ item.description }}</span>
        </span>
      </button>

      <span v-if="index < items.length - 1" class="mb-stepper__connector" aria-hidden="true" />
    </li>
  </ol>
</template>
