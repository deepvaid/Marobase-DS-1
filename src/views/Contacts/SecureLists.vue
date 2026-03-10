<script setup lang="ts">
import { ref } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const search = ref('')

const lists = [
  { name: 'Confidential Investor Updates', contacts: 120, lastAccessed: '2026-03-05' },
  { name: 'Board of Directors', contacts: 12, lastAccessed: '2026-03-01' },
]

const headers = [
  { title: 'List Name', key: 'name', sortable: true },
  { title: 'Contacts', key: 'contacts', align: 'end' as const },
  { title: 'Last Accessed', key: 'lastAccessed' },
  { title: '', key: 'actions', sortable: false, width: 48 },
]
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Secure Lists"
      :subtitle="`${lists.length} secure lists`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Contacts', to: '/contacts' },
        { title: 'Secure Lists', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">New Secure List</v-btn>
      </template>
    </MpPageHeader>

    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        v-model:search="search"
        title="All Secure Lists"
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
        <template v-slot:item.actions>
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
            </template>
            <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
              <v-divider class="my-1" style="opacity: 0.4" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
