<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/useAnalytics'
import MpKpiCard from '@/components/MpKpiCard.vue'

const analytics = useAnalyticsStore()

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
</script>

<template>
  <v-row dense>
    <v-col v-for="card in kpiCards" :key="card.label" cols="12" sm="6" lg="3">
      <MpKpiCard v-bind="card" />
    </v-col>
  </v-row>
</template>
