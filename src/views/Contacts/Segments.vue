<script setup lang="ts">
import { ref } from 'vue'
import { useContactsStore } from '@/stores/useContacts'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const store = useContactsStore()
const search = ref('')

const headers = [
  { title: 'Segment Name', key: 'name', sortable: true },
  { title: 'Total Contacts', key: 'count', align: 'end' as const },
  { title: 'Last Calculated', key: 'lastCalculated' },
  { title: '', key: 'actions', sortable: false, width: 48 },
]
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Segments"
      :subtitle="`${store.segments.length} segments`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Contacts', to: '/contacts' },
        { title: 'Segments', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Create Segment</v-btn>
      </template>
    </MpPageHeader>

    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        v-model:search="search"
        title="All Segments"
      />

      <v-data-table
        :headers="headers"
        :items="store.segments"
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
              <v-list-item prepend-icon="mdi-refresh" title="Recalculate" />
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
