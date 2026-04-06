<script setup lang="ts">
import { ref } from 'vue'
import { useDaVinciStore } from '@/stores/useDaVinci'
import MpPageHeader from '@/components/MpPageHeader.vue'

const daVinci = useDaVinciStore()

interface MenuItem {
  id: string
  label: string
  url: string
  visible: boolean
  children: MenuItem[]
}

const menus = ref([
  {
    id: 'main',
    name: 'Main Menu',
    location: 'Header',
    icon: 'mdi-menu',
    items: [
      { id: 'm1', label: 'Home', url: '/', visible: true, children: [] },
      { id: 'm2', label: 'Shop All', url: '/collections/all', visible: true, children: [
        { id: 'm2a', label: 'Electric Scooters', url: '/collections/scooters', visible: true, children: [] },
        { id: 'm2b', label: 'Accessories', url: '/collections/accessories', visible: true, children: [] },
        { id: 'm2c', label: 'Helmets & Safety', url: '/collections/safety', visible: true, children: [] },
      ] },
      { id: 'm3', label: 'New Arrivals', url: '/collections/new', visible: true, children: [] },
      { id: 'm4', label: 'Sale', url: '/collections/sale', visible: true, children: [] },
      { id: 'm5', label: 'About Us', url: '/pages/about', visible: true, children: [] },
      { id: 'm6', label: 'Contact', url: '/pages/contact', visible: true, children: [] },
    ] as MenuItem[]
  },
  {
    id: 'footer',
    name: 'Footer Menu',
    location: 'Footer',
    icon: 'mdi-page-layout-footer',
    items: [
      { id: 'f1', label: 'Privacy Policy', url: '/pages/privacy', visible: true, children: [] },
      { id: 'f2', label: 'Terms of Service', url: '/pages/terms', visible: true, children: [] },
      { id: 'f3', label: 'Shipping Policy', url: '/pages/shipping', visible: true, children: [] },
      { id: 'f4', label: 'Returns & Refunds', url: '/pages/returns', visible: true, children: [] },
    ] as MenuItem[]
  },
])

const activeMenuId = ref('main')
const activeMenu = ref(menus.value[0])

function setActiveMenu(id: string) {
  activeMenuId.value = id
  const found = menus.value.find(m => m.id === id)
  if (found) activeMenu.value = found
}

// Edit item
const editDialog = ref(false)
const editingItem = ref<MenuItem | null>(null)

function editItem(item: MenuItem) {
  editingItem.value = { ...item, children: item.children }
  editDialog.value = true
}

function saveItem() {
  if (!editingItem.value) return
  // Find and update the item in the menu
  function updateInList(items: MenuItem[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === editingItem.value!.id) {
        items[i].label = editingItem.value!.label
        items[i].url = editingItem.value!.url
        items[i].visible = editingItem.value!.visible
        return true
      }
      if (updateInList(items[i].children)) return true
    }
    return false
  }
  updateInList(activeMenu.value.items)
  editDialog.value = false
}

// Add item
const addDialog = ref(false)
const newItem = ref({ label: '', url: '', visible: true })

function openAddDialog() {
  newItem.value = { label: '', url: '', visible: true }
  addDialog.value = true
}

function addMenuItem() {
  activeMenu.value.items.push({
    id: `new_${Date.now()}`,
    label: newItem.value.label,
    url: newItem.value.url,
    visible: newItem.value.visible,
    children: [],
  })
  addDialog.value = false
}

function removeItem(itemId: string) {
  function removeFromList(items: MenuItem[]): boolean {
    const idx = items.findIndex(i => i.id === itemId)
    if (idx !== -1) { items.splice(idx, 1); return true }
    return items.some(i => removeFromList(i.children))
  }
  removeFromList(activeMenu.value.items)
}

// Da Vinci
const dvBuilding = ref(false)
function autoBuildMenu() {
  dvBuilding.value = true
  setTimeout(() => {
    // Simulate Da Vinci generating a menu
    activeMenu.value.items.push(
      { id: `dv_${Date.now()}`, label: 'Best Sellers', url: '/collections/best-sellers', visible: true, children: [] },
      { id: `dv_${Date.now()+1}`, label: 'Gift Cards', url: '/products/gift-card', visible: true, children: [] },
    )
    dvBuilding.value = false
  }, 2000)
}

function askDaVinciNav() {
  daVinci.openWithQuery('Suggest an optimal navigation structure for my e-commerce store that maximizes conversions and reduces bounce rate')
}

const saveSnack = ref(false)
function saveMenu() { saveSnack.value = true }
</script>

<template>
  <div>
    <MpPageHeader
      title="Store Navigation"
      subtitle="Build and manage menus for your storefront"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Commerce', to: '/commerce/orders' },
        { title: 'Navigation', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="purple" variant="tonal" size="small" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" @click="askDaVinciNav">Ask Da Vinci</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" class="text-none" @click="saveMenu">Save Menus</v-btn>
      </template>
    </MpPageHeader>

    <v-row>
      <!-- Left Sidebar: Menu List -->
      <v-col cols="12" md="4" lg="3">
        <v-card variant="flat" border rounded="xl">
          <div class="pa-4 border-b">
            <div class="text-subtitle-1 font-weight-medium">Menus</div>
          </div>
          <v-list density="compact" :border="false" class="pa-2">
            <v-list-item
              v-for="menu in menus"
              :key="menu.id"
              :active="activeMenuId === menu.id"
              active-color="primary"
              rounded="lg"
              class="mb-1"
              @click="setActiveMenu(menu.id)"
            >
              <template v-slot:prepend>
                <v-icon :color="activeMenuId === menu.id ? 'primary' : 'medium-emphasis'" size="20" class="mr-3">{{ menu.icon }}</v-icon>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">{{ menu.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ menu.location }} · {{ menu.items.length }} items</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div class="pa-3 border-t">
            <v-btn block variant="tonal" prepend-icon="mdi-plus" class="text-none" size="small">Create Menu</v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Right: Menu Editor -->
      <v-col cols="12" md="8" lg="9">
        <v-card variant="flat" border rounded="xl">
          <div class="pa-5 border-b d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-medium">{{ activeMenu.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ activeMenu.location }} navigation · {{ activeMenu.items.length }} items</div>
            </div>
            <div class="d-flex gap-2">
              <v-btn color="purple" variant="tonal" size="small" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" :loading="dvBuilding" @click="autoBuildMenu">Auto-build with Da Vinci</v-btn>
              <v-btn variant="outlined" size="small" prepend-icon="mdi-plus" class="text-none" @click="openAddDialog">Add Item</v-btn>
            </div>
          </div>

          <!-- Menu Items List -->
          <div class="pa-4">
            <div v-for="item in activeMenu.items" :key="item.id" class="mb-2">
              <!-- Top-level item -->
              <v-card variant="flat" border rounded="lg" class="nav-item pa-3" :class="{ 'nav-item-hidden': !item.visible }">
                <div class="d-flex align-center gap-3">
                  <v-icon size="18" color="medium-emphasis" class="cursor-grab">mdi-drag-vertical</v-icon>
                  <v-icon size="18" :color="item.visible ? 'primary' : 'medium-emphasis'">mdi-link-variant</v-icon>
                  <div class="flex-grow-1">
                    <span class="text-body-2 font-weight-medium">{{ item.label }}</span>
                    <span class="text-caption text-medium-emphasis ml-2">{{ item.url }}</span>
                  </div>
                  <v-chip v-if="item.children.length > 0" size="x-small" variant="tonal" color="secondary">{{ item.children.length }} sub</v-chip>
                  <v-tooltip text="Toggle visibility" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'" variant="text" size="x-small" :color="item.visible ? 'medium-emphasis' : 'error'" @click="item.visible = !item.visible" />
                    </template>
                  </v-tooltip>
                  <v-btn icon="mdi-pencil-outline" variant="text" size="x-small" color="primary" @click="editItem(item)" />
                  <v-btn icon="mdi-delete-outline" variant="text" size="x-small" color="error" @click="removeItem(item.id)" />
                </div>
              </v-card>

              <!-- Child items (nested) -->
              <div v-if="item.children.length > 0" class="ml-8 mt-1">
                <v-card v-for="child in item.children" :key="child.id" variant="flat" border rounded="lg" class="nav-item nav-item-child pa-3 mb-1" :class="{ 'nav-item-hidden': !child.visible }">
                  <div class="d-flex align-center gap-3">
                    <v-icon size="16" color="medium-emphasis" class="cursor-grab">mdi-drag-vertical</v-icon>
                    <v-icon size="14" color="medium-emphasis">mdi-subdirectory-arrow-right</v-icon>
                    <div class="flex-grow-1">
                      <span class="text-body-2 font-weight-medium">{{ child.label }}</span>
                      <span class="text-caption text-medium-emphasis ml-2">{{ child.url }}</span>
                    </div>
                    <v-btn icon="mdi-pencil-outline" variant="text" size="x-small" color="primary" @click="editItem(child)" />
                    <v-btn icon="mdi-delete-outline" variant="text" size="x-small" color="error" @click="removeItem(child.id)" />
                  </div>
                </v-card>
              </div>
            </div>

            <!-- Empty state -->
            <v-card v-if="activeMenu.items.length === 0" variant="flat" border rounded="xl" class="pa-8 text-center">
              <v-icon size="48" color="medium-emphasis" class="mb-3">mdi-sitemap-outline</v-icon>
              <div class="text-body-1 font-weight-medium mb-1">No menu items yet</div>
              <div class="text-body-2 text-medium-emphasis mb-4">Add items manually or let Da Vinci auto-build your menu</div>
              <div class="d-flex justify-center gap-2">
                <v-btn variant="outlined" prepend-icon="mdi-plus" class="text-none" @click="openAddDialog">Add Item</v-btn>
                <v-btn color="purple" variant="tonal" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" @click="autoBuildMenu">Auto-build</v-btn>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Item Dialog -->
    <v-dialog v-model="addDialog" max-width="500">
      <v-card rounded="xl">
        <div class="pa-5 border-b">
          <div class="text-h6 font-weight-bold">Add Menu Item</div>
        </div>
        <div class="pa-5">
          <v-text-field v-model="newItem.label" label="Label" variant="outlined" density="comfortable" placeholder="e.g. Shop All" class="mb-3" />
          <v-text-field v-model="newItem.url" label="URL or Page" variant="outlined" density="comfortable" placeholder="e.g. /collections/all" class="mb-3" />
          <v-card variant="flat" border rounded="xl" class="pa-3">
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-2 font-weight-medium">Visible</div>
              <v-switch v-model="newItem.visible" color="primary" hide-details density="compact" inset />
            </div>
          </v-card>
        </div>
        <div class="pa-5 border-t d-flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :disabled="!newItem.label || !newItem.url" @click="addMenuItem">Add Item</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Edit Item Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card v-if="editingItem" rounded="xl">
        <div class="pa-5 border-b">
          <div class="text-h6 font-weight-bold">Edit Menu Item</div>
        </div>
        <div class="pa-5">
          <v-text-field v-model="editingItem.label" label="Label" variant="outlined" density="comfortable" class="mb-3" />
          <v-text-field v-model="editingItem.url" label="URL or Page" variant="outlined" density="comfortable" class="mb-3" />
          <v-card variant="flat" border rounded="xl" class="pa-3">
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-2 font-weight-medium">Visible</div>
              <v-switch v-model="editingItem.visible" color="primary" hide-details density="compact" inset />
            </div>
          </v-card>
        </div>
        <div class="pa-5 border-t d-flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" @click="saveItem">Save Changes</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
      <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Navigation saved successfully</div>
    </v-snackbar>
  </div>
</template>

<style scoped>
.nav-item {
  transition: all 0.15s;
}
.nav-item:hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.02);
}
.nav-item-hidden {
  opacity: 0.5;
}
.nav-item-child {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.2);
}
.cursor-grab {
  cursor: grab;
}
</style>
