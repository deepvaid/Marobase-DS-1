<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbSliderProps, MbSliderState } from './MbSlider.types';
import '../styles/mb-slider.css';

const props = withDefaults(defineProps<MbSliderProps>(), {
  modelValue: 0,
  rangeStart: null,
  min: 0,
  max: 100,
  step: 1,
  state: 'default',
  label: 'Label',
  showTicks: true,
  showValueLabels: true,
  disabled: false,
  hint: '',
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'update:rangeStart', value: number | null): void;
  (event: 'focus', payload: FocusEvent): void;
  (event: 'blur', payload: FocusEvent): void;
  (event: 'change', payload: { start: number | null; end: number }): void;
}>();

const startValue = ref<number | null>(props.rangeStart);
const endValue = ref<number>(props.modelValue);
const hasFocus = ref(false);

function clamp(value: number) {
  return Math.min(props.max, Math.max(props.min, value));
}

watch(
  () => props.rangeStart,
  (value) => {
    startValue.value = value === null ? null : clamp(value);
  }
);

watch(
  () => props.modelValue,
  (value) => {
    endValue.value = clamp(value);
  }
);

const isRange = computed(() => startValue.value !== null);

const state = computed<MbSliderState>(() => {
  if (props.disabled) return 'disabled';
  return props.state;
});

const isDisabled = computed(() => state.value === 'disabled');

const visualState = computed<MbSliderState>(() => {
  if (isDisabled.value) return 'disabled';
  if (props.state !== 'default') return props.state;
  if (hasFocus.value) return 'focus';
  return 'default';
});

const normalizedStart = computed(() => {
  if (!isRange.value || startValue.value === null) return props.min;
  return clamp(Math.min(startValue.value, endValue.value));
});

const normalizedEnd = computed(() => {
  if (!isRange.value) return clamp(endValue.value);
  return clamp(Math.max(endValue.value, normalizedStart.value));
});

const span = computed(() => Math.max(1, props.max - props.min));

const startPercent = computed(() => ((normalizedStart.value - props.min) / span.value) * 100);
const endPercent = computed(() => ((normalizedEnd.value - props.min) / span.value) * 100);

const rangeStyle = computed(() => {
  const left = isRange.value ? startPercent.value : 0;
  const width = isRange.value ? endPercent.value - startPercent.value : endPercent.value;
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.max(0, width)}%`
  };
});

const endThumbStyle = computed(() => ({ left: `${endPercent.value}%` }));
const startThumbStyle = computed(() => ({ left: `${startPercent.value}%` }));

function emitChange() {
  emit('change', {
    start: isRange.value ? normalizedStart.value : null,
    end: normalizedEnd.value
  });
}

function onEndInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;

  const next = clamp(Number(target.value));
  if (isRange.value) {
    const start = normalizedStart.value;
    endValue.value = Math.max(next, start);
  } else {
    endValue.value = next;
  }

  emit('update:modelValue', endValue.value);
  emitChange();
}

function onStartInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target || !isRange.value) return;

  const next = clamp(Number(target.value));
  const bounded = Math.min(next, normalizedEnd.value);
  startValue.value = bounded;

  emit('update:rangeStart', bounded);
  emitChange();
}

function onFocus(event: FocusEvent) {
  if (isDisabled.value) return;
  hasFocus.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}

function formatValue(value: number) {
  return `${Math.round(value)}`;
}
</script>

<template>
  <div class="mb-sr" :data-state="visualState" :data-disabled="isDisabled ? 'true' : 'false'">
    <label v-if="label" class="mb-sr__label">{{ label }}</label>

    <div class="mb-sr__control">
      <div class="mb-sr__track" aria-hidden="true" />
      <div class="mb-sr__range" aria-hidden="true" :style="rangeStyle" />

      <div v-if="showValueLabels" class="mb-sr__value" :style="endThumbStyle">{{ formatValue(normalizedEnd) }}</div>
      <div v-if="showValueLabels && isRange" class="mb-sr__value" :style="startThumbStyle">
        {{ formatValue(normalizedStart) }}
      </div>

      <input
        v-if="isRange"
        class="mb-sr__input mb-sr__input--start"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="normalizedStart"
        :disabled="isDisabled"
        :aria-label="(ariaLabel ?? label) + ' start'"
        @input="onStartInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <input
        class="mb-sr__input mb-sr__input--end"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="normalizedEnd"
        :disabled="isDisabled"
        :aria-label="ariaLabel ?? label"
        @input="onEndInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div v-if="showTicks" class="mb-sr__ticks" aria-hidden="true">
      <span class="mb-sr__tick mb-sr__tick--start">{{ min }}</span>
      <span class="mb-sr__tick" />
      <span class="mb-sr__tick" />
      <span class="mb-sr__tick" />
      <span class="mb-sr__tick mb-sr__tick--end">{{ max }}%</span>
    </div>

    <p v-if="hint" class="mb-sr__hint">{{ hint }}</p>
  </div>
</template>
