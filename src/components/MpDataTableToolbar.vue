<script setup lang="ts">
import { computed } from 'vue'

const search = defineModel<string>('search', { default: '' })
const filterMenu = defineModel<boolean>('filterOpen', { default: false })
const hiddenColumns = defineModel<string[]>('hiddenColumns', { default: () => [] })

const props = defineProps<{
  searchPlaceholder?: string
  title?: string
  activeFilters?: Array<{ key: string; label: string }>
  selectedCount?: number
  totalCount?: number
  headers?: Array<{ title: string; key: string; [k: string]: any }>
}>()

defineEmits<{
  removeFilter: [key: string]
  clearFilters: []
  clearSelection: []
  selectAll: []
}>()

// Column visibility
const NON_TOGGLEABLE = new Set(['actions', 'data-table-select', 'data-table-expand'])

const toggleableHeaders = computed(() =>
  (props.headers ?? []).filter(h => h.title && !NON_TOGGLEABLE.has(h.key))
)

function isColumnVisible(key: string) {
  return !hiddenColumns.value.includes(key)
}

function toggleColumn(key: string) {
  if (hiddenColumns.value.includes(key)) {
    hiddenColumns.value = hiddenColumns.value.filter(k => k !== key)
  } else {
    hiddenColumns.value = [...hiddenColumns.value, key]
  }
}

function resetColumns() {
  hiddenColumns.value = []
}

function visibleChips(filters: Array<{ key: string; label: string }>) {
  return filters.slice(0, 3)
}
function hiddenCount(filters: Array<{ key: string; label: string }>) {
  return Math.max(0, filters.length - 3)
}
</script>

<template>
  <!-- Toolbar row: title + filter button + extra actions + search -->
  <div class="d-flex align-center ga-3 px-4 pt-4 pb-3 mp-toolbar-row">
    <div v-if="title" class="text-subtitle-1 font-weight-bold">{{ title }}</div>
    <slot name="title" />
    <v-spacer />

    <!-- Filter button — only rendered if #filter-content slot is provided -->
    <v-menu
      v-if="$slots['filter-content']"
      v-model="filterMenu"
      :close-on-content-click="false"
      location="bottom end"
    >
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          variant="outlined"
          class="text-none text-medium-emphasis mp-filter-btn"
          prepend-icon="mdi-filter-variant"
          rounded="lg"
        >
          Filter
          <v-badge
            v-if="activeFilters?.length"
            :content="activeFilters.length"
            color="primary"
            floating
            class="ml-1"
          />
        </v-btn>
      </template>
      <v-card min-width="280" max-width="320" flat border rounded="xl" class="mt-1">
        <slot name="filter-content" />
        <v-divider class="mp-divider-muted" />
        <div class="d-flex justify-end ga-2 pa-3">
          <v-btn variant="text" size="small" class="text-none" @click="$emit('clearFilters')">Clear all</v-btn>
          <v-btn color="primary" variant="flat" size="small" class="text-none" @click="filterMenu = false">Done</v-btn>
        </div>
      </v-card>
    </v-menu>

    <!-- Column visibility toggle -->
    <v-menu
      v-if="headers?.length"
      :close-on-content-click="false"
      location="bottom end"
    >
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          variant="outlined"
          icon="mdi-view-column-outline"
          rounded="lg"
          class="text-medium-emphasis mp-filter-btn"
        >
          <v-icon>mdi-view-column-outline</v-icon>
          <v-badge
            v-if="hiddenColumns.length"
            :content="hiddenColumns.length"
            color="primary"
            floating
          />
        </v-btn>
      </template>
      <v-card min-width="220" max-width="280" flat border rounded="xl" class="mt-1">
        <div class="pa-3">
          <div class="text-subtitle-2 font-weight-bold mb-2">Toggle columns</div>
          <v-checkbox
            v-for="h in toggleableHeaders"
            :key="h.key"
            :label="h.title"
            :model-value="isColumnVisible(h.key)"
            density="compact"
            hide-details
            class="mp-column-checkbox"
            @update:model-value="toggleColumn(h.key)"
          />
        </div>
        <v-divider class="mp-divider-muted" />
        <div class="d-flex justify-end pa-3">
          <v-btn
            variant="text"
            size="small"
            class="text-none"
            :disabled="!hiddenColumns.length"
            @click="resetColumns"
          >
            Reset
          </v-btn>
        </div>
      </v-card>
    </v-menu>

    <!-- Extra action buttons (export, columns toggle, etc.) -->
    <slot name="actions" />

    <!-- Search field -->
    <div class="mp-toolbar-search">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        :placeholder="searchPlaceholder ?? 'Search...'"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        rounded="lg"
      />
    </div>
  </div>

  <!-- Active filter chips row -->
  <v-expand-transition>
    <div
      v-if="activeFilters?.length"
      class="px-4 pb-3 d-flex align-center ga-2 flex-wrap"
    >
      <span class="text-caption text-medium-emphasis font-weight-medium mr-1">Filter by:</span>
      <v-chip
        v-for="f in visibleChips(activeFilters)"
        :key="f.key"
        size="small"
        closable
        variant="outlined"
        color="primary"
        rounded="lg"
        @click:close="$emit('removeFilter', f.key)"
      >
        {{ f.label }}
      </v-chip>
      <v-chip
        v-if="hiddenCount(activeFilters) > 0"
        size="small"
        variant="outlined"
        color="medium-emphasis"
        rounded="lg"
      >
        + {{ hiddenCount(activeFilters) }} more
      </v-chip>
      <v-btn variant="text" size="x-small" class="text-none text-medium-emphasis" @click="$emit('clearFilters')">
        Clear
      </v-btn>
    </div>
  </v-expand-transition>

  <!-- Inline bulk action bar -->
  <v-expand-transition>
    <div v-if="selectedCount && selectedCount > 0" class="px-4 pb-3">
      <div class="d-flex align-center ga-3 pa-3 rounded-lg bg-surface-variant">
        <span class="text-body-2 font-weight-bold">
          {{ selectedCount }}
          <span v-if="totalCount" class="font-weight-regular text-medium-emphasis">
            of {{ totalCount }} selected
          </span>
          <span v-else class="font-weight-regular text-medium-emphasis">selected</span>
        </span>
        <v-btn
          v-if="totalCount"
          variant="text"
          size="small"
          class="text-none text-primary font-weight-medium"
          @click="$emit('selectAll')"
        >
          Select All
        </v-btn>
        <v-divider v-if="$slots['bulk-actions']" vertical class="mx-1 mp-divider-vertical" />
        <slot name="bulk-actions" />
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          @click="$emit('clearSelection')"
        />
      </div>
    </div>
  </v-expand-transition>

  <!-- Separator between toolbar and data table header row -->
  <v-divider class="mp-divider-toolbar" />
</template>

<style scoped lang="scss">
@import '@/design-tokens/generated/_variables.scss';

.mp-toolbar-row {
  min-height: $mp-layout-appbarHeight;
}
.mp-filter-btn {
  height: $mp-spacing-10;
}
.mp-toolbar-search {
  width: 220px;
}
.mp-divider-vertical {
  height: $mp-spacing-6;
}
.mp-divider-muted {
  opacity: 0.4;
}
.mp-divider-toolbar {
  opacity: 0.12;
}
.mp-column-checkbox {
  :deep(.v-label) {
    font-size: 13px;
  }
}
</style>
