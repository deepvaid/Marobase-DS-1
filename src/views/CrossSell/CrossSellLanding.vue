<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productMeta, type ProductId } from '@/stores/useAccount'
import MpKpiCard from '@/components/MpKpiCard.vue'

const route = useRoute()
const router = useRouter()

const product = computed(() => route.params.product as ProductId)
const meta = computed(() => productMeta(product.value))

if (!meta.value) {
  router.replace('/dashboard')
}

interface ProductContent {
  subtitle: string
  icon: string
  color: string
  kpis: { label: string; value: string; icon: string }[]
  capabilities: { icon: string; title: string; description: string }[]
}

const CONTENT: Partial<Record<ProductId, ProductContent>> = {
  commerce: {
    subtitle: 'Everything you need to run and grow an online store — orders, fulfillment, storefronts, and more.',
    icon: 'mdi-cart-outline',
    color: 'primary',
    kpis: [
      { label: 'Storefronts', value: '3', icon: 'mdi-storefront-outline' },
      { label: 'Products', value: '1,240', icon: 'mdi-package-variant' },
      { label: 'Markets', value: '12', icon: 'mdi-earth' },
      { label: 'Orders Today', value: '48', icon: 'mdi-receipt' },
    ],
    capabilities: [
      { icon: 'mdi-receipt-text-outline', title: 'Order Management', description: 'Manage sales, draft orders, and fulfillments from a single interface.' },
      { icon: 'mdi-store-outline', title: 'Multi-Storefront', description: 'Run multiple branded storefronts with shared inventory and catalog.' },
      { icon: 'mdi-tag-outline', title: 'Promos & Coupons', description: 'Create discount rules, coupon codes, and seasonal promotions at scale.' },
    ],
  },
  retail: {
    subtitle: 'Unify your online and physical retail operations with a single platform.',
    icon: 'mdi-storefront-outline',
    color: 'secondary',
    kpis: [
      { label: 'Locations', value: '5', icon: 'mdi-map-marker-outline' },
      { label: 'POS Terminals', value: '12', icon: 'mdi-point-of-sale' },
      { label: 'Staff', value: '34', icon: 'mdi-account-group-outline' },
      { label: 'In-store Orders', value: '120', icon: 'mdi-shopping-outline' },
    ],
    capabilities: [
      { icon: 'mdi-point-of-sale', title: 'Point of Sale', description: 'Accept payments in-store with a native POS that syncs with your online catalog.' },
      { icon: 'mdi-warehouse', title: 'In-Store Inventory', description: 'Track stock per location with real-time adjustments and low-stock alerts.' },
      { icon: 'mdi-account-tie-outline', title: 'Staff Management', description: 'Assign roles, track shifts, and measure team performance across all locations.' },
    ],
  },
  products: {
    subtitle: 'Centralise your catalog, inventory, and AI-powered product recommendations.',
    icon: 'mdi-package-variant',
    color: 'teal',
    kpis: [
      { label: 'Products', value: '2,400', icon: 'mdi-package-variant' },
      { label: 'Collections', value: '38', icon: 'mdi-folder-multiple-outline' },
      { label: 'Inventory Items', value: '8,912', icon: 'mdi-warehouse' },
      { label: 'Recommendations', value: '6', icon: 'mdi-robot-outline' },
    ],
    capabilities: [
      { icon: 'mdi-robot-outline', title: 'AI Recommendations', description: 'Personalise product suggestions based on purchase history and browsing.' },
      { icon: 'mdi-folder-multiple-outline', title: 'Collections', description: 'Group products into curated collections for merchandising and marketing.' },
      { icon: 'mdi-tag-multiple-outline', title: 'Tax Categories', description: 'Assign tax rules per product type across all your selling regions.' },
    ],
  },
  service: {
    subtitle: 'Resolve customer issues faster with full contact context and AI-assisted replies.',
    icon: 'mdi-headset',
    color: 'orange',
    kpis: [
      { label: 'Open Tickets', value: '42', icon: 'mdi-ticket-outline' },
      { label: 'Avg. Resolution', value: '3.2h', icon: 'mdi-clock-outline' },
      { label: 'CSAT Score', value: '94%', icon: 'mdi-emoticon-happy-outline' },
      { label: 'Agents', value: '8', icon: 'mdi-account-outline' },
    ],
    capabilities: [
      { icon: 'mdi-ticket-outline', title: 'Unified Inbox', description: 'Manage email, chat, and social tickets from one workspace.' },
      { icon: 'mdi-account-details-outline', title: 'Customer Context', description: 'See order history, contact data, and past tickets alongside every conversation.' },
      { icon: 'mdi-robot-outline', title: 'AI-Assisted Replies', description: 'Da Vinci drafts responses based on your knowledge base and past resolutions.' },
    ],
  },
  cdp_advanced: {
    subtitle: 'Unlock advanced audience tools — lists, custom fields, SQL queries, and web tracking.',
    icon: 'mdi-account-group-outline',
    color: 'deep-purple',
    kpis: [
      { label: 'Lists', value: '24', icon: 'mdi-format-list-bulleted' },
      { label: 'Custom Fields', value: '60', icon: 'mdi-table-column' },
      { label: 'SQL Queries', value: '8', icon: 'mdi-database-search' },
      { label: 'Tracked Domains', value: '3', icon: 'mdi-web' },
    ],
    capabilities: [
      { icon: 'mdi-format-list-bulleted', title: 'Contact Lists & Tags', description: 'Create segmented lists and tag contacts for precise audience targeting.' },
      { icon: 'mdi-database-search', title: 'SQL Queries', description: 'Write raw SQL against your contact database for maximum flexibility.' },
      { icon: 'mdi-web', title: 'Web Tracking', description: 'Track visitor behaviour on your site and sync it back to contact profiles.' },
    ],
  },
}

const content = computed<ProductContent | undefined>(() => product.value ? CONTENT[product.value] : undefined)
</script>

<template>
  <div v-if="meta" class="cross-sell-page">
    <!-- Hero card -->
    <v-card flat border rounded="xl" class="cross-sell-hero pa-8 mb-6">
      <div class="d-flex flex-column align-center text-center" style="max-width: 600px; margin: 0 auto;">
        <v-chip
          :color="content?.color ?? 'primary'"
          variant="tonal"
          size="small"
          class="mb-4 text-uppercase font-weight-bold cross-sell-badge"
        >
          {{ meta.label }}
        </v-chip>

        <v-icon
          :icon="content?.icon ?? 'mdi-lock-outline'"
          :color="content?.color ?? 'primary'"
          size="48"
          class="mb-4"
        />

        <h2 class="text-h5 font-weight-bold mb-3">{{ meta.tagline }}</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ content?.subtitle }}</p>

        <div class="d-flex gap-3">
          <v-btn :color="content?.color ?? 'primary'" size="large" rounded="lg" prepend-icon="mdi-phone-outline">
            Talk to Sales
          </v-btn>
          <v-btn variant="outlined" size="large" rounded="lg" prepend-icon="mdi-information-outline">
            Learn more
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- KPI strip -->
    <v-row v-if="content?.kpis" class="mb-6">
      <v-col v-for="kpi in content.kpis" :key="kpi.label" cols="12" sm="6" md="3">
        <MpKpiCard
          :label="kpi.label"
          :value="kpi.value"
          :icon="kpi.icon"
          :color="content.color"
        />
      </v-col>
    </v-row>

    <!-- Key capabilities -->
    <div v-if="content?.capabilities" class="mb-2">
      <div class="text-subtitle-1 font-weight-bold mb-4">Key capabilities</div>
      <v-row>
        <v-col v-for="cap in content.capabilities" :key="cap.title" cols="12" md="4">
          <v-card flat border rounded="lg" class="pa-5 h-100">
            <v-icon :icon="cap.icon" :color="content.color" size="28" class="mb-3" />
            <div class="text-body-1 font-weight-semibold mb-2">{{ cap.title }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ cap.description }}</div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cross-sell-page {
  max-width: 900px;
}
.cross-sell-hero {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}
.cross-sell-badge {
  letter-spacing: 0.06em;
}
</style>
