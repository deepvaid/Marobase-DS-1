import type { Meta, StoryObj } from '@storybook/vue3'
import MpDataTableToolbar from './MpDataTableToolbar.vue'
import { ref, computed } from 'vue'

const meta = {
  title: 'Data Display/MpDataTableToolbar',
  component: MpDataTableToolbar,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    selectedCount: { control: 'number' },
    totalCount: { control: 'number' },
  },
} satisfies Meta<typeof MpDataTableToolbar>

export default meta
type Story = StoryObj<typeof meta>

// ── 1. Default: title + search only ──────────────────────────────────────────
export const Default: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      return { args, search }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar v-bind="args" v-model:search="search" />
      </v-card>
    `,
  }),
  args: {
    title: 'All Orders',
    searchPlaceholder: 'Search orders…',
  },
}

// ── 2. With Filter Dropdown (single multi-select) ─────────────────────────────
export const WithSingleFilter: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      const statusFilter = ref<string[]>([])

      const activeFilters = computed(() =>
        statusFilter.value.length
          ? [{ key: 'status', label: `Status: ${statusFilter.value.join(', ')}` }]
          : []
      )

      function removeFilter(_key: string) { statusFilter.value = [] }
      function clearFilters() { statusFilter.value = [] }

      return { args, search, statusFilter, activeFilters, removeFilter, clearFilters }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-bind="args"
          v-model:search="search"
          :active-filters="activeFilters"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select
                v-model="statusFilter"
                label="Status"
                :items="['Sent', 'Draft', 'Scheduled', 'Archived']"
                multiple
                chips
                closable-chips
                variant="outlined"
                density="compact"
                hide-details
                clearable
                class="mb-3"
              />
            </div>
          </template>
        </MpDataTableToolbar>
      </v-card>
    `,
  }),
  args: {
    title: 'Campaign Reports',
    searchPlaceholder: 'Search campaigns…',
  },
}

// ── 3. With Multiple Filters ──────────────────────────────────────────────────
export const WithMultipleFilters: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      const filters = ref({
        status: [] as string[],
        category: [] as string[],
        vendor: [] as string[],
      })

      const filterLabels: Record<string, string> = {
        status: 'Status',
        category: 'Category',
        vendor: 'Vendor',
      }

      const activeFilters = computed(() =>
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

      function clearFilters() {
        filters.value = { status: [], category: [], vendor: [] }
      }

      return { args, search, filters, activeFilters, removeFilter, clearFilters }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-bind="args"
          v-model:search="search"
          :active-filters="activeFilters"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select
                v-model="filters.status"
                label="Status"
                :items="['In Stock', 'Low Stock', 'Out of Stock']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
                class="mb-3"
              />
              <v-select
                v-model="filters.category"
                label="Category"
                :items="['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
                class="mb-3"
              />
              <v-select
                v-model="filters.vendor"
                label="Vendor"
                :items="['Acme Corp', 'Brand House', 'Global Goods', 'Prime Supplier']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
              />
            </div>
          </template>
        </MpDataTableToolbar>
      </v-card>
    `,
  }),
  args: {
    title: 'All Products',
    searchPlaceholder: 'Search products…',
  },
}

// ── 4. With Active Filter Chips ───────────────────────────────────────────────
export const WithActiveFilters: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      const filters = ref({
        status: ['Active', 'Draft'] as string[],
        category: ['Electronics'] as string[],
      })

      const filterLabels: Record<string, string> = { status: 'Status', category: 'Category' }

      const activeFilters = computed(() =>
        Object.entries(filters.value)
          .filter(([, v]) => v.length > 0)
          .map(([key, value]) => ({
            key,
            label: `${filterLabels[key]}: ${(value as string[]).join(', ')}`,
          }))
      )

      function removeFilter(key: string) { ;(filters.value as any)[key] = [] }
      function clearFilters() { filters.value = { status: [], category: [] } }

      return { args, search, filters, activeFilters, removeFilter, clearFilters }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-bind="args"
          v-model:search="search"
          :active-filters="activeFilters"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select v-model="filters.status" label="Status" :items="['Active', 'Draft', 'Archived']"
                multiple chips closable-chips variant="outlined" density="compact" hide-details clearable class="mb-3" />
              <v-select v-model="filters.category" label="Category" :items="['Electronics', 'Apparel', 'Home & Kitchen']"
                multiple chips closable-chips variant="outlined" density="compact" hide-details clearable />
            </div>
          </template>
        </MpDataTableToolbar>
      </v-card>
    `,
  }),
  args: {
    title: 'All Products',
    searchPlaceholder: 'Search…',
  },
}

// ── 5. With Bulk Action Bar ───────────────────────────────────────────────────
export const WithBulkActions: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      const selectedCount = ref(4)
      const totalCount = ref(40)

      function selectAll() { selectedCount.value = totalCount.value }
      function clearSelection() { selectedCount.value = 0 }

      return { args, search, selectedCount, totalCount, selectAll, clearSelection }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-bind="args"
          v-model:search="search"
          :selected-count="selectedCount"
          :total-count="totalCount"
          @select-all="selectAll"
          @clear-selection="clearSelection"
        >
          <template #bulk-actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-export-variant" rounded="lg">Export</v-btn>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-tag-outline" rounded="lg">Tag</v-btn>
            <v-btn variant="outlined" size="small" class="text-none text-error" prepend-icon="mdi-delete-outline" rounded="lg">Delete</v-btn>
          </template>
        </MpDataTableToolbar>
      </v-card>
    `,
  }),
  args: {
    title: 'All Contacts',
    searchPlaceholder: 'Search contacts…',
  },
}

// ── 6. Full: Filters + Bulk Actions + Extra Actions ───────────────────────────
export const FullFeatured: Story = {
  render: (args) => ({
    components: { MpDataTableToolbar },
    setup() {
      const search = ref('')
      const selectedCount = ref(3)
      const totalCount = ref(28)
      const filters = ref({ status: ['Active'] as string[], list: [] as string[] })
      const filterLabels: Record<string, string> = { status: 'Status', list: 'List' }

      const activeFilters = computed(() =>
        Object.entries(filters.value)
          .filter(([, v]) => v.length > 0)
          .map(([key, value]) => ({
            key,
            label: `${filterLabels[key]}: ${(value as string[]).join(', ')}`,
          }))
      )

      function removeFilter(key: string) { ;(filters.value as any)[key] = [] }
      function clearFilters() { filters.value = { status: [], list: [] } }
      function selectAll() { selectedCount.value = totalCount.value }
      function clearSelection() { selectedCount.value = 0 }

      return { args, search, filters, activeFilters, selectedCount, totalCount,
               removeFilter, clearFilters, selectAll, clearSelection }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-bind="args"
          v-model:search="search"
          :active-filters="activeFilters"
          :selected-count="selectedCount"
          :total-count="totalCount"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
          @select-all="selectAll"
          @clear-selection="clearSelection"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select v-model="filters.status" label="Status"
                :items="['Active', 'Unsubscribed', 'Bounced']"
                multiple chips closable-chips variant="outlined" density="compact" hide-details clearable class="mb-3" />
              <v-select v-model="filters.list" label="List"
                :items="['Newsletter', 'VIP Circle', 'Win-Back']"
                multiple chips closable-chips variant="outlined" density="compact" hide-details clearable />
            </div>
          </template>
          <template #bulk-actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-export-variant" rounded="lg">Export</v-btn>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-tag-plus" rounded="lg">Tag</v-btn>
            <v-btn variant="outlined" size="small" class="text-none text-error" prepend-icon="mdi-delete-outline" rounded="lg">Delete</v-btn>
          </template>
          <template #actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-download">Export All</v-btn>
          </template>
        </MpDataTableToolbar>
      </v-card>
    `,
  }),
  args: {
    title: 'All Contacts',
    searchPlaceholder: 'Search contacts…',
  },
}
