<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:rail': [val: boolean]
}>()

// ─── Navigation Structure ────────────────────────────────────
interface NavItem { title: string; route: string; group?: string }
interface NavGroup { title: string; icon: string; singleRoute?: string; badge?: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    singleRoute: '/dashboard',
    items: []
  },
  {
    title: 'Analytics',
    icon: 'mdi-chart-line',
    items: [
      { title: 'Monthly Totals',              route: '/analytics/reports/monthly_totals' },
      { title: 'Sales by Order',              route: '/analytics/reports/orders' },
      { title: 'Dispatched Orders',           route: '/analytics/reports/dispatched_orders' },
      { title: 'Sales Summary',               route: '/analytics/reports/sales_summary' },
      { title: 'Campaign Reports',            route: '/analytics/reports/campaign_reports' },
      { title: 'Recurring Reports',           route: '/analytics/reports/recurring_campaign_reports' },
      { title: 'A/B Campaign Reports',        route: '/analytics/reports/ab_campaign_reports' },
      { title: 'Test Campaign Reports',       route: '/analytics/reports/test_campaign_reports' },
      { title: 'Website Reports',             route: '/analytics/reports/website_reports' },
      { title: 'Journey Reports',             route: '/analytics/reports/journey_reports' },
      { title: 'Custom Reports',              route: '/analytics/custom_reports' },
      { title: 'Transactional Reports',       route: '/analytics/reports/transactional_campaign_reports' },
      { title: 'Log Inspector',               route: '/analytics/log_inspector' },
    ]
  },
  {
    title: 'Contacts',
    icon: 'mdi-account-group-outline',
    items: [
      { title: 'All Contacts',      route: '/contacts' },
      { title: 'Contact Lists',     route: '/lists' },
      { title: 'Segments',          route: '/segmentations' },
      { title: 'Contact Fields',    route: '/contacts/fields' },
      { title: 'Contact Tags',      route: '/tags' },
      { title: 'Relational Tables', route: '/relational_tables' },
      { title: 'SQL Queries',       route: '/sql_queries' },
      { title: 'Secure Lists',      route: '/secure_lists' },
      { title: 'Web Tracking',      route: '/marketing/tracking_domains' },
    ]
  },
  {
    title: 'Products',
    icon: 'mdi-package-variant-closed',
    items: [
      { title: 'Products List',          route: '/commerce/products' },
      { title: 'Inventory',              route: '/commerce/inventory' },
      { title: 'Reservations',           route: '/commerce/products/reservations' },
      { title: 'Product Recommendations',route: '/product_recommendations' },
    ]
  },
  {
    title: 'Commerce',
    icon: 'mdi-cart-outline',
    items: [
      { title: 'Sales Orders',   route: '/commerce/orders' },
      { title: 'Draft Orders',   route: '/commerce/orders/drafts' },
      { title: 'Fulfillment',    route: '/commerce/fulfillments' },
      { title: 'Promos & Coupons', route: '/commerce/coupons' },
      { title: 'Sales Channels', route: '/commerce/store-setup' },
    ]
  },
  {
    title: 'Marketing',
    icon: 'mdi-bullhorn-outline',
    items: [
      { title: 'Email Campaigns',    route: '/campaigns',                 group: 'Campaigns' },
      { title: 'Transactional Email',route: '/transactional_campaigns',   group: 'Campaigns' },
      { title: 'Campaign Tags',      route: '/campaign_tags',             group: 'Campaigns' },
      { title: 'Acquisition Forms',  route: '/marketing/acquisition_forms', group: 'Acquisition' },
      { title: 'Signup Forms',       route: '/signup_forms',              group: 'Acquisition' },
      { title: 'Landing Pages',      route: '/marketing/landing_pages',   group: 'Acquisition' },
      { title: 'Surveys',            route: '/content/surveys',           group: 'Acquisition' },
      { title: 'Journeys',           route: '/workflows',                 group: 'Automation' },
      { title: 'Data Journeys',      route: '/data_workflows',            group: 'Automation' },
      { title: 'Email Content',      route: '/contents',                  group: 'Content' },
      { title: 'Dynamic Content',    route: '/dynamic_contents',          group: 'Content' },
      { title: 'Image Library',      route: '/images',                    group: 'Content' },
      { title: 'Footer Management',  route: '/footers',                   group: 'Content' },
      { title: 'Optimise on Open',   route: '/image_groups',              group: 'Content' },
      { title: 'Content Feeds',      route: '/content_feeds',             group: 'Content' },
      { title: 'Coupon Banks',       route: '/coupon_banks',              group: 'Content' },
      { title: 'Preference Pages',   route: '/content/preference_pages',  group: 'Content' },
      { title: 'Countdown Timer',    route: '/live_content_images',       group: 'Content' },
    ]
  },
  {
    title: 'Service',
    icon: 'mdi-headset',
    items: [
      { title: 'Tickets', route: '/service/tickets' },
    ]
  },
  {
    title: 'Da Vinci',
    icon: 'mdi-robot-outline',
    badge: 'NEW',
    items: [
      { title: 'AI Dashboard', route: '/da-vinci/dashboard' },
      { title: 'AI Studio',    route: '/da-vinci' },
    ]
  },
  {
    title: 'Integrations',
    icon: 'mdi-puzzle-outline',
    singleRoute: '/integrations',
    items: []
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    singleRoute: '/settings',
    items: []
  },
]

const marketingGroups = ['Campaigns', 'Acquisition', 'Automation', 'Content']

const localDrawer = ref(props.modelValue)
const localRail = ref(props.rail)
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    permanent
    width="260"
    class="mp-sidebar"
    style="background: var(--mp-color-sidebar-bg);"
  >
    <!-- Logo + collapse toggle -->
    <div class="d-flex align-center px-3 py-3" style="height: var(--mp-layout-appbarHeight);">
      <v-btn
        icon="mdi-menu"
        variant="text"
        size="small"
        @click.stop="localRail = !localRail; emit('update:rail', localRail)"
        style="color: var(--mp-color-sidebar-textMuted);"
        class="mr-2 flex-shrink-0"
      />
      <template v-if="!localRail">
        <span
          class="font-weight-bold cursor-pointer d-flex align-center gap-1"
          style="font-size: 17px; letter-spacing: -0.5px; color: var(--mp-color-sidebar-text);"
          @click="$router.push('/dashboard')"
        >
          Maropost
          <v-chip size="x-small" color="primary" variant="flat" class="ml-1 px-1" style="font-size: 9px; height: 16px;">X</v-chip>
        </span>
      </template>
    </div>

    <div class="my-1" />

    <!-- Full Navigation (expanded mode) -->
    <v-list density="compact" nav class="px-2 py-1" v-if="!localRail" style="overflow-y: auto;">
      <template v-for="group in navGroups" :key="group.title">
        <v-list-item
          v-if="group.singleRoute"
          :to="group.singleRoute"
          :prepend-icon="group.icon"
          :title="group.title"
          rounded="lg"
          color="primary"
          base-color="rgba(255,255,255,0.6)"
          active-class="active-nav-item"
          class="mb-1"
          style="color: var(--mp-color-sidebar-text);"
        >
          <template v-slot:append v-if="group.badge">
            <v-chip size="x-small" color="success" variant="flat" style="font-size: 9px; height: 16px; padding: 0 5px;">{{ group.badge }}</v-chip>
          </template>
        </v-list-item>

        <v-list-group v-else :value="group.title" class="mb-1">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="group.icon"
              :title="group.title"
              rounded="lg"
              base-color="rgba(255,255,255,0.6)"
              style="color: var(--mp-color-sidebar-text);"
            >
              <template v-slot:append="{ isActive }" v-if="group.badge">
                <v-chip size="x-small" color="success" variant="flat" style="font-size: 9px; height: 16px; padding: 0 5px;" class="mr-1">{{ group.badge }}</v-chip>
                <v-icon>{{ isActive ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </template>
            </v-list-item>
          </template>

          <!-- Marketing gets grouped sub-sections -->
          <template v-if="group.title === 'Marketing'">
            <div v-for="subGroup in marketingGroups" :key="subGroup">
              <div class="px-4 pt-2 pb-1">
                <span class="text-uppercase font-weight-bold" style="font-size: var(--mp-typography-fontSize-xs); color: var(--mp-color-sidebar-textFaint); letter-spacing: 0.08em;">{{ subGroup }}</span>
              </div>
              <v-list-item
                v-for="item in group.items.filter(i => i.group === subGroup)"
                :key="item.title"
                :title="item.title"
                :to="item.route"
                rounded="lg"
                color="primary"
                base-color="rgba(255,255,255,0.5)"
                exact
                class="mb-0.5"
                style="padding-left: var(--mp-spacing-7);"
              />
            </div>
          </template>

          <!-- All other groups — flat list -->
          <template v-else>
            <v-list-item
              v-for="item in group.items"
              :key="item.title"
              :title="item.title"
              :to="item.route"
              rounded="lg"
              color="primary"
              base-color="rgba(255,255,255,0.5)"
              exact
              class="mb-0.5"
            />
          </template>
        </v-list-group>
      </template>
    </v-list>

    <!-- Rail Mode Icons Only -->
    <v-list density="compact" nav class="px-1 py-1" v-else>
      <v-menu v-for="group in navGroups" :key="group.title" location="end" open-on-hover offset="8">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="group.icon"
            :to="group.singleRoute"
            rounded="lg"
            base-color="rgba(255,255,255,0.5)"
            color="primary"
            class="mb-1 justify-center"
          />
        </template>
        <v-card width="220" elevation="8" rounded="xl" style="background: var(--mp-color-sidebar-surface);">
          <v-list density="compact" class="bg-transparent py-1">
            <v-list-subheader style="color: var(--mp-color-sidebar-textMuted); font-size: var(--mp-typography-fontSize-xs);">{{ group.title }}</v-list-subheader>
            <template v-if="group.singleRoute">
              <v-list-item :to="group.singleRoute" :title="group.title" style="color: var(--mp-color-sidebar-text);" rounded="lg" />
            </template>
            <template v-else>
              <v-list-item
                v-for="item in group.items"
                :key="item.title"
                :title="item.title"
                :to="item.route"
                style="color: var(--mp-color-sidebar-text);"
                color="primary"
                rounded="lg"
                exact
              />
            </template>
          </v-list>
        </v-card>
      </v-menu>
    </v-list>

    <!-- Bottom: Help -->
    <template v-slot:append>
      <div class="my-1" />
      <div class="pa-2" v-if="!localRail">
        <v-btn block variant="text" prepend-icon="mdi-help-circle-outline" class="text-none justify-start" style="color: var(--mp-color-sidebar-textFaint); font-size: var(--mp-typography-fontSize-body);">
          Help & Documentation
        </v-btn>
      </div>
      <div class="d-flex justify-center pa-2" v-else>
        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" style="color: var(--mp-color-sidebar-textFaint);" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
:deep(.active-nav-item) {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}
:deep(.v-list-group__items .v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}
:deep(.v-list-group__items .v-list-item--active .v-list-item-title) {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}
</style>
