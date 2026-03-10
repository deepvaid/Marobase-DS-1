<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTicketsStore } from '@/stores/useTickets'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const store = useTicketsStore()
const tab = ref('list')
const replyBody = ref('')
const search = ref('')
const filterStatus = ref('All')

const activeTicket = computed(() => store.tickets.find(t => t.id === store.activeTicketId))

// New Ticket Drawer
const newTicketDrawer = ref(false)
const saveSnack = ref(false)
const newTicket = ref({
  customer: '',
  email: '',
  subject: '',
  category: 'General',
  priority: 'Normal',
  description: '',
  assignee: 'Auto-assign',
})
function submitTicket() {
  newTicketDrawer.value = false
  saveSnack.value = true
  newTicket.value = { customer:'', email:'', subject:'', category:'General', priority:'Normal', description:'', assignee:'Auto-assign' }
}

// Canned responses
const cannedMenu = ref(false)
const cannedResponses = [
  { label:'Thank you for reaching out', body:'Hi {{first_name}}, Thank you for contacting our support team. We have received your message and will respond within 24 hours.' },
  { label:'Order status update',        body:'Hi {{first_name}}, Your order {{order_id}} is currently being processed and will ship within 1-2 business days.' },
  { label:'Refund confirmation',        body:'Hi {{first_name}}, Your refund of {{amount}} has been processed and will appear in your account within 3-5 business days.' },
]

const statusOptions = ['All', 'Open', 'In Progress', 'Awaiting Reply', 'Resolved']
const statusColor = (s: string): string => ({'Open': 'error', 'In Progress': 'warning', 'Awaiting Reply': 'info', 'Resolved': 'success'} as Record<string, string>)[s] ?? 'default'
const priorityColor = (p: string): string => ({'Urgent': 'error', 'High': 'warning', 'Normal': 'primary', 'Low': 'grey'} as Record<string, string>)[p] ?? 'default'

const filteredTickets = computed(() => {
  let t = store.tickets
  if (filterStatus.value !== 'All') t = t.filter(x => x.status === filterStatus.value)
  if (search.value) t = t.filter(x => x.subject.toLowerCase().includes(search.value.toLowerCase()) || x.customer.toLowerCase().includes(search.value.toLowerCase()))
  return t
})

const kanbanCols = [
  { status: 'Open', color: 'error' },
  { status: 'In Progress', color: 'warning' },
  { status: 'Awaiting Reply', color: 'info' },
  { status: 'Resolved', color: 'success' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function sendReply() {
  if (replyBody.value.trim() && activeTicket.value) {
    store.replyToTicket(activeTicket.value.id, replyBody.value.trim())
    replyBody.value = ''
  }
}
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <!-- Header -->
    <MpPageHeader
      title="Support Tickets"
      :subtitle="`Manage customer inquiries and support requests · ${store.tickets.filter(t=>t.status==='Open').length} open`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Service', disabled: true },
        { title: 'Support Tickets', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" @click="newTicketDrawer=true">New Ticket</v-btn>
      </template>
    </MpPageHeader>

    <!-- Filter chips -->
    <div class="d-flex align-center gap-2 overflow-x-auto hide-scrollbar">
      <v-btn-toggle v-model="filterStatus" density="comfortable" mandatory class="bg-transparent" selected-class="bg-blue-darken-3 text-white">
        <v-btn v-for="s in statusOptions" :key="s" :value="s" rounded="pill" variant="flat" size="small"
          class="text-none px-4 mr-2" :class="filterStatus === s ? '' : 'bg-grey-lighten-4 text-medium-emphasis border'">
          {{ s }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- Toolbar: Search + View Toggle -->
    <div class="d-flex align-center gap-3">
      <MpDataTableToolbar
        v-model:search="search"
        search-placeholder="Search tickets by ID, subject, or customer…"
        class="flex-grow-1 pa-0"
        style="min-height: unset;"
      />
      <v-btn-toggle v-model="tab" density="compact" variant="outlined" divided class="bg-surface border" rounded="lg" mandatory>
        <v-btn value="list" class="text-none" size="small">
          <v-icon size="16" class="mr-1">mdi-format-list-bulleted</v-icon> List
        </v-btn>
        <v-btn value="kanban" class="text-none" size="small">
          <v-icon size="16" class="mr-1">mdi-view-column</v-icon> Kanban
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- Main Workspace -->
    <div v-if="tab === 'list'" class="flex-grow-1 d-flex gap-4 overflow-hidden">
      <!-- Left: Ticket List -->
      <v-card variant="flat" border rounded="xl" class="overflow-hidden d-flex flex-column" style="width: 360px; min-width: 320px; flex-shrink: 0;">
        <!-- Ticket List -->
        <div class="flex-grow-1 overflow-y-auto">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="pa-4 cursor-pointer ticket-row border-b"
            :class="{ 'bg-primary-lighten-5': store.activeTicketId === ticket.id }"
            @click="store.setActive(ticket.id)"
          >
            <div class="d-flex align-start gap-3">
              <v-avatar :color="store.activeTicketId === ticket.id ? 'primary' : 'surface-variant'" variant="flat" size="36" class="mt-0.5 font-weight-bold text-caption flex-shrink-0">{{ ticket.avatar }}</v-avatar>
              <div class="flex-grow-1 min-width-0">
                <div class="d-flex justify-space-between align-start mb-1">
                  <span class="text-caption text-medium-emphasis">{{ ticket.number }}</span>
                  <span class="text-caption text-medium-emphasis">{{ timeAgo(ticket.updatedAt) }}</span>
                </div>
                <div class="text-body-2 font-weight-medium text-truncate mb-1">{{ ticket.subject }}</div>
                <div class="text-caption text-medium-emphasis mb-2">{{ ticket.customer }}</div>
                <div class="d-flex align-center gap-1 flex-wrap">
                  <v-chip :color="statusColor(ticket.status)" size="x-small" variant="flat" class="font-weight-medium">{{ ticket.status }}</v-chip>
                  <v-chip v-if="ticket.priority === 'Urgent' || ticket.priority === 'High'" :color="priorityColor(ticket.priority)" size="x-small" variant="flat">{{ ticket.priority }}</v-chip>
                  <v-chip v-for="tag in ticket.tags" :key="tag" size="x-small" variant="outlined" color="secondary">{{ tag }}</v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Right: Active Ticket Detail -->
      <v-card v-if="activeTicket" variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
        <!-- Ticket Header -->
        <div class="pa-5 border-b d-flex align-start justify-space-between">
          <div>
            <div class="d-flex align-center gap-2 mb-2">
              <span class="text-caption font-weight-bold text-medium-emphasis">{{ activeTicket.number }}</span>
              <v-chip :color="statusColor(activeTicket.status)" size="x-small" variant="flat" class="font-weight-medium">{{ activeTicket.status }}</v-chip>
              <v-chip :color="priorityColor(activeTicket.priority)" size="x-small" variant="tonal">{{ activeTicket.priority }}</v-chip>
              <v-chip size="x-small" variant="outlined" color="secondary">{{ activeTicket.category }}</v-chip>
            </div>
            <div class="text-h6 font-weight-bold">{{ activeTicket.subject }}</div>
          </div>
          <div class="d-flex gap-2 align-center">
            <v-tooltip text="Assign ticket" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-account-arrow-right" variant="text" size="small" color="medium-emphasis"></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Mark Resolved" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-check-circle-outline" variant="text" size="small" color="success"></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="More options" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" color="medium-emphasis"></v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>

        <!-- Customer Info Bar -->
        <div class="px-5 py-3 border-b bg-surface-variant d-flex align-center gap-4">
          <v-avatar color="primary" variant="tonal" size="36" class="font-weight-bold text-caption">{{ activeTicket.avatar }}</v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold">{{ activeTicket.customer }}</div>
            <div class="text-caption text-medium-emphasis">{{ activeTicket.customerEmail }}</div>
          </div>
          <v-spacer></v-spacer>
          <div class="text-right">
            <div class="text-caption text-medium-emphasis">Assignee</div>
            <div class="text-body-2 font-weight-medium">{{ activeTicket.assignee }}</div>
          </div>
        </div>

        <!-- Thread -->
        <div class="flex-grow-1 overflow-y-auto pa-6">
          <v-timeline side="end" density="compact" truncate-line="start" class="timeline-compact">
            <v-timeline-item
              v-for="(msg, idx) in activeTicket.thread"
              :key="idx"
              :dot-color="msg.role === 'agent' ? 'primary' : 'surface-variant'"
              size="small"
            >
              <template v-slot:icon>
                <span class="text-caption font-weight-bold" :style="msg.role === 'agent' ? 'color: white;' : ''">{{ msg.avatar }}</span>
              </template>
              <v-card :variant="msg.role === 'agent' ? 'tonal' : 'outlined'" :color="msg.role === 'agent' ? 'primary' : 'surface'" rounded="xl" class="pa-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-bold">{{ msg.author }}</span>
                  <span class="text-caption text-medium-emphasis">{{ msg.time }}</span>
                </div>
                <div class="text-body-2" style="line-height: 1.6;">{{ msg.body }}</div>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>

        <!-- Reply Box -->
        <div class="pa-4 border-t">
          <v-textarea
            v-model="replyBody"
            placeholder="Write a reply..."
            variant="outlined"
            density="comfortable"
            rows="3"
            hide-details
            class="mb-3"
            rounded="lg"
          ></v-textarea>
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex gap-2">
              <v-tooltip text="Attach file" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-paperclip" variant="text" size="small" color="medium-emphasis"></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Add emoji" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-emoticon-outline" variant="text" size="small" color="medium-emphasis"></v-btn>
                </template>
              </v-tooltip>
              <v-menu v-model="cannedMenu" location="top start">
                <template v-slot:activator="{ props }">
                  <v-tooltip text="Insert canned response" location="top">
                    <template v-slot:activator="{ props: tip }">
                      <v-btn v-bind="{...props,...tip}" icon="mdi-text-box-multiple-outline" variant="text" size="small" color="medium-emphasis"></v-btn>
                    </template>
                  </v-tooltip>
                </template>
                <v-list density="compact" rounded="xl" nav elevation="8" min-width="240">
                  <v-list-subheader>Canned Responses</v-list-subheader>
                  <v-list-item v-for="cr in cannedResponses" :key="cr.label" :title="cr.label" @click="replyBody+=cr.body;cannedMenu=false"></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="d-flex gap-2">
              <v-btn variant="outlined" class="text-none" color="warning" size="small">Close Ticket</v-btn>
              <v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-send" :disabled="!replyBody.trim()" @click="sendReply">Send Reply</v-btn>
            </div>
          </div>
        </div>
      </v-card>
      <v-card v-else variant="flat" border rounded="xl" class="flex-grow-1 d-flex align-center justify-center">
        <div class="text-center pa-8">
          <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-headset</v-icon>
          <div class="text-h6 font-weight-medium mb-2">Select a ticket</div>
          <div class="text-body-2 text-medium-emphasis">Choose a support ticket from the list to view its details and reply.</div>
        </div>
      </v-card>
    </div>

    <!-- KANBAN VIEW -->
    <div v-if="tab === 'kanban'" class="flex-grow-1 d-flex gap-4 overflow-x-auto pb-2">
      <div v-for="col in kanbanCols" :key="col.status" class="kanban-col d-flex flex-column" style="min-width: 280px; width: 280px;">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center gap-2">
            <v-chip :color="col.color" size="x-small" variant="flat" class="font-weight-bold">{{ store.tickets.filter(t => t.status === col.status).length }}</v-chip>
            <span class="text-subtitle-2 font-weight-bold">{{ col.status }}</span>
          </div>
          <v-tooltip :text="`Add to ${col.status}`" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-plus" variant="text" size="x-small" color="medium-emphasis"></v-btn>
            </template>
          </v-tooltip>
        </div>
        <div class="d-flex flex-column gap-2 overflow-y-auto flex-grow-1">
          <v-card
            v-for="ticket in store.tickets.filter(t => t.status === col.status)"
            :key="ticket.id"
            variant="flat"
            border
            rounded="xl"
            class="pa-4 cursor-pointer kanban-card"
            @click="store.setActive(ticket.id); tab = 'list'"
          >
            <div class="d-flex align-start justify-space-between mb-2">
              <span class="text-caption text-medium-emphasis">{{ ticket.number }}</span>
              <v-chip :color="priorityColor(ticket.priority)" size="x-small" variant="flat">{{ ticket.priority }}</v-chip>
            </div>
            <div class="text-body-2 font-weight-medium mb-2">{{ ticket.subject.substring(0, 60) }}{{ ticket.subject.length > 60 ? '...' : '' }}</div>
            <div class="d-flex align-center justify-space-between">
              <v-avatar color="primary" variant="tonal" size="24" class="text-caption font-weight-bold">{{ ticket.avatar }}</v-avatar>
              <span class="text-caption text-medium-emphasis">{{ timeAgo(ticket.updatedAt) }}</span>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>

  <!-- ── New Ticket Drawer ────────────────────────────────────── -->
  <v-navigation-drawer v-model="newTicketDrawer" location="right" temporary width="480" elevation="16">
    <div class="d-flex flex-column h-100">
      <div class="pa-5 border-b d-flex align-center justify-space-between">
        <div><div class="text-h6 font-weight-bold">Create New Ticket</div><div class="text-caption text-medium-emphasis">Log a support request on behalf of a customer</div></div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="newTicketDrawer=false"></v-btn>
      </div>
      <div class="pa-5 flex-grow-1 overflow-y-auto">
        <div class="text-subtitle-2 font-weight-bold mb-3 text-uppercase text-medium-emphasis">Customer</div>
        <v-text-field v-model="newTicket.customer" label="Customer Name *" variant="outlined" density="comfortable" class="mb-3" prepend-inner-icon="mdi-account-outline"></v-text-field>
        <v-text-field v-model="newTicket.email" label="Customer Email *" type="email" variant="outlined" density="comfortable" class="mb-5" prepend-inner-icon="mdi-email-outline"></v-text-field>

        <v-divider class="mb-5"></v-divider>
        <div class="text-subtitle-2 font-weight-bold mb-3 text-uppercase text-medium-emphasis">Ticket Details</div>
        <v-text-field v-model="newTicket.subject" label="Subject *" variant="outlined" density="comfortable" class="mb-3" placeholder="Brief description of the issue"></v-text-field>
        <v-row dense class="mb-3">
          <v-col cols="6">
            <v-select v-model="newTicket.category" label="Category" :items="['General','Order Issue','Billing','Technical','Returns & Refunds','Shipping']" variant="outlined" density="comfortable"></v-select>
          </v-col>
          <v-col cols="6">
            <v-select v-model="newTicket.priority" label="Priority"
              :items="[{title:'Urgent',value:'Urgent'},{title:'High',value:'High'},{title:'Normal',value:'Normal'},{title:'Low',value:'Low'}]"
              variant="outlined" density="comfortable">
              <template v-slot:selection="{ item }">
                <v-chip :color="priorityColor(item.value)" size="x-small" variant="flat">{{ item.title }}</v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-textarea v-model="newTicket.description" label="Description" variant="outlined" density="comfortable" rows="4" class="mb-3" placeholder="Describe the customer's issue in detail…"></v-textarea>
        <v-select v-model="newTicket.assignee" label="Assign To" :items="['Auto-assign','Sarah Connor (Admin)','Mike Zhang (Agent)','Priya Sharma (Agent)']" variant="outlined" density="comfortable" class="mb-3" prepend-inner-icon="mdi-account-arrow-right"></v-select>

        <v-card variant="outlined" rounded="xl" class="pa-3" style="border-style:dashed;">
          <div class="d-flex align-center gap-2 text-body-2 text-medium-emphasis cursor-pointer">
            <v-icon size="18">mdi-paperclip</v-icon>
            <span>Attach files or screenshots (optional)</span>
          </div>
        </v-card>
      </div>
      <div class="pa-5 border-t d-flex justify-space-between">
        <v-btn variant="text" class="text-none" @click="newTicketDrawer=false">Cancel</v-btn>
        <v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-plus" :disabled="!newTicket.customer||!newTicket.email||!newTicket.subject" @click="submitTicket">Create Ticket</v-btn>
      </div>
    </div>
  </v-navigation-drawer>

  <!-- Snackbar -->
  <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
    <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Ticket created and assigned</div>
  </v-snackbar>
</template>

<style scoped>
.mp-btn-dark {
  background: rgb(var(--v-theme-on-surface));
  color: rgb(var(--v-theme-surface));
}
.mp-btn-dark:hover {
  opacity: 0.88;
}
.gap-5 { gap: 20px; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.border { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.border-dashed { border-style: dashed !important; border-width: 2px !important; }
.ticket-row { transition: background 0.15s ease; }
.ticket-row:hover { background: rgba(var(--v-theme-primary), 0.04); }
.kanban-card { transition: transform 0.15s ease; }
.kanban-card:hover { transform: translateY(-2px); }
.min-width-0 { min-width: 0; }
.kanban-col { flex-shrink: 0; }
</style>
