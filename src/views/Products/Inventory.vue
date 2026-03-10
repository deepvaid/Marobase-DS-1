<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommerceStore } from '@/stores/useCommerce'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const store = useCommerceStore()
const search = ref('')

const inventoryItems = store.products.map(p => ({
  ...p,
  incoming: Math.floor(Math.random() * 500),
  location: ['Main Warehouse - FL', 'Secondary Node - CA', 'Retail Hub - TX'][Math.floor(Math.random() * 3)]
}))

// Multi-select filters
const filters = ref({
  location: [] as string[],
  status: [] as string[],
})

const filterOptions = {
  location: ['Main Warehouse - FL', 'Secondary Node - CA', 'Retail Hub - TX'],
  status: ['In Stock', 'Low Stock', 'Out of Stock'],
}

const filterLabels: Record<string, string> = {
  location: 'Location',
  status: 'Status',
}

const activeFilterEntries = computed(() =>
  Object.entries(filters.value)
    .filter(([, v]) => v.length > 0)
    .map(([key, value]) => ({
      key,
      label: `${filterLabels[key]}: ${(value as string[]).join(', ')}`,
    }))
)

function removeFilter(key: string) {
  ;(filters.value as any)[key] = []
}

function clearAllFilters() {
  filters.value = { location: [], status: [] }
}

const filteredInventory = computed(() => {
  let items = inventoryItems
  if (filters.value.location.length) items = items.filter(p => filters.value.location.includes(p.location))
  if (filters.value.status.length) items = items.filter(p => filters.value.status.includes(p.status))
  return items
})

const headers = [
  { title: 'SKU', key: 'sku', sortable: true },
  { title: 'Product', key: 'name', sortable: true },
  { title: 'Avail. Inventory', key: 'inventory', align: 'end' as const },
  { title: 'On Order / Incoming', key: 'incoming', align: 'end' as const },
  { title: 'Location', key: 'location' },
  { title: '', key: 'actions', sortable: false, width: 48 },
]
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Inventory"
      subtitle="14,204 total stock items across all locations"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Products', to: '/commerce/products' },
        { title: 'Inventory', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-download" class="text-none">Export</v-btn>
      </template>
    </MpPageHeader>

    <v-row dense class="mb-2">
      <v-col cols="12" md="3">
        <v-card variant="flat" border rounded="xl">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-overline text-medium-emphasis">Total Stock Items</div>
              <div class="text-h4 font-weight-bold">14,204</div>
            </div>
            <v-icon size="40" color="primary" opacity="0.3">mdi-bookshelf</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        title="Inventory Items"
        v-model:search="search"
        :active-filters="activeFilterEntries"
        @remove-filter="removeFilter"
        @clear-filters="clearAllFilters"
      >
        <template #filter-content>
          <div class="pa-4 pb-2">
            <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
            <v-select
              v-model="filters.location"
              :items="filterOptions.location"
              label="Location"
              multiple
              chips
              closable-chips
              density="compact"
              variant="outlined"
              rounded="lg"
              hide-details
              class="mb-3"
            />
            <v-select
              v-model="filters.status"
              :items="filterOptions.status"
              label="Status"
              multiple
              chips
              closable-chips
              density="compact"
              variant="outlined"
              rounded="lg"
              hide-details
              class="mb-2"
            />
          </div>
        </template>
      </MpDataTableToolbar>

      <v-data-table
        :headers="headers"
        :items="filteredInventory"
        :search="search"
        :items-per-page="15"
        hover
        density="comfortable"
        fixed-header
        class="flex-grow-1"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center gap-3 py-2">
            <v-img
              :src="`https://picsum.photos/seed/${item.id}/32/32`"
              :width="32"
              :height="32"
              cover
              rounded="md"
              class="flex-shrink-0 border"
              style="width:32px;height:32px;min-width:32px;max-width:32px"
            >
              <template #error>
                <div class="w-100 h-100 d-flex align-center justify-center bg-surface-variant rounded-md">
                  <v-icon size="16" color="medium-emphasis">mdi-image-outline</v-icon>
                </div>
              </template>
            </v-img>
            <div>
              <div class="text-body-2 font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.sku }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.inventory="{ item }">
          <span :class="item.inventory < 50 ? 'text-error font-weight-bold' : 'font-weight-medium'">{{ item.inventory }}</span>
        </template>

        <template v-slot:item.actions>
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
            </template>
            <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Adjust Stock" />
              <v-list-item prepend-icon="mdi-transfer" title="Transfer" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
