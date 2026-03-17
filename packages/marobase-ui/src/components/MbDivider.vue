<script setup lang="ts">
import type { MbDividerProps } from './MbDivider.types';
import '../styles/mb-divider.css';

withDefaults(defineProps<MbDividerProps>(), {
  text: '',
  orientation: 'horizontal',
  textAlign: 'center',
  inset: false
});
</script>

<template>
  <div class="mb-div" :data-orientation="orientation" :data-align="textAlign" :data-inset="inset ? 'true' : 'false'">
    <template v-if="orientation === 'horizontal'">
      <span class="mb-div__line" aria-hidden="true" />
      <span v-if="text" class="mb-div__text">{{ text }}</span>
      <span class="mb-div__line" aria-hidden="true" />
    </template>
    <span v-else class="mb-div__line mb-div__line--vertical" aria-hidden="true" />
  </div>
</template>
