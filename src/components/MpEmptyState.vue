<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionIcon?: string
}>()

defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center py-12 text-center">
    <v-icon v-if="icon" size="56" color="medium-emphasis" class="mb-4">{{ icon }}</v-icon>
    <div class="text-h6 font-weight-medium mb-1">{{ title }}</div>
    <div v-if="description" class="text-body-2 text-medium-emphasis mb-4" style="max-width: 360px;">{{ description }}</div>
    <v-btn
      v-if="actionLabel"
      color="primary"
      variant="elevated"
      class="text-none"
      :prepend-icon="actionIcon"
      @click="$emit('action')"
    >{{ actionLabel }}</v-btn>
  </div>
</template>
