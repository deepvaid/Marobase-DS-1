<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="d-flex align-center justify-space-between mb-4">
    <div class="text-h6 font-weight-medium">{{ title }}</div>
    <div v-if="$slots.actions" class="d-flex gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
