<script setup lang="ts">
import { ref } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'

const activeTab = ref('shopping')
const botEnabled = ref(true)
const autoEscalate = ref(true)

const config = ref({
  botName: 'Maro',
  greeting: 'Hi there! I\'m Maro, your AI shopping assistant. How can I help you today?',
  personality: 'Friendly & Helpful',
  language: 'English',
  responseLength: 'Concise',
})

const shoppingCapabilities = [
  { title: 'Product Discovery', desc: 'Help customers find products using natural language queries like "I need a blue dress for a wedding."', icon: 'mdi-magnify', color: 'primary', enabled: true },
  { title: 'Smart Recommendations', desc: 'Suggest complementary products based on browsing history and purchase patterns.', icon: 'mdi-star-shooting-outline', color: 'warning', enabled: true },
  { title: 'Size & Fit Guidance', desc: 'Answer sizing questions using product specifications and customer preference data.', icon: 'mdi-ruler', color: 'info', enabled: true },
  { title: 'Price Comparison', desc: 'Compare prices across variants and highlight active promotions for the customer.', icon: 'mdi-tag-outline', color: 'success', enabled: false },
]

const serviceCapabilities = [
  { title: 'Order Tracking', desc: 'Provide real-time order status, shipping updates, and delivery estimates.', icon: 'mdi-package-variant', color: 'primary', enabled: true },
  { title: 'Returns & Exchanges', desc: 'Guide customers through returns, generate labels, and initiate exchanges.', icon: 'mdi-swap-horizontal', color: 'warning', enabled: true },
  { title: 'FAQ & Policy Answers', desc: 'Automatically answer common questions about shipping, payments, and store policies.', icon: 'mdi-frequently-asked-questions', color: 'info', enabled: true },
  { title: 'Human Escalation', desc: 'Intelligently route complex issues to your human support agents with full context.', icon: 'mdi-headset', color: 'error', enabled: true },
]

const recentConversations = [
  { customer: 'Sarah M.', topic: 'Product sizing question', outcome: 'Resolved', time: '5 min ago', messages: 4 },
  { customer: 'James L.', topic: 'Order #12847 tracking', outcome: 'Resolved', time: '22 min ago', messages: 3 },
  { customer: 'Emily R.', topic: 'Return request for jacket', outcome: 'Escalated', time: '1 hour ago', messages: 7 },
  { customer: 'Mike T.', topic: 'Product recommendation', outcome: 'Converted', time: '2 hours ago', messages: 5 },
]

const stats = [
  { label: 'Conversations Today', value: '234', icon: 'mdi-message-text-outline', color: 'primary' },
  { label: 'Resolution Rate', value: '87%', icon: 'mdi-check-circle-outline', color: 'success' },
  { label: 'Avg. Response Time', value: '1.8s', icon: 'mdi-timer-outline', color: 'info' },
  { label: 'Customer Satisfaction', value: '4.6★', icon: 'mdi-star-outline', color: 'warning' },
]

const outcomeColor = (o: string) => ({ Resolved: 'success', Escalated: 'warning', Converted: 'primary' }[o] || 'grey')
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="AI Customer Bot"
      subtitle="Unified Shopping & Service Assistant powered by Da Vinci"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Da Vinci', disabled: true },
        { title: 'Customer Bot', disabled: true },
      ]"
    >
      <template #actions>
        <v-chip :color="botEnabled ? 'success' : 'error'" variant="flat" size="small" class="mr-2 font-weight-bold">
          <v-icon start size="14">{{ botEnabled ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
          {{ botEnabled ? 'Bot Active' : 'Bot Paused' }}
        </v-chip>
        <v-btn :color="botEnabled ? 'error' : 'success'" variant="tonal" size="small" class="text-none font-weight-bold" @click="botEnabled = !botEnabled">
          {{ botEnabled ? 'Pause Bot' : 'Activate Bot' }}
        </v-btn>
      </template>
    </MpPageHeader>

    <!-- Stats Row -->
    <v-row dense>
      <v-col v-for="s in stats" :key="s.label" cols="6" md="3">
        <v-card variant="flat" border rounded="xl" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption text-medium-emphasis font-weight-bold text-uppercase">{{ s.label }}</span>
            <v-icon :color="s.color" size="18">{{ s.icon }}</v-icon>
          </div>
          <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs: Shopping / Service / Settings -->
    <v-tabs v-model="activeTab" color="primary" density="compact">
      <v-tab value="shopping" class="text-none">
        <v-icon start size="18">mdi-cart-outline</v-icon> Shopping Assistant
      </v-tab>
      <v-tab value="service" class="text-none">
        <v-icon start size="18">mdi-headset</v-icon> Service Assistant
      </v-tab>
      <v-tab value="conversations" class="text-none">
        <v-icon start size="18">mdi-message-text-outline</v-icon> Recent Conversations
      </v-tab>
      <v-tab value="settings" class="text-none">
        <v-icon start size="18">mdi-cog-outline</v-icon> Bot Settings
      </v-tab>
    </v-tabs>

    <!-- Shopping Capabilities -->
    <div v-if="activeTab === 'shopping'">
      <v-row dense>
        <v-col v-for="cap in shoppingCapabilities" :key="cap.title" cols="12" sm="6">
          <v-card variant="flat" border rounded="xl" class="pa-4">
            <div class="d-flex align-start gap-3">
              <v-avatar :color="cap.color" variant="tonal" size="40">
                <v-icon :color="cap.color" size="20">{{ cap.icon }}</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-subtitle-2 font-weight-bold">{{ cap.title }}</div>
                  <v-switch v-model="cap.enabled" color="success" hide-details density="compact" inset></v-switch>
                </div>
                <div class="text-caption text-medium-emphasis">{{ cap.desc }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Service Capabilities -->
    <div v-if="activeTab === 'service'">
      <v-row dense>
        <v-col v-for="cap in serviceCapabilities" :key="cap.title" cols="12" sm="6">
          <v-card variant="flat" border rounded="xl" class="pa-4">
            <div class="d-flex align-start gap-3">
              <v-avatar :color="cap.color" variant="tonal" size="40">
                <v-icon :color="cap.color" size="20">{{ cap.icon }}</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-subtitle-2 font-weight-bold">{{ cap.title }}</div>
                  <v-switch v-model="cap.enabled" color="success" hide-details density="compact" inset></v-switch>
                </div>
                <div class="text-caption text-medium-emphasis">{{ cap.desc }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Recent Conversations -->
    <div v-if="activeTab === 'conversations'">
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <v-list lines="two" density="comfortable" class="pa-0">
          <v-list-item v-for="c in recentConversations" :key="c.customer" class="px-5 py-3 border-b">
            <template v-slot:prepend>
              <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                <span class="font-weight-bold text-caption">{{ c.customer.split(' ').map(w => w[0]).join('') }}</span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2 font-weight-bold">{{ c.customer }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ c.topic }} • {{ c.messages }} messages</v-list-item-subtitle>
            <template v-slot:append>
              <div class="text-right">
                <v-chip :color="outcomeColor(c.outcome)" size="x-small" variant="flat" class="font-weight-bold mb-1">{{ c.outcome }}</v-chip>
                <div class="text-caption text-medium-emphasis">{{ c.time }}</div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <!-- Bot Settings -->
    <div v-if="activeTab === 'settings'">
      <v-card variant="flat" border rounded="xl" class="pa-6" style="max-width: 640px;">
        <div class="text-h6 font-weight-bold mb-4">Bot Personality & Behavior</div>
        <v-text-field v-model="config.botName" label="Bot Name" variant="outlined" density="comfortable" class="mb-3"></v-text-field>
        <v-textarea v-model="config.greeting" label="Greeting Message" variant="outlined" density="comfortable" rows="2" class="mb-3"></v-textarea>
        <v-select v-model="config.personality" :items="['Professional', 'Friendly & Helpful', 'Casual', 'Formal']" label="Personality" variant="outlined" density="comfortable" class="mb-3"></v-select>
        <v-select v-model="config.language" :items="['English', 'Spanish', 'French', 'German', 'Portuguese']" label="Primary Language" variant="outlined" density="comfortable" class="mb-3"></v-select>
        <v-select v-model="config.responseLength" :items="['Concise', 'Detailed', 'Balanced']" label="Response Length" variant="outlined" density="comfortable" class="mb-4"></v-select>
        <v-switch v-model="autoEscalate" label="Auto-escalate after 3 failed attempts" color="primary" hide-details></v-switch>
        <v-btn color="primary" variant="flat" class="text-none mt-6 font-weight-bold" prepend-icon="mdi-content-save">Save Settings</v-btn>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
</style>
