<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommerceStore } from '@/stores/useCommerce'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpFilterTabs from '@/components/MpFilterTabs.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'

const store = useCommerceStore()
const search = ref('')
const expanded = ref<string[]>([])
const selected = ref<string[]>([])
const activeTab = ref('all')

// Tabs matching real Maropost app
const tabs = computed(() => [
  { label: 'All Orders', key: 'all', count: tabCount('all') },
  { label: 'Completed', key: 'completed', count: tabCount('completed') },
  { label: 'Processing', key: 'processing', count: tabCount('processing') },
  { label: 'Not Fulfilled', key: 'not_fulfilled', count: tabCount('not_fulfilled') },
])

const headers = [
  { title: 'Order', key: 'orderNumber', sortable: true, width: 110 },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Customer', key: 'customer.name' },
  { title: 'Items', key: 'itemCount', align: 'center' as const, width: 70 },
  { title: 'Total', key: 'total', align: 'end' as const, sortable: true },
  { title: 'Fulfillment', key: 'fulfillmentStatus' },
  { title: 'Payment', key: 'paymentStatus' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, width: 48 },
  { title: '', key: 'data-table-expand', width: 40 },
]

// ─── Tab Filtering ────────────────────────────────────────────────────────────
const filteredOrders = computed(() => {
  const orders = store.orders
  switch (activeTab.value) {
    case 'completed':     return orders.filter(o => o.status === 'Completed')
    case 'processing':    return orders.filter(o => o.status === 'Processing')
    case 'not_fulfilled': return orders.filter(o => !['Shipped', 'Cancelled'].includes(o.fulfillmentStatus ?? ''))
    default:              return orders
  }
})

const tabCount = (key: string) => {
  switch (key) {
    case 'all':           return store.orders.length
    case 'completed':     return store.orders.filter(o => o.status === 'Completed').length
    case 'processing':    return store.orders.filter(o => o.status === 'Processing').length
    case 'not_fulfilled': return store.orders.filter(o => !['Shipped', 'Cancelled'].includes(o.fulfillmentStatus ?? '')).length
    default: return 0
  }
}

// ─── Filters ──────────────────────────────────────────────────────────────────
const filters = ref({
  status: null as string | null,
  fulfillment: null as string | null,
  payment: null as string | null,
})

const filterOptions = {
  status: ['Completed', 'Processing', 'On Hold', 'Cancelled'],
  fulfillment: ['Shipped', 'Awaiting Fulfillment', 'Partially Fulfilled', 'Unfulfilled'],
  payment: ['Paid', 'Pending', 'Refunded', 'Failed'],
}

const filterLabels: Record<string, string> = {
  status: 'Order Status',
  fulfillment: 'Fulfillment',
  payment: 'Payment',
}

const activeFilterEntries = computed(() =>
  Object.entries(filters.value)
    .filter(([, v]) => v !== null)
    .map(([key, value]) => ({ key, label: `${filterLabels[key]}: ${value}` }))
)

function removeFilter(key: string) {
  filters.value[key as keyof typeof filters.value] = null
}

function clearAllFilters() {
  filters.value = { status: null, fulfillment: null, payment: null }
}

function selectAll() {
  selected.value = filteredOrders.value.map((o: any) => o.id)
}
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <!-- Page Header -->
    <MpPageHeader
      title="Sales Orders"
      :subtitle="`${store.orders.length} orders total · $${store.orders.reduce((a,o) => a + parseFloat(o.total), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lifetime revenue`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Commerce', disabled: true },
        { title: 'Sales Orders', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn class="text-none mp-btn-dark" variant="flat" prepend-icon="mdi-download">Export</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none">Create Draft Order</v-btn>
      </template>
      <template #tabs>
        <MpFilterTabs v-model="activeTab" :tabs="tabs" />
      </template>
    </MpPageHeader>

    <!-- Main Table Card -->
    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <!-- Toolbar -->
      <MpDataTableToolbar
        v-model:search="search"
        title="All Orders"
        :active-filters="activeFilterEntries"
        :selected-count="selected.length"
        :total-count="filteredOrders.length"
        @remove-filter="removeFilter"
        @clear-filters="clearAllFilters"
        @clear-selection="selected = []"
        @select-all="selectAll"
      >
        <template #filter-content>
          <div class="pa-4 pb-2">
            <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
            <div v-for="(options, key) in filterOptions" :key="key" class="mb-3">
              <v-select
                v-model="filters[key as keyof typeof filters]"
                :label="filterLabels[key]"
                :items="options"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              />
            </div>
          </div>
        </template>
        <template #bulk-actions>
          <v-btn size="small" variant="outlined" color="success" prepend-icon="mdi-package-check" class="text-none" rounded="lg">Mark Fulfilled</v-btn>
          <v-btn size="small" variant="outlined" color="secondary" prepend-icon="mdi-printer" class="text-none" rounded="lg">Print Labels</v-btn>
          <v-btn size="small" variant="outlined" color="error" prepend-icon="mdi-cancel" class="text-none" rounded="lg">Cancel Orders</v-btn>
        </template>
      </MpDataTableToolbar>

      <v-data-table
        v-model="selected"
        v-model:expanded="expanded"
        :headers="headers"
        :items="filteredOrders"
        :search="search"
        item-value="id"
        show-select
        show-expand
        hover
        density="comfortable"
        :items-per-page="15"
        fixed-header
        class="flex-grow-1"
      >
        <!-- Order number — clickable link style -->
        <template v-slot:item.orderNumber="{ item }">
          <span class="text-primary font-weight-bold cursor-pointer">{{ item.orderNumber }}</span>
        </template>

        <!-- Date — muted -->
        <template v-slot:item.date="{ item }">
          <span class="text-medium-emphasis text-body-2">{{ item.date }}</span>
        </template>

        <!-- Customer -->
        <template v-slot:item.customer.name="{ item }">
          <div class="d-flex align-center gap-2 py-1">
            <v-avatar color="primary" variant="tonal" size="32" class="text-caption font-weight-bold">
              {{ item.customer.avatar }}
            </v-avatar>
            <div>
              <div class="font-weight-medium text-body-2">{{ item.customer.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.customer.email }}</div>
            </div>
          </div>
        </template>

        <!-- Items count -->
        <template v-slot:item.itemCount="{ item }">
          <v-chip size="x-small" variant="tonal" color="secondary" class="font-weight-bold">{{ item.itemCount }}</v-chip>
        </template>

        <!-- Total -->
        <template v-slot:item.total="{ item }">
          <span class="font-weight-bold">${{ item.total }}</span>
        </template>

        <!-- Fulfillment Status — real Maropost values -->
        <template v-slot:item.fulfillmentStatus="{ item }">
          <MpStatusChip :status="item.fulfillmentStatus ?? ''" type="fulfillment" show-icon />
        </template>

        <!-- Payment Status -->
        <template v-slot:item.paymentStatus="{ item }">
          <MpStatusChip :status="item.paymentStatus ?? ''" type="payment" />
        </template>

        <!-- Order Status -->
        <template v-slot:item.status="{ item }">
          <MpStatusChip :status="item.status ?? ''" type="order" variant="flat" />
        </template>

        <!-- Row actions — revealed on hover -->
        <template v-slot:item.actions>
          <div class="action-btns d-flex">
            <v-tooltip text="View order" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-eye-outline" variant="text" size="x-small" color="medium-emphasis"></v-btn>
              </template>
            </v-tooltip>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="x-small" color="medium-emphasis"></v-btn>
              </template>
              <v-list density="compact" min-width="180">
                <v-list-item prepend-icon="mdi-pencil-outline" title="Edit order" value="edit"></v-list-item>
                <v-list-item prepend-icon="mdi-package-check" title="Mark fulfilled" value="fulfill"></v-list-item>
                <v-list-item prepend-icon="mdi-printer" title="Print invoice" value="print"></v-list-item>
                <v-divider></v-divider>
                <v-list-item prepend-icon="mdi-cash-refund" title="Refund" value="refund" class="text-error"></v-list-item>
                <v-list-item prepend-icon="mdi-cancel" title="Cancel order" value="cancel" class="text-error"></v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>

        <!-- Expanded detail row -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="pa-0 bg-surface-variant">
              <div class="pa-6">
                <v-row>
                  <!-- Customer & Payment -->
                  <v-col cols="12" md="3">
                    <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Customer</div>
                    <div class="d-flex align-center gap-3 mb-4">
                      <v-avatar color="primary" size="44" class="font-weight-bold text-white">{{ item.customer.avatar }}</v-avatar>
                      <div>
                        <div class="font-weight-bold">{{ item.customer.name }}</div>
                        <div class="text-caption text-medium-emphasis">{{ item.customer.email }}</div>
                        <div class="text-caption text-medium-emphasis">{{ item.city }}</div>
                      </div>
                    </div>
                    <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-2">Payment</div>
                    <div class="d-flex align-center gap-2 mb-1">
                      <v-icon size="16" color="medium-emphasis">mdi-credit-card-outline</v-icon>
                      <span class="text-body-2">{{ item.paymentMethod }}</span>
                    </div>
                    <MpStatusChip :status="item.paymentStatus ?? ''" type="payment" class="mt-2" />
                    <div v-if="item.notes" class="mt-3 pa-3 rounded-lg border text-caption" style="border-color: rgb(var(--v-theme-warning)) !important; background: rgba(var(--v-theme-warning), 0.08)">
                      <v-icon size="14" color="warning" class="mr-1">mdi-note-text</v-icon>
                      {{ item.notes }}
                    </div>
                  </v-col>

                  <!-- Line Items -->
                  <v-col cols="12" md="6">
                    <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Order Items</div>
                    <v-table density="compact" class="rounded-lg border">
                      <thead>
                        <tr class="bg-surface">
                          <th class="text-caption font-weight-bold">Product</th>
                          <th class="text-caption font-weight-bold text-center">Qty</th>
                          <th class="text-caption font-weight-bold text-right">Price</th>
                          <th class="text-caption font-weight-bold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="li in item.lineItems" :key="li.sku">
                          <td>
                            <div class="text-body-2 font-weight-medium">{{ (li.product ?? '').substring(0, 35) }}{{ (li.product ?? '').length > 35 ? '...' : '' }}</div>
                            <div class="text-caption text-medium-emphasis">{{ li.sku }}</div>
                          </td>
                          <td class="text-center text-body-2">{{ li.qty }}</td>
                          <td class="text-right text-body-2">${{ li.price }}</td>
                          <td class="text-right font-weight-bold text-body-2">${{ (li.qty * parseFloat(li.price)).toFixed(2) }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="bg-surface-variant">
                          <td colspan="3" class="text-right font-weight-bold text-body-2 py-2">Subtotal</td>
                          <td class="text-right font-weight-bold">${{ item.subtotal }}</td>
                        </tr>
                        <tr class="bg-surface-variant">
                          <td colspan="3" class="text-right text-body-2 py-1">Shipping</td>
                          <td class="text-right text-body-2">${{ item.shipping }}</td>
                        </tr>
                        <tr class="bg-surface-variant">
                          <td colspan="3" class="text-right font-weight-bold py-2">Order Total</td>
                          <td class="text-right font-weight-bold text-primary">${{ item.total }}</td>
                        </tr>
                      </tfoot>
                    </v-table>
                  </v-col>

                  <!-- Fulfillment Timeline + Actions -->
                  <v-col cols="12" md="3">
                    <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Fulfillment</div>
                    <MpStatusChip :status="item.fulfillmentStatus ?? ''" type="fulfillment" show-icon class="mb-4" />
                    <v-timeline side="end" density="compact" truncate-line="start" class="mb-4">
                      <v-timeline-item dot-color="success" size="small">
                        <div class="text-body-2 font-weight-medium">Order Placed</div>
                        <div class="text-caption text-medium-emphasis">{{ item.date }}</div>
                      </v-timeline-item>
                      <v-timeline-item
                        :dot-color="item.fulfillmentStatus === 'Shipped' ? 'success' : 'grey'"
                        size="small"
                      >
                        <div class="text-body-2 font-weight-medium">Dispatched</div>
                        <div v-if="item.trackingNumber" class="text-caption text-medium-emphasis">
                          {{ item.courier ?? '' }}: {{ item.trackingNumber }}
                        </div>
                        <div v-else class="text-caption text-medium-emphasis">Pending</div>
                      </v-timeline-item>
                      <v-timeline-item
                        :dot-color="item.status === 'Completed' ? 'success' : 'grey'"
                        size="small"
                      >
                        <div class="text-body-2 font-weight-medium">Completed</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ item.status === 'Completed' ? 'Order complete' : 'In progress' }}
                        </div>
                      </v-timeline-item>
                    </v-timeline>

                    <div class="d-flex flex-column gap-2 mt-2">
                      <v-btn block variant="elevated" color="primary" size="small" class="text-none" prepend-icon="mdi-package-check">Mark Fulfilled</v-btn>
                      <v-btn block variant="outlined" color="secondary" size="small" class="text-none" prepend-icon="mdi-printer">Print Invoice</v-btn>
                      <v-btn block variant="text" color="error" size="small" class="text-none" prepend-icon="mdi-cash-refund">Refund Order</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style scoped>
.mp-btn-dark {
  background: rgb(var(--v-theme-on-surface));
  color: rgb(var(--v-theme-surface));
}
.mp-btn-dark:hover {
  opacity: 0.88;
}
</style>
