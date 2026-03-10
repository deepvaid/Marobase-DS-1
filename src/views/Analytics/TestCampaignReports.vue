<script setup lang="ts">
import { ref } from 'vue'
import { useCampaignsStore } from '@/stores/useCampaigns'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const store = useCampaignsStore()
const search = ref('')

const headers = [
  { title: 'Test Scenario', key: 'name', sortable: true },
  { title: 'Date Scheduled', key: 'sentDate' },
  { title: 'Inbox Placement', key: 'placement' },
  { title: 'Spam Score', key: 'spamScore', align: 'end' as const },
]

const testReports = store.campaigns.slice(20, 30).map(c => ({
  ...c,
  placement: `${Math.floor(Math.random() * 20 + 80)}%`,
  spamScore: (Math.random() * 2).toFixed(1)
}))
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Test Campaign Reports"
      :subtitle="`${testReports.length} test scenarios`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Analytics', to: '/analytics/reports/monthly_totals' },
        { title: 'Test Campaign Reports', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-download" class="text-none">Export CSV</v-btn>
      </template>
    </MpPageHeader>

    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        v-model:search="search"
        title="Test Reports"
        :total-count="testReports.length"
      />
      <v-data-table :headers="headers" :items="testReports" :search="search" hover density="comfortable" :items-per-page="15" fixed-header class="flex-grow-1" />
    </v-card>
  </div>
</template>
