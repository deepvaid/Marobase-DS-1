<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WidgetSize } from '@/stores/useDashboard'

const props = defineProps<{
  widgetId: string
  title: string
  size: WidgetSize
  editMode: boolean
  index: number
}>()

const emit = defineEmits<{
  resize: [id: string, size: WidgetSize]
  remove: [id: string]
  dragStart: [index: number]
  dragOver: [index: number]
  drop: [index: number]
}>()

const menuOpen = ref(false)
const isDragOver = ref(false)
const isRemoving = ref(false)

const colSpanClass = computed(() => {
  switch (props.size) {
    case 'S': return 'widget-col-4'
    case 'M': return 'widget-col-6'
    case 'L': return 'widget-col-12'
  }
})

function onResize(size: WidgetSize) {
  emit('resize', props.widgetId, size)
  menuOpen.value = false
}

function onRemove() {
  isRemoving.value = true
  setTimeout(() => {
    emit('remove', props.widgetId)
  }, 300)
}

function onDragStart(e: DragEvent) {
  if (!props.editMode) return
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', String(props.index))
  emit('dragStart', props.index)
}

function onDragOver(e: DragEvent) {
  if (!props.editMode) return
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  if (!props.editMode) return
  e.preventDefault()
  isDragOver.value = false
  emit('drop', props.index)
}
</script>

<template>
  <div
    :class="[
      'dashboard-widget',
      colSpanClass,
      {
        'edit-mode': editMode,
        'drag-over': isDragOver,
        'removing': isRemoving,
      }
    ]"
    :draggable="editMode"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <v-card variant="flat" border rounded="xl" class="widget-card h-100">
      <!-- Widget Header -->
      <div class="widget-header d-flex align-center px-5 pt-4 pb-2">
        <!-- Drag handle (edit mode only) -->
        <v-icon
          v-if="editMode"
          class="drag-handle mr-2"
          size="18"
          color="medium-emphasis"
          style="cursor: grab;"
        >mdi-drag</v-icon>

        <div class="text-h6 font-weight-medium flex-grow-1">{{ title }}</div>

        <!-- Size badge (edit mode) -->
        <v-chip
          v-if="editMode"
          size="x-small"
          variant="tonal"
          color="primary"
          class="mr-2 font-weight-bold"
        >{{ size }}</v-chip>

        <!-- Kebab menu -->
        <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn icon variant="text" size="28" v-bind="menuProps" class="widget-menu-btn">
              <v-icon size="18">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card rounded="lg" width="200" class="py-1" elevation="4">
            <div class="px-3 py-2 text-caption font-weight-bold text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Resize</div>
            <v-list-item
              v-for="s in (['S', 'M', 'L'] as WidgetSize[])" :key="s"
              density="compact"
              :active="size === s"
              @click="onResize(s)"
            >
              <template #prepend>
                <v-icon size="16" class="mr-2">
                  {{ s === 'S' ? 'mdi-rectangle-outline' : s === 'M' ? 'mdi-rectangle' : 'mdi-monitor' }}
                </v-icon>
              </template>
              <v-list-item-title class="text-body-2">
                {{ s === 'S' ? 'Small (1/3)' : s === 'M' ? 'Medium (1/2)' : 'Large (Full)' }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-1" />
            <v-list-item density="compact" @click="onRemove">
              <template #prepend>
                <v-icon size="16" color="error" class="mr-2">mdi-delete-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2 text-error">Remove Widget</v-list-item-title>
            </v-list-item>
          </v-card>
        </v-menu>

        <!-- Quick remove button (edit mode) -->
        <v-btn
          v-if="editMode"
          icon
          variant="text"
          size="24"
          class="ml-1 remove-btn"
          @click="onRemove"
        >
          <v-icon size="16" color="error">mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Remove widget</v-tooltip>
        </v-btn>
      </div>

      <!-- Widget Content -->
      <div class="widget-content px-5 pb-5 pt-1">
        <slot />
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.dashboard-widget {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 120px;
}

.widget-col-4 { grid-column: span 4; }
.widget-col-6 { grid-column: span 6; }
.widget-col-12 { grid-column: span 12; }

/* Responsive */
@media (max-width: 960px) {
  .widget-col-4,
  .widget-col-6 {
    grid-column: span 12;
  }
}
@media (min-width: 961px) and (max-width: 1264px) {
  .widget-col-4 {
    grid-column: span 6;
  }
}

.widget-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-menu-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.widget-card:hover .widget-menu-btn,
.edit-mode .widget-menu-btn {
  opacity: 1;
}

/* Edit mode styling */
.edit-mode .widget-card {
  border-style: dashed !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 2px !important;
}

.edit-mode .drag-handle {
  cursor: grab;
}
.edit-mode .drag-handle:active {
  cursor: grabbing;
}

.edit-mode:hover .widget-card {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.12);
}

/* Drag over state */
.drag-over .widget-card {
  border-color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.04) !important;
  transform: scale(1.01);
}

/* Removing animation */
.removing {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}

/* Remove button */
.remove-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.edit-mode:hover .remove-btn {
  opacity: 1;
}
</style>
