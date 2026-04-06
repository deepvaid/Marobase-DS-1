<script setup lang="ts">
import DvChartCard from '@/components/copilot/DvChartCard.vue'
import DvKpiRow from '@/components/copilot/DvKpiRow.vue'
import DvDataTable from '@/components/copilot/DvDataTable.vue'
import DvInsightCard from '@/components/copilot/DvInsightCard.vue'

defineProps<{
  customData?: { type: string; props: any }[]
  customQuery?: string
}>()
</script>

<template>
  <div>
    <div v-if="customQuery" class="d-flex align-center gap-2 mb-3">
      <v-icon size="14" color="purple">mdi-creation</v-icon>
      <span class="text-caption text-medium-emphasis font-italic">"{{ customQuery }}"</span>
    </div>
    <template v-if="customData && customData.length">
      <div class="d-flex flex-column ga-3">
        <template v-for="(comp, ci) in customData" :key="ci">
          <DvChartCard v-if="comp.type === 'chart'" v-bind="comp.props" />
          <DvKpiRow v-else-if="comp.type === 'kpi'" v-bind="comp.props" />
          <DvDataTable v-else-if="comp.type === 'table'" v-bind="comp.props" />
          <DvInsightCard v-else-if="comp.type === 'insight'" v-bind="comp.props" />
          <!-- Fallback for other types -->
          <v-card v-else variant="outlined" rounded="lg" class="pa-4">
            <div class="text-body-2 text-medium-emphasis">Widget content ({{ comp.type }})</div>
          </v-card>
        </template>
      </div>
    </template>
    <div v-else class="d-flex flex-column align-center justify-center pa-8 text-center">
      <v-icon size="48" color="purple" class="mb-3" style="opacity: 0.3;">mdi-creation</v-icon>
      <div class="text-body-2 text-medium-emphasis">Da Vinci generated widget</div>
    </div>
  </div>
</template>
