<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/useContacts'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpKpiCard from '@/components/MpKpiCard.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'
import MpSectionHeader from '@/components/MpSectionHeader.vue'
import MpEmptyState from '@/components/MpEmptyState.vue'
import MpFormDrawer from '@/components/MpFormDrawer.vue'

const route = useRoute()
const router = useRouter()
const store = useContactsStore()

const contactId = computed(() => Number(route.params.id))
const contact = computed(() => store.getContactById(contactId.value))
const detail = computed(() => store.getContactDetail(contactId.value))

onMounted(() => {
  if (!contact.value) router.replace('/contacts')
})

// Tab state
const activeTab = ref('overview')
const engagementSubTab = ref('emails')
const campaignSubTab = ref('email')

// Edit drawer
const editDrawer = ref(false)
const editForm = ref({ firstName: '', lastName: '', email: '', phone: '', company: '' })
function openEditDrawer() {
  if (!contact.value) return
  editForm.value = {
    firstName: contact.value.firstName,
    lastName: contact.value.lastName,
    email: contact.value.email,
    phone: contact.value.phone,
    company: contact.value.company || '',
  }
  editDrawer.value = true
}

// Computed helpers
const fullName = computed(() => contact.value ? `${contact.value.firstName} ${contact.value.lastName}` : '')
const initials = computed(() => contact.value ? `${contact.value.firstName[0]}${contact.value.lastName[0]}` : '')

const breadcrumbs = computed(() => [
  { title: 'Contacts', to: '/contacts' },
  { title: fullName.value, disabled: true },
])

const emailCampaigns = computed(() => detail.value?.campaigns.filter(c => c.type === 'email') ?? [])
const smsCampaigns = computed(() => detail.value?.campaigns.filter(c => c.type === 'sms') ?? [])

const emailLists = computed(() => detail.value?.lists.filter(l => l.type === 'email') ?? [])
const smsLists = computed(() => detail.value?.lists.filter(l => l.type === 'sms') ?? [])

// Status chip color for campaign/timeline statuses
function activityChipColor(status: string) {
  const map: Record<string, string> = {
    'Delivered': 'info', 'Opened': 'success', 'Clicked': 'primary',
    'Re-sent': 'warning', 'Bounced': 'error', 'Completed': 'success',
    'Processing': 'info', 'Pending': 'warning', 'Open': 'primary', 'Solved': 'success',
  }
  return map[status] || 'grey'
}

// Order table headers
const orderHeaders = [
  { title: 'Order', key: 'id', width: '120px' },
  { title: 'Date', key: 'date' },
  { title: 'Items', key: 'items', align: 'center' as const },
  { title: 'Total', key: 'total', align: 'end' as const },
  { title: 'Status', key: 'status' },
  { title: 'Payment', key: 'paymentStatus' },
  { title: 'Fulfillment', key: 'fulfillmentStatus' },
]

// Ticket table headers
const ticketHeaders = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Subject', key: 'subject' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Date', key: 'date' },
  { title: 'Assignee', key: 'assignee' },
]

// Cart table headers
const cartHeaders = [
  { title: 'Cart ID', key: 'id' },
  { title: 'Date', key: 'date' },
  { title: 'Items', key: 'items', align: 'center' as const },
  { title: 'Total', key: 'total', align: 'end' as const },
  { title: 'Recovered', key: 'recovered', align: 'center' as const },
]
</script>

<template>
  <div v-if="contact && detail" class="contact-detail-page">

    <!-- ── Page Header ────────────────────────────────────────────────────── -->
    <MpPageHeader :title="fullName" :breadcrumbs="breadcrumbs">
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" @click="openEditDrawer">Edit Contact</v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" />
          </template>
          <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
            <v-list-item prepend-icon="mdi-export-variant" title="Export" />
            <v-list-item prepend-icon="mdi-content-copy" title="Duplicate" />
            <v-list-item prepend-icon="mdi-merge" title="Merge" />
            <v-divider class="my-1" />
            <v-list-item prepend-icon="mdi-trash-can-outline" title="Delete" class="text-error" />
          </v-list>
        </v-menu>
      </template>
    </MpPageHeader>

    <!-- ── Two-Column Layout ──────────────────────────────────────────────── -->
    <div class="d-flex gap-5 content-area">

      <!-- ═══ LEFT SIDEBAR ══════════════════════════════════════════════════ -->
      <div class="contact-sidebar">
        <div class="d-flex flex-column gap-4">

        <!-- Card 1: Profile -->
        <v-card flat border rounded="xl" class="pa-5">
          <div class="d-flex align-start gap-4">
            <v-avatar size="64" color="primary" class="text-h5 font-weight-bold">{{ initials }}</v-avatar>
            <div class="flex-grow-1 pt-1">
              <div class="text-h6 font-weight-bold">{{ fullName }}</div>
              <a :href="`mailto:${contact.email}`" class="text-primary text-body-2 d-block mb-1">{{ contact.email }}</a>
              <div v-if="contact.phone" class="text-body-2 text-medium-emphasis">{{ contact.phone }}</div>
            </div>
            <MpStatusChip :status="contact.status" type="contact" size="small" />
          </div>

          <v-divider class="my-4" />

          <div class="d-flex flex-column gap-3">
            <div class="detail-row">
              <span class="detail-label">UID</span>
              <span class="detail-value text-truncate" style="max-width: 200px;">{{ detail.uid }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Customer Created</span>
              <span class="detail-value">{{ contact.createdAt }}</span>
            </div>
            <div v-if="contact.company" class="detail-row">
              <span class="detail-label">Company</span>
              <span class="detail-value">{{ contact.company }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location</span>
              <span class="detail-value">{{ contact.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Score</span>
              <div class="d-flex align-center gap-2">
                <v-progress-linear :model-value="contact.score" :color="contact.score >= 70 ? 'success' : contact.score >= 40 ? 'warning' : 'error'" rounded height="6" style="width: 60px;" />
                <span class="detail-value">{{ contact.score }}</span>
              </div>
            </div>
            <template v-for="field in detail.customFields" :key="field.label">
              <div class="detail-row">
                <span class="detail-label">{{ field.label }}</span>
                <span class="detail-value">{{ field.value }}</span>
              </div>
            </template>
          </div>
        </v-card>

        <!-- Card 2: Tags -->
        <v-card flat border rounded="xl" class="pa-5">
          <MpSectionHeader :title="`Contact Tags (${contact.tags?.length ?? 0})`" />
          <div v-if="contact.tags?.length" class="d-flex flex-wrap gap-2 mb-4">
            <v-chip v-for="tag in contact.tags" :key="tag" size="small" variant="tonal" color="secondary">{{ tag }}</v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis mb-4">No contact tags to show.</div>
          <v-btn variant="outlined" size="small" prepend-icon="mdi-plus">Add Contact Tags</v-btn>
        </v-card>

        <!-- Card 3: Lists & Subscriptions -->
        <v-card flat border rounded="xl" class="pa-5">
          <MpSectionHeader title="Contact Lists">
            <template #actions>
              <v-btn icon="mdi-pencil-outline" variant="text" size="small" density="comfortable" />
            </template>
          </MpSectionHeader>

          <div class="text-subtitle-2 font-weight-medium mb-2">Email Subscription ({{ emailLists.length }})</div>
          <div v-if="emailLists.length" class="d-flex flex-wrap gap-2 mb-4">
            <v-chip v-for="l in emailLists" :key="l.name" size="small" :color="l.subscribed ? 'primary' : 'grey'" variant="tonal">{{ l.name }}</v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis mb-4">No email subscriptions.</div>

          <div class="text-subtitle-2 font-weight-medium mb-2">SMS Subscription ({{ smsLists.length }})</div>
          <div v-if="smsLists.length" class="d-flex flex-wrap gap-2 mb-4">
            <v-chip v-for="l in smsLists" :key="l.name" size="small" :color="l.subscribed ? 'primary' : 'grey'" variant="tonal">{{ l.name }}</v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis mb-4">No SMS subscriptions.</div>

          <v-divider class="mb-3" />

          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Add to Do Not Email List</span>
            <v-switch v-model="detail.doNotEmail" hide-details density="compact" color="primary" />
          </div>
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-body-2">Add to Do Not SMS List</span>
            <v-switch v-model="detail.doNotSms" hide-details density="compact" color="primary" />
          </div>

          <div class="d-flex align-center gap-4">
            <div class="d-flex align-center gap-1"><v-icon size="10" color="primary">mdi-circle</v-icon><span class="text-caption">Subscribed</span></div>
            <div class="d-flex align-center gap-1"><v-icon size="10" color="error">mdi-circle</v-icon><span class="text-caption">Unsubscribed</span></div>
          </div>
        </v-card>

        <!-- Card 4: Brands -->
        <v-card flat border rounded="xl" class="pa-5">
          <MpSectionHeader :title="`Brands (${detail.brands.length})`" />
          <div v-if="detail.brands.length" class="d-flex flex-wrap gap-2">
            <v-chip v-for="b in detail.brands" :key="b" size="small" variant="tonal">{{ b }}</v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis">No Brands to show.<br>Add the customer to a Branded List to send emails.</div>
        </v-card>

        <!-- Card 5: eRFM -->
        <v-card flat border rounded="xl" class="pa-5">
          <MpSectionHeader title="eRFM (Customer Group)" />
          <div class="d-flex flex-column gap-3">
            <div class="detail-row">
              <span class="detail-label">RFM Group</span>
              <span class="detail-value">{{ detail.erfm.rfmGroup }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Engagement Level</span>
              <span class="detail-value">{{ detail.erfm.engagementLevel }}</span>
            </div>
          </div>
        </v-card>

        <!-- Card 6: Keywords -->
        <v-card flat border rounded="xl" class="pa-5">
          <MpSectionHeader :title="`Most Engaging Keywords (${detail.keywords.length})`" />
          <div v-if="detail.keywords.length" class="d-flex flex-wrap gap-2">
            <v-chip v-for="kw in detail.keywords" :key="kw" size="small" variant="tonal" color="info">{{ kw }}</v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis">No keywords data available.</div>
        </v-card>

        </div><!-- end inner flex column -->
      </div>

      <!-- ═══ RIGHT CONTENT AREA ════════════════════════════════════════════ -->
      <div class="flex-grow-1 d-flex flex-column overflow-hidden">

        <!-- Tab bar -->
        <v-tabs v-model="activeTab" density="comfortable" color="primary" class="mb-4 flex-shrink-0">
          <v-tab value="overview">Overview</v-tab>
          <v-tab value="campaigns">
            Campaigns
            <v-badge v-if="detail.campaigns.length" :content="detail.campaigns.length" color="primary" inline class="ml-1" />
          </v-tab>
          <v-tab value="tickets">Tickets</v-tab>
          <v-tab value="orders">Orders</v-tab>
          <v-tab value="abandoned">Abandoned Cart List</v-tab>
        </v-tabs>

        <!-- Tab content -->
        <v-window v-model="activeTab" class="flex-grow-1 right-tab-content">

          <!-- ─── OVERVIEW TAB ──────────────────────────────────────────── -->
          <v-window-item value="overview">
            <div class="d-flex flex-column gap-4 pa-1">

              <!-- KPI Row 1: Response & Revenue -->
              <v-row dense>
                <v-col cols="3">
                  <MpKpiCard label="Response Rate" :value="detail.responseRate.email" icon="mdi-email-outline" color="error">
                    <div class="text-body-2 text-medium-emphasis mt-1">{{ detail.responseRate.sms }} SMS</div>
                  </MpKpiCard>
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="Ideal Response Time" :value="detail.idealResponseTime" icon="mdi-clock-outline" color="info" />
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="Lifetime Value" :value="`$${detail.lifetimeValue.toLocaleString()}`" icon="mdi-cash-multiple" color="success" sub-stat="vs. average $310.0M" />
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="Number of Orders" :value="contact.orders" icon="mdi-cart-outline" color="warning" :sub-stat="`vs. average ${detail.avgOrders} Orders`" />
                </v-col>
              </v-row>

              <!-- KPI Row 2: Tickets -->
              <v-row dense>
                <v-col cols="3">
                  <MpKpiCard label="Total Tickets" :value="detail.engagement.tickets.total" icon="mdi-ticket-outline" color="primary" />
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="Open Tickets" :value="detail.engagement.tickets.open" icon="mdi-ticket-confirmation-outline" color="info" />
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="Solved Tickets" :value="detail.engagement.tickets.solved" icon="mdi-check-circle-outline" color="success" />
                </v-col>
                <v-col cols="3">
                  <MpKpiCard label="On-hold Tickets" :value="detail.engagement.tickets.onHold" icon="mdi-pause-circle-outline" color="error" />
                </v-col>
              </v-row>

              <!-- Customer Engagement Section -->
              <v-card flat border rounded="xl" class="pa-5">
                <MpSectionHeader title="Customer Engagement (Last 7 days)">
                  <template #actions>
                    <v-btn variant="text" prepend-icon="mdi-filter-variant" size="small">Filters</v-btn>
                  </template>
                </MpSectionHeader>

                <v-tabs v-model="engagementSubTab" density="compact" color="primary" class="mb-4">
                  <v-tab value="emails">Emails</v-tab>
                  <v-tab value="orders">Orders</v-tab>
                  <v-tab value="sms">SMS</v-tab>
                  <v-tab value="tickets">Tickets</v-tab>
                </v-tabs>

                <!-- Email engagement metrics -->
                <v-row v-if="engagementSubTab === 'emails'" dense class="mb-5">
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <v-icon color="primary" size="24" class="mb-2">mdi-email-send-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.email.sends }}</div>
                      <div class="text-caption text-medium-emphasis">Sends</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <v-icon color="success" size="24" class="mb-2">mdi-email-open-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.email.opens }}</div>
                      <div class="text-caption text-medium-emphasis">Opens · {{ detail.engagement.email.openRate }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <v-icon color="info" size="24" class="mb-2">mdi-cursor-default-click-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.email.clicks }}</div>
                      <div class="text-caption text-medium-emphasis">Clicks · {{ detail.engagement.email.clickRate }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <v-icon color="error" size="24" class="mb-2">mdi-email-remove-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.email.bounceRate }}</div>
                      <div class="text-caption text-medium-emphasis">Bounces</div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Tickets engagement -->
                <v-row v-else-if="engagementSubTab === 'tickets'" dense class="mb-5">
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.tickets.total }}</div>
                      <div class="text-caption text-medium-emphasis">Total</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.tickets.open }}</div>
                      <div class="text-caption text-medium-emphasis">Open</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.tickets.solved }}</div>
                      <div class="text-caption text-medium-emphasis">Solved</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card flat border rounded="lg" class="pa-4 text-center">
                      <div class="text-h5 font-weight-bold">{{ detail.engagement.tickets.onHold }}</div>
                      <div class="text-caption text-medium-emphasis">On-hold</div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Orders / SMS engagement -->
                <v-row v-else dense class="mb-5">
                  <v-col cols="12">
                    <div class="text-body-2 text-medium-emphasis pa-4 text-center">
                      {{ engagementSubTab === 'orders' ? 'Order engagement data' : 'SMS engagement data' }} — coming soon
                    </div>
                  </v-col>
                </v-row>

                <!-- History Timeline -->
                <div class="text-subtitle-1 font-weight-medium mb-3">History Timeline</div>
                <div class="d-flex flex-column">
                  <div v-for="entry in detail.timeline" :key="entry.id" class="timeline-entry d-flex align-start gap-3 py-3">
                    <v-avatar :color="entry.color" size="36" variant="tonal">
                      <v-icon size="18">{{ entry.icon }}</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">{{ entry.title }}</div>
                      <div class="d-flex align-center gap-2 mt-1 flex-wrap">
                        <v-chip v-for="s in entry.statuses" :key="s" size="x-small" variant="outlined" :color="activityChipColor(s)">{{ s }}</v-chip>
                      </div>
                    </div>
                    <div class="text-caption text-medium-emphasis text-no-wrap">{{ entry.date }}</div>
                  </div>
                </div>
              </v-card>

            </div>
          </v-window-item>

          <!-- ─── CAMPAIGNS TAB ─────────────────────────────────────────── -->
          <v-window-item value="campaigns">
            <div class="pa-1">
              <v-tabs v-model="campaignSubTab" density="compact" color="primary" class="mb-4">
                <v-tab value="email">Email Campaigns ({{ emailCampaigns.length }})</v-tab>
                <v-tab value="sms">SMS Campaigns ({{ smsCampaigns.length }})</v-tab>
              </v-tabs>

              <div v-if="campaignSubTab === 'email' && emailCampaigns.length" class="d-flex flex-column">
                <div v-for="c in emailCampaigns" :key="c.id" class="campaign-row d-flex align-center gap-3 py-3 px-2">
                  <v-avatar color="primary" size="36" variant="tonal">
                    <v-icon size="18">mdi-email-outline</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">{{ c.name }}</div>
                    <div class="d-flex gap-2 mt-1 flex-wrap">
                      <v-chip v-for="s in c.statuses" :key="s" size="x-small" variant="outlined" :color="activityChipColor(s)">{{ s }}</v-chip>
                    </div>
                  </div>
                  <div class="text-caption text-medium-emphasis text-no-wrap mr-3">{{ c.sentDate }}</div>
                  <v-btn variant="outlined" size="small">Re-send Campaign</v-btn>
                  <v-btn variant="tonal" size="small">Details</v-btn>
                </div>
              </div>

              <div v-else-if="campaignSubTab === 'sms' && smsCampaigns.length" class="d-flex flex-column">
                <div v-for="c in smsCampaigns" :key="c.id" class="campaign-row d-flex align-center gap-3 py-3 px-2">
                  <v-avatar color="info" size="36" variant="tonal">
                    <v-icon size="18">mdi-cellphone-message</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">{{ c.name }}</div>
                    <div class="d-flex gap-2 mt-1 flex-wrap">
                      <v-chip v-for="s in c.statuses" :key="s" size="x-small" variant="outlined" :color="activityChipColor(s)">{{ s }}</v-chip>
                    </div>
                  </div>
                  <div class="text-caption text-medium-emphasis text-no-wrap mr-3">{{ c.sentDate }}</div>
                  <v-btn variant="outlined" size="small">Re-send</v-btn>
                  <v-btn variant="tonal" size="small">Details</v-btn>
                </div>
              </div>

              <MpEmptyState
                v-else
                icon="mdi-email-off-outline"
                title="No campaigns found"
                description="No campaigns have been sent to this contact yet."
              />
            </div>
          </v-window-item>

          <!-- ─── TICKETS TAB ───────────────────────────────────────────── -->
          <v-window-item value="tickets">
            <div class="pa-1">
              <v-data-table
                v-if="detail.tickets.length"
                :headers="ticketHeaders"
                :items="detail.tickets"
                items-per-page="10"
                density="comfortable"
              >
                <template v-slot:item.status="{ item }">
                  <MpStatusChip :status="item.status" type="ticket" size="x-small" />
                </template>
                <template v-slot:item.priority="{ item }">
                  <v-chip size="x-small" variant="tonal" :color="item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'info'">{{ item.priority }}</v-chip>
                </template>
              </v-data-table>
              <MpEmptyState
                v-else
                icon="mdi-headset"
                title="No tickets"
                description="This contact has no support tickets."
              />
            </div>
          </v-window-item>

          <!-- ─── ORDERS TAB ────────────────────────────────────────────── -->
          <v-window-item value="orders">
            <div class="pa-1">
              <div class="text-subtitle-1 font-weight-medium mb-3">All Orders ({{ detail.orders.length }})</div>
              <v-data-table
                v-if="detail.orders.length"
                :headers="orderHeaders"
                :items="detail.orders"
                items-per-page="10"
                density="comfortable"
              >
                <template v-slot:item.total="{ item }">
                  <span class="font-weight-medium">${{ item.total.toFixed(2) }}</span>
                </template>
                <template v-slot:item.status="{ item }">
                  <MpStatusChip :status="item.status" type="order" size="x-small" />
                </template>
                <template v-slot:item.paymentStatus="{ item }">
                  <MpStatusChip :status="item.paymentStatus" type="payment" size="x-small" />
                </template>
                <template v-slot:item.fulfillmentStatus="{ item }">
                  <MpStatusChip :status="item.fulfillmentStatus" type="fulfillment" size="x-small" />
                </template>
              </v-data-table>
              <MpEmptyState
                v-else
                icon="mdi-cart-off"
                title="No orders"
                description="This contact has not placed any orders yet."
              />
            </div>
          </v-window-item>

          <!-- ─── ABANDONED CART TAB ────────────────────────────────────── -->
          <v-window-item value="abandoned">
            <div class="pa-1">
              <v-data-table
                v-if="detail.abandonedCarts.length"
                :headers="cartHeaders"
                :items="detail.abandonedCarts"
                items-per-page="10"
                density="comfortable"
              >
                <template v-slot:item.items="{ item }">
                  {{ item.items.length }} item{{ item.items.length !== 1 ? 's' : '' }}
                </template>
                <template v-slot:item.total="{ item }">
                  <span class="font-weight-medium">${{ item.total.toFixed(2) }}</span>
                </template>
                <template v-slot:item.recovered="{ item }">
                  <v-chip size="x-small" variant="flat" :color="item.recovered ? 'success' : 'warning'">
                    {{ item.recovered ? 'Recovered' : 'Not Recovered' }}
                  </v-chip>
                </template>
              </v-data-table>
              <MpEmptyState
                v-else
                icon="mdi-cart-remove"
                title="No abandoned carts"
                description="This contact has no abandoned carts."
              />
            </div>
          </v-window-item>

        </v-window>
      </div>
    </div>

    <!-- ── Edit Contact Drawer ────────────────────────────────────────────── -->
    <MpFormDrawer v-model="editDrawer" title="Edit Contact" subtitle="Update contact information">
      <v-row dense>
        <v-col cols="6"><v-text-field v-model="editForm.firstName" label="First Name" /></v-col>
        <v-col cols="6"><v-text-field v-model="editForm.lastName" label="Last Name" /></v-col>
        <v-col cols="12"><v-text-field v-model="editForm.email" label="Email" type="email" /></v-col>
        <v-col cols="12"><v-text-field v-model="editForm.phone" label="Phone" /></v-col>
        <v-col cols="12"><v-text-field v-model="editForm.company" label="Company" /></v-col>
      </v-row>
      <template #footer>
        <v-btn variant="text" @click="editDrawer = false">Cancel</v-btn>
        <v-btn color="primary" @click="editDrawer = false">Save Changes</v-btn>
      </template>
    </MpFormDrawer>

  </div>
</template>

<style scoped>
.contact-detail-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-area {
  height: calc(100vh - 200px);
  overflow: hidden;
}

.contact-sidebar {
  width: 380px;
  min-width: 380px;
  flex-shrink: 0;
  overflow-y: auto;
  padding-bottom: 24px;
  scrollbar-width: thin;
}

.contact-sidebar > * {
  flex-shrink: 0;
}

.contact-sidebar::-webkit-scrollbar {
  width: 4px;
}

.contact-sidebar::-webkit-scrollbar-thumb {
  background: rgba(var(--v-border-color), 0.3);
  border-radius: 4px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.right-tab-content {
  overflow-y: auto;
  scrollbar-width: thin;
}

.right-tab-content::-webkit-scrollbar {
  width: 4px;
}

.right-tab-content::-webkit-scrollbar-thumb {
  background: rgba(var(--v-border-color), 0.3);
  border-radius: 4px;
}

.detail-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
}

.timeline-entry {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.timeline-entry:last-child {
  border-bottom: none;
}

.campaign-row {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.campaign-row:last-child {
  border-bottom: none;
}
</style>
