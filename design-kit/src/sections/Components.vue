<script setup lang="ts">
import { ref } from 'vue'
import MpKpiCard from '@/components/MpKpiCard.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'
import MpEmptyState from '@/components/MpEmptyState.vue'
import MpFilterTabs from '@/components/MpFilterTabs.vue'
import MpFloatingBulkBar from '@/components/MpFloatingBulkBar.vue'
import MpFormDrawer from '@/components/MpFormDrawer.vue'
import MpSectionHeader from '@/components/MpSectionHeader.vue'

// ── MpFilterTabs ──────────────────────────────────────────────────────────────
const tabsWithCount   = ref('all')
const tabsNoCounts    = ref('active')
const tabsMany        = ref('orders')

const filterTabsCounts = [
  { key: 'all',       label: 'All',       count: 284 },
  { key: 'active',    label: 'Active',    count: 178 },
  { key: 'draft',     label: 'Draft',     count: 63 },
  { key: 'archived',  label: 'Archived',  count: 43 },
]
const filterTabsNone = [
  { key: 'active',    label: 'Active' },
  { key: 'inactive',  label: 'Inactive' },
  { key: 'pending',   label: 'Pending' },
]
const filterTabsMany = [
  { key: 'orders',       label: 'Orders',      count: 91 },
  { key: 'contacts',     label: 'Contacts',    count: 2104 },
  { key: 'campaigns',    label: 'Campaigns',   count: 17 },
  { key: 'journeys',     label: 'Journeys',    count: 8 },
  { key: 'tickets',      label: 'Tickets',     count: 34 },
  { key: 'products',     label: 'Products',    count: 512 },
]

// ── MpDataTableToolbar ────────────────────────────────────────────────────────
const searchMinimal   = ref('')
const searchWithTitle = ref('')
const searchFiltered  = ref('')
const filterMenuOpen  = ref(false)
const activeFilters   = ref([
  { key: 'status',   label: 'Status: Active' },
  { key: 'date',     label: 'Date: Last 30 days' },
  { key: 'channel',  label: 'Channel: Email' },
  { key: 'tag',      label: 'Tag: VIP' },
])
const selectedCount = ref(12)
const totalCount    = ref(284)
const bulkSearch    = ref('')

// ── MpFloatingBulkBar ─────────────────────────────────────────────────────────
const bulkCount1  = ref(1)
const bulkCount5  = ref(5)
const bulkCount25 = ref(25)

// ── MpFormDrawer ──────────────────────────────────────────────────────────────
const drawerDefault = ref(false)
const drawerWide    = ref(false)
const drawerNoFooter = ref(false)

// ── MpStatusChip type/status maps (title-case, matching source colorMap) ──────
const statusGroups: Array<{
  type: 'order' | 'fulfillment' | 'payment' | 'campaign' | 'contact' | 'ticket' | 'coupon' | 'general'
  statuses: string[]
}> = [
  { type: 'order',       statuses: ['Processing', 'Completed', 'Cancelled', 'Refunded', 'On Hold'] },
  { type: 'fulfillment', statuses: ['Unfulfilled', 'Partial', 'Fulfilled', 'Unapproved', 'Not Ready', 'Ready For Fulfillment', 'Shipped', 'Return Requested'] },
  { type: 'payment',     statuses: ['Pending', 'Paid', 'Refunded', 'Voided'] },
  { type: 'campaign',    statuses: ['Draft', 'Scheduled', 'Sending', 'Sent', 'Active', 'Paused', 'Completed', 'Failed'] },
  { type: 'contact',     statuses: ['Active', 'Unsubscribed', 'Bounced', 'Pending'] },
  { type: 'ticket',      statuses: ['Open', 'In Progress', 'Awaiting Reply', 'Resolved', 'Closed'] },
  { type: 'coupon',      statuses: ['Active', 'Scheduled', 'Expired', 'Used'] },
  { type: 'general',     statuses: ['Active', 'Inactive', 'Pending', 'Error', 'Published', 'Draft', 'Archived'] },
]

// Chip variant showcase (use 'Active' in 'general' for clean demo)
const chipVariants: Array<'tonal' | 'flat' | 'outlined'> = ['tonal', 'flat', 'outlined']
const chipSizes: Array<'x-small' | 'small' | 'default'> = ['x-small', 'small', 'default']
</script>

<template>
  <div>
    <!-- Page heading -->
    <div class="mb-8">
      <div style="font-size: 28px; font-weight: 700; font-family: Inter, sans-serif; color: #111928;">
        Component Gallery
      </div>
      <div class="text-medium-emphasis mt-1">
        Every prop variation of all 9 Mp* design system components
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 1. MpPageHeader                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">1 — MpPageHeader</div>

      <div class="variant-label">Variant A — title only</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <div class="pa-4">
          <MpPageHeader title="Sales Orders" />
        </div>
      </v-card>

      <div class="variant-label">Variant B — title + subtitle</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <div class="pa-4">
          <MpPageHeader
            title="Sales Orders"
            subtitle="Manage and track all customer orders from every channel"
          />
        </div>
      </v-card>

      <div class="variant-label">Variant C — title + subtitle + breadcrumbs + #actions slot</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <div class="pa-4">
          <MpPageHeader
            title="Order #1042"
            subtitle="Placed on Mar 8, 2026 · Shopify channel"
            :breadcrumbs="[
              { title: 'Commerce' },
              { title: 'Sales Orders', to: '/commerce/orders' },
              { title: '#1042', disabled: true },
            ]"
          >
            <template #actions>
              <v-btn variant="outlined" size="small">Print packing slip</v-btn>
              <v-btn color="primary" size="small" prepend-icon="mdi-check">Fulfil order</v-btn>
            </template>
          </MpPageHeader>
        </div>
      </v-card>

      <div class="variant-label">Variant D — with #tabs slot (MpFilterTabs inline)</div>
      <v-card flat border rounded="lg" style="overflow:hidden;">
        <div class="pa-4">
          <MpPageHeader
            title="Contacts"
            subtitle="2,104 total contacts"
            :breadcrumbs="[{ title: 'Contacts', disabled: true }]"
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-account-plus">Add contact</v-btn>
            </template>
            <template #tabs>
              <MpFilterTabs v-model="tabsWithCount" :tabs="filterTabsCounts" />
            </template>
          </MpPageHeader>
        </div>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 2. MpKpiCard                                                           -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">2 — MpKpiCard</div>

      <div class="variant-label">Variant A — value only (minimal)</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;" class="mb-4">
        <MpKpiCard label="Total Orders" value="1,284" />
        <MpKpiCard label="Revenue" value="$94,200" />
        <MpKpiCard label="Avg Order Value" value="$73.36" />
      </div>

      <div class="variant-label">Variant B — with icon + color, no trend</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;" class="mb-4">
        <MpKpiCard label="Total Revenue"   value="$142,580" icon="mdi-currency-usd"     color="primary" />
        <MpKpiCard label="Active Orders"   value="284"      icon="mdi-shopping"         color="success" />
        <MpKpiCard label="New Contacts"    value="1,038"    icon="mdi-account-multiple"  color="secondary" />
        <MpKpiCard label="Open Tickets"    value="17"       icon="mdi-headset"           color="warning" />
      </div>

      <div class="variant-label">Variant C — with trend positive + subStat</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;" class="mb-4">
        <MpKpiCard label="Revenue"         value="$142,580" icon="mdi-currency-usd"    color="primary"   trend="+12.4%" :trendPositive="true"  subStat="vs last month" />
        <MpKpiCard label="Conversion Rate" value="3.2%"     icon="mdi-percent"         color="success"   trend="+0.8%" :trendPositive="true"  subStat="industry avg 2.1%" />
        <MpKpiCard label="Email Open Rate" value="28.5%"    icon="mdi-email-open"      color="info"      trend="+4.1%" :trendPositive="true"  subStat="last campaign" />
        <MpKpiCard label="LTV"             value="$890"     icon="mdi-account-heart"   color="secondary" trend="+6.2%" :trendPositive="true"  subStat="per customer" />
      </div>

      <div class="variant-label">Variant D — with trend negative</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
        <MpKpiCard label="Refund Rate"    value="1.8%"   icon="mdi-alert-circle"  color="warning" trend="+0.4%" :trendPositive="false" subStat="vs last month" />
        <MpKpiCard label="Bounce Rate"    value="6.3%"   icon="mdi-email-bounce"  color="error"   trend="+1.2%" :trendPositive="false" subStat="email campaign" />
        <MpKpiCard label="Cart Abandonment" value="71.4%" icon="mdi-cart-remove"  color="error"   trend="+3.7%" :trendPositive="false" />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 3. MpStatusChip                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">3 — MpStatusChip</div>

      <!-- All types + statuses -->
      <div class="variant-label">Variant A — all types, all statuses (variant="tonal" size="small")</div>
      <v-card flat border rounded="lg" class="pa-5 mb-4">
        <div v-for="group in statusGroups" :key="group.type" class="mb-5">
          <div class="type-badge mb-2">type="{{ group.type }}"</div>
          <div class="d-flex flex-wrap gap-2">
            <MpStatusChip
              v-for="s in group.statuses"
              :key="s"
              :status="s"
              :type="group.type"
            />
          </div>
        </div>
      </v-card>

      <!-- showIcon=true -->
      <div class="variant-label">Variant B — showIcon="true" (types with icon maps)</div>
      <v-card flat border rounded="lg" class="pa-5 mb-4">
        <div v-for="group in statusGroups.filter(g => ['campaign','fulfillment','ticket'].includes(g.type))" :key="group.type" class="mb-4">
          <div class="type-badge mb-2">type="{{ group.type }}" show-icon</div>
          <div class="d-flex flex-wrap gap-2">
            <MpStatusChip
              v-for="s in group.statuses"
              :key="s"
              :status="s"
              :type="group.type"
              show-icon
            />
          </div>
        </div>
      </v-card>

      <!-- Variants (flat / tonal / outlined) -->
      <div class="variant-label">Variant C — chip variants (flat / tonal / outlined)</div>
      <v-card flat border rounded="lg" class="pa-5 mb-4">
        <div v-for="v in chipVariants" :key="v" class="mb-4">
          <div class="type-badge mb-2">variant="{{ v }}"</div>
          <div class="d-flex flex-wrap gap-2">
            <MpStatusChip status="Active"      type="general"   :variant="v" />
            <MpStatusChip status="Draft"       type="general"   :variant="v" />
            <MpStatusChip status="Pending"     type="payment"   :variant="v" />
            <MpStatusChip status="Paid"        type="payment"   :variant="v" />
            <MpStatusChip status="Processing"  type="order"     :variant="v" />
            <MpStatusChip status="Completed"   type="order"     :variant="v" />
            <MpStatusChip status="Sent"        type="campaign"  :variant="v" />
            <MpStatusChip status="Scheduled"   type="campaign"  :variant="v" />
          </div>
        </div>
      </v-card>

      <!-- Sizes -->
      <div class="variant-label">Variant D — sizes (x-small / small / default)</div>
      <v-card flat border rounded="lg" class="pa-5">
        <div v-for="sz in chipSizes" :key="sz" class="mb-4">
          <div class="type-badge mb-2">size="{{ sz }}"</div>
          <div class="d-flex flex-wrap align-center gap-2">
            <MpStatusChip status="Active"     type="general"   :size="sz" />
            <MpStatusChip status="Processing" type="order"     :size="sz" />
            <MpStatusChip status="Paid"       type="payment"   :size="sz" />
            <MpStatusChip status="Sending"    type="campaign"  :size="sz" />
            <MpStatusChip status="Open"       type="ticket"    :size="sz" show-icon />
          </div>
        </div>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 4. MpFilterTabs                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">4 — MpFilterTabs</div>

      <div class="variant-label">Variant A — with counts</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <div class="pa-4 pb-0">
          <MpFilterTabs v-model="tabsWithCount" :tabs="filterTabsCounts" />
        </div>
        <div class="px-4 pb-3 text-caption text-medium-emphasis">Active: {{ tabsWithCount }}</div>
      </v-card>

      <div class="variant-label">Variant B — without counts</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <div class="pa-4 pb-0">
          <MpFilterTabs v-model="tabsNoCounts" :tabs="filterTabsNone" />
        </div>
        <div class="px-4 pb-3 text-caption text-medium-emphasis">Active: {{ tabsNoCounts }}</div>
      </v-card>

      <div class="variant-label">Variant C — many tabs (6 tabs)</div>
      <v-card flat border rounded="lg" style="overflow:hidden;">
        <div class="pa-4 pb-0">
          <MpFilterTabs v-model="tabsMany" :tabs="filterTabsMany" />
        </div>
        <div class="px-4 pb-3 text-caption text-medium-emphasis">Active: {{ tabsMany }}</div>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 5. MpDataTableToolbar                                                  -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">5 — MpDataTableToolbar</div>

      <div class="variant-label">Variant A — search only (minimal)</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <MpDataTableToolbar v-model:search="searchMinimal" search-placeholder="Search orders..." />
      </v-card>

      <div class="variant-label">Variant B — with title prop</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <MpDataTableToolbar
          v-model:search="searchWithTitle"
          title="All Contacts"
          search-placeholder="Search contacts..."
        />
      </v-card>

      <div class="variant-label">Variant C — with #actions slot (export + columns)</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <MpDataTableToolbar v-model:search="searchMinimal" search-placeholder="Search campaigns...">
          <template #actions>
            <v-btn variant="outlined" size="small" prepend-icon="mdi-table-column">Columns</v-btn>
            <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-download">Export CSV</v-btn>
          </template>
        </MpDataTableToolbar>
      </v-card>

      <div class="variant-label">Variant D — with #filter-content slot (filter button + dropdown)</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <MpDataTableToolbar
          v-model:search="searchFiltered"
          v-model:filter-open="filterMenuOpen"
          search-placeholder="Search orders..."
        >
          <template #filter-content>
            <div class="pa-4">
              <div class="text-subtitle-2 font-weight-bold mb-3">Filter Orders</div>
              <v-select label="Status" :items="['Processing','Completed','Cancelled']" density="compact" class="mb-3" />
              <v-select label="Channel" :items="['Shopify','WooCommerce','Amazon']" density="compact" />
            </div>
          </template>
          <template #actions>
            <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-download">Export</v-btn>
          </template>
        </MpDataTableToolbar>
      </v-card>

      <div class="variant-label">Variant E — with active filter chips row</div>
      <v-card flat border rounded="lg" class="mb-4" style="overflow:hidden;">
        <MpDataTableToolbar
          v-model:search="searchFiltered"
          search-placeholder="Search..."
          :active-filters="activeFilters"
          @remove-filter="(key) => activeFilters.splice(activeFilters.findIndex(f => f.key === key), 1)"
          @clear-filters="activeFilters.splice(0)"
        />
      </v-card>

      <div class="variant-label">Variant F — with selectedCount + bulk-actions slot</div>
      <v-card flat border rounded="lg" style="overflow:hidden;">
        <MpDataTableToolbar
          v-model:search="bulkSearch"
          search-placeholder="Search..."
          :selected-count="selectedCount"
          :total-count="totalCount"
          @clear-selection="selectedCount = 0"
          @select-all="selectedCount = totalCount"
        >
          <template #bulk-actions>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-tag">Tag</v-btn>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-email-fast">Email</v-btn>
            <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-delete">Delete</v-btn>
          </template>
        </MpDataTableToolbar>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 6. MpEmptyState                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">6 — MpEmptyState</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="mb-4">
        <div>
          <div class="variant-label">Variant A — title only</div>
          <v-card flat border rounded="lg">
            <MpEmptyState title="No results found" />
          </v-card>
        </div>
        <div>
          <div class="variant-label">Variant B — with icon</div>
          <v-card flat border rounded="lg">
            <MpEmptyState icon="mdi-magnify" title="No results found" />
          </v-card>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="mb-4">
        <div>
          <div class="variant-label">Variant C — icon + description</div>
          <v-card flat border rounded="lg">
            <MpEmptyState
              icon="mdi-shopping-outline"
              title="No orders yet"
              description="Once customers place orders they will appear here. You can also create a draft order manually."
            />
          </v-card>
        </div>
        <div>
          <div class="variant-label">Variant D — full (icon + description + action)</div>
          <v-card flat border rounded="lg">
            <MpEmptyState
              icon="mdi-shopping-outline"
              title="No orders yet"
              description="Once customers place orders they will appear here."
              action-label="Create first order"
              action-icon="mdi-plus"
              @action="() => {}"
            />
          </v-card>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        <div>
          <div class="variant-label">Contacts context</div>
          <v-card flat border rounded="lg">
            <MpEmptyState
              icon="mdi-account-multiple-outline"
              title="No contacts found"
              description="Try adjusting your filters or add a new contact."
              action-label="Add contact"
              action-icon="mdi-account-plus"
              @action="() => {}"
            />
          </v-card>
        </div>
        <div>
          <div class="variant-label">Campaigns context</div>
          <v-card flat border rounded="lg">
            <MpEmptyState
              icon="mdi-email-newsletter"
              title="No campaigns yet"
              description="Create your first email campaign to start reaching customers."
              action-label="Create campaign"
              action-icon="mdi-plus"
              @action="() => {}"
            />
          </v-card>
        </div>
        <div>
          <div class="variant-label">Tickets context</div>
          <v-card flat border rounded="lg">
            <MpEmptyState
              icon="mdi-headset-off"
              title="No open tickets"
              description="Your support queue is empty. All tickets have been resolved."
            />
          </v-card>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 7. MpSectionHeader                                                     -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">7 — MpSectionHeader</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="mb-4">
        <div>
          <div class="variant-label">Variant A — title only</div>
          <v-card flat border rounded="lg" class="pa-5">
            <MpSectionHeader title="Recent Transactions" />
            <div class="text-caption text-medium-emphasis">Content area</div>
          </v-card>
        </div>
        <div>
          <div class="variant-label">Variant B — with single action</div>
          <v-card flat border rounded="lg" class="pa-5">
            <MpSectionHeader title="Top Products">
              <template #actions>
                <v-btn variant="text" size="small" class="text-none">View all</v-btn>
              </template>
            </MpSectionHeader>
            <div class="text-caption text-medium-emphasis">Content area</div>
          </v-card>
        </div>
      </div>

      <div class="variant-label">Variant C — with multiple actions</div>
      <v-card flat border rounded="lg" class="pa-5">
        <MpSectionHeader title="Campaign Performance">
          <template #actions>
            <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-download">Export</v-btn>
            <v-btn color="primary" size="small" class="text-none" prepend-icon="mdi-plus">New campaign</v-btn>
          </template>
        </MpSectionHeader>
        <div class="text-caption text-medium-emphasis">Content area</div>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 8. MpFloatingBulkBar                                                   -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">8 — MpFloatingBulkBar</div>

      <div class="variant-label">Variant A — count=0 (hidden, transition demo)</div>
      <v-card flat border rounded="lg" class="pa-4 mb-4" style="min-height:72px; background:#F9FAFB;">
        <MpFloatingBulkBar :count="0" @clear="() => {}">
          <v-btn size="small" variant="tonal" color="error">Delete</v-btn>
        </MpFloatingBulkBar>
        <div class="text-caption text-medium-emphasis">(nothing visible — count is 0)</div>
      </v-card>

      <div class="variant-label">Variant B — count=1, single action</div>
      <v-card flat border rounded="lg" class="pa-4 mb-4" style="background:#F9FAFB;">
        <MpFloatingBulkBar :count="bulkCount1" @clear="bulkCount1 = 0">
          <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-delete">Delete</v-btn>
        </MpFloatingBulkBar>
      </v-card>

      <div class="variant-label">Variant C — count=5, multiple actions</div>
      <v-card flat border rounded="lg" class="pa-4 mb-4" style="background:#F9FAFB;">
        <MpFloatingBulkBar :count="bulkCount5" @clear="bulkCount5 = 0">
          <v-btn size="small" variant="tonal" prepend-icon="mdi-tag">Tag</v-btn>
          <v-btn size="small" variant="tonal" prepend-icon="mdi-email-fast">Email</v-btn>
          <v-btn size="small" variant="tonal" prepend-icon="mdi-export">Export</v-btn>
          <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-delete">Delete</v-btn>
        </MpFloatingBulkBar>
      </v-card>

      <div class="variant-label">Variant D — high count (25 items)</div>
      <v-card flat border rounded="lg" class="pa-4" style="background:#F9FAFB;">
        <MpFloatingBulkBar :count="bulkCount25" @clear="bulkCount25 = 0">
          <v-btn size="small" variant="tonal" prepend-icon="mdi-check-all">Mark fulfilled</v-btn>
          <v-btn size="small" variant="tonal" prepend-icon="mdi-printer">Print labels</v-btn>
          <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-cancel">Cancel orders</v-btn>
        </MpFloatingBulkBar>
      </v-card>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- 9. MpFormDrawer                                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section class="mb-10">
      <div class="section-title">9 — MpFormDrawer</div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        <div>
          <div class="variant-label">Variant A — default width (480px)</div>
          <v-card flat border rounded="lg" class="pa-5">
            <v-btn color="primary" prepend-icon="mdi-account-plus" block @click="drawerDefault = true">
              Open drawer (480px)
            </v-btn>
          </v-card>
        </div>
        <div>
          <div class="variant-label">Variant B — wide drawer (640px)</div>
          <v-card flat border rounded="lg" class="pa-5">
            <v-btn color="secondary" prepend-icon="mdi-email-plus" block @click="drawerWide = true">
              Open drawer (640px)
            </v-btn>
          </v-card>
        </div>
        <div>
          <div class="variant-label">Variant C — no footer slot</div>
          <v-card flat border rounded="lg" class="pa-5">
            <v-btn variant="outlined" prepend-icon="mdi-information-outline" block @click="drawerNoFooter = true">
              Open drawer (no footer)
            </v-btn>
          </v-card>
        </div>
      </div>

      <!-- Drawer A — default 480px with footer -->
      <MpFormDrawer
        v-model="drawerDefault"
        title="Create Contact"
        subtitle="Add a new contact to your list"
      >
        <v-row>
          <v-col cols="6"><v-text-field label="First name" placeholder="Jane" /></v-col>
          <v-col cols="6"><v-text-field label="Last name"  placeholder="Smith" /></v-col>
          <v-col cols="12"><v-text-field label="Email" placeholder="jane@example.com" type="email" /></v-col>
          <v-col cols="12"><v-text-field label="Phone" placeholder="+1 555 000 0000" /></v-col>
          <v-col cols="12">
            <v-select label="Status" :items="['Active', 'Unsubscribed', 'Bounced']" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="Notes" placeholder="Internal notes about this contact..." rows="3" />
          </v-col>
        </v-row>
        <template #footer>
          <v-btn variant="text" @click="drawerDefault = false">Cancel</v-btn>
          <v-btn color="primary" @click="drawerDefault = false">Save Contact</v-btn>
        </template>
      </MpFormDrawer>

      <!-- Drawer B — 640px for complex campaign form -->
      <MpFormDrawer
        v-model="drawerWide"
        title="Create Email Campaign"
        subtitle="Configure and schedule your campaign"
        :width="640"
      >
        <v-row>
          <v-col cols="12"><v-text-field label="Campaign name" placeholder="Spring Sale 2026" /></v-col>
          <v-col cols="12"><v-text-field label="Subject line" placeholder="Don't miss our biggest sale..." /></v-col>
          <v-col cols="6">
            <v-select label="From name" :items="['Maropost Store', 'Support Team', 'Marketing']" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Reply-to email" placeholder="hello@store.com" />
          </v-col>
          <v-col cols="12">
            <v-select label="Audience" :items="['All Contacts', 'Active Subscribers', 'VIP Customers', 'Custom segment']" />
          </v-col>
          <v-col cols="6">
            <v-select label="Send type" :items="['Send now', 'Schedule', 'Triggered']" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Scheduled date" type="datetime-local" />
          </v-col>
        </v-row>
        <template #footer>
          <v-btn variant="text" @click="drawerWide = false">Cancel</v-btn>
          <div class="d-flex gap-2">
            <v-btn variant="outlined">Save as draft</v-btn>
            <v-btn color="primary" @click="drawerWide = false">Schedule</v-btn>
          </div>
        </template>
      </MpFormDrawer>

      <!-- Drawer C — no footer -->
      <MpFormDrawer
        v-model="drawerNoFooter"
        title="Order Details"
        subtitle="View-only — no footer slot"
      >
        <v-list density="compact">
          <v-list-item title="Order #1042" subtitle="Mar 8, 2026" prepend-icon="mdi-shopping" />
          <v-list-item title="Customer" subtitle="Jane Smith · jane@example.com" prepend-icon="mdi-account" />
          <v-list-item title="Total" subtitle="$284.00 · Paid" prepend-icon="mdi-currency-usd" />
          <v-list-item title="Fulfillment" subtitle="Unfulfilled · 3 items" prepend-icon="mdi-package-variant" />
        </v-list>
      </MpFormDrawer>
    </section>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 700;
  font-family: Inter, sans-serif;
  color: #111928;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #E5E7EB;
}

.variant-label {
  font-size: 11px;
  font-weight: 600;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #1A56DB;
  background: #EEF2FF;
  border-radius: 4px;
  padding: 3px 8px;
  display: inline-block;
  margin-bottom: 10px;
}

.type-badge {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}
</style>
