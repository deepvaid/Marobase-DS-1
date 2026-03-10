<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  color?: string
  trend?: string
  trendPositive?: boolean
  subStat?: string
}>()
</script>

<template>
  <v-card variant="flat" border rounded="xl" class="pa-5 h-100">
    <div class="d-flex justify-space-between align-start mb-4">
      <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis">{{ label }}</div>
      <v-icon v-if="icon" :color="color" size="20" class="mt-0.5">{{ icon }}</v-icon>
    </div>
    <div class="text-h4 font-weight-bold mb-2">{{ value }}</div>
    <div v-if="trend || subStat" class="d-flex align-center gap-2">
      <v-chip
        v-if="trend"
        :color="trendPositive ? 'success' : 'error'"
        size="x-small"
        variant="flat"
        class="font-weight-bold"
        :prepend-icon="trendPositive ? 'mdi-trending-up' : 'mdi-trending-down'"
      >{{ trend }}</v-chip>
      <span v-if="subStat" class="text-caption text-medium-emphasis">{{ subStat }}</span>
    </div>
    <slot />
  </v-card>
</template>
