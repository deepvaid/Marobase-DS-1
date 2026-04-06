<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardStore, type WidgetType, type WidgetSize, MAX_WIDGETS } from '@/stores/useDashboard'
import { useDaVinciStore } from '@/stores/useDaVinci'

const dashboard = useDashboardStore()
const daVinci = useDaVinciStore()

const searchQuery = ref('')

interface CatalogItem {
  type: WidgetType
  title: string
  description: string
  icon: string
  color: string
  defaultSize: WidgetSize
}

const availableWidgets: CatalogItem[] = [
  {
    type: 'kpi-row',
    title: 'Key Metrics',
    description: 'Revenue, subscribers, open rate, and email sends at a glance.',
    icon: 'mdi-chart-box-outline',
    color: 'success',
    defaultSize: 'L',
  },
  {
    type: 'revenue-chart',
    title: 'Revenue & Engagement Chart',
    description: 'Interactive line chart showing revenue and engagement trends.',
    icon: 'mdi-chart-line',
    color: 'primary',
    defaultSize: 'L',
  },
  {
    type: 'activity-feed',
    title: 'Recent Activity',
    description: 'Timeline of recent events across campaigns, orders, and integrations.',
    icon: 'mdi-timeline-clock-outline',
    color: 'info',
    defaultSize: 'M',
  },
  {
    type: 'campaign-list',
    title: 'Top Campaigns',
    description: 'Best performing campaigns ranked by revenue and open rate.',
    icon: 'mdi-email-check-outline',
    color: 'success',
    defaultSize: 'M',
  },
  {
    type: 'order-list',
    title: 'Recent Orders',
    description: 'Latest orders with customer details, amounts, and status.',
    icon: 'mdi-cart-outline',
    color: 'warning',
    defaultSize: 'M',
  },
  {
    type: 'goal-gauge',
    title: 'Goal Gauge',
    description: 'Track progress against a target (MRR, Sales, etc).',
    icon: 'mdi-speedometer',
    color: 'error',
    defaultSize: 'S',
  },
  {
    type: 'live-activity',
    title: 'Live Activity Feed',
    description: 'Real-time feed of events happening right now.',
    icon: 'mdi-access-point-network',
    color: 'info',
    defaultSize: 'S',
  },
]

const dashboardTemplates = [
  {
    id: 'marketing',
    title: 'Marketing Overview',
    description: 'Focus on campaign performance and engagement.',
    icon: 'mdi-bullhorn-outline',
    color: 'primary',
    widgets: [
      { type: 'kpi-row', title: 'Key Metrics', size: 'L' as WidgetSize },
      { type: 'revenue-chart', title: 'Revenue & Engagement', size: 'L' as WidgetSize },
      { type: 'campaign-list', title: 'Top Campaigns', size: 'M' as WidgetSize },
      { type: 'activity-feed', title: 'Recent Activity', size: 'M' as WidgetSize },
    ]
  },
  {
    id: 'commerce',
    title: 'Sales & Commerce',
    description: 'Track orders, revenue, and MRR goals.',
    icon: 'mdi-cart-outline',
    color: 'success',
    widgets: [
      { type: 'kpi-row', title: 'Key Metrics', size: 'L' as WidgetSize },
      { type: 'goal-gauge', title: 'MRR vs Target', size: 'M' as WidgetSize, config: { gaugeType: 'mrr' } },
      { type: 'goal-gauge', title: 'Sales vs Target', size: 'M' as WidgetSize, config: { gaugeType: 'sales' } },
      { type: 'revenue-chart', title: 'Revenue Trend', size: 'L' as WidgetSize },
      { type: 'order-list', title: 'Recent Orders', size: 'L' as WidgetSize },
    ]
  },
  {
    id: 'executive',
    title: 'Executive Summary',
    description: 'High-level metrics, live activity, and goals.',
    icon: 'mdi-chart-box-outline',
    color: 'info',
    widgets: [
      { type: 'kpi-row', title: 'Key Metrics', size: 'L' as WidgetSize },
      { type: 'goal-gauge', title: 'New Business', size: 'S' as WidgetSize, config: { gaugeType: 'new-business' } },
      { type: 'live-activity', title: 'Live Activity', size: 'S' as WidgetSize },
      { type: 'goal-gauge', title: 'MRR vs Target', size: 'S' as WidgetSize, config: { gaugeType: 'mrr' } },
      { type: 'revenue-chart', title: 'Revenue Overview', size: 'L' as WidgetSize },
    ]
  }
]

// Filtered lists based on search
const filteredPreBuilt = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return availableWidgets
  return availableWidgets.filter(
    w => w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
  )
})

const filteredSavedCharts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const charts = dashboard.savedCharts
  if (!q) return charts
  return charts.filter(
    c => c.title.toLowerCase().includes(q) || c.query.toLowerCase().includes(q)
  )
})

const hasResults = computed(() => filteredPreBuilt.value.length > 0 || filteredSavedCharts.value.length > 0)

function addWidget(item: CatalogItem) {
  if (!dashboard.canAddMore) return
  dashboard.addWidget({
    type: item.type,
    title: item.title,
    size: item.defaultSize,
  })
}

function removeWidgetByType(type: WidgetType) {
  const w = dashboard.widgets.find(w => w.type === type)
  if (w) dashboard.removeWidget(w.id)
}

function isOnDashboard(type: WidgetType) {
  if (type === 'davinci-custom') return false
  return dashboard.widgets.some(w => w.type === type)
}

function askDaVinci() {
  dashboard.catalogOpen = false
  daVinci.openWithQuery('')
}

function formatDate(ts: number) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Confirm dialog for deleting saved chart
const confirmDeleteId = ref<string | null>(null)

function deleteSavedChart(id: string) {
  // Also remove from dashboard if present
  dashboard.removeSavedChartFromDashboard(id)
  dashboard.removeSavedChart(id)
  confirmDeleteId.value = null
}

// Confirm dialog for applying template
const templateToApply = ref<typeof dashboardTemplates[0] | null>(null)

function applyTemplate(template: typeof dashboardTemplates[0]) {
  dashboard.applyTemplate(template.title, template.widgets as any)
  templateToApply.value = null
  dashboard.catalogOpen = false
}
</script>

<template>
  <v-navigation-drawer
    :model-value="dashboard.catalogOpen"
    @update:model-value="dashboard.catalogOpen = $event"
    location="right"
    width="420"
    temporary
    class="widget-catalog"
  >
    <div class="d-flex flex-column h-100">
      <!-- Header -->
      <div class="catalog-header px-5 py-4 border-b">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-h6 font-weight-bold">Add Widget</div>
            <div class="text-caption text-medium-emphasis">
              {{ dashboard.widgetCount }} / {{ MAX_WIDGETS }} widgets on dashboard
            </div>
          </div>
          <v-btn icon variant="text" size="32" @click="dashboard.catalogOpen = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Widget count progress -->
        <v-progress-linear
          :model-value="(dashboard.widgetCount / MAX_WIDGETS) * 100"
          :color="dashboard.widgetCount >= MAX_WIDGETS ? 'error' : dashboard.widgetCount >= 16 ? 'warning' : 'primary'"
          rounded
          height="4"
          class="mb-3"
        />

        <!-- Search -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Search widgets..."
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="catalog-search"
        />
      </div>

      <!-- Widget list (scrollable) -->
      <div class="flex-grow-1 overflow-y-auto pa-4">
        <!-- Max reached warning -->
        <v-alert
          v-if="!dashboard.canAddMore"
          type="warning"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mb-4"
        >
          <template #text>
            <span class="text-body-2">Maximum of {{ MAX_WIDGETS }} widgets reached. Remove a widget to add a new one.</span>
          </template>
        </v-alert>

        <!-- ═══ DASHBOARD TEMPLATES ═══ -->
        <template v-if="!searchQuery">
          <div class="d-flex align-center justify-space-between mb-3 mt-2">
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">
              Quick Setup Templates
            </div>
          </div>
          
          <v-row dense class="mb-4">
            <v-col v-for="template in dashboardTemplates" :key="template.id" cols="12" sm="12">
              <v-card variant="outlined" rounded="lg" class="template-card" @click="templateToApply = template">
                <v-card-text class="d-flex align-center gap-3 pa-3">
                  <v-avatar :color="template.color" variant="tonal" size="36">
                    <v-icon size="18">{{ template.icon }}</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1 min-width-0">
                    <div class="text-subtitle-2 font-weight-bold text-truncate">{{ template.title }}</div>
                    <div class="text-caption text-medium-emphasis text-truncate">{{ template.description }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider class="mb-4" />
        </template>

        <!-- Da Vinci custom section -->
        <v-card
          variant="outlined"
          rounded="lg"
          class="mb-4 da-vinci-add-card cursor-pointer"
          @click="askDaVinci"
        >
          <v-card-text class="d-flex align-center gap-3 pa-4">
            <v-avatar color="purple" variant="tonal" size="44">
              <v-icon size="22" color="purple">mdi-creation</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold">Ask Da Vinci</div>
              <div class="text-caption text-medium-emphasis">Create a custom widget with AI — describe what you want to see.</div>
            </div>
            <v-icon size="18" color="purple">mdi-arrow-right</v-icon>
          </v-card-text>
        </v-card>

        <!-- ═══ SAVED DA VINCI CHARTS ═══ -->
        <template v-if="filteredSavedCharts.length > 0">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">
              Saved from Da Vinci
              <v-chip size="x-small" variant="tonal" color="purple" class="ml-1">{{ filteredSavedCharts.length }}</v-chip>
            </div>
          </div>

          <v-card
            v-for="chart in filteredSavedCharts"
            :key="chart.id"
            variant="outlined"
            rounded="lg"
            class="mb-3 catalog-item"
            :class="{ 'on-dashboard': dashboard.isSavedChartOnDashboard(chart.id) }"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center gap-3">
                <v-avatar color="purple" variant="tonal" size="44">
                  <v-icon size="22" color="purple">mdi-chart-bar</v-icon>
                </v-avatar>
                <div class="flex-grow-1 min-width-0">
                  <div class="text-subtitle-2 font-weight-bold text-truncate">{{ chart.title }}</div>
                  <div class="text-caption text-medium-emphasis text-truncate">{{ chart.query || 'Da Vinci chart' }}</div>
                  <div class="d-flex align-center ga-2 mt-1">
                    <v-chip v-if="dashboard.isSavedChartOnDashboard(chart.id)" size="x-small" variant="tonal" color="success">
                      <v-icon size="10" start>mdi-check</v-icon>On dashboard
                    </v-chip>
                    <span class="text-caption text-disabled">{{ formatDate(chart.savedAt) }}</span>
                  </div>
                </div>
                <div class="d-flex flex-column ga-1">
                  <!-- Add / Remove toggle -->
                  <v-btn
                    v-if="!dashboard.isSavedChartOnDashboard(chart.id)"
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="text-none"
                    :disabled="!dashboard.canAddMore"
                    @click="dashboard.addSavedChartToDashboard(chart)"
                  >
                    <v-icon size="14" start>mdi-plus</v-icon>Add
                  </v-btn>
                  <v-btn
                    v-else
                    size="small"
                    variant="tonal"
                    color="error"
                    class="text-none"
                    @click="dashboard.removeSavedChartFromDashboard(chart.id)"
                  >
                    <v-icon size="14" start>mdi-minus</v-icon>Remove
                  </v-btn>
                  <!-- Delete saved chart entirely -->
                  <v-btn
                    icon
                    size="24"
                    variant="text"
                    color="medium-emphasis"
                    @click="confirmDeleteId = chart.id"
                  >
                    <v-icon size="14">mdi-delete-outline</v-icon>
                    <v-tooltip activator="parent" location="left">Delete from library</v-tooltip>
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-divider class="my-4" />
        </template>

        <!-- ═══ PRE-BUILT WIDGETS ═══ -->
        <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3" style="letter-spacing: 0.05em;">
          Pre-built Widgets
          <v-chip size="x-small" variant="tonal" class="ml-1">{{ filteredPreBuilt.length }}</v-chip>
        </div>

        <v-card
          v-for="item in filteredPreBuilt"
          :key="item.type"
          variant="outlined"
          rounded="lg"
          class="mb-3 catalog-item"
          :class="{ 'on-dashboard': isOnDashboard(item.type) }"
        >
          <v-card-text class="d-flex align-center gap-3 pa-4">
            <v-avatar :color="item.color" variant="tonal" size="44">
              <v-icon size="22" :color="item.color">{{ item.icon }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold">{{ item.title }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
              <v-chip v-if="isOnDashboard(item.type)" size="x-small" variant="tonal" color="success" class="mt-1">
                <v-icon size="10" start>mdi-check</v-icon>On dashboard
              </v-chip>
            </div>
            <v-btn
              v-if="!isOnDashboard(item.type)"
              size="small"
              variant="tonal"
              color="primary"
              class="text-none"
              :disabled="!dashboard.canAddMore"
              @click="addWidget(item)"
            >
              <v-icon size="14" start>mdi-plus</v-icon>Add
            </v-btn>
            <v-btn
              v-else
              size="small"
              variant="tonal"
              color="error"
              class="text-none"
              @click="removeWidgetByType(item.type)"
            >
              <v-icon size="14" start>mdi-minus</v-icon>Remove
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- No results -->
        <div v-if="!hasResults && searchQuery" class="text-center py-8">
          <v-icon size="48" color="disabled" class="mb-3">mdi-magnify-close</v-icon>
          <div class="text-body-2 text-medium-emphasis">No widgets match "{{ searchQuery }}"</div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <v-dialog :model-value="!!confirmDeleteId" @update:model-value="!$event && (confirmDeleteId = null)" max-width="380" persistent>
      <v-card rounded="xl" class="pa-4">
        <div class="d-flex align-center ga-2 mb-3">
          <v-icon color="error" size="20">mdi-alert-circle-outline</v-icon>
          <span class="text-subtitle-1 font-weight-bold">Delete saved chart?</span>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-4">This will remove the chart from your library and from the dashboard if it's currently added.</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" size="small" class="text-none" @click="confirmDeleteId = null">Cancel</v-btn>
          <v-btn variant="flat" size="small" color="error" class="text-none" @click="confirmDeleteId && deleteSavedChart(confirmDeleteId)">Delete</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Apply Template confirmation dialog -->
    <v-dialog :model-value="!!templateToApply" @update:model-value="!$event && (templateToApply = null)" max-width="400" persistent>
      <v-card rounded="xl" class="pa-5">
        <div class="d-flex align-center ga-3 mb-3">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon size="20">mdi-view-dashboard-outline</v-icon>
          </v-avatar>
          <span class="text-body-1 font-weight-bold">Apply Template</span>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-5">
          This will create a new dashboard tab called <strong>{{ templateToApply?.title }}</strong> pre-populated with these widgets.
        </p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" size="small" class="text-none" @click="templateToApply = null">Cancel</v-btn>
          <v-btn variant="flat" size="small" color="primary" class="text-none font-weight-bold" @click="templateToApply && applyTemplate(templateToApply)">Create Dashboard</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<style scoped>
.widget-catalog {
  z-index: 1010 !important;
}
.catalog-header {
  background: rgb(var(--v-theme-surface));
}
.catalog-search :deep(.v-field) {
  font-size: 13px;
}
.catalog-item {
  transition: all 0.2s ease;
  cursor: default;
}
.catalog-item:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.catalog-item.on-dashboard {
  border-color: rgba(var(--v-theme-success), 0.3);
  background: rgba(var(--v-theme-success), 0.02);
}
.da-vinci-add-card {
  border-color: rgba(168, 85, 247, 0.3);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.04) 0%, rgba(168, 85, 247, 0.01) 100%);
  transition: all 0.2s ease;
}
.da-vinci-add-card:hover {
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.1);
}
.template-card {
  transition: all 0.2s ease;
  cursor: pointer;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}
.template-card:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  background: rgba(var(--v-theme-primary), 0.02);
}
.cursor-pointer { cursor: pointer; }
.min-width-0 { min-width: 0; }
</style>
