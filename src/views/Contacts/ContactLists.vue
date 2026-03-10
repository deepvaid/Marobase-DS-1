<script setup lang="ts">
import { ref } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const search = ref('')

const headers = [
  { title: 'List Name', key: 'name', sortable: true },
  { title: 'Total Contacts', key: 'count', align: 'end' as const },
  { title: 'Opt-in Type', key: 'type' },
  { title: 'Created', key: 'created' },
  { title: '', key: 'actions', sortable: false, width: 48 },
]

const lists = [
  { name: 'Master Subscriber List', count: 125000, type: 'Double Opt-in', created: '2023-01-15' },
  { name: 'Event Attendees 2025', count: 4200, type: 'Single Opt-in', created: '2025-11-20' },
  { name: 'Webinar Registrants', count: 850, type: 'Single Opt-in', created: '2026-02-10' },
  { name: 'B2B Leads', count: 32000, type: 'Double Opt-in', created: '2024-06-05' },
]
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Contact Lists"
      :subtitle="`${lists.length} lists`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Contacts', to: '/contacts' },
        { title: 'Contact Lists', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Create List</v-btn>
      </template>
    </MpPageHeader>

    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        v-model:search="search"
        title="All Lists"
      />

      <v-data-table
        :headers="headers"
        :items="lists"
        :search="search"
        :items-per-page="15"
        hover
        density="comfortable"
        fixed-header
        class="flex-grow-1"
      >
        <template v-slot:item.count="{ item }">
          <span class="text-body-2 font-weight-medium">{{ item.count.toLocaleString() }}</span>
        </template>
        <template v-slot:item.actions>
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
            </template>
            <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
              <v-list-item prepend-icon="mdi-content-copy" title="Duplicate" />
              <v-divider class="my-1" style="opacity: 0.4" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
