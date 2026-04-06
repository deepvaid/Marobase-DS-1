<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  config?: any
}>()

const chartContainerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(400)
let resizeObserver: ResizeObserver | null = null

// Gauge specific configurations based on type
const gaugeConfig = computed(() => {
  const type = props.config?.gaugeType || 'mrr'
  if (type === 'mrr') {
    return {
      title: 'Monthly Recurring Revenue',
      value: 8990,
      target: 100000,
      format: (val: number) => `$${(val / 1000).toFixed(2)}K`,
      color: '#10B981', // Success green
    }
  } else if (type === 'sales') {
    return {
      title: 'Sales Bookings',
      value: 45000,
      target: 50000,
      format: (val: number) => `$${(val / 1000).toFixed(1)}K`,
      color: '#6366F1', // Primary blue/indigo
    }
  } else { // new-business
    return {
      title: 'New Business',
      value: 120,
      target: 200,
      format: (val: number) => `${val}`,
      color: '#F59E0B', // Warning orange
    }
  }
})

const conf = gaugeConfig.value

const chartW = computed(() => Math.max(containerWidth.value, 150))
const chartH = computed(() => Math.max(Math.round(chartW.value * 0.45), 80))
const strokeW = computed(() => Math.max(chartW.value * 0.08, 12))

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
      
      // Animate on mount
      setTimeout(() => {
        animatedValue.value = conf.value
      }, 100)
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

const animatedValue = ref(0)
const progress = computed(() => Math.min(animatedValue.value / conf.target, 1))

// SVG Arc calculations
const cx = computed(() => chartW.value / 2)
const cy = computed(() => chartH.value - strokeW.value / 2 - 4) // Leave room at bottom
const r = computed(() => Math.min(cx.value, chartH.value) - strokeW.value)

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  const d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ")
  return d
}

const backgroundArc = computed(() => describeArc(cx.value, cy.value, r.value, 0, 180))
const foregroundArc = computed(() => {
  const endAngle = progress.value * 180
  // Prevent zero-length arcs which can cause rendering issues
  if (endAngle <= 0) return ''
  return describeArc(cx.value, cy.value, r.value, 0, endAngle)
})
</script>

<template>
  <div class="h-100 d-flex flex-column align-center justify-center pt-2">
    <!-- SVG Gauge -->
    <div ref="chartContainerRef" class="w-100 position-relative d-flex justify-center flex-grow-1">
      <svg
        :viewBox="`0 0 ${chartW} ${chartH}`"
        class="gauge-svg"
        :style="{ height: chartH + 'px' }"
      >
        <defs>
          <linearGradient :id="`grad-${conf.title}`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="conf.color" stop-opacity="0.6"/>
            <stop offset="100%" :stop-color="conf.color" />
          </linearGradient>
        </defs>
        
        <!-- Background Arc -->
        <path
          :d="backgroundArc"
          fill="none"
          stroke="rgba(var(--v-theme-on-surface), 0.08)"
          :stroke-width="strokeW"
          stroke-linecap="round"
        />
        
        <!-- Foreground Arc -->
        <path
          v-if="foregroundArc"
          :d="foregroundArc"
          fill="none"
          :stroke="`url(#grad-${conf.title})`"
          :stroke-width="strokeW"
          stroke-linecap="round"
          class="progress-arc"
        />
      </svg>
      
      <!-- Center Text overlay -->
      <div class="gauge-center text-center">
        <div class="text-h4 font-weight-black mb-n1" :style="{ color: conf.color, fontSize: chartW > 300 ? '2.5rem' : '1.75rem' }">
          {{ conf.format(conf.value) }}
        </div>
      </div>
    </div>
    
    <!-- Footer labels -->
    <div class="text-center mt-2 px-4 pb-2 w-100">
      <div class="text-subtitle-1 font-weight-bold text-truncate">{{ conf.title }}</div>
      <div class="text-caption text-medium-emphasis">
        of {{ conf.format(conf.target) }} target
      </div>
    </div>
  </div>
</template>

<style scoped>
.gauge-svg {
  max-width: 100%;
}
.progress-arc {
  transition: d 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.gauge-center {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
}
</style>
