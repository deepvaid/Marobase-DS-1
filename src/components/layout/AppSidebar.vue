<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import maropostLogo from '@/assets/logo-svg.svg'
import { useAccountStore, type ProductId } from '@/stores/useAccount'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:rail': [val: boolean]
}>()

// ─── Navigation Structure ────────────────────────────────────
interface NavItem { title: string; route: string; group?: string; productId?: ProductId }
interface NavGroup { title: string; icon: string; singleRoute?: string; badge?: string; productId?: ProductId; items: NavItem[] }

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
      { title: 'eRFM Report',                 route: '/analytics/reports/erfm' },
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
    title: 'CDP',
    icon: 'mdi-account-group-outline',
    items: [
      { title: 'All Contacts',      route: '/contacts' },
      { title: 'Contact Lists',     route: '/lists',                      productId: 'cdp_advanced' },
      { title: 'Segments',          route: '/segmentations' },
      { title: 'Contact Fields',    route: '/contacts/fields',            productId: 'cdp_advanced' },
      { title: 'Contact Tags',      route: '/tags',                       productId: 'cdp_advanced' },
      { title: 'Relational Tables', route: '/relational_tables',          productId: 'cdp_advanced' },
      { title: 'SQL Queries',       route: '/sql_queries',                productId: 'cdp_advanced' },
      { title: 'Secure Lists',      route: '/secure_lists',               productId: 'cdp_advanced' },
      { title: 'Web Tracking',      route: '/marketing/tracking_domains', productId: 'cdp_advanced' },
    ]
  },
  {
    title: 'Products',
    icon: 'mdi-package-variant',
    productId: 'products',
    items: [
      { title: 'Product Recommendations', route: '/product_recommendations' },
      { title: 'Products',                route: '/commerce/products' },
      { title: 'Product Tax Category',    route: '/commerce/products/tax-categories' },
      { title: 'Collections',             route: '/commerce/products/collections' },
      { title: 'Inventory',               route: '/commerce/inventory' },
      { title: 'Reservations',            route: '/commerce/products/reservations' },
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
    title: 'Commerce',
    icon: 'mdi-cart-outline',
    productId: 'commerce',
    items: [
      { title: 'Sales Orders',   route: '/commerce/orders' },
      { title: 'Draft Orders',   route: '/commerce/orders/drafts' },
      { title: 'Fulfillment',    route: '/commerce/fulfillments' },
      { title: 'Promos & Coupons', route: '/commerce/coupons' },
      { title: 'Sales Channels', route: '/commerce/store-setup' },
      { title: 'Store Settings', route: '/commerce/stores/general' },
      { title: 'Themes', route: '/commerce/stores/themes' },
      { title: 'Navigation', route: '/commerce/stores/navigation' },
    ]
  },
  {
    title: 'Retail',
    icon: 'mdi-storefront-outline',
    singleRoute: '/commerce/retail',
    productId: 'retail',
    items: []
  },
  {
    title: 'Service',
    icon: 'mdi-headset',
    productId: 'service',
    items: [
      { title: 'Tickets', route: '/service/tickets' },
    ]
  },
  {
    title: 'Da Vinci',
    icon: 'mdi-robot-outline',
    badge: 'NEW',
    items: [
      { title: 'Discover AI', route: '/da-vinci/discover' },
      { title: 'AI Studio',    route: '/da-vinci' },
      { title: 'Journeys', route: '/da-vinci/journeys' },
      { title: 'Personalization', route: '/da-vinci/personalization' },
      { title: 'Marketing Assets', route: '/da-vinci/marketing-assets' },
      { title: 'Customer Bot', route: '/da-vinci/customer-bot' },
    ]
  },
  {
    title: 'App Store',
    icon: 'mdi-puzzle-outline',
    singleRoute: '/integrations',
    items: []
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    items: [
      { title: 'Workspace Settings', route: '/settings' },
      { title: 'Design System', route: '/design-system' },
    ]
  },
]

const marketingGroups = ['Campaigns', 'Acquisition', 'Automation', 'Content']

const localDrawer = ref(props.modelValue)
const localRail = ref(props.rail)
const router = useRouter()
const accountStore = useAccountStore()

function isLocked(productId?: ProductId): boolean {
  return productId ? !accountStore.hasEntitlement(productId) : false
}

function goTo(route: string, productId?: ProductId) {
  if (productId && isLocked(productId)) {
    router.push(`/cross-sell/${productId}`)
  } else {
    router.push(route)
  }
}
</script>

<template>
  <v-navigation-drawer
    v-model="localDrawer"
    :rail="localRail"
    permanent
    :mobile-breakpoint="0"
    width="260"
    theme="maropostDark"
    class="mp-sidebar"
  >
    <!-- Logo + collapse toggle -->
    <div class="d-flex align-center px-3 py-3 sidebar-header">
      <v-btn
        icon="mdi-menu"
        variant="text"
        size="small"
        @click.stop="localRail = !localRail; emit('update:rail', localRail)"
        class="mr-2 flex-shrink-0 sidebar-muted"
      />
      <template v-if="!localRail">
        <span
          class="font-weight-bold cursor-pointer d-flex align-center gap-1 sidebar-logo"
          @click="$router.push('/dashboard')"
        >
          <img :src="maropostLogo" alt="Maropost" class="sidebar-brand-logo" />
        </span>
      </template>
    </div>

    <div class="my-1" />

    <!-- Full Navigation (expanded mode) — hover flyout submenus -->
    <v-list density="compact" nav class="px-2 py-1 sidebar-scroll" v-if="!localRail">
      <template v-for="group in navGroups" :key="group.title">
        <!-- Single-route items (Dashboard, Retail, App Store) — no flyout -->
        <v-list-item
          v-if="group.singleRoute"
          :to="isLocked(group.productId) ? undefined : group.singleRoute"
          @click="goTo(group.singleRoute!, group.productId)"
          :prepend-icon="group.icon"
          :title="group.title"
          rounded="lg"
          active-class="active-nav-item"
          class="mb-1 sidebar-text"
        >
          <template v-slot:append>
            <v-icon v-if="isLocked(group.productId)" icon="mdi-crown" size="14" class="sidebar-lock-crown" />
            <v-chip v-else-if="group.badge" size="x-small" color="success" variant="flat" class="sidebar-chip">{{ group.badge }}</v-chip>
          </template>
        </v-list-item>

        <!-- Group items — hover flyout to the right (or locked → cross-sell) -->
        <template v-else-if="isLocked(group.productId)">
          <v-list-item
            :prepend-icon="group.icon"
            :title="group.title"
            rounded="lg"
            class="mb-1 sidebar-text"
            @click="goTo('', group.productId)"
          >
            <template v-slot:append>
              <v-icon icon="mdi-crown" size="14" class="sidebar-lock-crown" />
            </template>
          </v-list-item>
        </template>
        <v-menu
          v-else
          location="end"
          open-on-hover
          :open-delay="80"
          :close-delay="150"
          offset="8"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props: menuProps }">
            <v-list-item
              v-bind="menuProps"
              :prepend-icon="group.icon"
              :title="group.title"
              rounded="lg"
              class="mb-1 sidebar-text sidebar-group-activator"
            >
              <template v-slot:append>
                <v-chip v-if="group.badge" size="x-small" color="success" variant="flat" class="mr-1 sidebar-chip">{{ group.badge }}</v-chip>
                <v-icon size="16" icon="mdi-chevron-right" class="sidebar-muted" />
              </template>
            </v-list-item>
          </template>

          <v-card :width="group.title === 'Marketing' ? 240 : 240" flat border rounded="xl" class="sidebar-surface sidebar-popover">
            <v-list density="compact" class="bg-transparent py-1">
              <v-list-subheader class="sidebar-subheader">{{ group.title }}</v-list-subheader>

              <!-- Marketing: nested flyouts (Campaigns / Acquisition / Automation / Content) -->
              <template v-if="group.title === 'Marketing'">
                <v-menu
                  v-for="subGroup in marketingGroups"
                  :key="subGroup"
                  location="end"
                  open-on-hover
                  :open-delay="80"
                  :close-delay="150"
                  offset="8"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ props: subProps }">
                    <v-list-item
                      v-bind="subProps"
                      :title="subGroup"
                      class="sidebar-text sidebar-popover-item"
                      rounded="lg"
                      slim
                    >
                      <template v-slot:append>
                        <v-icon size="16" icon="mdi-chevron-right" class="sidebar-muted" />
                      </template>
                    </v-list-item>
                  </template>
                  <v-card width="240" flat border rounded="xl" class="sidebar-surface sidebar-popover">
                    <v-list density="compact" class="bg-transparent py-1">
                      <v-list-subheader class="sidebar-subheader">{{ subGroup }}</v-list-subheader>
                      <v-list-item
                        v-for="item in group.items.filter(i => i.group === subGroup)"
                        :key="item.title"
                        :title="item.title"
                        :to="item.route"
                        @click="goTo(item.route)"
                        class="sidebar-text sidebar-popover-item"
                        rounded="lg"
                        slim
                        exact
                      />
                    </v-list>
                  </v-card>
                </v-menu>
              </template>

              <!-- Flat list for all other groups -->
              <template v-else>
                <v-list-item
                  v-for="item in group.items"
                  :key="item.title"
                  :title="item.title"
                  :to="isLocked(item.productId) ? undefined : item.route"
                  @click="goTo(item.route, item.productId)"
                  class="sidebar-text sidebar-popover-item"
                  rounded="lg"
                  slim
                  exact
                >
                  <template v-slot:append v-if="isLocked(item.productId)">
                    <v-icon icon="mdi-crown" size="12" class="sidebar-lock-crown" />
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-list>

    <!-- Rail Mode Icons Only -->
    <div class="d-flex flex-column align-center px-1 py-1 rail-icon-list" v-else>
      <v-menu v-for="group in navGroups" :key="group.title" location="end" open-on-hover offset="8">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="group.icon"
            variant="text"
            size="40"
            :to="(group.singleRoute && !isLocked(group.productId)) ? group.singleRoute : undefined"
            @click="group.singleRoute && goTo(group.singleRoute, group.productId)"
            rounded="lg"
            class="mb-1 sidebar-text rail-icon-btn"
          />
        </template>
        <v-card width="220" flat border rounded="xl" class="sidebar-surface rail-popover">
          <v-list density="compact" class="bg-transparent py-1">
            <v-list-subheader class="sidebar-subheader">{{ group.title }}</v-list-subheader>
            <template v-if="group.singleRoute">
              <v-list-item
                :to="isLocked(group.productId) ? undefined : group.singleRoute"
                :title="group.title"
                @click="goTo(group.singleRoute!, group.productId)"
                class="sidebar-text rail-popover-item"
                rounded="lg"
                slim
              >
                <template v-slot:append v-if="isLocked(group.productId)">
                  <v-icon icon="mdi-crown" size="12" class="sidebar-lock-crown" />
                </template>
              </v-list-item>
            </template>
            <template v-else-if="isLocked(group.productId)">
              <v-list-item
                :title="group.title"
                @click="goTo('', group.productId)"
                class="sidebar-text rail-popover-item"
                rounded="lg"
                slim
              >
                <template v-slot:append>
                  <v-icon icon="mdi-crown" size="12" class="sidebar-lock-crown" />
                </template>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item
                v-for="item in group.items"
                :key="item.title"
                :title="item.title"
                :to="isLocked(item.productId) ? undefined : item.route"
                @click="goTo(item.route, item.productId)"
                class="sidebar-text rail-popover-item"
                rounded="lg"
                slim
                exact
              >
                <template v-slot:append v-if="isLocked(item.productId)">
                  <v-icon icon="mdi-crown" size="12" class="sidebar-lock-crown" />
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <!-- Bottom: Help -->
    <template v-slot:append>
      <div class="my-1" />
      <div class="pa-2" v-if="!localRail">
        <v-btn block variant="text" prepend-icon="mdi-help-circle-outline" class="text-none justify-start sidebar-help">
          Help & Documentation
        </v-btn>
      </div>
      <div class="d-flex justify-center pa-2" v-else>
        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" class="sidebar-muted" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.mp-sidebar {
  background: var(--mp-color-sidebar-bg);
}
.sidebar-header {
  height: var(--mp-layout-appbarHeight);
}
.sidebar-scroll {
  overflow-y: auto;
}
.sidebar-muted {
  color: var(--mp-color-sidebar-textMuted);
}
.sidebar-text {
  color: var(--mp-color-sidebar-text);
}
.sidebar-logo {
  min-height: 24px;
}
.sidebar-brand-logo {
  height: 24px;
  width: auto;
  display: block;
}
.sidebar-chip {
  font-size: 9px;
  height: 16px;
  padding: 0 5px;
}
.sidebar-subgroup {
  font-size: var(--mp-typography-fontSize-xs);
  color: var(--mp-color-sidebar-textFaint);
  letter-spacing: 0.08em;
}
.sidebar-child-item {
  padding-left: var(--mp-spacing-7);
}
.sidebar-surface {
  background: var(--mp-color-sidebar-surface);
}
.rail-icon-list {
  overflow-y: auto;
}
.rail-icon-btn {
  color: var(--mp-color-sidebar-text) !important;
}
.rail-popover-item {
  font-size: var(--mp-typography-fontSize-sm);
  min-height: 32px;
}
.sidebar-popover {
  background: var(--mp-color-sidebar-surface);
}
.sidebar-popover-item {
  font-size: var(--mp-typography-fontSize-sm);
  min-height: 32px;
}
.sidebar-popover-item :deep(.v-list-item-title),
.rail-popover-item :deep(.v-list-item-title) {
  font-size: var(--mp-typography-fontSize-body);
  line-height: 1.25;
  font-weight: 400;
}
.sidebar-group-activator :deep(.v-list-item__append .v-icon) {
  opacity: 0.6;
}
.sidebar-subheader {
  color: var(--mp-color-sidebar-textMuted);
  font-size: var(--mp-typography-fontSize-xs);
  min-height: 24px;
  padding-top: 4px;
  padding-bottom: 2px;
}
.sidebar-help {
  color: var(--mp-color-sidebar-textFaint);
  font-size: var(--mp-typography-fontSize-body);
}
.sidebar-lock-crown {
  color: rgba(var(--v-theme-on-surface), 0.45);
  opacity: 0.75;
}
:deep(.active-nav-item) {
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
:deep(.v-list-group__items .v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
:deep(.v-list-group__items .v-list-item--active .v-list-item-title) {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
:deep(.v-list-item__prepend .v-icon),
:deep(.v-list-item-title) {
  color: var(--mp-color-sidebar-text);
}
:deep(.v-list-item-subtitle) {
  color: var(--mp-color-sidebar-textMuted);
}
</style>
