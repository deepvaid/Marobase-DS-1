<script setup lang="ts">
import { ref } from 'vue'
import MpPageHeader from '@/components/MpPageHeader.vue'

const isGenerating = ref(false)
const hasGenerated = ref(false)
const form = ref({
  type: 'Email Campaign',
  tone: 'Friendly & Conversational',
  product: '',
  keyMessage: '',
})

interface GeneratedAsset {
  id: number
  title: string
  content: string
  rating: 'up' | 'down' | null
}

const results = ref<GeneratedAsset[]>([])

function generateAssets() {
  if (!form.value.product || !form.value.keyMessage) return
  isGenerating.value = true
  hasGenerated.value = false
  
  // Simulate AI generation delay
  setTimeout(() => {
    isGenerating.value = false
    hasGenerated.value = true
    
    if (form.value.type === 'Email Campaign') {
      results.value = [
        { id: 1, title: 'Option 1: Direct & Value-Focused', content: `Subject: Elevate your routine with ${form.value.product}\n\nHi there,\n\nWe know how important it is to find exactly what you need. That's why we're thrilled to introduce ${form.value.product}. ${form.value.keyMessage}\n\nShop now and see the difference for yourself.\n\nCheers,\nThe Maropost Team`, rating: null },
        { id: 2, title: 'Option 2: Story-Driven & Engaging', content: `Subject: The wait is over. Meet ${form.value.product} ✨\n\nHi friends,\n\nYou asked, we listened. After months of development, we're finally launching ${form.value.product}! ${form.value.keyMessage}\n\nOur early testers are already obsessed. Grab yours before they sell out!\n\nBest,\nThe Maropost Team`, rating: null },
        { id: 3, title: 'Option 3: Short & Punchy', content: `Subject: ${form.value.product} is officially here!\n\nHey!\n\nIt's finally here: ${form.value.product}. ${form.value.keyMessage}\n\nTap below to shop the collection.\n\nThanks,\nMaropost Team`, rating: null },
      ]
    } else {
      results.value = [
        { id: 1, title: 'Option 1', content: `Check out ${form.value.product}! ${form.value.keyMessage} Shop now at the link below.`, rating: null },
        { id: 2, title: 'Option 2', content: `Don't miss out on ${form.value.product} 🔥 ${form.value.keyMessage}. Grab yours today!`, rating: null },
      ]
    }
  }, 1800)
}
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">
    <MpPageHeader
      title="Marketing Assets Generation"
      subtitle="Instantly generate and optimize marketing copy and imagery using Da Vinci AI"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Da Vinci', disabled: true },
        { title: 'Marketing Assets', disabled: true },
      ]"
    />

    <v-row class="flex-grow-1" style="min-height: 0;">
      <!-- Left Panel: Configuration Form -->
      <v-col cols="12" md="4" class="h-100 d-flex flex-column">
        <v-card variant="flat" border rounded="xl" class="pa-5 h-100 overflow-y-auto">
          <div class="text-h6 font-weight-bold mb-4 d-flex align-center gap-2">
            <v-icon color="purple">mdi-creation</v-icon> Asset Builder
          </div>
          
          <v-select 
            v-model="form.type" 
            :items="['Email Campaign', 'SMS Copy', 'Social Media Caption', 'Push Notification']" 
            label="What do you want to create?" 
            variant="outlined" 
            density="comfortable" 
            class="mb-3"
          ></v-select>

          <v-select 
            v-model="form.tone" 
            :items="['Professional', 'Friendly & Conversational', 'Urgent / FOMO', 'Humorous', 'Empathetic']" 
            label="Tone of Voice" 
            variant="outlined" 
            density="comfortable" 
            class="mb-3"
          ></v-select>

          <v-text-field 
            v-model="form.product" 
            label="Product or Promotion Name" 
            variant="outlined" 
            density="comfortable" 
            placeholder="e.g. Summer Collection 2026"
            class="mb-3"
          ></v-text-field>

          <v-textarea 
            v-model="form.keyMessage" 
            label="Key Message & Details" 
            variant="outlined" 
            density="comfortable" 
            placeholder="What are the main talking points? Any specific discounts or dates to mention?" 
            rows="4"
            class="mb-5"
          ></v-textarea>
          
          <v-btn 
            color="purple" 
            block 
            rounded="lg" 
            size="large" 
            class="text-none font-weight-bold text-white mb-2" 
            prepend-icon="mdi-auto-fix" 
            :loading="isGenerating" 
            :disabled="!form.product || !form.keyMessage"
            @click="generateAssets"
          >
            Generate Options
          </v-btn>
          <div class="text-caption text-center text-medium-emphasis">Da Vinci uses your store data to personalize outputs.</div>
        </v-card>
      </v-col>

      <!-- Right Panel: Generated Results -->
      <v-col cols="12" md="8" class="h-100 d-flex flex-column">
        <v-card variant="flat" border rounded="xl" class="pa-5 h-100 bg-surface-variant overflow-y-auto d-flex flex-column position-relative">
          
          <div v-if="!hasGenerated && !isGenerating" class="flex-grow-1 d-flex align-center justify-center">
            <div class="text-center" style="max-width: 400px;">
              <v-icon size="64" color="purple" style="opacity: 0.2;" class="mb-4">mdi-pencil-ruler</v-icon>
              <div class="text-h6 font-weight-bold mb-2">Configure to Generate</div>
              <div class="text-body-2 text-medium-emphasis">Fill out the brief on the left and Da Vinci will instantly generate multiple conversion-optimized options for you to choose from.</div>
            </div>
          </div>

          <div v-else-if="isGenerating" class="flex-grow-1 d-flex align-center justify-center">
            <div class="text-center">
              <v-progress-circular indeterminate color="purple" size="48" class="mb-4"></v-progress-circular>
              <div class="text-body-1 font-weight-medium">Da Vinci is analyzing your brand...</div>
              <div class="text-caption text-medium-emphasis mt-1">Generating {{ form.type }} options in a {{ form.tone }} tone.</div>
            </div>
          </div>

          <div v-else class="flex-grow-1 w-100 mx-auto" style="max-width: 720px;">
            <div class="d-flex align-center justify-space-between mb-5">
              <div class="text-h6 font-weight-bold">Generated {{ form.type }} Options</div>
              <v-chip color="purple" variant="tonal" size="small" prepend-icon="mdi-check-circle">{{ results.length }} Options Ready</v-chip>
            </div>

            <v-card 
              v-for="res in results" 
              :key="res.id" 
              variant="flat" 
              border 
              rounded="xl" 
              class="pa-5 mb-4 bg-surface position-relative"
            >
              <v-icon color="purple" class="position-absolute top-0 right-0 ma-4" size="20" style="opacity: 0.15;">mdi-auto-fix</v-icon>
              <div class="text-subtitle-2 font-weight-bold mb-3 text-purple">{{ res.title }}</div>
              
              <div class="text-body-1 mb-5" style="white-space: pre-wrap; line-height: 1.6;">{{ res.content }}</div>
              
              <v-divider class="mb-3"></v-divider>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-1 bg-surface-variant rounded-pill px-2 py-1">
                  <v-btn icon="mdi-thumb-up-outline" variant="text" size="small" :class="res.rating === 'up' ? 'text-success' : 'text-medium-emphasis'" @click="res.rating = 'up'"></v-btn>
                  <v-btn icon="mdi-thumb-down-outline" variant="text" size="small" :class="res.rating === 'down' ? 'text-error' : 'text-medium-emphasis'" @click="res.rating = 'down'"></v-btn>
                </div>
                <div class="d-flex gap-2">
                  <v-btn variant="outlined" color="primary" size="small" class="text-none font-weight-medium" prepend-icon="mdi-pencil-outline">Edit</v-btn>
                  <v-btn variant="flat" color="primary" size="small" class="text-none font-weight-bold" prepend-icon="mdi-content-copy">Copy to Clipboard</v-btn>
                </div>
              </div>
            </v-card>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.gap-5 { gap: 20px; }
.gap-2 { gap: 8px; }
.gap-1 { gap: 4px; }
</style>
