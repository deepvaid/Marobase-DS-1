<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/useAnalytics'
import { useCommerceStore } from '@/stores/useCommerce'
import { useCampaignsStore } from '@/stores/useCampaigns'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpKpiCard from '@/components/MpKpiCard.vue'
import MpSectionHeader from '@/components/MpSectionHeader.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'

const analytics = useAnalyticsStore()
const commerce = useCommerceStore()
const campaigns = useCampaignsStore()

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
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Create Campaign</v-btn>
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
        <v-card variant="flat" border rounded="xl" class="pa-5" style="min-height: 340px;">
          <MpSectionHeader title="Revenue & Engagement Overview">
            <template #actions>
              <v-btn v-for="r in ['7D','30D','3M','YTD']" :key="r"
                :variant="r === '30D' ? 'elevated' : 'text'"
                :color="r === '30D' ? 'primary' : 'medium-emphasis'"
                size="x-small" class="text-none">{{ r }}</v-btn>
            </template>
          </MpSectionHeader>
          <v-card variant="outlined" class="d-flex align-center justify-center border-dashed" style="height: 260px;" color="surface-variant">
            <div class="text-center">
              <v-icon size="48" color="medium-emphasis" class="mb-3">mdi-chart-line</v-icon>
              <div class="text-body-2 text-medium-emphasis font-weight-medium">Interactive Chart Component</div>
              <div class="text-caption text-medium-emphasis">Integrate Recharts, Chart.js, or ApexCharts here</div>
            </div>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card variant="flat" border rounded="xl" class="h-100 pa-5">
          <MpSectionHeader title="Recent Activity" />
          <v-list lines="two" density="compact" class="pa-0">
            <v-list-item v-for="(item, idx) in activityFeed" :key="idx" class="px-0 mb-2">
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
          <v-list lines="two" density="compact" class="pa-0">
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
          <v-list lines="two" density="compact" class="pa-0">
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
