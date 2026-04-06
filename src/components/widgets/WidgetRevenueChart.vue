<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useDaVinciStore } from '@/stores/useDaVinci'

const daVinci = useDaVinciStore()
const activeRange = ref('30D')

/* ── Responsive sizing via ResizeObserver ───────────────────── */
const chartContainerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(600)
let resizeObserver: ResizeObserver | null = null

const chartW = computed(() => Math.max(containerWidth.value, 200))
const chartH = computed(() => Math.max(Math.round(chartW.value * 0.34), 140))
const pad = computed(() => (chartW.value < 400 ? 14 : 20))
const dotR = computed(() => (chartW.value < 400 ? 2.5 : 4))
const fontSize = computed(() => (chartW.value < 400 ? 8 : 10))
const strokeW = computed(() => (chartW.value < 400 ? 1.5 : 2.5))

onMounted(() => {
  nextTick(() => {
    if (chartContainerRef.value) {
      containerWidth.value = chartContainerRef.value.clientWidth
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerWidth.value = entry.contentRect.width
        }
      })
      resizeObserver.observe(chartContainerRef.value)
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

/* ── Chart data ────────────────────────────────────────────── */
const chartData: Record<string, { revenue: number[]; engagement: number[]; labels: string[] }> = {
  '7D':  { revenue: [6200, 5800, 7100, 6900, 8200, 7600, 8400], engagement: [42, 39, 45, 43, 48, 46, 50], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  '30D': { revenue: [18400, 21200, 19600, 24800, 22100, 26500, 23800, 28100, 25400, 31200, 27600, 34800], engagement: [38, 42, 40, 46, 43, 48, 45, 50, 47, 54, 49, 56], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'] },
  '3M':  { revenue: [58000, 64000, 72000], engagement: [41, 45, 52], labels: ['Jan', 'Feb', 'Mar'] },
  'YTD': { revenue: [58000, 64000, 72000, 68000, 78000], engagement: [41, 45, 52, 48, 55], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
}

const activeData = computed(() => chartData[activeRange.value] ?? chartData['30D']!)

/* ── Computed grid lines ───────────────────────────────────── */
const gridLines = computed(() => {
  const count = 5
  const p = pad.value
  const h = chartH.value
  const step = (h - p * 2) / (count - 1)
  return Array.from({ length: count }, (_, i) => p + i * step)
})

/* ── Chart geometry helpers ────────────────────────────────── */
function getChartPoints(data: number[], width: number, height: number, padding: number) {
  const max = Math.max(...data)
  const min = Math.min(...data) * 0.8
  const range = max - min || 1
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1)
  return data.map((v, i) => ({
    x: padding + i * stepX,
    y: padding + (1 - (v - min) / range) * (height - padding * 2)
  }))
}

function svgPath(points: { x: number; y: number }[]) {
  return points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]!
    const cx1 = prev.x + (p.x - prev.x) * 0.4
    const cx2 = p.x - (p.x - prev.x) * 0.4
    return `C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`
  }).join(' ')
}

function svgArea(points: { x: number; y: number }[], height: number) {
  const path = svgPath(points)
  const last = points[points.length - 1]!
  const first = points[0]!
  return `${path} L ${last.x} ${height} L ${first.x} ${height} Z`
}

/* ── Computed chart paths (recalculated whenever dimensions change) ── */
const revenuePoints = computed(() => getChartPoints(activeData.value.revenue, chartW.value, chartH.value, pad.value))
const engagementPoints = computed(() => getChartPoints(activeData.value.engagement, chartW.value, chartH.value, pad.value))

const revenueLine = computed(() => svgPath(revenuePoints.value))
const revenueAreaPath = computed(() => svgArea(revenuePoints.value, chartH.value))
const engagementLine = computed(() => svgPath(engagementPoints.value))
const engagementAreaPath = computed(() => svgArea(engagementPoints.value, chartH.value))

const labelPositions = computed(() => {
  const labels = activeData.value.labels
  const p = pad.value
  const w = chartW.value
  const step = (w - p * 2) / Math.max(labels.length - 1, 1)
  return labels.map((label, i) => ({ label, x: p + i * step }))
})

/* ── Da Vinci insight overlay on chart ──────────────────────── */
const showDvInsight = ref(false)
const dvInsightText = ref('')
const dvInsightLoading = ref(false)

function askDaVinciChart() {
  dvInsightLoading.value = true
  showDvInsight.value = true
  dvInsightText.value = ''

  setTimeout(() => {
    dvInsightLoading.value = false
    dvInsightText.value = `📊 Revenue grew 12.5% MoM, driven primarily by the "Flash Sale" campaign which alone contributed $34.8K. Engagement rates peaked in Week 10 at 54%, coinciding with the abandoned cart journey launch. I recommend doubling down on automated journeys — they're outperforming manual campaigns by 2.3x on ROI.`
  }, 1500)
}

function askDaVinciFull() {
  daVinci.openWithQuery('Compare this month vs last month')
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-end mb-2 flex-wrap" style="gap: 6px;">
      <v-btn color="purple" variant="tonal" size="x-small" prepend-icon="mdi-auto-fix" class="text-none mr-auto font-weight-bold" @click="askDaVinciChart">Ask Da Vinci</v-btn>
      <v-btn v-for="r in ['7D','30D','3M','YTD']" :key="r"
        :variant="r === activeRange ? 'elevated' : 'text'"
        :color="r === activeRange ? 'primary' : 'medium-emphasis'"
        size="x-small" class="text-none"
        @click="activeRange = r"
      >{{ r }}</v-btn>
    </div>

    <!-- SVG Chart (responsive) -->
    <div ref="chartContainerRef" class="chart-container position-relative mt-2">
      <svg
        :viewBox="`0 0 ${chartW} ${chartH}`"
        class="w-100"
        preserveAspectRatio="xMidYMid meet"
        :style="{ height: chartH + 'px', maxHeight: '320px' }"
      >
        <!-- Grid lines -->
        <line v-for="(y, i) in gridLines" :key="'g'+i"
          :x1="pad" :x2="chartW - pad" :y1="y" :y2="y"
          stroke="rgba(0,0,0,0.05)" stroke-width="1"
        />
        <!-- Revenue area + line + dots -->
        <path :d="revenueAreaPath" fill="url(#revenueGradientW)" opacity="0.15" />
        <path :d="revenueLine" fill="none" stroke="#6366F1" :stroke-width="strokeW" stroke-linecap="round" />
        <circle v-for="(pt, i) in revenuePoints" :key="'rd'+i"
          :cx="pt.x" :cy="pt.y" :r="dotR" fill="#6366F1" stroke="white" stroke-width="2"
        />
        <!-- Engagement area + line + dots -->
        <path :d="engagementAreaPath" fill="url(#engagementGradientW)" opacity="0.1" />
        <path :d="engagementLine" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="6 3" stroke-linecap="round" />
        <circle v-for="(pt, i) in engagementPoints" :key="'ed'+i"
          :cx="pt.x" :cy="pt.y" :r="Math.max(dotR - 1, 2)" fill="#10B981" stroke="white" stroke-width="2"
        />
        <!-- Labels -->
        <text v-for="lp in labelPositions" :key="'lb'+lp.label"
          :x="lp.x" :y="chartH - 4"
          text-anchor="middle" fill="rgba(0,0,0,0.4)" :font-size="fontSize"
        >{{ lp.label }}</text>
        <defs>
          <linearGradient id="revenueGradientW" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366F1" />
            <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="engagementGradientW" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#10B981" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Legend -->
      <div class="d-flex align-center mt-2 ml-2" style="gap: 16px;">
        <div class="d-flex align-center" style="gap: 4px;">
          <span style="width:12px; height:3px; border-radius:2px; background:#6366F1; display:inline-block;"></span>
          <span class="text-caption text-medium-emphasis">Revenue</span>
        </div>
        <div class="d-flex align-center" style="gap: 4px;">
          <span style="width:12px; height:3px; border-radius:2px; background:#10B981; display:inline-block; border-top: 1px dashed #10B981;"></span>
          <span class="text-caption text-medium-emphasis">Engagement %</span>
        </div>
      </div>

      <!-- Da Vinci Insight Overlay -->
      <v-expand-transition>
        <div v-if="showDvInsight" class="dv-insight-overlay">
          <v-card variant="flat" rounded="xl" class="pa-4 dv-insight-card">
            <div class="d-flex align-center gap-2 mb-2">
              <v-icon color="purple" size="18">mdi-creation</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-purple">Da Vinci Insight</span>
              <v-spacer />
              <v-btn icon variant="text" size="x-small" @click="showDvInsight = false"><v-icon size="16">mdi-close</v-icon></v-btn>
            </div>
            <div v-if="dvInsightLoading" class="d-flex align-center gap-2 py-2">
              <v-progress-circular indeterminate color="purple" size="20" width="2"></v-progress-circular>
              <span class="text-body-2 text-medium-emphasis">Analyzing your data...</span>
            </div>
            <div v-else class="text-body-2" style="line-height: 1.6;">{{ dvInsightText }}</div>
            <div v-if="!dvInsightLoading" class="d-flex align-center gap-2 mt-3">
              <v-btn size="small" variant="tonal" color="purple" class="text-none font-weight-bold" prepend-icon="mdi-auto-fix" @click="askDaVinciFull">Explore in Copilot</v-btn>
              <v-btn size="small" variant="text" class="text-none" prepend-icon="mdi-thumb-up-outline">Helpful</v-btn>
            </div>
          </v-card>
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}
.dv-insight-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 10;
}
.dv-insight-card {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}
</style>
