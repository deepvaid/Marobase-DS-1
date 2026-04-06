<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDaVinciStore } from '@/stores/useDaVinci'
import MpPageHeader from '@/components/MpPageHeader.vue'

const router = useRouter()

const daVinci = useDaVinciStore()

const activeTheme = ref({
  name: 'Dawn',
  version: '14.0.0',
  lastEdited: '2 hours ago',
  status: 'Published',
  previewColor: '#6366F1',
})

const themeLibrary = [
  { name: 'Dawn', description: 'Clean and modern with fast performance', category: 'Free', colors: ['#6366F1', '#818CF8', '#A5B4FC'], features: ['Responsive', 'SEO-ready', 'Fast'], active: true },
  { name: 'Taste', description: 'Bold typography and rich imagery for food & beverage', category: 'Free', colors: ['#F59E0B', '#D97706', '#FBBF24'], features: ['Gallery', 'Menu builder', 'Reviews'] },
  { name: 'Craft', description: 'Artisanal and handmade product showcase', category: 'Free', colors: ['#10B981', '#059669', '#34D399'], features: ['Story blocks', 'Lookbook', 'Video'] },
  { name: 'Refresh', description: 'Health and wellness focused with vibrant energy', category: 'Premium', colors: ['#EC4899', '#DB2777', '#F472B6'], features: ['Subscription', 'Quiz', 'Reviews'] },
  { name: 'Spotlight', description: 'Single product hero with immersive experience', category: 'Premium', colors: ['#8B5CF6', '#7C3AED', '#A78BFA'], features: ['3D viewer', 'Parallax', 'Video hero'] },
  { name: 'Starter', description: 'Minimal setup for getting started quickly', category: 'Free', colors: ['#64748B', '#475569', '#94A3B8'], features: ['Quick setup', 'Minimal', 'Blog'] },
]

const selectedTheme = ref<typeof themeLibrary[0] | null>(null)
const previewDialog = ref(false)

function previewTheme(theme: typeof themeLibrary[0]) {
  selectedTheme.value = theme
  previewDialog.value = true
}

function generateTheme() {
  daVinci.openWithQuery('Design a modern e-commerce theme for my scooter store with bold colors, product-focused hero sections, and fast checkout flow')
}

const dvCustomizing = ref(false)
function customizeWithDaVinci() {
  dvCustomizing.value = true
  setTimeout(() => {
    dvCustomizing.value = false
    daVinci.openWithQuery('Help me customize my Dawn theme — suggest color palette and layout changes to improve conversions')
  }, 800)
}
</script>

<template>
  <div>
    <MpPageHeader
      title="Store Themes"
      subtitle="Choose a theme for your online storefront"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Commerce', to: '/commerce/orders' },
        { title: 'Themes', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="purple" variant="tonal" size="small" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" @click="generateTheme">Generate Theme with Da Vinci</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-upload" class="text-none">Upload Theme</v-btn>
      </template>
    </MpPageHeader>

    <!-- Active Theme -->
    <v-card variant="flat" border rounded="xl" class="mb-6">
      <div class="pa-5 border-b d-flex align-center justify-space-between">
        <div>
          <div class="text-h6 font-weight-medium">Active Theme</div>
          <div class="text-caption text-medium-emphasis">Currently published to your storefront</div>
        </div>
        <v-chip color="success" variant="flat" size="small" prepend-icon="mdi-check-circle">Published</v-chip>
      </div>
      <div class="pa-5">
        <v-row align="center">
          <v-col cols="12" md="5">
            <!-- Theme Preview Mock -->
            <v-card rounded="xl" class="overflow-hidden active-theme-preview" variant="flat">
              <div class="theme-preview-header" :style="{ background: `linear-gradient(135deg, ${activeTheme.previewColor}, ${activeTheme.previewColor}dd)` }">
                <div class="d-flex align-center gap-2 pa-3">
                  <div style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
                  <div style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
                  <div style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
                </div>
                <div class="text-center py-8">
                  <div class="text-white text-h5 font-weight-bold mb-2">Scooter Village</div>
                  <div class="text-white text-body-2" style="opacity: 0.8;">Premium Electric Scooters</div>
                </div>
              </div>
              <div class="pa-4 d-flex gap-2 justify-center" style="background: #fafafa;">
                <div v-for="i in 3" :key="i" class="rounded-lg" style="width:80px;height:80px;background:#e5e7eb;"></div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="7">
            <div class="pl-md-4">
              <h3 class="text-h5 font-weight-bold mb-1">{{ activeTheme.name }}</h3>
              <div class="text-body-2 text-medium-emphasis mb-4">Version {{ activeTheme.version }} · Last edited {{ activeTheme.lastEdited }}</div>

              <div class="d-flex flex-wrap gap-2 mb-5">
                <v-chip size="small" variant="tonal" color="primary" v-for="f in ['Responsive', 'SEO-ready', 'Fast loading', 'Mobile-first']" :key="f">{{ f }}</v-chip>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-palette-outline" class="text-none" @click="router.push('/commerce/themes/builder')">Customize</v-btn>
                <v-btn variant="outlined" prepend-icon="mdi-code-tags" class="text-none">Edit Code</v-btn>
                <v-btn color="purple" variant="tonal" prepend-icon="mdi-auto-fix" class="text-none font-weight-bold" :loading="dvCustomizing" @click="customizeWithDaVinci">Customize with Da Vinci</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Theme Library -->
    <div class="mb-4 d-flex align-center justify-space-between">
      <div>
        <div class="text-h6 font-weight-medium">Theme Library</div>
        <div class="text-caption text-medium-emphasis">Browse and install themes for your store</div>
      </div>
      <v-btn-toggle variant="outlined" density="compact" divided rounded="lg" mandatory>
        <v-btn size="small" icon="mdi-view-grid" />
        <v-btn size="small" icon="mdi-format-list-bulleted" />
      </v-btn-toggle>
    </div>

    <v-row>
      <v-col v-for="theme in themeLibrary" :key="theme.name" cols="12" sm="6" lg="4">
        <v-card variant="flat" border rounded="xl" class="theme-card h-100" :class="{ 'theme-active': theme.active }">
          <!-- Theme Preview -->
          <div class="theme-card-preview" :style="{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }">
            <div class="d-flex align-center justify-space-between pa-3">
              <div class="d-flex gap-1">
                <div style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>
              </div>
              <v-chip v-if="theme.active" color="white" size="x-small" variant="flat" class="font-weight-bold" style="color: #333;">Active</v-chip>
              <v-chip v-else-if="theme.category === 'Premium'" size="x-small" variant="flat" style="background: rgba(255,255,255,0.2); color: white;">Premium</v-chip>
            </div>
            <div class="text-center py-6">
              <div class="text-white text-h6 font-weight-bold">{{ theme.name }}</div>
            </div>
            <!-- Hover overlay -->
            <div class="theme-overlay d-flex align-center justify-center gap-2">
              <v-btn color="white" variant="flat" size="small" class="text-none font-weight-bold" @click="previewTheme(theme)">Preview</v-btn>
              <v-btn v-if="!theme.active" color="white" variant="outlined" size="small" class="text-none">Try Theme</v-btn>
            </div>
          </div>

          <div class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-2 font-weight-bold">{{ theme.name }}</div>
              <div class="d-flex gap-1">
                <div v-for="c in theme.colors" :key="c" :style="{ width: '14px', height: '14px', borderRadius: '50%', background: c }" />
              </div>
            </div>
            <div class="text-body-2 text-medium-emphasis mb-3" style="line-height: 1.5;">{{ theme.description }}</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip v-for="f in theme.features" :key="f" size="x-small" variant="tonal" color="secondary">{{ f }}</v-chip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Theme Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="900" rounded="xl">
      <v-card v-if="selectedTheme" rounded="xl">
        <div class="pa-5 border-b d-flex align-center justify-space-between">
          <div>
            <div class="text-h6 font-weight-bold">{{ selectedTheme.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ selectedTheme.description }}</div>
          </div>
          <v-btn icon variant="text" @click="previewDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <div :style="{ background: `linear-gradient(135deg, ${selectedTheme.colors[0]}, ${selectedTheme.colors[1]})`, minHeight: '400px' }" class="d-flex align-center justify-center">
          <div class="text-center text-white">
            <v-icon size="64" color="white" class="mb-4" style="opacity: 0.6;">mdi-storefront-outline</v-icon>
            <div class="text-h4 font-weight-bold mb-2">{{ selectedTheme.name }}</div>
            <div class="text-body-1" style="opacity: 0.8;">Theme Preview</div>
          </div>
        </div>
        <div class="pa-5 d-flex align-center justify-space-between">
          <div class="d-flex flex-wrap gap-2">
            <v-chip v-for="f in selectedTheme.features" :key="f" size="small" variant="tonal" color="primary">{{ f }}</v-chip>
          </div>
          <div class="d-flex gap-2">
            <v-btn v-if="!selectedTheme.active" color="primary" variant="flat" class="text-none" prepend-icon="mdi-download">Install Theme</v-btn>
            <v-btn variant="outlined" class="text-none" @click="previewDialog = false">Close</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.active-theme-preview {
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
}
.theme-preview-header {
  min-height: 160px;
}
.theme-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.theme-active {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}
.theme-card-preview {
  position: relative;
  min-height: 160px;
  overflow: hidden;
}
.theme-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.25s;
}
.theme-card:hover .theme-overlay {
  opacity: 1;
}
</style>
