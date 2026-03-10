<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  tabs: Array<{ label: string; key: string; count?: number }>
}>()
</script>

<template>
  <v-tabs v-model="model" color="primary" density="compact" class="mb-4" height="36">
    <v-tab
      v-for="tab in tabs"
      :key="tab.key"
      :value="tab.key"
      class="text-none font-weight-medium px-4"
    >
      {{ tab.label }}
      <v-chip
        v-if="tab.count != null && tab.count > 0"
        size="x-small"
        :color="model === tab.key ? 'primary' : 'grey'"
        :variant="model === tab.key ? 'flat' : 'tonal'"
        class="ml-2 font-weight-bold"
      >{{ tab.count }}</v-chip>
    </v-tab>
  </v-tabs>
</template>
