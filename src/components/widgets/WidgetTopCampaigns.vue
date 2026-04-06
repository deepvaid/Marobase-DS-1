<script setup lang="ts">
import { useCampaignsStore } from '@/stores/useCampaigns'

const campaigns = useCampaignsStore()
const topSendingCampaigns = campaigns.campaigns.filter(c => c.status === 'Sent').slice(0, 5)
</script>

<template>
  <div>
    <v-list lines="two" density="compact" :border="false" class="pa-0">
      <v-list-item v-for="camp in topSendingCampaigns" :key="camp.id" class="px-1 py-3 border-b">
        <template v-slot:prepend>
          <v-avatar color="success" variant="tonal" size="36" class="mr-3">
            <v-icon color="success" size="18">mdi-email-check</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">{{ camp.name.substring(0, 45) }}{{ camp.name.length > 45 ? '...' : '' }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-chip size="x-small" variant="tonal" color="success" class="mr-2">{{ Math.floor((camp.metrics.opens / camp.metrics.sent) * 100) }}% open</v-chip>
          <span class="text-caption">${{ camp.metrics.revenue.toLocaleString() }} revenue</span>
        </v-list-item-subtitle>
        <template v-slot:append>
          <span class="text-caption text-medium-emphasis">{{ camp.sentDate }}</span>
        </template>
      </v-list-item>
    </v-list>
    <v-btn block variant="text" color="primary" class="text-none mt-4" append-icon="mdi-arrow-right" to="/campaigns">View All Campaigns</v-btn>
  </div>
</template>
