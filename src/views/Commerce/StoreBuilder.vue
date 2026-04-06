<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ── Section types & palette ─────────────────────────────────────
interface Section {
  id: string
  type: string
  label: string
  icon: string
  color: string
  config: Record<string, any>
  visible: boolean
}

const sectionPalette = [
  { type: 'header', label: 'Header / Announcement Bar', icon: 'mdi-page-layout-header', color: '#6366F1' },
  { type: 'hero', label: 'Hero Banner', icon: 'mdi-image-area', color: '#8B5CF6' },
  { type: 'image-text', label: 'Image with Text', icon: 'mdi-image-text', color: '#EC4899' },
  { type: 'featured-products', label: 'Featured Products', icon: 'mdi-view-grid-outline', color: '#F59E0B' },
  { type: 'collection-list', label: 'Collection List', icon: 'mdi-view-carousel-outline', color: '#10B981' },
  { type: 'testimonials', label: 'Testimonials', icon: 'mdi-format-quote-open', color: '#06B6D4' },
  { type: 'newsletter', label: 'Newsletter Signup', icon: 'mdi-email-newsletter', color: '#F43F5E' },
  { type: 'rich-text', label: 'Rich Text', icon: 'mdi-text-box-outline', color: '#64748B' },
  { type: 'video', label: 'Video', icon: 'mdi-play-circle-outline', color: '#EF4444' },
  { type: 'footer', label: 'Footer', icon: 'mdi-page-layout-footer', color: '#475569' },
]

// ── Active sections on the page ─────────────────────────────────
const sections = ref<Section[]>([
  { id: 's1', type: 'header', label: 'Announcement Bar', icon: 'mdi-page-layout-header', color: '#6366F1', visible: true, config: { text: 'Free shipping on orders over $200 🛴', bgColor: '#6366F1' } },
  { id: 's2', type: 'hero', label: 'Hero Banner', icon: 'mdi-image-area', color: '#8B5CF6', visible: true, config: { heading: 'Ride the Future', subheading: 'Premium Electric Scooters for Every Journey', ctaText: 'Shop Now', ctaUrl: '/collections/all' } },
  { id: 's3', type: 'featured-products', label: 'Featured Products', icon: 'mdi-view-grid-outline', color: '#F59E0B', visible: true, config: { title: 'Best Sellers', count: 4, collection: 'best-sellers' } },
  { id: 's4', type: 'image-text', label: 'Image with Text', icon: 'mdi-image-text', color: '#EC4899', visible: true, config: { heading: 'Why Scooter Village?', body: 'Expert reviews, top brands, and unbeatable after-sales support.', imagePosition: 'left' } },
  { id: 's5', type: 'newsletter', label: 'Newsletter Signup', icon: 'mdi-email-newsletter', color: '#F43F5E', visible: true, config: { heading: 'Stay in the Loop', subtext: 'Get exclusive deals and new arrival updates.' } },
  { id: 's6', type: 'footer', label: 'Footer', icon: 'mdi-page-layout-footer', color: '#475569', visible: true, config: { copyright: '© 2026 Scooter Village. All rights reserved.' } },
])

const selectedSectionId = ref<string | null>('s2')
const selectedSection = computed<Section | null>(() => sections.value.find(s => s.id === selectedSectionId.value) ?? null)

function selectSection(id: string) {
  selectedSectionId.value = id
}

function moveSection(idx: number, direction: 'up' | 'down') {
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= sections.value.length) return
  const temp = sections.value[idx]
  sections.value[idx] = sections.value[target]
  sections.value[target] = temp
}

function removeSection(id: string) {
  sections.value = sections.value.filter(s => s.id !== id)
  if (selectedSectionId.value === id) selectedSectionId.value = null
}

function toggleVisibility(id: string) {
  const s = sections.value.find(s => s.id === id)
  if (s) s.visible = !s.visible
}

// ── Add Section Drawer ──────────────────────────────────────────
const addDrawer = ref(false)

function addSection(type: string) {
  const palette = sectionPalette.find(p => p.type === type)
  if (!palette) return
  const newSection: Section = {
    id: `s_${Date.now()}`,
    type: palette.type,
    label: palette.label,
    icon: palette.icon,
    color: palette.color,
    visible: true,
    config: {},
  }
  // Insert before footer if exists, otherwise append
  const footerIdx = sections.value.findIndex(s => s.type === 'footer')
  if (footerIdx !== -1) {
    sections.value.splice(footerIdx, 0, newSection)
  } else {
    sections.value.push(newSection)
  }
  selectedSectionId.value = newSection.id
  addDrawer.value = false
}

// ── Da Vinci Block Generator ────────────────────────────────────
const dvPrompt = ref('')
const dvGenerating = ref(false)

const dvSuggestions = [
  'Add a summer sale hero banner',
  'Create a testimonials section',
  'Add a video showcase block',
  'Create a collection grid for new arrivals',
]

function generateBlock() {
  if (!dvPrompt.value.trim()) return
  dvGenerating.value = true
  const prompt = dvPrompt.value.trim().toLowerCase()

  setTimeout(() => {
    // Intelligent block generation based on prompt keywords
    let newSection: Section

    if (prompt.includes('hero') || prompt.includes('banner') || prompt.includes('sale')) {
      newSection = {
        id: `dv_${Date.now()}`, type: 'hero', label: 'AI: Hero Banner', icon: 'mdi-image-area', color: '#8B5CF6', visible: true,
        config: { heading: prompt.includes('summer') ? '☀️ Summer Sale — Up to 40% Off' : 'Limited Time Offer', subheading: 'Discover deals on premium electric scooters', ctaText: 'Shop the Sale', ctaUrl: '/collections/sale' },
      }
    } else if (prompt.includes('testimonial') || prompt.includes('review')) {
      newSection = {
        id: `dv_${Date.now()}`, type: 'testimonials', label: 'AI: Testimonials', icon: 'mdi-format-quote-open', color: '#06B6D4', visible: true,
        config: { heading: 'What Our Riders Say', reviews: 3 },
      }
    } else if (prompt.includes('video')) {
      newSection = {
        id: `dv_${Date.now()}`, type: 'video', label: 'AI: Video Showcase', icon: 'mdi-play-circle-outline', color: '#EF4444', visible: true,
        config: { heading: 'See It in Action', videoUrl: 'https://youtube.com/embed/example' },
      }
    } else if (prompt.includes('collection') || prompt.includes('grid') || prompt.includes('arrival')) {
      newSection = {
        id: `dv_${Date.now()}`, type: 'collection-list', label: 'AI: Collection Grid', icon: 'mdi-view-carousel-outline', color: '#10B981', visible: true,
        config: { heading: 'Shop by Category', columns: 3 },
      }
    } else if (prompt.includes('newsletter') || prompt.includes('signup') || prompt.includes('email')) {
      newSection = {
        id: `dv_${Date.now()}`, type: 'newsletter', label: 'AI: Newsletter', icon: 'mdi-email-newsletter', color: '#F43F5E', visible: true,
        config: { heading: 'Join the Ride', subtext: 'Subscribe for exclusive deals and updates.' },
      }
    } else {
      newSection = {
        id: `dv_${Date.now()}`, type: 'rich-text', label: `AI: ${dvPrompt.value.substring(0, 30)}`, icon: 'mdi-text-box-outline', color: '#64748B', visible: true,
        config: { heading: dvPrompt.value, body: 'Content generated by Da Vinci AI based on your prompt.' },
      }
    }

    const footerIdx = sections.value.findIndex(s => s.type === 'footer')
    if (footerIdx !== -1) {
      sections.value.splice(footerIdx, 0, newSection)
    } else {
      sections.value.push(newSection)
    }
    selectedSectionId.value = newSection.id
    dvPrompt.value = ''
    dvGenerating.value = false
  }, 1800)
}

// ── Preview mode ────────────────────────────────────────────────
const previewMode = ref<'desktop' | 'mobile'>('desktop')
const saveSnack = ref(false)

function goBack() {
  router.push('/commerce/stores/themes')
}
</script>

<template>
  <div class="builder-shell">
    <!-- ═══ Top Bar ═══ -->
    <div class="builder-topbar">
      <div class="d-flex align-center gap-3">
        <v-btn icon variant="text" size="small" @click="goBack"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <v-divider vertical class="mx-1" style="height:24px;" />
        <v-icon size="20" color="primary">mdi-palette-outline</v-icon>
        <div>
          <div class="text-body-2 font-weight-bold">Dawn Theme</div>
          <div class="text-caption text-medium-emphasis">Scooter Village · Home Page</div>
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <v-btn-toggle v-model="previewMode" mandatory variant="outlined" density="compact" divided rounded="lg">
          <v-btn value="desktop" size="small" icon="mdi-monitor" />
          <v-btn value="mobile" size="small" icon="mdi-cellphone" />
        </v-btn-toggle>
        <v-divider vertical class="mx-1" style="height:24px;" />
        <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-eye">Preview</v-btn>
        <v-btn color="primary" variant="flat" size="small" class="text-none" prepend-icon="mdi-content-save" @click="saveSnack = true">Save</v-btn>
      </div>
    </div>

    <div class="builder-body">
      <!-- ═══ Left Sidebar: Section List ═══ -->
      <div class="builder-sidebar">
        <div class="sidebar-header">
          <div class="text-subtitle-2 font-weight-bold">Sections</div>
          <v-btn icon variant="text" size="x-small" color="primary" @click="addDrawer = true"><v-icon size="18">mdi-plus</v-icon></v-btn>
        </div>

        <!-- Section list -->
        <div class="section-list">
          <div
            v-for="(section, idx) in sections"
            :key="section.id"
            class="section-item"
            :class="{ 'section-item--active': selectedSectionId === section.id, 'section-item--hidden': !section.visible }"
            @click="selectSection(section.id)"
          >
            <div class="d-flex align-center gap-2 flex-grow-1 overflow-hidden">
              <v-icon size="16" class="cursor-grab" color="medium-emphasis">mdi-drag-vertical</v-icon>
              <div class="section-dot" :style="{ background: section.color }" />
              <span class="text-body-2 font-weight-medium text-truncate">{{ section.label }}</span>
            </div>
            <div class="section-item-actions">
              <v-btn icon variant="text" size="x-small" @click.stop="moveSection(idx, 'up')" :disabled="idx === 0"><v-icon size="14">mdi-chevron-up</v-icon></v-btn>
              <v-btn icon variant="text" size="x-small" @click.stop="moveSection(idx, 'down')" :disabled="idx === sections.length - 1"><v-icon size="14">mdi-chevron-down</v-icon></v-btn>
              <v-btn icon variant="text" size="x-small" @click.stop="toggleVisibility(section.id)"><v-icon size="14">{{ section.visible ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon></v-btn>
              <v-btn icon variant="text" size="x-small" color="error" @click.stop="removeSection(section.id)"><v-icon size="14">mdi-delete-outline</v-icon></v-btn>
            </div>
          </div>
        </div>

        <!-- Add section button -->
        <div class="px-3 py-2">
          <v-btn block variant="tonal" size="small" prepend-icon="mdi-plus" class="text-none" @click="addDrawer = true">Add Section</v-btn>
        </div>

        <!-- ✨ Da Vinci Block Generator -->
        <div class="dv-generator">
          <div class="d-flex align-center gap-2 mb-2">
            <v-icon size="16" color="purple">mdi-auto-fix</v-icon>
            <span class="text-caption font-weight-bold" style="color: rgb(var(--v-theme-purple, 124, 58, 237));">Da Vinci Block Generator</span>
          </div>
          <div class="d-flex gap-1 flex-wrap mb-2">
            <v-chip
              v-for="s in dvSuggestions" :key="s"
              size="x-small" variant="outlined" color="purple"
              class="cursor-pointer"
              @click="dvPrompt = s"
            >{{ s }}</v-chip>
          </div>
          <div class="d-flex gap-2">
            <v-text-field
              v-model="dvPrompt"
              variant="outlined"
              density="compact"
              placeholder="Describe a block to create…"
              hide-details
              class="flex-grow-1"
              :loading="dvGenerating"
              @keydown.enter="generateBlock"
            >
              <template #prepend-inner>
                <v-icon size="16" color="purple">mdi-auto-fix</v-icon>
              </template>
            </v-text-field>
            <v-btn icon color="purple" variant="tonal" size="small" :loading="dvGenerating" @click="generateBlock" :disabled="!dvPrompt.trim()">
              <v-icon size="18">mdi-send</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- ═══ Main Preview Area ═══ -->
      <div class="builder-preview" :class="{ 'preview-mobile': previewMode === 'mobile' }">
        <div class="preview-canvas" :class="{ 'canvas-mobile': previewMode === 'mobile' }">

          <div
            v-for="section in sections"
            :key="section.id"
            class="preview-block"
            :class="{
              'preview-block--selected': selectedSectionId === section.id,
              'preview-block--hidden': !section.visible,
            }"
            @click="selectSection(section.id)"
          >
            <!-- Hover label -->
            <div class="block-label" :style="{ background: section.color }">
              <v-icon size="12" color="white">{{ section.icon }}</v-icon>
              <span>{{ section.label }}</span>
            </div>

            <!-- ─── Header ─── -->
            <div v-if="section.type === 'header'" class="block-header" :style="{ background: section.config.bgColor || '#6366F1' }">
              <div class="text-center text-white text-caption font-weight-medium py-2">{{ section.config.text }}</div>
            </div>

            <!-- ─── Hero Banner ─── -->
            <div v-else-if="section.type === 'hero'" class="block-hero" :style="{ background: `linear-gradient(135deg, ${section.color}ee, ${section.color}88)` }">
              <div class="text-center text-white pa-8">
                <h1 class="text-h4 font-weight-black mb-2" style="letter-spacing: -0.5px;">{{ section.config.heading }}</h1>
                <p class="text-body-1 mb-4" style="opacity: 0.85;">{{ section.config.subheading }}</p>
                <v-btn color="white" variant="flat" class="text-none font-weight-bold" style="color: #333;">{{ section.config.ctaText || 'Shop Now' }}</v-btn>
              </div>
            </div>

            <!-- ─── Featured Products ─── -->
            <div v-else-if="section.type === 'featured-products'" class="block-products pa-6">
              <div class="text-h6 font-weight-bold text-center mb-4">{{ section.config.title || 'Featured Products' }}</div>
              <div class="d-flex gap-3 justify-center">
                <div v-for="i in (section.config.count || 4)" :key="i" class="product-placeholder">
                  <div class="product-img"></div>
                  <div class="text-caption font-weight-medium mt-2">Product {{ i }}</div>
                  <div class="text-caption text-medium-emphasis">$199.00</div>
                </div>
              </div>
            </div>

            <!-- ─── Image with Text ─── -->
            <div v-else-if="section.type === 'image-text'" class="block-imgtext pa-6">
              <div class="d-flex gap-4 align-center" :class="{ 'flex-row-reverse': section.config.imagePosition === 'right' }">
                <div class="imgtext-img"></div>
                <div class="flex-grow-1">
                  <div class="text-h6 font-weight-bold mb-2">{{ section.config.heading }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ section.config.body }}</div>
                </div>
              </div>
            </div>

            <!-- ─── Testimonials ─── -->
            <div v-else-if="section.type === 'testimonials'" class="block-testimonials pa-6">
              <div class="text-h6 font-weight-bold text-center mb-4">{{ section.config.heading || 'What Our Customers Say' }}</div>
              <div class="d-flex gap-3 justify-center">
                <div v-for="i in (section.config.reviews || 3)" :key="i" class="testimonial-card pa-4">
                  <div class="d-flex gap-1 mb-2">
                    <v-icon v-for="s in 5" :key="s" size="14" color="amber">mdi-star</v-icon>
                  </div>
                  <div class="text-body-2 text-medium-emphasis mb-2">"Amazing quality and fast shipping!"</div>
                  <div class="text-caption font-weight-bold">— Customer {{ i }}</div>
                </div>
              </div>
            </div>

            <!-- ─── Collection List ─── -->
            <div v-else-if="section.type === 'collection-list'" class="block-collections pa-6">
              <div class="text-h6 font-weight-bold text-center mb-4">{{ section.config.heading || 'Shop by Category' }}</div>
              <div class="d-flex gap-3 justify-center">
                <div v-for="cat in ['Scooters', 'Accessories', 'Safety Gear']" :key="cat" class="collection-card">
                  <div class="collection-img" />
                  <div class="text-body-2 font-weight-medium text-center mt-2">{{ cat }}</div>
                </div>
              </div>
            </div>

            <!-- ─── Newsletter ─── -->
            <div v-else-if="section.type === 'newsletter'" class="block-newsletter pa-6" :style="{ background: `linear-gradient(135deg, ${section.color}22, ${section.color}11)` }">
              <div class="text-center">
                <div class="text-h6 font-weight-bold mb-1">{{ section.config.heading || 'Stay Updated' }}</div>
                <div class="text-body-2 text-medium-emphasis mb-4">{{ section.config.subtext }}</div>
                <div class="d-flex gap-2 justify-center" style="max-width: 400px; margin: 0 auto;">
                  <div style="flex:1; height:36px; border-radius:8px; border: 1px solid #ddd; background: white;"></div>
                  <div style="width:100px; height:36px; border-radius:8px; background: #6366F1;" class="d-flex align-center justify-center text-white text-caption font-weight-bold">Subscribe</div>
                </div>
              </div>
            </div>

            <!-- ─── Video ─── -->
            <div v-else-if="section.type === 'video'" class="block-video pa-6">
              <div class="text-h6 font-weight-bold text-center mb-4">{{ section.config.heading || 'Watch' }}</div>
              <div class="video-placeholder d-flex align-center justify-center">
                <v-icon size="48" color="white" style="opacity: 0.8;">mdi-play-circle</v-icon>
              </div>
            </div>

            <!-- ─── Rich Text ─── -->
            <div v-else-if="section.type === 'rich-text'" class="block-richtext pa-6">
              <div class="text-h6 font-weight-bold mb-2">{{ section.config.heading }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ section.config.body }}</div>
            </div>

            <!-- ─── Footer ─── -->
            <div v-else-if="section.type === 'footer'" class="block-footer pa-4">
              <div class="text-center text-caption text-medium-emphasis">{{ section.config.copyright }}</div>
            </div>

            <!-- Fallback -->
            <div v-else class="pa-6 text-center text-medium-emphasis">
              <v-icon size="28">{{ section.icon }}</v-icon>
              <div class="text-body-2 mt-2">{{ section.label }}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══ Right Panel: Section Config ═══ -->
      <div v-if="selectedSection" class="builder-config">
        <div class="config-header">
          <div class="d-flex align-center gap-2">
            <div class="section-dot" :style="{ background: selectedSection.color }" />
            <span class="text-subtitle-2 font-weight-bold">{{ selectedSection.label }}</span>
          </div>
          <v-btn icon variant="text" size="x-small" @click="selectedSectionId = null"><v-icon size="16">mdi-close</v-icon></v-btn>
        </div>
        <div class="config-body">
          <div v-for="(value, key) in selectedSection.config" :key="key" class="mb-3">
            <v-text-field
              v-if="typeof value === 'string'"
              v-model="selectedSection.config[key as string]"
              :label="String(key).replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())"
              variant="outlined"
              density="compact"
              hide-details
            />
            <v-text-field
              v-else-if="typeof value === 'number'"
              v-model.number="selectedSection.config[key as string]"
              :label="String(key).replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())"
              variant="outlined"
              density="compact"
              type="number"
              hide-details
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Add Section Drawer ═══ -->
    <v-dialog v-model="addDrawer" max-width="550">
      <v-card rounded="xl">
        <div class="pa-5 border-b">
          <div class="text-h6 font-weight-bold">Add Section</div>
          <div class="text-caption text-medium-emphasis">Choose a block type to add to your page</div>
        </div>
        <div class="pa-4">
          <v-row dense>
            <v-col v-for="p in sectionPalette" :key="p.type" cols="6">
              <v-card
                variant="outlined"
                rounded="lg"
                class="pa-3 cursor-pointer add-block-card"
                @click="addSection(p.type)"
              >
                <div class="d-flex align-center gap-3">
                  <v-avatar :color="p.color" size="36" variant="flat" rounded="lg">
                    <v-icon size="18" color="white">{{ p.icon }}</v-icon>
                  </v-avatar>
                  <span class="text-body-2 font-weight-medium">{{ p.label }}</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div class="pa-4 border-t d-flex justify-end">
          <v-btn variant="text" class="text-none" @click="addDrawer = false">Cancel</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
      <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Theme saved successfully</div>
    </v-snackbar>
  </div>
</template>

<style scoped>
/* ── Shell ── */
.builder-shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  z-index: 100;
}

/* ── Top Bar ── */
.builder-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  gap: 12px;
  z-index: 10;
}

/* ── Body ── */
.builder-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Left Sidebar ── */
.builder-sidebar {
  width: 300px;
  min-width: 300px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}
.section-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.section-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 2px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.section-item:hover {
  background: #f1f5f9;
}
.section-item--active {
  background: rgba(99, 102, 241, 0.08);
  outline: 1.5px solid rgba(99, 102, 241, 0.4);
}
.section-item--hidden {
  opacity: 0.45;
}
.section-item-actions {
  display: flex;
  gap: 0;
  opacity: 0;
  transition: opacity 0.15s;
}
.section-item:hover .section-item-actions {
  opacity: 1;
}
.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Da Vinci Generator ── */
.dv-generator {
  border-top: 1px solid #e5e7eb;
  padding: 12px;
  background: linear-gradient(to top, rgba(139, 92, 246, 0.04), transparent);
}

/* ── Preview ── */
.builder-preview {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 24px;
  background: #e5e7eb;
}
.preview-canvas {
  width: 100%;
  max-width: 960px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  height: fit-content;
}
.canvas-mobile {
  max-width: 390px;
}
.preview-block {
  position: relative;
  border: 2px solid transparent;
  transition: border-color 0.15s;
  cursor: pointer;
}
.preview-block:hover {
  border-color: rgba(99, 102, 241, 0.3);
}
.preview-block--selected {
  border-color: #6366F1 !important;
}
.preview-block--hidden {
  opacity: 0.3;
}
.block-label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 8px;
  border-radius: 0 0 6px 0;
  font-size: 10px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 2;
}
.preview-block:hover .block-label,
.preview-block--selected .block-label {
  opacity: 1;
}

/* ─── Block styles ─── */
.block-header {
  min-height: 32px;
}
.block-hero {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.block-products { background: white; }
.product-placeholder {
  width: 140px;
  text-align: center;
}
.product-img {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: #f1f5f9;
}
.block-imgtext { background: white; }
.imgtext-img {
  width: 200px;
  min-width: 200px;
  height: 150px;
  border-radius: 12px;
  background: #f1f5f9;
}
.testimonial-card {
  background: #f8fafc;
  border-radius: 12px;
  flex: 1;
  max-width: 200px;
}
.collection-card { width: 160px; text-align: center; }
.collection-img {
  width: 160px;
  height: 100px;
  border-radius: 12px;
  background: #f1f5f9;
}
.video-placeholder {
  height: 200px;
  border-radius: 12px;
  background: #1a1a2e;
}
.block-footer {
  background: #1e293b;
  color: white;
}
.block-richtext,
.block-newsletter {
  background: white;
}

/* ── Right Config Panel ── */
.builder-config {
  width: 280px;
  min-width: 280px;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}
.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}
.config-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cursor-pointer { cursor: pointer; }
.cursor-grab { cursor: grab; }
.add-block-card {
  transition: all 0.15s;
}
.add-block-card:hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.04);
}
</style>
