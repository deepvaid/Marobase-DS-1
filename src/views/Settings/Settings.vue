<script setup lang="ts">
import { ref, computed } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'

const activeTab = ref('account')
const saveSnack = ref(false)
const addUserDialog = ref(false)
const newUserEmail = ref('')
const newUserRole = ref('Marketer')
const addDomainDialog = ref(false)
const addKeyDialog = ref(false)
const settingSearch = ref('')
const selectedSetting = ref<string | null>(null)

// ── Top-level horizontal tabs matching the real Maropost app ──────────────────
const topTabs = [
  { key: 'connections',  label: 'Connections',   icon: 'mdi-connection' },
  { key: 'dns',          label: 'DNS Setup',      icon: 'mdi-dns-outline' },
  { key: 'contacts',     label: 'Contacts',       icon: 'mdi-account-filter-outline' },
  { key: 'campaigns',    label: 'Campaigns',      icon: 'mdi-bullhorn-outline' },
  { key: 'store',        label: 'Store Setup',    icon: 'mdi-store-outline' },
  { key: 'service',      label: 'Service',        icon: 'mdi-headset' },
  { key: 'account',      label: 'Account',        icon: 'mdi-office-building-outline' },
]

// ── Icon cards per tab ────────────────────────────────────────────────────────
const settingCards: Record<string, { key: string; icon: string; color: string; label: string; desc: string }[]> = {
  connections: [
    { key: 'apikeys',      icon: 'mdi-key-variant',         color: 'warning',   label: 'API Keys',        desc: 'REST API credentials for integrations' },
    { key: 'webhooks',     icon: 'mdi-webhook',             color: 'secondary', label: 'HTTP Post URLs',  desc: 'Receive real-time event webhooks' },
    { key: 'integrations', icon: 'mdi-puzzle-outline',      color: 'primary',   label: 'Integrations',   desc: 'Shopify, Stripe, Zapier and more' },
  ],
  dns: [
    { key: 'domains',      icon: 'mdi-email-check-outline', color: 'success',   label: 'Sending Domains', desc: 'DKIM, SPF and DMARC verification' },
    { key: 'tracking',     icon: 'mdi-link-variant',        color: 'info',      label: 'Tracking Domains',desc: 'Click and open tracking domains' },
  ],
  contacts: [
    { key: 'contactsettings', icon: 'mdi-account-cog-outline',   color: 'primary',   label: 'Contact Settings',  desc: 'Suppression, deduplication, cleansing' },
    { key: 'notifications',   icon: 'mdi-bell-cog-outline',       color: 'warning',   label: 'Notifications',     desc: 'Email digests and alert preferences' },
  ],
  campaigns: [
    { key: 'campaignsettings', icon: 'mdi-email-cog-outline',    color: 'primary',   label: 'Campaign Defaults', desc: 'Sender, subject prefix, tracking' },
  ],
  store: [
    { key: 'billing',      icon: 'mdi-credit-card-outline', color: 'success',   label: 'Billing & Plan',  desc: 'Subscription, usage, invoices' },
  ],
  service: [
    { key: 'servicesettings', icon: 'mdi-headset',          color: 'primary',   label: 'Service Settings',desc: 'Helpdesk, SLA, reply templates' },
  ],
  account: [
    { key: 'accountdetails', icon: 'mdi-office-building-outline', color: 'primary',  label: 'Account & Company', desc: 'Name, locale, industry, address' },
    { key: 'billing',        icon: 'mdi-credit-card-outline',     color: 'success',  label: 'Billing & Plan',    desc: 'Plan, usage, payment method' },
    { key: 'users',          icon: 'mdi-account-multiple-outline',color: 'secondary',label: 'Users & Permissions',desc: 'Team members and module access' },
    { key: 'profile',        icon: 'mdi-account-circle-outline',  color: 'info',     label: 'My Profile',        desc: 'Personal info, password, timezone' },
  ],
}

const currentCards = computed(() => settingCards[activeTab.value] ?? [])

const filteredCards = computed(() => {
  const q = settingSearch.value.toLowerCase().trim()
  if (!q) return currentCards.value
  return currentCards.value.filter(c =>
    c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  )
})

function openSetting(key: string) {
  selectedSetting.value = key
}

// ── Data ──────────────────────────────────────────────────────────────────
const company = ref({
  accountId: '2000290', name: 'MMC-MSC-MCC Scooter Village', clientName: 'Deepak Vaidya',
  industry: 'E-Commerce', language: 'English (US)', website: 'https://scootervillage.com',
  address1: '123 Commerce St', address2: '', country: 'United States',
  state: 'New York', city: 'New York', zip: '10001',
  timezone: 'America/New_York', currency: 'USD', dateFormat: 'MM/DD/YYYY',
})

const teamUsers = ref([
  { id:1, name:'Deepak Vaidya', email:'deepak.v@maropost.com',  role:'Owner',         marketing:true,  service:true,  commerce:true,  status:'Active', avatar:'DV' },
  { id:2, name:'Sarah Connor',  email:'sarah@maropost.com',     role:'Admin',         marketing:true,  service:true,  commerce:false, status:'Active', avatar:'SC' },
  { id:3, name:'Mike Zhang',    email:'mike@maropost.com',      role:'Support Agent', marketing:false, service:true,  commerce:false, status:'Active', avatar:'MZ' },
  { id:4, name:'Priya Sharma',  email:'priya@maropost.com',     role:'Marketer',      marketing:true,  service:false, commerce:false, status:'Active', avatar:'PS' },
  { id:5, name:'Tom Brady',     email:'tom@maropost.com',       role:'Analyst',       marketing:true,  service:false, commerce:true,  status:'Invited',avatar:'TB' },
])

const sendingDomains = ref([
  { domain:'scootervillage.com',     status:'Verified', dkim:'Pass', spf:'Pass',    dmarc:'Pass',    isDefault:true  },
  { domain:'mail.scootervillage.io', status:'Pending',  dkim:'Fail', spf:'Pending', dmarc:'Pending', isDefault:false },
])

const trackingDomains = ref([
  { domain:'track.scootervillage.com', status:'Verified', ssl:true,  isDefault:true  },
  { domain:'click.scootervillage.io',  status:'Pending',  ssl:false, isDefault:false },
])

const apiKeys = ref([
  { id:1, label:'Production Key', user:'deepak.v@maropost.com', key:'mp_live_sk_••••••••••••••••••••••4xyz', created:'2024-01-15', lastUsed:'2026-03-07', status:'Active' },
  { id:2, label:'Dev / Staging',  user:'deepak.v@maropost.com', key:'mp_test_sk_••••••••••••••••••••••1abc', created:'2024-03-01', lastUsed:'2026-02-28', status:'Active' },
])

const webhooks = ref([
  { id:1, label:'Order Fulfilled Hook', url:'https://api.scootervillage.com/webhooks/order',   events:['Order Completed','Fulfillment Updated'], status:'Active' },
  { id:2, label:'New Contact Hook',     url:'https://api.scootervillage.com/webhooks/contact', events:['Contact Created'],                        status:'Active' },
])

const integrations = [
  { name:'Shopify',          icon:'mdi-shopping',       color:'success',   connected:true,  desc:'Sync orders, products & customers' },
  { name:'WooCommerce',      icon:'mdi-wordpress',      color:'purple',    connected:false, desc:'Connect your WooCommerce store' },
  { name:'Stripe',           icon:'mdi-credit-card',    color:'primary',   connected:true,  desc:'Payment and subscription data sync' },
  { name:'Zapier',           icon:'mdi-lightning-bolt', color:'warning',   connected:false, desc:'5000+ app integrations' },
  { name:'Google Analytics', icon:'mdi-google',         color:'error',     connected:true,  desc:'Campaign performance tracking' },
  { name:'Facebook Pixel',   icon:'mdi-facebook',       color:'info',      connected:false, desc:'Ad retargeting audience sync' },
  { name:'HubSpot CRM',      icon:'mdi-hub',            color:'error',     connected:false, desc:'Two-way CRM sync' },
  { name:'Salesforce',       icon:'mdi-cloud',          color:'primary',   connected:false, desc:'Enterprise CRM integration' },
  { name:'Neto',             icon:'mdi-store',          color:'success',   connected:false, desc:'Neto e-commerce platform sync' },
]

const notifications = ref({
  emailDigest:    { label:'Daily Email Digest',          desc:'Receive a daily summary of account activity', value:true },
  campaignSent:   { label:'Campaign Sent',               desc:'Confirm when a campaign has been successfully sent', value:true },
  bounceAlerts:   { label:'Bounce Rate Alerts',          desc:'Alert when bounce rate exceeds 5%', value:true },
  newTickets:     { label:'New Support Tickets',         desc:'Notify when a customer opens a new ticket', value:true },
  weeklyReport:   { label:'Weekly Performance Report',   desc:'Receive weekly analytics summary on Monday', value:true },
  productUpdates: { label:'Product Updates',             desc:'Be notified about new Maropost features', value:false },
})

const contactSettings = ref({
  globalSuppression: true,
  autoUnsubEmail:    true,
  cleansingRules:    true,
  dedupeOnImport:    true,
  geoTracking:       false,
})

const campaignSettings = ref({
  testSubjectLine:  'TEST - ',
  defaultFromName:  'Scooter Village',
  defaultReplyTo:   'hello@scootervillage.com',
  openTracking:     true,
  clickTracking:    true,
  unsubLink:        true,
})

const serviceSettings = ref({
  supportEmail: 'support@scootervillage.com',
  autoAssign:   true,
  slaHours:     24,
  ticketPrefix: 'TKT-',
})

const replyTemplates = ref([
  { id:1, name:'Thank you for reaching out', preview:'Hi {{first_name}}, Thank you for contacting us...' },
  { id:2, name:'Order tracking update',      preview:'Hi {{first_name}}, Your order {{order_id}} is...' },
])

function save() { saveSnack.value = true }
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <!-- Page Header + search -->
    <MpPageHeader
      title="Settings"
      subtitle="Manage your account, connections, and platform configuration."
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Settings', disabled: true },
      ]"
    >
      <template #actions>
        <div style="width: 260px;">
          <v-text-field v-model="settingSearch" prepend-inner-icon="mdi-magnify" placeholder="Search settings..." variant="outlined" density="compact" hide-details clearable rounded="lg" />
        </div>
      </template>
    </MpPageHeader>

    <!-- Horizontal Tab Bar (matches real Maropost) -->
    <v-tabs v-model="activeTab" color="primary" density="compact" class="mb-6" height="40" @update:model-value="selectedSetting = null">
      <v-tab v-for="tab in topTabs" :key="tab.key" :value="tab.key" class="text-none font-weight-medium px-4">
        <v-icon size="16" class="mr-1">{{ tab.icon }}</v-icon>
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <div class="flex-grow-1 overflow-y-auto">

      <!-- ── Icon Card Grid (per-tab overview) ───────────────────── -->
      <div v-if="!selectedSetting">
        <div v-if="filteredCards.length === 0" class="text-center py-12 text-medium-emphasis">
          <v-icon size="48" class="mb-3">mdi-magnify-close</v-icon>
          <div class="text-body-1">No settings match "{{ settingSearch }}"</div>
        </div>

        <v-row dense>
          <v-col v-for="card in filteredCards" :key="card.key" cols="12" sm="6" md="4">
            <v-card
              variant="flat"
              border
              rounded="xl"
              class="pa-5 settings-tile cursor-pointer h-100"
              @click="openSetting(card.key)"
            >
              <div class="d-flex align-start gap-4">
                <v-avatar :color="card.color" variant="tonal" size="48" rounded="lg">
                  <v-icon :color="card.color" size="24">{{ card.icon }}</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="font-weight-bold text-body-1 mb-1">{{ card.label }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ card.desc }}</div>
                </div>
                <v-icon color="medium-emphasis" size="18">mdi-chevron-right</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- ── Detail Panels (shown when a card is clicked) ────────── -->
      <div v-else>
        <!-- Back breadcrumb -->
        <div class="d-flex align-center gap-2 mb-5">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-arrow-left"
            class="text-none text-medium-emphasis"
            @click="selectedSetting = null"
          >Back to {{ topTabs.find(t => t.key === activeTab)?.label }}</v-btn>
        </div>

        <!-- Account & Company ─────────────────────────────────── -->
        <v-card v-if="selectedSetting==='accountdetails'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b">
            <div class="text-h6 font-weight-bold mb-1">Account & Company</div>
            <div class="text-body-2 text-medium-emphasis">Basic account details, locale, and contact address.</div>
          </div>
          <div class="pa-6">
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Account</div>
            <v-row dense class="mb-4">
              <v-col cols="12" sm="4"><v-text-field v-model="company.accountId" label="Account ID" variant="outlined" density="comfortable" readonly bg-color="surface-variant"></v-text-field></v-col>
              <v-col cols="12" sm="8"><v-text-field v-model="company.name" label="Account Name" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="company.clientName" label="Client / Contact Name" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-select v-model="company.industry" label="Industry" :items="['E-Commerce','SaaS','Retail','Media','Healthcare','Finance','Other']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="6"><v-select v-model="company.language" label="Language" :items="['English (US)','English (UK)','French','Spanish','German','Portuguese']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="company.website" label="Website URL" variant="outlined" density="comfortable" prepend-inner-icon="mdi-web"></v-text-field></v-col>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Locale</div>
            <v-row dense class="mb-4">
              <v-col cols="12" sm="4"><v-select v-model="company.timezone" label="Timezone" :items="['America/New_York','America/Chicago','America/Los_Angeles','UTC','Europe/London','Asia/Tokyo']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="4"><v-select v-model="company.currency" label="Currency" :items="['USD','EUR','GBP','CAD','AUD','JPY']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="4"><v-select v-model="company.dateFormat" label="Date Format" :items="['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD']" variant="outlined" density="comfortable"></v-select></v-col>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Address</div>
            <v-row dense>
              <v-col cols="12"><v-text-field v-model="company.address1" label="Address Line 1" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12"><v-text-field v-model="company.address2" label="Address Line 2 (optional)" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-select v-model="company.country" label="Country" :items="['United States','Canada','United Kingdom','Australia','India','Germany']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="company.state" label="State / Province" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="company.city" label="City" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="company.zip" label="Zip / Postal Code" variant="outlined" density="comfortable"></v-text-field></v-col>
            </v-row>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Changes</v-btn></div>
        </v-card>

        <!-- Billing ──────────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='billing'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Billing & Plan</div><div class="text-body-2 text-medium-emphasis">Manage your subscription, payment method, and invoices.</div></div>
          <div class="pa-6">
            <v-card variant="tonal" color="primary" rounded="xl" class="pa-5 mb-6">
              <div class="d-flex align-center justify-space-between flex-wrap gap-4">
                <div>
                  <v-chip color="white" variant="flat" size="small" class="font-weight-bold mb-2">MARKETING CLOUD ENTERPRISE</v-chip>
                  <div class="text-h5 font-weight-bold text-white mb-1">$1,499 / month</div>
                  <div class="text-body-2 text-white" style="opacity:.8">50M emails · Unlimited contacts · Priority support</div>
                </div>
                <div class="d-flex flex-column gap-2">
                  <v-btn variant="outlined" color="white" class="text-none" prepend-icon="mdi-arrow-up-circle">Upgrade Plan</v-btn>
                  <v-btn variant="text" color="white" class="text-none" size="small">View Usage Details</v-btn>
                </div>
              </div>
            </v-card>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Usage This Month</div>
            <v-row dense class="mb-6">
              <v-col v-for="u in [{label:'Emails Sent',used:'12.4M',limit:'50M',pct:25},{label:'Contacts',used:'128,430',limit:'Unlimited',pct:0},{label:'SMS Sent',used:'3,240',limit:'10,000',pct:32},{label:'Support Tickets',used:'847',limit:'Unlimited',pct:0}]" :key="u.label" cols="12" sm="6">
                <v-card variant="flat" border rounded="xl" class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-2"><span class="text-body-2 font-weight-medium">{{ u.label }}</span><span class="text-caption text-medium-emphasis">{{ u.used }} / {{ u.limit }}</span></div>
                  <v-progress-linear v-if="u.pct>0" :model-value="u.pct" color="primary" rounded height="6" bg-color="surface-variant"></v-progress-linear>
                  <div v-else class="text-caption text-success">Unlimited</div>
                </v-card>
              </v-col>
            </v-row>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Payment Method</div>
            <v-card variant="outlined" rounded="xl" class="pa-4 mb-6 d-flex align-center gap-4">
              <v-icon color="primary" size="32">mdi-credit-card</v-icon>
              <div><div class="font-weight-bold text-body-2">Visa ending in 4242</div><div class="text-caption text-medium-emphasis">Expires 12/2028</div></div>
              <v-spacer></v-spacer>
              <v-btn variant="outlined" size="small" color="primary" class="text-none">Change Card</v-btn>
            </v-card>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Recent Invoices</div>
            <v-table density="compact" class="rounded-xl border">
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th style="width:48px"></th></tr></thead>
              <tbody>
                <tr v-for="(inv,i) in [{date:'Mar 1, 2026',desc:'Enterprise Plan — March',amt:'$1,499'},{date:'Feb 1, 2026',desc:'Enterprise Plan — February',amt:'$1,499'},{date:'Jan 1, 2026',desc:'Enterprise Plan — January',amt:'$1,499'}]" :key="i">
                  <td class="text-body-2">{{ inv.date }}</td><td class="text-body-2">{{ inv.desc }}</td>
                  <td class="font-weight-bold text-body-2">{{ inv.amt }}</td>
                  <td><v-chip color="success" size="x-small" variant="flat">Paid</v-chip></td>
                  <td><v-btn icon="mdi-download" variant="text" size="small" color="primary"></v-btn></td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>

        <!-- Users & Permissions ────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='users'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b d-flex align-center justify-space-between">
            <div><div class="text-h6 font-weight-bold mb-1">Users & Permissions</div><div class="text-body-2 text-medium-emphasis">{{ teamUsers.length }} members · Manage access levels per module</div></div>
            <v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-account-plus" @click="addUserDialog=true">Invite User</v-btn>
          </div>
          <v-table density="comfortable">
            <thead><tr><th>User</th><th>Role</th><th class="text-center">Marketing</th><th class="text-center">Service</th><th class="text-center">Commerce</th><th>Status</th><th style="width:80px"></th></tr></thead>
            <tbody>
              <tr v-for="u in teamUsers" :key="u.id">
                <td>
                  <div class="d-flex align-center gap-3 py-2">
                    <v-avatar color="primary" variant="tonal" size="36" class="font-weight-bold text-caption">{{ u.avatar }}</v-avatar>
                    <div><div class="text-body-2 font-weight-medium">{{ u.name }}</div><div class="text-caption text-medium-emphasis">{{ u.email }}</div></div>
                  </div>
                </td>
                <td><v-chip size="x-small" variant="outlined" color="secondary">{{ u.role }}</v-chip></td>
                <td class="text-center"><v-icon :color="u.marketing?'success':'grey-lighten-2'" size="18">{{ u.marketing ? 'mdi-check-circle':'mdi-minus-circle' }}</v-icon></td>
                <td class="text-center"><v-icon :color="u.service?'success':'grey-lighten-2'" size="18">{{ u.service ? 'mdi-check-circle':'mdi-minus-circle' }}</v-icon></td>
                <td class="text-center"><v-icon :color="u.commerce?'success':'grey-lighten-2'" size="18">{{ u.commerce ? 'mdi-check-circle':'mdi-minus-circle' }}</v-icon></td>
                <td><v-chip :color="u.status==='Active'?'success':'warning'" size="x-small" variant="flat">{{ u.status }}</v-chip></td>
                <td>
                  <div class="d-flex">
                    <v-tooltip text="Edit" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small"></v-btn></template></v-tooltip>
                    <v-tooltip v-if="u.role!=='Owner'" text="Remove" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- My Profile ─────────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='profile'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">My Profile</div><div class="text-body-2 text-medium-emphasis">Update your personal info, timezone, and password.</div></div>
          <div class="pa-6">
            <div class="d-flex align-center gap-5 mb-6">
              <v-avatar color="primary" size="72" class="text-h5 font-weight-bold text-white">DV</v-avatar>
              <div>
                <v-btn variant="outlined" color="primary" class="text-none mb-1" prepend-icon="mdi-camera" size="small">Change Photo</v-btn>
                <div class="text-caption text-medium-emphasis">JPG or PNG. Max 2MB.</div>
              </div>
            </div>
            <v-row dense class="mb-2">
              <v-col cols="12" sm="6"><v-text-field label="First Name" model-value="Deepak" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field label="Last Name" model-value="Vaidya" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field label="Email" model-value="deepak.v@maropost.com" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field label="Phone" model-value="+1 (555) 000-0000" variant="outlined" density="comfortable" prepend-inner-icon="mdi-phone"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-select label="Timezone" model-value="America/New_York" :items="['America/New_York','UTC','Europe/London','Asia/Tokyo']" variant="outlined" density="comfortable"></v-select></v-col>
              <v-col cols="12" sm="6"><v-select label="Preferred Language" model-value="English (US)" :items="['English (US)','French','Spanish','German']" variant="outlined" density="comfortable"></v-select></v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Security</div>
            <v-row dense>
              <v-col cols="12" sm="4"><v-text-field label="Current Password" type="password" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="4"><v-text-field label="New Password" type="password" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="4"><v-text-field label="Confirm Password" type="password" variant="outlined" density="comfortable"></v-text-field></v-col>
            </v-row>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Profile</v-btn></div>
        </v-card>

        <!-- Sending Domains ────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='domains'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b d-flex align-center justify-space-between">
            <div><div class="text-h6 font-weight-bold mb-1">Sending Domains</div><div class="text-body-2 text-medium-emphasis">Verify domains for DKIM, SPF, and DMARC compliance.</div></div>
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" class="text-none" @click="addDomainDialog=true">Add Domain</v-btn>
          </div>
          <div class="pa-6">
            <v-card v-for="d in sendingDomains" :key="d.domain" variant="flat" border rounded="xl" class="pa-5 mb-4">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center gap-3">
                  <v-icon color="primary" size="20">mdi-email-outline</v-icon>
                  <span class="font-weight-bold text-body-1">{{ d.domain }}</span>
                  <v-chip v-if="d.isDefault" size="x-small" variant="tonal" color="primary">Default</v-chip>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="d.status==='Verified'?'success':'warning'" size="small" variant="flat">{{ d.status }}</v-chip>
                  <v-tooltip text="View DNS records" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-dns" variant="text" size="small"></v-btn></template></v-tooltip>
                  <v-tooltip text="Remove domain" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                </div>
              </div>
              <div class="d-flex gap-6">
                <div v-for="(val, key) in { DKIM: d.dkim, SPF: d.spf, DMARC: d.dmarc }" :key="key">
                  <div class="text-caption text-medium-emphasis font-weight-bold mb-1">{{ key }}</div>
                  <v-chip :color="val==='Pass'?'success':val==='Pending'?'warning':'error'" size="x-small" variant="flat" :prepend-icon="val==='Pass'?'mdi-check':'mdi-clock-outline'">{{ val }}</v-chip>
                </div>
              </div>
            </v-card>
            <v-alert type="info" variant="tonal" density="compact" rounded="xl" class="text-body-2">
              <strong>DNS propagation</strong> can take up to 48 hours after adding records to your DNS provider.
            </v-alert>
          </div>
        </v-card>

        <!-- Tracking Domains ───────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='tracking'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b d-flex align-center justify-space-between">
            <div><div class="text-h6 font-weight-bold mb-1">Link Tracking Domains</div><div class="text-body-2 text-medium-emphasis">Custom subdomains for click and open tracking links.</div></div>
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" class="text-none">Add Tracking Domain</v-btn>
          </div>
          <div class="pa-6">
            <v-card v-for="d in trackingDomains" :key="d.domain" variant="flat" border rounded="xl" class="pa-5 mb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <v-icon color="secondary" size="20">mdi-link-variant</v-icon>
                  <span class="font-weight-bold text-body-1">{{ d.domain }}</span>
                  <v-chip v-if="d.isDefault" size="x-small" color="primary" variant="tonal">Default</v-chip>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-chip :color="d.ssl?'success':'warning'" size="x-small" variant="flat" prepend-icon="mdi-lock">{{ d.ssl ? 'SSL Active' : 'SSL Pending' }}</v-chip>
                  <v-chip :color="d.status==='Verified'?'success':'warning'" size="small" variant="flat">{{ d.status }}</v-chip>
                  <v-tooltip text="Remove" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                </div>
              </div>
            </v-card>
          </div>
        </v-card>

        <!-- API Keys ───────────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='apikeys'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b d-flex align-center justify-space-between">
            <div><div class="text-h6 font-weight-bold mb-1">API Keys</div><div class="text-body-2 text-medium-emphasis">Manage REST API access for integrations and custom apps.</div></div>
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" class="text-none" @click="addKeyDialog=true">Generate Key</v-btn>
          </div>
          <div class="pa-6">
            <v-alert type="warning" variant="tonal" density="compact" rounded="xl" class="text-body-2 mb-5">Keep your API keys secret. Never share them or commit them to source control.</v-alert>
            <v-card v-for="k in apiKeys" :key="k.id" variant="flat" border rounded="xl" class="pa-5 mb-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <div><div class="font-weight-bold text-body-1">{{ k.label }}</div><div class="text-caption text-medium-emphasis">User: {{ k.user }}</div></div>
                <div class="d-flex align-center gap-2">
                  <v-chip color="success" size="x-small" variant="flat">{{ k.status }}</v-chip>
                  <v-tooltip text="Copy key" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-content-copy" variant="text" size="small" color="primary"></v-btn></template></v-tooltip>
                  <v-tooltip text="Revoke key" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                </div>
              </div>
              <code class="text-caption pa-3 rounded-lg d-block mb-2" style="background:rgba(var(--v-theme-surface-variant),1);font-family:monospace;">{{ k.key }}</code>
              <div class="text-caption text-medium-emphasis">Created: {{ k.created }} &nbsp;·&nbsp; Last used: {{ k.lastUsed }}</div>
            </v-card>
          </div>
        </v-card>

        <!-- HTTP Post URLs / Webhooks ──────────────────────────── -->
        <v-card v-else-if="selectedSetting==='webhooks'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b d-flex align-center justify-space-between">
            <div><div class="text-h6 font-weight-bold mb-1">HTTP Post URLs (Webhooks)</div><div class="text-body-2 text-medium-emphasis">Configure endpoints to receive real-time event notifications.</div></div>
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" class="text-none">Add Webhook</v-btn>
          </div>
          <div class="pa-6">
            <v-card v-for="w in webhooks" :key="w.id" variant="flat" border rounded="xl" class="pa-5 mb-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="font-weight-bold text-body-1">{{ w.label }}</div>
                <div class="d-flex align-center gap-2">
                  <v-chip color="success" size="x-small" variant="flat">{{ w.status }}</v-chip>
                  <v-tooltip text="Test endpoint" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-play-circle-outline" variant="text" size="small" color="primary"></v-btn></template></v-tooltip>
                  <v-tooltip text="Edit" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small"></v-btn></template></v-tooltip>
                  <v-tooltip text="Delete" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                </div>
              </div>
              <code class="text-caption pa-3 rounded-lg d-block mb-3" style="background:rgba(var(--v-theme-surface-variant),1);">{{ w.url }}</code>
              <div class="d-flex gap-2 flex-wrap">
                <v-chip v-for="ev in w.events" :key="ev" size="x-small" variant="tonal" color="secondary">{{ ev }}</v-chip>
              </div>
            </v-card>
          </div>
        </v-card>

        <!-- Integrations ───────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='integrations'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Integrations</div><div class="text-body-2 text-medium-emphasis">Connect your favourite tools and platforms.</div></div>
          <v-row class="pa-6" dense>
            <v-col v-for="intg in integrations" :key="intg.name" cols="12" sm="6" md="4">
              <v-card variant="flat" border rounded="xl" class="pa-4 h-100 d-flex flex-column">
                <div class="d-flex align-start justify-space-between mb-3">
                  <v-icon :color="intg.color" size="32">{{ intg.icon }}</v-icon>
                  <v-chip :color="intg.connected?'success':'grey'" size="x-small" variant="flat">{{ intg.connected ? 'Connected' : 'Not Connected' }}</v-chip>
                </div>
                <div class="font-weight-bold text-body-1 mb-1">{{ intg.name }}</div>
                <div class="text-caption text-medium-emphasis mb-4 flex-grow-1">{{ intg.desc }}</div>
                <v-btn :color="intg.connected?'error':'primary'" :variant="intg.connected?'outlined':'elevated'" size="small" block class="text-none">{{ intg.connected ? 'Disconnect' : 'Connect' }}</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Contact Settings ───────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='contactsettings'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Contact Settings</div><div class="text-body-2 text-medium-emphasis">Global suppression, deduplication, and cleansing rules.</div></div>
          <div class="pa-6">
            <div class="d-flex flex-column gap-3">
              <v-card v-for="(val, key) in {globalSuppression:{label:'Global Suppression List',desc:'Prevent unsubscribed contacts from being re-added',val:contactSettings.globalSuppression},autoUnsubEmail:{label:'Auto-Unsubscribe on Bounce',desc:'Automatically suppress hard-bounced email addresses',val:contactSettings.autoUnsubEmail},cleansingRules:{label:'Data Cleansing Rules',desc:'Sanitise imported contact data on upload',val:contactSettings.cleansingRules},dedupeOnImport:{label:'Deduplicate on Import',desc:'Merge duplicate contacts by email on every import',val:contactSettings.dedupeOnImport},geoTracking:{label:'Geo-Location Tracking',desc:'Record contact location from campaign open events',val:contactSettings.geoTracking}}" :key="key" variant="flat" border rounded="xl" class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div><div class="text-body-2 font-weight-bold">{{ val.label }}</div><div class="text-caption text-medium-emphasis">{{ val.desc }}</div></div>
                  <v-switch :model-value="val.val" color="primary" hide-details density="compact" inset></v-switch>
                </div>
              </v-card>
            </div>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Settings</v-btn></div>
        </v-card>

        <!-- Campaign Settings ──────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='campaignsettings'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Campaign Defaults</div><div class="text-body-2 text-medium-emphasis">Default sending configuration and tracking preferences.</div></div>
          <div class="pa-6">
            <v-row dense class="mb-4">
              <v-col cols="12" sm="6"><v-text-field v-model="campaignSettings.defaultFromName" label="Default From Name" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="campaignSettings.defaultReplyTo" label="Default Reply-To Email" variant="outlined" density="comfortable"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="campaignSettings.testSubjectLine" label="Test Subject Prefix" variant="outlined" density="comfortable" placeholder="TEST - "></v-text-field></v-col>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Tracking</div>
            <div class="d-flex flex-column gap-3">
              <v-card v-for="(val, key) in {openTracking:{label:'Open Tracking',desc:'Insert tracking pixel to record email opens',val:campaignSettings.openTracking},clickTracking:{label:'Click Tracking',desc:'Rewrite links to track clicks through Maropost',val:campaignSettings.clickTracking},unsubLink:{label:'Unsubscribe Link Required',desc:'Always append unsubscribe footer to campaigns',val:campaignSettings.unsubLink}}" :key="key" variant="flat" border rounded="xl" class="pa-4">
                <div class="d-flex align-center justify-space-between"><div><div class="text-body-2 font-weight-bold">{{ val.label }}</div><div class="text-caption text-medium-emphasis">{{ val.desc }}</div></div><v-switch :model-value="val.val" color="primary" hide-details density="compact" inset></v-switch></div>
              </v-card>
            </div>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Settings</v-btn></div>
        </v-card>

        <!-- Notifications ──────────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='notifications'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Notification Preferences</div><div class="text-body-2 text-medium-emphasis">Control which notifications you receive by email.</div></div>
          <div class="pa-6">
            <div class="d-flex flex-column gap-3">
              <v-card v-for="(item, key) in notifications" :key="key" variant="flat" border rounded="xl" class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div><div class="text-body-2 font-weight-bold">{{ item.label }}</div><div class="text-caption text-medium-emphasis">{{ item.desc }}</div></div>
                  <v-switch v-model="notifications[key as keyof typeof notifications].value" color="primary" hide-details density="compact" inset></v-switch>
                </div>
              </v-card>
            </div>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Preferences</v-btn></div>
        </v-card>

        <!-- Service Settings ───────────────────────────────────── -->
        <v-card v-else-if="selectedSetting==='servicesettings'" variant="flat" border rounded="xl">
          <div class="pa-6 border-b"><div class="text-h6 font-weight-bold mb-1">Service Settings</div><div class="text-body-2 text-medium-emphasis">Configure helpdesk, support email, SLA, and reply templates.</div></div>
          <div class="pa-6">
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Support Channel</div>
            <v-row dense class="mb-4">
              <v-col cols="12" sm="6"><v-text-field v-model="serviceSettings.supportEmail" label="Support Email Address" variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline"></v-text-field></v-col>
              <v-col cols="12" sm="3"><v-text-field v-model="serviceSettings.ticketPrefix" label="Ticket ID Prefix" variant="outlined" density="comfortable" placeholder="TKT-"></v-text-field></v-col>
              <v-col cols="12" sm="3"><v-text-field v-model.number="serviceSettings.slaHours" label="Default SLA (hours)" variant="outlined" density="comfortable" type="number"></v-text-field></v-col>
            </v-row>
            <v-card variant="flat" border rounded="xl" class="pa-4 mb-5">
              <div class="d-flex align-center justify-space-between"><div><div class="text-body-2 font-weight-bold">Auto-Assign Tickets</div><div class="text-caption text-medium-emphasis">Automatically assign new tickets to available agents</div></div><v-switch v-model="serviceSettings.autoAssign" color="primary" hide-details density="compact" inset></v-switch></div>
            </v-card>
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis">Reply Templates</div>
              <v-btn size="small" variant="outlined" prepend-icon="mdi-plus" class="text-none">Add Template</v-btn>
            </div>
            <v-card v-for="t in replyTemplates" :key="t.id" variant="flat" border rounded="xl" class="pa-4 mb-3">
              <div class="d-flex align-center justify-space-between">
                <div><div class="text-body-2 font-weight-bold">{{ t.name }}</div><div class="text-caption text-medium-emphasis text-truncate" style="max-width:420px;">{{ t.preview }}</div></div>
                <div class="d-flex gap-1">
                  <v-tooltip text="Edit" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small"></v-btn></template></v-tooltip>
                  <v-tooltip text="Delete" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
                </div>
              </div>
            </v-card>
          </div>
          <div class="pa-5 border-t d-flex justify-end"><v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-content-save" @click="save">Save Settings</v-btn></div>
        </v-card>

      </div><!-- /detail panels -->
    </div><!-- /scroll container -->

    <!-- Invite User Dialog -->
    <v-dialog v-model="addUserDialog" max-width="460" rounded="xl">
      <v-card rounded="xl">
        <div class="pa-5 border-b d-flex align-center justify-space-between">
          <div class="text-h6 font-weight-bold">Invite Team Member</div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="addUserDialog=false"></v-btn>
        </div>
        <div class="pa-5">
          <v-text-field v-model="newUserEmail" label="Email Address" type="email" variant="outlined" density="comfortable" class="mb-3" placeholder="colleague@company.com"></v-text-field>
          <v-select v-model="newUserRole" label="Role" :items="['Admin','Marketer','Support Agent','Analyst','Viewer']" variant="outlined" density="comfortable" class="mb-3"></v-select>
          <div class="text-subtitle-2 font-weight-bold mb-2">Module Access</div>
          <div class="d-flex gap-4 mb-3">
            <v-checkbox label="Marketing" color="primary" density="compact" hide-details></v-checkbox>
            <v-checkbox label="Service" color="primary" density="compact" hide-details></v-checkbox>
            <v-checkbox label="Commerce" color="primary" density="compact" hide-details></v-checkbox>
          </div>
          <v-alert type="info" variant="tonal" density="compact" rounded="lg" class="text-body-2">The invitee will receive a sign-up link. Access is granted after they accept.</v-alert>
        </div>
        <div class="pa-5 border-t d-flex justify-end gap-3">
          <v-btn variant="text" class="text-none" @click="addUserDialog=false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" class="text-none" prepend-icon="mdi-email-send" :disabled="!newUserEmail">Send Invitation</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Save snackbar -->
    <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
      <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Settings saved successfully</div>
    </v-snackbar>
  </div>
</template>

<style scoped>
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
</style>
