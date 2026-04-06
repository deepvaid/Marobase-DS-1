<script setup lang="ts">
import { ref } from 'vue'
import { useDashboardStore, type WidgetSize } from '@/stores/useDashboard'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDashboardFilters from '@/components/MpDashboardFilters.vue'
import MpDashboardWidget from '@/components/MpDashboardWidget.vue'
import MpWidgetCatalog from '@/components/MpWidgetCatalog.vue'

// Widget content components
import WidgetKpiRow from '@/components/widgets/WidgetKpiRow.vue'
import WidgetRevenueChart from '@/components/widgets/WidgetRevenueChart.vue'
import WidgetActivityFeed from '@/components/widgets/WidgetActivityFeed.vue'
import WidgetTopCampaigns from '@/components/widgets/WidgetTopCampaigns.vue'
import WidgetRecentOrders from '@/components/widgets/WidgetRecentOrders.vue'
import WidgetDaVinciCustom from '@/components/widgets/WidgetDaVinciCustom.vue'
import WidgetGoalGauge from '@/components/widgets/WidgetGoalGauge.vue'
import WidgetLiveActivity from '@/components/widgets/WidgetLiveActivity.vue'

const dashboard = useDashboardStore()

// Drag state
const dragFromIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragFromIndex.value = index
}

function onDrop(toIndex: number) {
  if (dragFromIndex.value !== null && dragFromIndex.value !== toIndex) {
    dashboard.reorderWidget(dragFromIndex.value, toIndex)
  }
  dragFromIndex.value = null
}

function onResize(id: string, size: WidgetSize) {
  dashboard.resizeWidget(id, size)
}

// Snackbar for widget removal undo
const snackbar = ref(false)
const removedWidget = ref<any>(null)

function removeWithUndo(id: string) {
  const idx = dashboard.widgets.findIndex(w => w.id === id)
  if (idx === -1) return
  removedWidget.value = { ...dashboard.widgets[idx], _index: idx }
  dashboard.removeWidget(id)
  snackbar.value = true
}

function undoRemove() {
  if (removedWidget.value) {
    const { _index, ...widget } = removedWidget.value
    dashboard.widgets.splice(_index, 0, widget)
    removedWidget.value = null
    snackbar.value = false
  }
}

// Multi-dashboard
const showNewDashDialog = ref(false)
const newDashName = ref('')

function createDashboard() {
  if (newDashName.value.trim()) {
    dashboard.addDashboard(newDashName.value.trim())
  }
  newDashName.value = ''
  showNewDashDialog.value = false
}
</script>

<template>
  <div>
    <MpPageHeader
      title="Good afternoon, Admin 👋"
      subtitle="Here is what's happening across your accounts today — March 7, 2026."
      :breadcrumbs="[{ title: 'Home', disabled: true }]"
    >
      <template #actions>
        <v-btn
          :variant="dashboard.editMode ? 'flat' : 'outlined'"
          :color="dashboard.editMode ? 'primary' : 'default'"
          :prepend-icon="dashboard.editMode ? 'mdi-check' : 'mdi-pencil-outline'"
          class="text-none"
          @click="dashboard.toggleEditMode()"
        >
          {{ dashboard.editMode ? 'Done' : 'Customize' }}
        </v-btn>
        <v-btn
          variant="tonal"
          color="primary"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="dashboard.catalogOpen = true"
        >Add Widget</v-btn>
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" v-bind="menuProps">Create</v-btn>
          </template>
          <v-list rounded="lg" elevation="4" class="py-1 mt-1" density="compact">
            <v-list-item to="/campaigns/new">
              <template #prepend><v-icon size="18" class="mr-2 text-medium-emphasis">mdi-bullhorn-outline</v-icon></template>
              <v-list-item-title class="text-body-2 font-weight-medium">Campaign</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon size="18" class="mr-2 text-medium-emphasis">mdi-sitemap-outline</v-icon></template>
              <v-list-item-title class="text-body-2 font-weight-medium">Journey</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon size="18" class="mr-2 text-medium-emphasis">mdi-account-plus-outline</v-icon></template>
              <v-list-item-title class="text-body-2 font-weight-medium">Contact</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item>
              <template #prepend><v-icon size="18" class="mr-2 text-medium-emphasis">mdi-box-variant-outline</v-icon></template>
              <v-list-item-title class="text-body-2 font-weight-medium">Product</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend><v-icon size="18" class="mr-2 text-medium-emphasis">mdi-shape-outline</v-icon></template>
              <v-list-item-title class="text-body-2 font-weight-medium">Category</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </MpPageHeader>

    <div class="dashboard-tabs-wrapper px-6 bg-surface border-b">
      <v-tabs v-model="dashboard.activeDashboardId" color="primary" density="compact" height="36" class="dashboard-tabs">
        <v-tab
          v-for="dash in dashboard.dashboards"
          :key="dash.id"
          :value="dash.id"
          class="text-none font-weight-medium"
        >
          {{ dash.name }}
          
          <v-menu v-if="dashboard.dashboards.length > 1" offset="y" open-on-hover>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="x-small" class="ml-1 mr-n2" v-bind="props" @click.stop></v-btn>
            </template>
            <v-list density="compact" elevation="2">
              <v-list-item @click="dashboard.removeDashboard(dash.id)" class="text-error">
                <v-list-item-title class="text-caption font-weight-medium">Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tab>
        
        <v-btn
          variant="text"
          size="small"
          class="ml-2 align-self-center px-1 text-none"
          color="medium-emphasis"
          min-width="32"
          rounded="lg"
          @click="showNewDashDialog = true"
        >
          <v-icon size="18">mdi-plus</v-icon>
        </v-btn>
      </v-tabs>
    </div>

    <MpDashboardFilters />

    <!-- Edit mode banner -->
    <v-expand-transition>
      <v-alert
        v-if="dashboard.editMode"
        type="info"
        variant="tonal"
        density="compact"
        rounded="lg"
        class="mb-4"
        closable
        @click:close="dashboard.toggleEditMode()"
      >
        <template #prepend>
          <v-icon>mdi-cursor-move</v-icon>
        </template>
        <strong>Editing dashboard</strong> — Drag widgets to reorder, use the menu to resize (S/M/L) or remove. Click "Done" when finished.
        <template #append>
          <v-btn size="small" variant="text" color="primary" class="text-none ml-2" @click="dashboard.resetToDefault()">
            <v-icon size="16" start>mdi-restore</v-icon>Reset to Default
          </v-btn>
        </template>
      </v-alert>
    </v-expand-transition>

    <!-- Widget Grid -->
    <div class="widget-grid" :class="{ 'edit-mode-grid': dashboard.editMode }">
      <MpDashboardWidget
        v-for="(widget, index) in dashboard.widgets"
        :key="widget.id"
        :widget-id="widget.id"
        :title="widget.title"
        :size="widget.size"
        :edit-mode="dashboard.editMode"
        :index="index"
        @resize="onResize"
        @remove="removeWithUndo"
        @drag-start="onDragStart"
        @drop="onDrop"
      >
        <!-- Render correct content based on widget type -->
        <WidgetKpiRow v-if="widget.type === 'kpi-row'" />
        <WidgetRevenueChart v-else-if="widget.type === 'revenue-chart'" />
        <WidgetActivityFeed v-else-if="widget.type === 'activity-feed'" />
        <WidgetTopCampaigns v-else-if="widget.type === 'campaign-list'" />
        <WidgetRecentOrders v-else-if="widget.type === 'order-list'" />
        <WidgetGoalGauge v-else-if="widget.type === 'goal-gauge'" :config="widget.config" />
        <WidgetLiveActivity v-else-if="widget.type === 'live-activity'" />
        <WidgetDaVinciCustom
          v-else-if="widget.type === 'davinci-custom'"
          :custom-data="widget.customData"
          :custom-query="widget.customQuery"
        />
      </MpDashboardWidget>

      <!-- Empty state when no widgets -->
      <div v-if="dashboard.widgets.length === 0" class="empty-dashboard">
        <v-card variant="flat" border rounded="xl" class="pa-12 text-center" style="grid-column: span 12;">
          <v-icon size="64" color="primary" class="mb-4" style="opacity: 0.2;">mdi-view-dashboard-outline</v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">Your dashboard is empty</h3>
          <p class="text-body-2 text-medium-emphasis mb-6">Add widgets to customize your dashboard, or ask Da Vinci to create one for you.</p>
          <div class="d-flex justify-center gap-3">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" @click="dashboard.catalogOpen = true">Add Widget</v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-restore" class="text-none" @click="dashboard.resetToDefault()">Restore Defaults</v-btn>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Widget Catalog Drawer -->
    <MpWidgetCatalog />

    <!-- Undo snackbar -->
    <v-snackbar v-model="snackbar" :timeout="5000" location="bottom" color="surface" rounded="lg">
      <div class="d-flex align-center gap-2">
        <v-icon size="18" color="warning">mdi-information-outline</v-icon>
        <span class="text-body-2">Widget removed</span>
      </div>
      <template #actions>
        <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold" @click="undoRemove">Undo</v-btn>
        <v-btn variant="text" size="small" class="text-none" @click="snackbar = false">Dismiss</v-btn>
      </template>
    </v-snackbar>

    <!-- New Dashboard Dialog -->
    <v-dialog v-model="showNewDashDialog" max-width="360" persistent>
      <v-card rounded="xl" class="pa-4">
        <h3 class="text-subtitle-1 font-weight-bold mb-4">Create New Dashboard</h3>
        <v-text-field
          v-model="newDashName"
          label="Dashboard Name"
          variant="outlined"
          density="compact"
          hide-details
          placeholder="e.g. Sales KPIs"
          autofocus
          @keyup.enter="createDashboard"
        ></v-text-field>
        <div class="d-flex justify-end gap-2 mt-4">
          <v-btn variant="text" size="small" class="text-none" @click="showNewDashDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="small" class="text-none" @click="createDashboard" :disabled="!newDashName.trim()">Create</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.widget-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  transition: all 0.3s ease;
}

.edit-mode-grid {
  padding: 8px;
  border-radius: 16px;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent calc(8.333% - 1px),
    rgba(var(--v-theme-primary), 0.03) calc(8.333% - 1px),
    rgba(var(--v-theme-primary), 0.03) 8.333%
  );
}

.gap-3 { gap: 12px; }

.empty-dashboard {
  grid-column: 1 / -1;
}
</style>
