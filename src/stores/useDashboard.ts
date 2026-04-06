import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export type WidgetSize = 'S' | 'M' | 'L'
export type WidgetType = 'kpi-row' | 'revenue-chart' | 'activity-feed' | 'campaign-list' | 'order-list' | 'davinci-custom' | 'goal-gauge' | 'live-activity'
export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  size: WidgetSize
  /** For davinci-custom widgets — the componentData from a copilot response */
  customData?: {
    type: string
    props: any
  }[]
  /** User-query that created the custom widget (for display) */
  customQuery?: string
  /** General widget config (e.g. gauge type) */
  config?: any
}

export interface DashboardState {
  id: string
  name: string
  widgets: DashboardWidget[]
}

export interface GlobalFilters {
  dateRange: '7D' | '30D' | '3M' | 'YTD'
  segment: string
  region: string
}

/** A chart saved from copilot into the widget library (not yet on dashboard) */
export interface SavedChart {
  id: string
  title: string
  query: string
  savedAt: number
  chartData: {
    type: string
    props: any
  }
}

const STORAGE_KEY = 'mp-dashboard-layout'
const ACTIVE_DASHBOARD_KEY = 'mp-active-dashboard'
const SAVED_CHARTS_KEY = 'mp-saved-charts'
const FILTERS_KEY = 'mp-dashboard-filters'
export const MAX_WIDGETS = 20

function defaultWidgets(): DashboardWidget[] {
  return [
    { id: 'kpi-row', type: 'kpi-row', title: 'Key Metrics', size: 'L' },
    { id: 'revenue-chart', type: 'revenue-chart', title: 'Revenue & Engagement Overview', size: 'L' },
    { id: 'activity-feed', type: 'activity-feed', title: 'Recent Activity', size: 'M' },
    { id: 'campaign-list', type: 'campaign-list', title: 'Top Campaigns by Revenue', size: 'M' },
    { id: 'order-list', type: 'order-list', title: 'Recent Orders', size: 'M' },
  ]
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<DashboardState[]>([
    { id: 'default', name: 'My Dashboard', widgets: defaultWidgets() }
  ])
  const activeDashboardId = ref<string>('default')
  
  const activeDashboard = computed(() => dashboards.value.find(d => d.id === activeDashboardId.value) || dashboards.value[0]!)
  const widgets = computed(() => activeDashboard.value.widgets)

  const editMode = ref(false)
  const catalogOpen = ref(false)
  const savedCharts = ref<SavedChart[]>([])
  const globalFilters = ref<GlobalFilters>({
    dateRange: '30D',
    segment: 'all',
    region: 'all'
  })

  const widgetCount = computed(() => widgets.value.length)
  const canAddMore = computed(() => widgets.value.length < MAX_WIDGETS)

  // ── Persistence ───────────────────────────────────────────
  function loadLayout() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].widgets) { // New format
            dashboards.value = parsed
          } else { // Old format (array of widgets)
            dashboards.value = [{ id: 'default', name: 'My Dashboard', widgets: parsed }]
          }
        }
      }
    } catch { /* ignore */ }

    try {
      const savedActiveId = localStorage.getItem(ACTIVE_DASHBOARD_KEY)
      if (savedActiveId && dashboards.value.some(d => d.id === savedActiveId)) {
        activeDashboardId.value = savedActiveId
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem(SAVED_CHARTS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) savedCharts.value = parsed
      }
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem(FILTERS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed) globalFilters.value = { ...globalFilters.value, ...parsed }
      }
    } catch { /* ignore */ }
  }

  function saveLayout() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards.value))
    localStorage.setItem(ACTIVE_DASHBOARD_KEY, activeDashboardId.value)
  }

  function saveSavedCharts() {
    localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(savedCharts.value))
  }

  function saveFilters() {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(globalFilters.value))
  }

  // Auto-save whenever widgets or savedCharts change
  watch(dashboards, saveLayout, { deep: true })
  watch(activeDashboardId, saveLayout)
  watch(savedCharts, saveSavedCharts, { deep: true })
  watch(globalFilters, saveFilters, { deep: true })

  // ── Widget Actions ────────────────────────────────────────
  function addWidget(widget: Omit<DashboardWidget, 'id'> & { id?: string }) {
    if (!canAddMore.value) return ''
    const id = widget.id || `widget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    activeDashboard.value.widgets.push({ ...widget, id })
    return id
  }

  function removeWidget(id: string) {
    const idx = widgets.value.findIndex(w => w.id === id)
    if (idx !== -1) activeDashboard.value.widgets.splice(idx, 1)
  }

  function resizeWidget(id: string, size: WidgetSize) {
    const w = widgets.value.find(w => w.id === id)
    if (w) w.size = size
  }

  function reorderWidget(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const [moved] = activeDashboard.value.widgets.splice(fromIndex, 1)
    if (moved) activeDashboard.value.widgets.splice(toIndex, 0, moved)
  }

  function resetToDefault() {
    activeDashboard.value.widgets = defaultWidgets()
  }

  function applyTemplate(title: string, templateWidgets: Omit<DashboardWidget, 'id'>[]) {
    const id = `dash-${Date.now()}`
    dashboards.value.push({
      id,
      name: title,
      widgets: templateWidgets.map(w => ({
        ...w,
        id: `widget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      }))
    })
    activeDashboardId.value = id
  }

  function addDashboard(name: string) {
    const id = `dash-${Date.now()}`
    dashboards.value.push({ id, name, widgets: defaultWidgets() })
    activeDashboardId.value = id
  }

  function removeDashboard(id: string) {
    if (dashboards.value.length <= 1) return // retain at least one
    const idx = dashboards.value.findIndex(d => d.id === id)
    if (idx !== -1) {
      dashboards.value.splice(idx, 1)
      if (activeDashboardId.value === id) {
        activeDashboardId.value = dashboards.value[0]!.id
      }
    }
  }

  function toggleEditMode() {
    editMode.value = !editMode.value
  }

  function setGlobalFilter(key: keyof GlobalFilters, value: any) {
    globalFilters.value[key] = value
  }

  // ── Saved Charts Library ──────────────────────────────────
  function saveChart(chart: Omit<SavedChart, 'id' | 'savedAt'>) {
    const id = `chart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    savedCharts.value.push({ ...chart, id, savedAt: Date.now() })
    return id
  }

  function removeSavedChart(id: string) {
    const idx = savedCharts.value.findIndex(c => c.id === id)
    if (idx !== -1) savedCharts.value.splice(idx, 1)
  }

  function isSavedChartOnDashboard(chartId: string): boolean {
    return widgets.value.some(w => w.id === `dv-${chartId}`)
  }

  function addSavedChartToDashboard(chart: SavedChart) {
    if (!canAddMore.value) return
    const widgetId = `dv-${chart.id}`
    if (widgets.value.some(w => w.id === widgetId)) return // already added
    addWidget({
      id: widgetId,
      type: 'davinci-custom',
      title: chart.title,
      size: 'M',
      customData: [chart.chartData],
      customQuery: chart.query,
    })
  }

  function removeSavedChartFromDashboard(chartId: string) {
    removeWidget(`dv-${chartId}`)
  }

  function updateDashboardName(id: string, name: string) {
    const dash = dashboards.value.find(d => d.id === id)
    if (dash) dash.name = name
  }

  // ── Helper: size → col-span ─────────────────────────────
  function colSpan(size: WidgetSize): number {
    switch (size) {
      case 'S': return 4
      case 'M': return 6
      case 'L': return 12
    }
  }

  // Init on store creation
  loadLayout()

  return {
    dashboards,
    activeDashboardId,
    activeDashboard,
    widgets,
    editMode,
    catalogOpen,
    savedCharts,
    globalFilters,
    widgetCount,
    canAddMore,
    addWidget,
    removeWidget,
    resizeWidget,
    reorderWidget,
    resetToDefault,
    toggleEditMode,
    setGlobalFilter,
    applyTemplate,
    addDashboard,
    removeDashboard,
    updateDashboardName,
    colSpan,
    loadLayout,
    saveLayout,
    saveChart,
    removeSavedChart,
    isSavedChartOnDashboard,
    addSavedChartToDashboard,
    removeSavedChartFromDashboard,
  }
})
