<script setup lang="ts">
import { ref } from 'vue'
import { useAnalyticsStore } from '@/stores/useAnalytics'
import { useCommerceStore } from '@/stores/useCommerce'
import { useCampaignsStore } from '@/stores/useCampaigns'
import { useDaVinciStore } from '@/stores/useDaVinci'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpKpiCard from '@/components/MpKpiCard.vue'
import MpSectionHeader from '@/components/MpSectionHeader.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'

const analytics = useAnalyticsStore()
const commerce = useCommerceStore()
const campaigns = useCampaignsStore()
const daVinci = useDaVinciStore()

const kpiCards = [
  {
    label: 'Total Revenue',
    value: `$${analytics.accountMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
    trend: '+12.5%', trendPositive: true, subStat: 'vs. last month',
    icon: 'mdi-currency-usd', color: 'success',
  },
  {
    label: 'Active Subscribers',
    value: analytics.accountMetrics.activeSubscribers.toLocaleString(),
    trend: '+4.2%', trendPositive: true, subStat: '18,432 on newsletter',
    icon: 'mdi-account-group', color: 'primary',
  },
  {
    label: 'Avg. Email Open Rate',
    value: `${analytics.accountMetrics.avgOpenRate}%`,
    trend: '-1.1%', trendPositive: false, subStat: 'Industry avg: 21.3%',
    icon: 'mdi-email-open-outline', color: 'warning',
  },
  {
    label: 'Email Sends (MTD)',
    value: analytics.accountMetrics.monthlySends.toLocaleString(),
    trend: '+8.4%', trendPositive: true,
    subStat: `${Math.round((analytics.accountMetrics.monthlySends / analytics.accountMetrics.monthlyLimit) * 100)}% of monthly plan`,
    icon: 'mdi-send', color: 'secondary',
  },
]

const recentOrders = commerce.orders.slice(0, 6)
const topSendingCampaigns = campaigns.campaigns.filter(c => c.status === 'Sent').slice(0, 5)

const activityFeed = [
  { icon: 'mdi-email-check', color: 'success', text: 'Campaign "Flash Sale — 40% Off Sitewide" completed with 12,891 clicks.', time: '10 mins ago' },
  { icon: 'mdi-account-check', color: 'primary', text: 'Segment "Lapsed 90 Days" recalculated: 4,201 contacts.', time: '1 hour ago' },
  { icon: 'mdi-connection', color: 'secondary', text: 'New Shopify store connection authenticated successfully.', time: '3 hours ago' },
  { icon: 'mdi-robot', color: 'info', text: 'Journey "Abandoned Cart — 3-Email Recovery" triggered 234 new enrollments.', time: '5 hours ago' },
  { icon: 'mdi-cart-check', color: 'success', text: '47 orders received today — $8,234 in revenue.', time: 'Today' },
]

/* ── Chart Data ─────────────────────────────────────────────── */
const activeRange = ref('30D')
const chartData = {
  '7D':  { revenue: [6200, 5800, 7100, 6900, 8200, 7600, 8400], engagement: [42, 39, 45, 43, 48, 46, 50], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  '30D': { revenue: [18400, 21200, 19600, 24800, 22100, 26500, 23800, 28100, 25400, 31200, 27600, 34800], engagement: [38, 42, 40, 46, 43, 48, 45, 50, 47, 54, 49, 56], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'] },
  '3M':  { revenue: [58000, 64000, 72000], engagement: [41, 45, 52], labels: ['Jan', 'Feb', 'Mar'] },
  'YTD': { revenue: [58000, 64000, 72000, 68000, 78000], engagement: [41, 45, 52, 48, 55], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
}

function getChartPoints(data: number[], width: number, height: number, padding = 20) {
  const max = Math.max(...data)
  const min = Math.min(...data) * 0.8
  const range = max - min || 1
  const stepX = (width - padding * 2) / (data.length - 1)
  return data.map((v, i) => ({
    x: padding + i * stepX,
    y: padding + (1 - (v - min) / range) * (height - padding * 2)
  }))
}

function svgPath(points: { x: number; y: number }[]) {
  return points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cx1 = prev.x + (p.x - prev.x) * 0.4
    const cx2 = p.x - (p.x - prev.x) * 0.4
    return `C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`
  }).join(' ')
}

function svgArea(points: { x: number; y: number }[], height: number) {
  const path = svgPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${path} L ${last.x} ${height} L ${first.x} ${height} Z`
}

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
    <MpPageHeader
      title="Good afternoon, Admin 👋"
      subtitle="Here is what's happening across your accounts today — March 7, 2026."
      :breadcrumbs="[{ title: 'Home', disabled: true }]"
    >
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-calendar-range" class="text-none">Last 30 Days</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" to="/campaigns/new">Create Campaign</v-btn>
      </template>
    </MpPageHeader>

    <!-- KPI Metric Cards -->
    <v-row class="mb-6" dense>
      <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" lg="3">
        <MpKpiCard v-bind="card" />
      </v-col>
    </v-row>

    <!-- Main Body: Chart Area + Activity Feed -->
    <v-row class="mb-6" dense>
      <v-col cols="12" lg="8">
        <v-card variant="flat" border rounded="xl" class="pa-5">
          <MpSectionHeader title="Revenue & Engagement Overview">
            <template #actions>
              <v-btn color="purple" variant="tonal" size="x-small" prepend-icon="mdi-auto-fix" class="text-none mr-3 font-weight-bold" @click="askDaVinciChart">Ask Da Vinci</v-btn>
              <v-btn v-for="r in ['7D','30D','3M','YTD']" :key="r"
                :variant="r === activeRange ? 'elevated' : 'text'"
                :color="r === activeRange ? 'primary' : 'medium-emphasis'"
                size="x-small" class="text-none"
                @click="activeRange = r"
              >{{ r }}</v-btn>
            </template>
          </MpSectionHeader>

          <!-- SVG Chart -->
          <div class="chart-container position-relative mt-2">
            <svg viewBox="0 0 700 240" class="w-100" preserveAspectRatio="xMidYMid meet" style="height: 240px;">
              <!-- Grid lines -->
              <line v-for="i in 5" :key="'g'+i" :x1="20" :x2="680" :y1="20 + (i-1)*50" :y2="20 + (i-1)*50" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
              <!-- Revenue area -->
              <path
                :d="svgArea(getChartPoints(chartData[activeRange as keyof typeof chartData].revenue, 700, 240), 240)"
                fill="url(#revenueGradient)" opacity="0.15"
              />
              <!-- Revenue line -->
              <path
                :d="svgPath(getChartPoints(chartData[activeRange as keyof typeof chartData].revenue, 700, 240))"
                fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round"
              />
              <!-- Revenue dots -->
              <circle v-for="(pt, i) in getChartPoints(chartData[activeRange as keyof typeof chartData].revenue, 700, 240)" :key="'rd'+i"
                :cx="pt.x" :cy="pt.y" r="4" fill="#6366F1" stroke="white" stroke-width="2"
              />
              <!-- Engagement area -->
              <path
                :d="svgArea(getChartPoints(chartData[activeRange as keyof typeof chartData].engagement, 700, 240), 240)"
                fill="url(#engagementGradient)" opacity="0.1"
              />
              <!-- Engagement line -->
              <path
                :d="svgPath(getChartPoints(chartData[activeRange as keyof typeof chartData].engagement, 700, 240))"
                fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="6 3" stroke-linecap="round"
              />
              <!-- Engagement dots -->
              <circle v-for="(pt, i) in getChartPoints(chartData[activeRange as keyof typeof chartData].engagement, 700, 240)" :key="'ed'+i"
                :cx="pt.x" :cy="pt.y" r="3" fill="#10B981" stroke="white" stroke-width="2"
              />
              <!-- Labels -->
              <text v-for="(label, i) in chartData[activeRange as keyof typeof chartData].labels" :key="'lb'+i"
                :x="20 + i * ((700 - 40) / (chartData[activeRange as keyof typeof chartData].labels.length - 1))"
                y="235" text-anchor="middle" fill="rgba(0,0,0,0.4)" font-size="10"
              >{{ label }}</text>
              <!-- Gradients -->
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366F1" />
                  <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981" />
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <!-- Legend -->
            <div class="d-flex align-center gap-4 mt-2 ml-2">
              <div class="d-flex align-center gap-1">
                <span style="width:12px; height:3px; border-radius:2px; background:#6366F1; display:inline-block;"></span>
                <span class="text-caption text-medium-emphasis">Revenue</span>
              </div>
              <div class="d-flex align-center gap-1">
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
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card variant="flat" border rounded="xl" class="h-100 pa-5">
          <MpSectionHeader title="Recent Activity" />
          <v-list lines="two" density="compact" :border="false" class="pa-0">
            <v-list-item
              v-for="(item, idx) in activityFeed"
              :key="idx"
              class="px-5 py-3 border-b"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" variant="tonal" size="36" class="mr-3">
                  <v-icon :color="item.color" size="18">{{ item.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium" style="white-space: normal; line-height: 1.3;">{{ item.text }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ item.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-btn block variant="text" color="primary" class="text-none mt-4" append-icon="mdi-arrow-right">View Full Audit Log</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Split: Top Campaigns + Recent Orders -->
    <v-row dense>
      <v-col cols="12" lg="6">
        <v-card variant="flat" border rounded="xl">
          <div class="pa-5 d-flex justify-space-between align-center border-b">
            <div class="text-h6 font-weight-medium">Top Campaigns by Revenue</div>
            <v-btn variant="text" size="small" color="primary" class="text-none" to="/campaigns">View All</v-btn>
          </div>
          <v-list lines="two" density="compact" :border="false" class="pa-0">
            <v-list-item v-for="camp in topSendingCampaigns" :key="camp.id" class="px-5 py-3 border-b">
              <template v-slot:prepend>
                <v-avatar color="success" variant="tonal" size="36" class="mr-3">
                  <v-icon color="success" size="18">mdi-email-check</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ camp.name.substring(0, 45) }}...</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" variant="tonal" color="success" class="mr-2">{{ Math.floor((camp.metrics.opens / camp.metrics.sent) * 100) }}% open</v-chip>
                <span class="text-caption">${{ camp.metrics.revenue.toLocaleString() }} revenue</span>
              </v-list-item-subtitle>
              <template v-slot:append>
                <span class="text-caption text-medium-emphasis">{{ camp.sentDate }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card variant="flat" border rounded="xl">
          <div class="pa-5 d-flex justify-space-between align-center border-b">
            <div class="text-h6 font-weight-medium">Recent Orders</div>
            <v-btn variant="text" size="small" color="primary" class="text-none" to="/commerce/orders">View All</v-btn>
          </div>
          <v-list lines="two" density="compact" :border="false" class="pa-0">
            <v-list-item v-for="order in recentOrders" :key="order.id" class="px-5 py-3 border-b">
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal" size="36" class="mr-3 font-weight-bold text-caption">{{ order.customer.avatar }}</v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ order.customer.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ order.orderNumber }} · {{ order.itemCount }} items · {{ order.date }}</v-list-item-subtitle>
              <template v-slot:append>
                <div class="text-right">
                  <div class="font-weight-bold text-body-2">${{ order.total }}</div>
                  <MpStatusChip :status="order.status || ''" type="order" size="x-small" variant="flat" />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }
.gap-1 { gap: 4px; }
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
