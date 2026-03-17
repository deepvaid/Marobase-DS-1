<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type {
  MbButtonIconMode,
  MbButtonProps,
  MbButtonResolvedState,
  MbButtonSize,
  MbButtonState,
  MbButtonStyleType
} from './MbButton.types';
import '../styles/mb-button.css';

const props = withDefaults(defineProps<MbButtonProps>(), {
  styleType: 'filled',
  size: 'lg',
  state: 'default',
  iconMode: 'with-label',
  label: 'Sign Up',
  disabled: false,
  loading: false,
  leadingIcon: undefined,
  trailingIcon: undefined,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const slots = useSlots();

const styleType = computed<MbButtonStyleType>(() => props.styleType);
const size = computed<MbButtonSize>(() => props.size);
const iconMode = computed<MbButtonIconMode>(() => props.iconMode);

const isDisabled = computed(() => props.disabled || props.state === 'disabled');
const isLoading = computed(() => props.loading || props.state === 'loading');

const resolvedState = computed<MbButtonResolvedState>(() => {
  if (isLoading.value) {
    return 'loading';
  }

  if (isDisabled.value) {
    return 'disabled';
  }

  return props.state as MbButtonState;
});

const ariaLabel = computed(() => {
  if (props.ariaLabel) {
    return props.ariaLabel;
  }

  return props.label;
});

const showLeadingIcon = computed(() => {
  return (
    !isLoading.value &&
    iconMode.value === 'with-label' &&
    (Boolean(slots.leading) || Boolean(props.leadingIcon))
  );
});
const showTrailingIcon = computed(() => {
  return (
    !isLoading.value &&
    iconMode.value === 'with-label' &&
    (Boolean(slots.trailing) || Boolean(props.trailingIcon))
  );
});
const showLabel = computed(() => !isLoading.value && iconMode.value === 'with-label');

function onClick(event: MouseEvent) {
  if (isDisabled.value || isLoading.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <button
    type="button"
    class="mb-btn"
    :data-style-type="styleType"
    :data-size="size"
    :data-state="resolvedState"
    :data-icon-mode="iconMode"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-busy="isLoading ? 'true' : undefined"
    :aria-label="iconMode === 'icon-only' ? ariaLabel : undefined"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span v-if="isLoading" class="mb-btn__spinner" aria-hidden="true" />

    <template v-else>
      <span v-if="showLeadingIcon" class="mb-btn__icon" :data-icon-alias="leadingIcon">
        <slot name="leading">
          <span class="mb-btn__icon-fallback" aria-hidden="true" />
        </slot>
      </span>

      <span v-if="showLabel" class="mb-btn__label">
        <slot>
          {{ label }}
        </slot>
      </span>

      <span v-if="showTrailingIcon" class="mb-btn__icon" :data-icon-alias="trailingIcon">
        <slot name="trailing">
          <span class="mb-btn__icon-fallback" aria-hidden="true" />
        </slot>
      </span>

      <span v-if="iconMode === 'icon-only'" class="mb-btn__icon" :data-icon-alias="leadingIcon">
        <slot name="leading">
          <span class="mb-btn__icon-fallback" aria-hidden="true" />
        </slot>
      </span>
    </template>
  </button>
</template>
