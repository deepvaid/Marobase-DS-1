<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
  bars: number[][]
  labels?: string[]
  seriesNames?: string[]
}>()

const emit = defineEmits<{
  save: []
  download: []
  expand: []
}>()

// Chart series palette — references Vuetify theme primary via CSS custom properties
const colors = [
  'rgb(var(--v-theme-primary))',
  'rgba(var(--v-theme-primary), 0.65)',
  'rgba(var(--v-theme-primary), 0.45)',
  'rgba(var(--v-theme-primary), 0.25)',
  'rgba(var(--v-theme-primary), 0.12)',
]

function getMax(bars: number[][]) {
  return Math.max(...bars.map(b => b.reduce((s, v) => s + v, 0)))
}
</script>

<template>
  <v-card variant="outlined" rounded="lg" class="dv-chart-card">
    <v-card-text>
      <div class="d-flex align-center justify-space-between mb-1">
        <div>
          <div class="text-subtitle-2 font-weight-bold">{{ title || 'Analysis Results' }}</div>
          <div v-if="subtitle" class="text-caption text-medium-emphasis mt-1">{{ subtitle }}</div>
        </div>
        <div class="d-flex ga-1 chart-action-btns">
          <v-btn icon size="28" variant="text" @click="emit('save')">
            <v-icon size="16">mdi-content-save-outline</v-icon>
            <v-tooltip activator="parent" location="bottom">Save to widgets</v-tooltip>
          </v-btn>
          <v-btn icon size="28" variant="text" @click="emit('download')">
            <v-icon size="16">mdi-download-outline</v-icon>
            <v-tooltip activator="parent" location="bottom">Download PNG</v-tooltip>
          </v-btn>
          <v-btn icon size="28" variant="text" @click="emit('expand')">
            <v-icon size="16">mdi-arrow-expand</v-icon>
            <v-tooltip activator="parent" location="bottom">Expand chart</v-tooltip>
          </v-btn>
        </div>
      </div>

      <div class="chart-area mt-4 mb-3">
        <div class="chart-y-labels">
          <span v-for="v in [1250,1000,750,500,250]" :key="v">{{ v }}</span>
        </div>
        <div class="chart-bars-wrap">
          <div v-for="(bar, bi) in bars" :key="bi" class="chart-bar-col">
            <div
              v-for="(seg, si) in bar"
              :key="si"
              :style="{ height: (seg / getMax(bars)) * 120 + 'px', background: colors[si % colors.length], borderRadius: si === bar.length - 1 ? '2px 2px 0 0' : '0' }"
            />
          </div>
        </div>
      </div>

      <div v-if="labels" class="d-flex justify-space-between px-4 mb-3">
        <span v-for="l in labels" :key="l" class="text-caption text-medium-emphasis" style="font-size: 9px;">{{ l }}</span>
      </div>

      <div v-if="seriesNames" class="d-flex align-center ga-4 flex-wrap">
        <div v-for="(name, i) in seriesNames" :key="i" class="d-flex align-center ga-1">
          <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i % colors.length] }" />
          <span class="text-caption">{{ name }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-area { display: flex; gap: 4px; height: 140px; }
.chart-y-labels { display: flex; flex-direction: column; justify-content: space-between; font-size: 10px; color: rgba(var(--v-theme-on-surface), 0.45); min-width: 36px; text-align: right; padding-right: 6px; }
.chart-bars-wrap { display: flex; align-items: flex-end; gap: 3px; flex: 1; border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); padding: 0 2px; }
.chart-bar-col { flex: 1; display: flex; flex-direction: column-reverse; }

.chart-action-btns .v-btn {
  opacity: 0.5;
  transition: all 0.2s ease;
}
.chart-action-btns .v-btn:hover {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}
</style>
