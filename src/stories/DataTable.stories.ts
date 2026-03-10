import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue'
import MpDataTableToolbar from '../components/MpDataTableToolbar.vue'
import MpStatusChip from '../components/MpStatusChip.vue'
import MpEmptyState from '../components/MpEmptyState.vue'

const meta = {
  title: 'Data Display/DataTable',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ORDERS = [
  { id: 1, orderNumber: '#10042', customer: 'James Anderson', email: 'james.a@email.com', avatar: 'JA', total: '$284.00', status: 'Completed', fulfillment: 'Shipped', payment: 'Paid', date: '2026-03-08' },
  { id: 2, orderNumber: '#10041', customer: 'Sofia Martinez', email: 'sofia.m@email.com', avatar: 'SM', total: '$156.50', status: 'Processing', fulfillment: 'Awaiting Fulfillment', payment: 'Paid', date: '2026-03-07' },
  { id: 3, orderNumber: '#10040', customer: 'Liam Johnson', email: 'liam.j@email.com', avatar: 'LJ', total: '$89.99', status: 'Completed', fulfillment: 'Shipped', payment: 'Paid', date: '2026-03-07' },
  { id: 4, orderNumber: '#10039', customer: 'Emma Williams', email: 'emma.w@email.com', avatar: 'EW', total: '$412.00', status: 'On Hold', fulfillment: 'Not Ready', payment: 'Pending', date: '2026-03-06' },
  { id: 5, orderNumber: '#10038', customer: 'Noah Brown', email: 'noah.b@email.com', avatar: 'NB', total: '$73.20', status: 'Cancelled', fulfillment: 'Cancelled', payment: 'Refunded', date: '2026-03-05' },
  { id: 6, orderNumber: '#10037', customer: 'Olivia Davis', email: 'olivia.d@email.com', avatar: 'OD', total: '$550.00', status: 'Processing', fulfillment: 'Packed', payment: 'Paid', date: '2026-03-05' },
]

// ── Default: clean table with toolbar ────────────────────────────────────────
export const Default: Story = {
  render: () => ({
    components: { MpDataTableToolbar, MpStatusChip },
    setup() {
      const search = ref('')
      const headers = [
        { title: 'Order', key: 'orderNumber', sortable: true },
        { title: 'Customer', key: 'customer', sortable: true },
        { title: 'Date', key: 'date' },
        { title: 'Total', key: 'total', align: 'end' as const, sortable: true },
        { title: 'Status', key: 'status' },
        { title: '', key: 'actions', sortable: false, width: 48 },
      ]
      return { search, headers, orders: ORDERS }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-model:search="search"
          title="All Orders"
          search-placeholder="Search orders..."
        />
        <v-data-table
          :headers="headers"
          :items="orders"
          :search="search"
          density="comfortable"
          hover
          fixed-header
          :items-per-page="10"
        >
          <template v-slot:item.orderNumber="{ item }">
            <span class="text-primary font-weight-bold cursor-pointer">{{ item.orderNumber }}</span>
          </template>
          <template v-slot:item.customer="{ item }">
            <div class="d-flex align-center gap-2 py-1">
              <v-avatar color="primary" variant="tonal" size="32" class="text-caption font-weight-bold">{{ item.avatar }}</v-avatar>
              <div>
                <div class="font-weight-medium text-body-2">{{ item.customer }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>
          <template v-slot:item.total="{ item }">
            <span class="font-weight-bold">{{ item.total }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <MpStatusChip :status="item.status" type="order" size="small" />
          </template>
          <template v-slot:item.actions>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
              </template>
              <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
                <v-list-item prepend-icon="mdi-open-in-new" title="View" />
                <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
                <v-divider class="my-1" style="opacity: 0.4" />
                <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    `,
  }),
}

// ── With Filters + Multi-select ───────────────────────────────────────────────
export const WithFilters: Story = {
  render: () => ({
    components: { MpDataTableToolbar, MpStatusChip },
    setup() {
      const search = ref('')
      const filters = ref({ status: [] as string[], payment: [] as string[] })
      const filterLabels: Record<string, string> = { status: 'Status', payment: 'Payment' }

      const activeFilters = computed(() =>
        Object.entries(filters.value)
          .filter(([, v]) => v.length > 0)
          .map(([key, value]) => ({
            key,
            label: `${filterLabels[key]}: ${(value as string[]).join(', ')}`,
          }))
      )

      const filteredOrders = computed(() => {
        let items = ORDERS
        if (filters.value.status.length) items = items.filter(o => filters.value.status.includes(o.status))
        if (filters.value.payment.length) items = items.filter(o => filters.value.payment.includes(o.payment))
        return items
      })

      function removeFilter(key: string) { ;(filters.value as any)[key] = [] }
      function clearFilters() { filters.value = { status: [], payment: [] } }

      const headers = [
        { title: 'Order', key: 'orderNumber', sortable: true },
        { title: 'Customer', key: 'customer' },
        { title: 'Total', key: 'total', align: 'end' as const },
        { title: 'Payment', key: 'payment' },
        { title: 'Status', key: 'status' },
      ]

      return { search, filters, activeFilters, filteredOrders, removeFilter, clearFilters, headers }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-model:search="search"
          title="Sales Orders"
          :active-filters="activeFilters"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select
                v-model="filters.status"
                label="Order Status"
                :items="['Completed', 'Processing', 'On Hold', 'Cancelled']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
                class="mb-3"
              />
              <v-select
                v-model="filters.payment"
                label="Payment Status"
                :items="['Paid', 'Pending', 'Refunded']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
              />
            </div>
          </template>
        </MpDataTableToolbar>
        <v-data-table
          :headers="headers"
          :items="filteredOrders"
          :search="search"
          density="comfortable"
          hover
          fixed-header
          :items-per-page="10"
        >
          <template v-slot:item.orderNumber="{ item }">
            <span class="text-primary font-weight-bold">{{ item.orderNumber }}</span>
          </template>
          <template v-slot:item.customer="{ item }">
            <div class="d-flex align-center gap-2">
              <v-avatar color="primary" variant="tonal" size="28" class="text-caption font-weight-bold">{{ item.avatar }}</v-avatar>
              <span class="text-body-2 font-weight-medium">{{ item.customer }}</span>
            </div>
          </template>
          <template v-slot:item.total="{ item }">
            <span class="font-weight-bold">{{ item.total }}</span>
          </template>
          <template v-slot:item.payment="{ item }">
            <MpStatusChip :status="item.payment" type="payment" size="small" />
          </template>
          <template v-slot:item.status="{ item }">
            <MpStatusChip :status="item.status" type="order" size="small" />
          </template>
        </v-data-table>
      </v-card>
    `,
  }),
}

// ── With Row Selection + Bulk Actions ─────────────────────────────────────────
export const WithBulkActions: Story = {
  render: () => ({
    components: { MpDataTableToolbar, MpStatusChip },
    setup() {
      const search = ref('')
      const selected = ref<number[]>([])

      function selectAll() { selected.value = ORDERS.map(o => o.id) }

      const headers = [
        { title: 'Order', key: 'orderNumber', sortable: true },
        { title: 'Customer', key: 'customer' },
        { title: 'Total', key: 'total', align: 'end' as const },
        { title: 'Status', key: 'status' },
        { title: '', key: 'actions', sortable: false, width: 48 },
      ]
      return { search, selected, headers, orders: ORDERS, selectAll }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-model:search="search"
          title="All Orders"
          :selected-count="selected.length"
          :total-count="orders.length"
          @select-all="selectAll"
          @clear-selection="selected = []"
        >
          <template #bulk-actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-package-check" rounded="lg">Mark Fulfilled</v-btn>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-export-variant" rounded="lg">Export</v-btn>
            <v-btn variant="outlined" size="small" class="text-none text-error" prepend-icon="mdi-cancel" rounded="lg">Cancel</v-btn>
          </template>
        </MpDataTableToolbar>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="orders"
          :search="search"
          item-value="id"
          show-select
          density="comfortable"
          hover
          fixed-header
          :items-per-page="10"
        >
          <template v-slot:item.orderNumber="{ item }">
            <span class="text-primary font-weight-bold">{{ item.orderNumber }}</span>
          </template>
          <template v-slot:item.customer="{ item }">
            <div class="d-flex align-center gap-2">
              <v-avatar color="primary" variant="tonal" size="28" class="text-caption font-weight-bold">{{ item.avatar }}</v-avatar>
              <span class="text-body-2 font-weight-medium">{{ item.customer }}</span>
            </div>
          </template>
          <template v-slot:item.total="{ item }">
            <span class="font-weight-bold">{{ item.total }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <MpStatusChip :status="item.status" type="order" size="small" />
          </template>
          <template v-slot:item.actions>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
              </template>
              <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
                <v-list-item prepend-icon="mdi-open-in-new" title="View" />
                <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
                <v-divider class="my-1" style="opacity: 0.4" />
                <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    `,
  }),
}

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState: Story = {
  render: () => ({
    components: { MpDataTableToolbar, MpEmptyState },
    setup() {
      const search = ref('no results here')
      const headers = [
        { title: 'Order', key: 'orderNumber' },
        { title: 'Customer', key: 'customer' },
        { title: 'Total', key: 'total', align: 'end' as const },
        { title: 'Status', key: 'status' },
      ]
      return { search, headers }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-model:search="search"
          title="All Orders"
        />
        <v-data-table
          :headers="headers"
          :items="[]"
          :search="search"
          density="comfortable"
          hover
          fixed-header
          :items-per-page="10"
        >
          <template v-slot:no-data>
            <MpEmptyState
              icon="mdi-receipt-text-outline"
              title="No orders found"
              description="Try adjusting your search or filter to find what you're looking for."
              action-label="Clear filters"
              action-icon="mdi-filter-remove-outline"
            />
          </template>
        </v-data-table>
      </v-card>
    `,
  }),
}

// ── Full Pattern (Filters + Bulk + Empty state) ───────────────────────────────
export const FullPattern: Story = {
  render: () => ({
    components: { MpDataTableToolbar, MpStatusChip, MpEmptyState },
    setup() {
      const search = ref('')
      const selected = ref<number[]>([])
      const filters = ref({ status: [] as string[] })

      const activeFilters = computed(() =>
        filters.value.status.length
          ? [{ key: 'status', label: `Status: ${filters.value.status.join(', ')}` }]
          : []
      )

      const filteredOrders = computed(() =>
        filters.value.status.length
          ? ORDERS.filter(o => filters.value.status.includes(o.status))
          : ORDERS
      )

      function removeFilter(_key: string) { filters.value.status = [] }
      function clearFilters() { filters.value.status = [] }
      function selectAll() { selected.value = filteredOrders.value.map(o => o.id) }

      const headers = [
        { title: 'Order', key: 'orderNumber', sortable: true },
        { title: 'Customer', key: 'customer' },
        { title: 'Date', key: 'date' },
        { title: 'Total', key: 'total', align: 'end' as const, sortable: true },
        { title: 'Fulfillment', key: 'fulfillment' },
        { title: 'Status', key: 'status' },
        { title: '', key: 'actions', sortable: false, width: 48 },
      ]

      return { search, selected, filters, activeFilters, filteredOrders, removeFilter, clearFilters, selectAll, headers }
    },
    template: `
      <v-card variant="flat" border rounded="xl" class="overflow-hidden">
        <MpDataTableToolbar
          v-model:search="search"
          title="Sales Orders"
          :active-filters="activeFilters"
          :selected-count="selected.length"
          :total-count="filteredOrders.length"
          @remove-filter="removeFilter"
          @clear-filters="clearFilters"
          @select-all="selectAll"
          @clear-selection="selected = []"
        >
          <template #filter-content>
            <div class="pa-4 pb-2">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
              <v-select
                v-model="filters.status"
                label="Order Status"
                :items="['Completed', 'Processing', 'On Hold', 'Cancelled']"
                multiple chips closable-chips
                variant="outlined" density="compact" hide-details clearable
              />
            </div>
          </template>
          <template #bulk-actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-package-check" rounded="lg">Fulfill</v-btn>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-export-variant" rounded="lg">Export</v-btn>
            <v-btn variant="outlined" size="small" class="text-none text-error" prepend-icon="mdi-cancel" rounded="lg">Cancel</v-btn>
          </template>
          <template #actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-download">Export All</v-btn>
          </template>
        </MpDataTableToolbar>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="filteredOrders"
          :search="search"
          item-value="id"
          show-select
          density="comfortable"
          hover
          fixed-header
          :items-per-page="10"
        >
          <template v-slot:item.orderNumber="{ item }">
            <span class="text-primary font-weight-bold cursor-pointer">{{ item.orderNumber }}</span>
          </template>
          <template v-slot:item.customer="{ item }">
            <div class="d-flex align-center gap-2 py-1">
              <v-avatar color="primary" variant="tonal" size="32" class="text-caption font-weight-bold">{{ item.avatar }}</v-avatar>
              <div>
                <div class="font-weight-medium text-body-2">{{ item.customer }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>
          <template v-slot:item.total="{ item }">
            <span class="font-weight-bold">{{ item.total }}</span>
          </template>
          <template v-slot:item.fulfillment="{ item }">
            <MpStatusChip :status="item.fulfillment" type="fulfillment" size="small" />
          </template>
          <template v-slot:item.status="{ item }">
            <MpStatusChip :status="item.status" type="order" size="small" />
          </template>
          <template v-slot:item.actions>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
              </template>
              <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
                <v-list-item prepend-icon="mdi-open-in-new" title="View order" />
                <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
                <v-list-item prepend-icon="mdi-printer" title="Print invoice" />
                <v-divider class="my-1" style="opacity: 0.4" />
                <v-list-item prepend-icon="mdi-cash-refund" title="Refund" class="text-error" />
              </v-list>
            </v-menu>
          </template>
          <template v-slot:no-data>
            <MpEmptyState
              icon="mdi-receipt-text-outline"
              title="No orders found"
              description="Try adjusting your filters or search term."
              action-label="Clear filters"
              action-icon="mdi-filter-remove-outline"
              @action="clearFilters"
            />
          </template>
        </v-data-table>
      </v-card>
    `,
  }),
}
