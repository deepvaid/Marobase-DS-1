<script setup lang="ts">
import { ref } from 'vue'
import { useDaVinciStore } from '@/stores/useDaVinci'
import MpPageHeader from '@/components/MpPageHeader.vue'

const daVinci = useDaVinciStore()

const store = ref({
  name: 'MMC-MSC-MCC Scooter Village',
  url: 'scootervillage.maropost.store',
  description: 'Your one-stop shop for premium electric scooters, accessories, and gear. We carry top brands and offer expert advice for every rider.',
  currency: 'AUD',
  timezone: 'Australia/Sydney',
  logo: '',
  contactEmail: 'support@scootervillage.com.au',
  contactPhone: '+61 2 9876 5432',
  address: '42 Harbour Street, Sydney NSW 2000, Australia',
  guestCheckout: true,
  orderNotes: true,
  autoFulfill: false,
  inventoryTracking: true,
  lowStockThreshold: 5,
  emailNotifications: true,
  smsNotifications: false,
})

const dvGenerating = ref(false)

function generateDescription() {
  dvGenerating.value = true
  setTimeout(() => {
    store.value.description = 'Discover the future of urban mobility at Scooter Village — Australia\'s #1 destination for premium electric scooters, e-bikes, and riding gear. From commuter-friendly models to high-performance rides, we curate only top-rated brands with expert reviews and unbeatable after-sales support. Free shipping Australia-wide on orders over $200.'
    dvGenerating.value = false
  }, 1800)
}

function askDaVinciStore() {
  daVinci.openWithQuery('Help me optimize my store settings for better conversion rates')
}

const saveSnack = ref(false)
function saveSettings() {
  saveSnack.value = true
}
</script>

<template>
  <div>
    <MpPageHeader
      title="Store Settings"
      subtitle="MMC-MSC-MCC Scooter Village · Online Storefront"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Commerce', to: '/commerce/orders' },
        { title: 'Store Settings', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="purple" variant="tonal" size="small" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" @click="askDaVinciStore">Ask Da Vinci</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" class="text-none" @click="saveSettings">Save Changes</v-btn>
      </template>
    </MpPageHeader>

    <v-row>
      <!-- Left Column: Store Info + Contact -->
      <v-col cols="12" lg="8">
        <!-- Store Information -->
        <v-card variant="flat" border rounded="xl" class="mb-5">
          <div class="pa-5 border-b">
            <div class="text-h6 font-weight-medium">Store Information</div>
            <div class="text-caption text-medium-emphasis">Basic details about your online store.</div>
          </div>
          <div class="pa-5">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="store.name" label="Store Name" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="store.url" label="Store URL" variant="outlined" density="comfortable" prefix="https://" readonly>
                  <template #append-inner>
                    <v-chip size="x-small" color="success" variant="flat">Live</v-chip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="store.description"
                  label="Store Description"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  counter="500"
                  :loading="dvGenerating"
                >
                  <template #append-inner>
                    <v-tooltip text="Generate with Da Vinci" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          variant="text"
                          size="small"
                          color="purple"
                          :loading="dvGenerating"
                          @click="generateDescription"
                        >
                          <v-icon>mdi-auto-fix</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>
                </v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="store.currency" label="Currency" :items="['AUD','USD','EUR','GBP','INR','CAD']" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="store.timezone" label="Timezone" :items="['Australia/Sydney','America/New_York','America/Los_Angeles','Europe/London','Asia/Kolkata']" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>
          </div>
        </v-card>

        <!-- Contact Information -->
        <v-card variant="flat" border rounded="xl" class="mb-5">
          <div class="pa-5 border-b">
            <div class="text-h6 font-weight-medium">Contact Information</div>
            <div class="text-caption text-medium-emphasis">Displayed to customers for support queries.</div>
          </div>
          <div class="pa-5">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="store.contactEmail" label="Support Email" variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="store.contactPhone" label="Phone Number" variant="outlined" density="comfortable" prepend-inner-icon="mdi-phone-outline" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="store.address" label="Business Address" variant="outlined" density="comfortable" rows="2" prepend-inner-icon="mdi-map-marker-outline" />
              </v-col>
            </v-row>
          </div>
        </v-card>

        <!-- Checkout Settings -->
        <v-card variant="flat" border rounded="xl">
          <div class="pa-5 border-b">
            <div class="text-h6 font-weight-medium">Checkout & Orders</div>
            <div class="text-caption text-medium-emphasis">Configure how customers place and complete orders.</div>
          </div>
          <div class="pa-5">
            <div class="d-flex flex-column gap-3">
              <v-card variant="flat" border rounded="xl" class="pa-4" v-for="toggle in [
                { model: 'guestCheckout', title: 'Guest Checkout', desc: 'Allow customers to purchase without creating an account', icon: 'mdi-account-off-outline' },
                { model: 'orderNotes', title: 'Order Notes', desc: 'Let customers add special instructions during checkout', icon: 'mdi-note-text-outline' },
                { model: 'autoFulfill', title: 'Auto-Fulfill Digital Products', desc: 'Automatically mark digital product orders as fulfilled', icon: 'mdi-package-check' },
              ]" :key="toggle.model">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-3">
                    <v-avatar color="primary" variant="tonal" size="40">
                      <v-icon size="20">{{ toggle.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ toggle.title }}</div>
                      <div class="text-caption text-medium-emphasis">{{ toggle.desc }}</div>
                    </div>
                  </div>
                  <v-switch v-model="(store as any)[toggle.model]" color="primary" hide-details density="compact" inset />
                </div>
              </v-card>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right Column: Store Preview + Inventory -->
      <v-col cols="12" lg="4">
        <!-- Store Preview Card -->
        <v-card variant="flat" border rounded="xl" class="mb-5">
          <div class="pa-5 border-b">
            <div class="text-subtitle-1 font-weight-medium">Store Preview</div>
          </div>
          <div class="pa-5 text-center">
            <v-avatar color="primary" size="80" class="mb-3" style="font-size: 28px; font-weight: 700;">SV</v-avatar>
            <h3 class="text-h6 font-weight-bold mb-1">{{ store.name }}</h3>
            <div class="text-caption text-medium-emphasis mb-3">{{ store.url }}</div>
            <v-chip color="success" variant="tonal" size="small" prepend-icon="mdi-check-circle" class="mb-3">Published</v-chip>
            <div class="text-body-2 text-medium-emphasis px-2" style="line-height: 1.6;">{{ store.description.substring(0, 120) }}...</div>
          </div>
          <div class="pa-4 border-t d-flex gap-2">
            <v-btn variant="outlined" size="small" class="text-none flex-grow-1" prepend-icon="mdi-open-in-new" href="https://scootervillage.maropost.store" target="_blank">Visit Store</v-btn>
            <v-btn variant="outlined" size="small" class="text-none flex-grow-1" prepend-icon="mdi-palette-outline" to="/commerce/stores/themes">Themes</v-btn>
          </div>
        </v-card>

        <!-- Inventory Settings -->
        <v-card variant="flat" border rounded="xl" class="mb-5">
          <div class="pa-5 border-b">
            <div class="text-subtitle-1 font-weight-medium">Inventory Alerts</div>
          </div>
          <div class="pa-5">
            <v-card variant="flat" border rounded="xl" class="pa-4 mb-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-body-2 font-weight-medium">Track inventory</div>
                  <div class="text-caption text-medium-emphasis">Manage stock levels across products</div>
                </div>
                <v-switch v-model="store.inventoryTracking" color="primary" hide-details density="compact" inset />
              </div>
            </v-card>
            <v-text-field v-model.number="store.lowStockThreshold" label="Low stock threshold" variant="outlined" density="comfortable" type="number" suffix="units" hint="Alert when product falls below this level" persistent-hint />
          </div>
        </v-card>

        <!-- Notifications Card -->
        <v-card variant="flat" border rounded="xl">
          <div class="pa-5 border-b">
            <div class="text-subtitle-1 font-weight-medium">Notifications</div>
          </div>
          <div class="pa-5">
            <v-card variant="flat" border rounded="xl" class="pa-4 mb-3">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-2">
                  <v-icon size="18" color="primary">mdi-email-outline</v-icon>
                  <span class="text-body-2 font-weight-medium">Email notifications</span>
                </div>
                <v-switch v-model="store.emailNotifications" color="primary" hide-details density="compact" inset />
              </div>
            </v-card>
            <v-card variant="flat" border rounded="xl" class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-2">
                  <v-icon size="18" color="secondary">mdi-message-text-outline</v-icon>
                  <span class="text-body-2 font-weight-medium">SMS notifications</span>
                </div>
                <v-switch v-model="store.smsNotifications" color="primary" hide-details density="compact" inset />
              </div>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
      <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Store settings saved successfully</div>
    </v-snackbar>
  </div>
</template>
