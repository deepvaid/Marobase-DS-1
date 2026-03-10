<script setup lang="ts">
defineProps<{
  count: number
}>()

defineEmits<{
  clear: []
}>()
</script>

<template>
  <v-slide-y-transition>
    <div v-if="count > 0" class="mp-floating-bulk-bar d-flex align-center gap-3">
      <v-chip color="primary" variant="flat" size="small" class="font-weight-bold">{{ count }} selected</v-chip>
      <slot />
      <v-spacer />
      <v-btn size="small" variant="text" class="text-none" @click="$emit('clear')">Clear selection</v-btn>
    </div>
  </v-slide-y-transition>
</template>
