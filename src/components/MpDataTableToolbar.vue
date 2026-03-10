<script setup lang="ts">
const search = defineModel<string>('search', { default: '' })
const filterMenu = defineModel<boolean>('filterOpen', { default: false })

defineProps<{
  searchPlaceholder?: string
  title?: string
  activeFilters?: Array<{ key: string; label: string }>
  selectedCount?: number
  totalCount?: number
}>()

defineEmits<{
  removeFilter: [key: string]
  clearFilters: []
  clearSelection: []
  selectAll: []
}>()

function visibleChips(filters: Array<{ key: string; label: string }>) {
  return filters.slice(0, 3)
}
function hiddenCount(filters: Array<{ key: string; label: string }>) {
  return Math.max(0, filters.length - 3)
}
</script>

<template>
  <!-- Toolbar row: title + filter button + extra actions + search -->
  <div class="d-flex align-center ga-3 px-4 pt-4 pb-3" style="min-height: 56px;">
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
          class="text-none text-medium-emphasis"
          prepend-icon="mdi-filter-variant"
          rounded="lg"
          style="height: 40px;"
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
      <v-card min-width="280" max-width="320" elevation="8" rounded="xl" class="mt-1">
        <slot name="filter-content" />
        <v-divider style="opacity: 0.4" />
        <div class="d-flex justify-end ga-2 pa-3">
          <v-btn variant="text" size="small" class="text-none" @click="$emit('clearFilters')">Clear all</v-btn>
          <v-btn color="primary" variant="flat" size="small" class="text-none" @click="filterMenu = false">Done</v-btn>
        </div>
      </v-card>
    </v-menu>

    <!-- Extra action buttons (export, columns toggle, etc.) -->
    <slot name="actions" />

    <!-- Search field -->
    <div style="width: 220px;">
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
        <v-divider v-if="$slots['bulk-actions']" vertical class="mx-1" style="height: 24px;" />
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
  <v-divider style="opacity: 0.12;" />
</template>
