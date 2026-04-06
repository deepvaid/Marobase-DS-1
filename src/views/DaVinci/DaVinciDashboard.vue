<script setup lang="ts">
import { ref } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'

const metrics = [
  { label: 'Avg. Lift via Smart Send', value: '+ 14.2%', color: 'primary', icon: 'mdi-trending-up', insight: 'Smart Send timing optimization drove a 14.2% higher open rate compared to standard scheduling.' },
  { label: 'Orders Saved (Churn Prevention)', value: '1,402', color: 'success', icon: 'mdi-cart-check', insight: 'AI-driven churn prevention journeys re-engaged 1,402 customers who were about to lapse.' },
  { label: 'Dynamic Recommendations Revenue', value: '$84,300', color: 'info', icon: 'mdi-currency-usd', insight: 'Product recommendation engine generated $84,300 in attributed revenue this month.' },
]

const activeInsight = ref<number | null>(null)

const features = [
  { title: 'Smart Send Optimization', desc: 'AI learns recipient behavior and optimizes email send times for each contact individually.', icon: 'mdi-clock-check-outline', color: 'primary', status: 'Active' },
  { title: 'Churn Prediction', desc: 'Machine learning model scores contacts by predicted churn risk so you can intervene proactively.', icon: 'mdi-shield-alert-outline', color: 'warning', status: 'Active' },
  { title: 'Product Recommendations', desc: 'Personalized product suggestions inserted into emails and storefronts using purchase history.', icon: 'mdi-star-shooting-outline', color: 'info', status: 'Active' },
  { title: 'Content Generation', desc: 'Generate subject lines, email copy, and SMS messages using your brand voice.', icon: 'mdi-auto-fix', color: 'purple', status: 'Active' },
  { title: 'Audience Segmentation', desc: 'AI-powered segments that automatically update based on predicted customer behavior.', icon: 'mdi-account-search', color: 'secondary', status: 'Beta' },
  { title: 'Journey Auto-Builder', desc: 'Describe your marketing goal in natural language and Da Vinci builds the automation flow.', icon: 'mdi-robot-outline', color: 'success', status: 'Beta' },
]

const recentActions = [
  { action: 'Generated 3 subject line variants', target: 'Spring Flash Sale Campaign', time: '12 min ago', icon: 'mdi-auto-fix', color: 'purple' },
  { action: 'Optimized send time for', target: '45,231 contacts', time: '1 hour ago', icon: 'mdi-clock-check-outline', color: 'primary' },
  { action: 'Identified 312 at-risk customers', target: 'Churn Prevention Model', time: '3 hours ago', icon: 'mdi-shield-alert-outline', color: 'warning' },
  { action: 'Auto-built abandoned cart journey', target: 'Cart Recovery Flow', time: 'Yesterday', icon: 'mdi-robot-outline', color: 'success' },
]

const usageData = ref({
  tokensUsed: 128400,
  tokensLimit: 500000,
  generationsToday: 47,
  avgResponseTime: '1.2s',
})
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Da Vinci Intelligence Dashboard"
      subtitle="AI-powered insights, usage analytics, and feature management"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Da Vinci', disabled: true },
        { title: 'Dashboard', disabled: true },
      ]"
    />

    <!-- KPI Metrics -->
    <v-row>
      <v-col cols="12" md="4" v-for="(m, idx) in metrics" :key="m.label">
        <v-card variant="flat" border rounded="xl" class="pa-5 position-relative overflow-hidden">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase">{{ m.label }}</div>
            <v-icon :color="m.color" size="20">{{ m.icon }}</v-icon>
          </div>
          <div class="text-h4 font-weight-bold mb-3" :class="`text-${m.color}`">{{ m.value }}</div>
          <v-btn
            color="purple" variant="tonal" size="small" class="text-none font-weight-bold" prepend-icon="mdi-auto-fix"
            @click="activeInsight = activeInsight === idx ? null : idx"
          >
            {{ activeInsight === idx ? 'Hide Insight' : 'Ask Da Vinci' }}
          </v-btn>
          <v-expand-transition>
            <div v-if="activeInsight === idx" class="mt-3">
              <v-alert type="info" variant="tonal" density="compact" rounded="lg" class="text-body-2" icon="mdi-creation">
                {{ m.insight }}
              </v-alert>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Usage & Recent Actions -->
    <v-row>
      <!-- Usage Meter -->
      <v-col cols="12" md="4">
        <v-card variant="flat" border rounded="xl" class="pa-5 h-100">
          <div class="text-h6 font-weight-bold mb-4">AI Usage (This Month)</div>
          <div class="mb-4">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 font-weight-medium">Token Usage</span>
              <span class="text-body-2 text-medium-emphasis">{{ (usageData.tokensUsed / 1000).toFixed(0) }}K / {{ (usageData.tokensLimit / 1000).toFixed(0) }}K</span>
            </div>
            <v-progress-linear :model-value="(usageData.tokensUsed / usageData.tokensLimit) * 100" color="purple" bg-color="purple-lighten-4" rounded height="8"></v-progress-linear>
          </div>
          <v-row dense>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Generations Today</div>
              <div class="text-h5 font-weight-bold">{{ usageData.generationsToday }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Avg. Response</div>
              <div class="text-h5 font-weight-bold">{{ usageData.avgResponseTime }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Recent AI Actions -->
      <v-col cols="12" md="8">
        <v-card variant="flat" border rounded="xl" class="pa-5 h-100">
          <div class="text-h6 font-weight-bold mb-4">Recent Da Vinci Actions</div>
          <v-list lines="two" density="compact" class="pa-0">
            <v-list-item v-for="(a, i) in recentActions" :key="i" class="px-0 rounded-lg">
              <template v-slot:prepend>
                <v-avatar :color="a.color" variant="tonal" size="36" class="mr-3">
                  <v-icon :color="a.color" size="18">{{ a.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ a.action }} <strong>{{ a.target }}</strong></v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ a.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- AI Feature Status Grid -->
    <div>
      <div class="text-h6 font-weight-bold mb-4">Da Vinci Capabilities</div>
      <v-row dense>
        <v-col cols="12" sm="6" md="4" v-for="f in features" :key="f.title">
          <v-card variant="flat" border rounded="xl" class="pa-4 h-100">
            <div class="d-flex align-start gap-3">
              <v-avatar :color="f.color" variant="tonal" size="40">
                <v-icon :color="f.color" size="20">{{ f.icon }}</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex align-center gap-2 mb-1">
                  <div class="text-subtitle-2 font-weight-bold">{{ f.title }}</div>
                  <v-chip :color="f.status === 'Active' ? 'success' : 'warning'" size="x-small" variant="flat">{{ f.status }}</v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">{{ f.desc }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
