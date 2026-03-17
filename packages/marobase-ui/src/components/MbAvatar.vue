<script setup lang="ts">
import { computed } from 'vue';
import type { MbAvatarProps, MbAvatarSize } from './MbAvatar.types';
import '../styles/mb-avatar.css';

const props = withDefaults(defineProps<MbAvatarProps>(), {
  name: 'Jane Smith',
  initials: '',
  src: '',
  alt: '',
  size: 'lg',
  tone: 'neutral',
  interactive: false,
  disabled: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const sizePxMap: Record<MbAvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
};

const sizePx = computed(() => sizePxMap[props.size]);
const avatarStyle = computed(() => ({ '--mb-av-size': `${sizePx.value}px` }));

const resolvedInitials = computed(() => {
  if (props.initials.trim().length > 0) {
    return props.initials.trim().slice(0, 2).toUpperCase();
  }

  const parts = props.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'MB';
  }

  return parts.map((part) => part[0]!.toUpperCase()).join('');
});

const isDisabled = computed(() => props.disabled || !props.interactive);
const resolvedAlt = computed(() => props.alt || props.name || resolvedInitials.value);
const ariaLabel = computed(() => props.ariaLabel ?? resolvedAlt.value);

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <button
    type="button"
    class="mb-av"
    :style="avatarStyle"
    :data-size="size"
    :data-tone="tone"
    :data-interactive="interactive ? 'true' : 'false'"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <img v-if="src" class="mb-av__image" :src="src" :alt="resolvedAlt" />
    <span v-else class="mb-av__initials" aria-hidden="true">{{ resolvedInitials }}</span>
  </button>
</template>
