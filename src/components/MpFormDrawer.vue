<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

withDefaults(defineProps<{
  title: string
  subtitle?: string
  width?: number
}>(), {
  width: 480,
})
</script>

<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    :width="width"
    elevation="16"
  >
    <div class="d-flex flex-column h-100">
      <div class="pa-5 border-b d-flex align-center justify-space-between">
        <div>
          <div class="text-h6 font-weight-bold">{{ title }}</div>
          <div v-if="subtitle" class="text-caption text-medium-emphasis">{{ subtitle }}</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="model = false" />
      </div>

      <div class="pa-5 flex-grow-1 overflow-y-auto">
        <slot />
      </div>

      <div v-if="$slots.footer" class="pa-5 border-t d-flex justify-space-between">
        <slot name="footer" />
      </div>
    </div>
  </v-navigation-drawer>
</template>
