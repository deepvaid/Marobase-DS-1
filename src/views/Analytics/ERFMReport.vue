<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpEmptyState from '@/components/MpEmptyState.vue'

const breadcrumbs = [
  { title: 'Analytics', disabled: true },
  { title: 'eRFM Report', disabled: true },
]
</script>

<template>
  <div>
    <MpPageHeader
      title="eRFM Report"
      subtitle="Recency, Frequency, Monetary analysis with engagement overlay."
      :breadcrumbs="breadcrumbs"
    />

    <v-card flat border rounded="lg" class="pa-8">
      <MpEmptyState
        icon="mdi-chart-scatter-plot"
        title="Report generating"
        description="eRFM segmentation is being computed. Check back shortly."
      />
    </v-card>
  </div>
</template>
