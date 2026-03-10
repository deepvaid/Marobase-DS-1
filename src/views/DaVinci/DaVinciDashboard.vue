<script setup lang="ts">
import MpPageHeader from '@/components/MpPageHeader.vue'

const metrics = [
  { label: 'Avg. Lift via Smart Send', value: '+ 14.2%', color: 'primary', icon: 'mdi-trending-up' },
  { label: 'Orders Saved (Churn Prevention)', value: '1,402', color: 'success', icon: 'mdi-cart-check' },
  { label: 'Dynamic Recommendations Revenue', value: '$84,300', color: 'info', icon: 'mdi-currency-usd' },
]
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="DaVinci Intelligence Dashboard"
      subtitle="AI-powered insights and performance metrics"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'DaVinci', disabled: true },
        { title: 'Dashboard', disabled: true },
      ]"
    />

    <v-row>
      <v-col cols="12" md="4" v-for="m in metrics" :key="m.label">
        <v-card variant="flat" border rounded="xl" class="pa-5">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase">{{ m.label }}</div>
            <v-icon :color="m.color" size="20">{{ m.icon }}</v-icon>
          </div>
          <div class="text-h4 font-weight-bold" :class="`text-${m.color}`">{{ m.value }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
