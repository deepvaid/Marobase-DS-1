<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
  title: string
  description: string
  confirmLabel?: string
  color?: string
}>()

const accentBorder = computed(() =>
  props.color ? { borderLeft: `3px solid ${props.color}` } : undefined
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <v-card variant="outlined" rounded="lg" class="dv-action-card" :style="accentBorder">
    <v-card-text class="pa-4">
      <div class="d-flex align-start ga-3">
        <v-avatar :color="color || 'primary'" variant="tonal" size="36">
          <v-icon size="20">{{ icon || 'mdi-lightning-bolt' }}</v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-subtitle-2 font-weight-bold mb-1">{{ title }}</div>
          <div class="text-body-2 text-medium-emphasis mb-3">{{ description }}</div>
          <div class="d-flex ga-2">
            <v-btn :color="color || 'primary'" variant="flat" size="small" class="text-none" @click="emit('confirm')">
              {{ confirmLabel || 'Confirm' }}
            </v-btn>
            <v-btn variant="text" size="small" class="text-none" @click="emit('cancel')">Cancel</v-btn>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.dv-action-card {
  border-left: 3px solid rgb(var(--v-theme-primary));
}
</style>
