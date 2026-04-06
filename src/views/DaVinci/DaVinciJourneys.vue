<script setup lang="ts">
import { ref } from 'vue'

// Dummy data for visual workflow
const nodes = ref([
  { id: 1, type: 'trigger', label: 'Customer Abandons Cart', icon: 'mdi-cart-off', x: 50, y: 50 },
  { id: 2, type: 'condition', label: 'Da Vinci: High CLV Delay', icon: 'mdi-brain', x: 50, y: 200, spark: true },
  { id: 3, type: 'action', label: 'Email: VIP Subject Gen', icon: 'mdi-email-fast', x: -100, y: 350, spark: true },
  { id: 4, type: 'action', label: 'SMS: 10% Discount', icon: 'mdi-message-text', x: 200, y: 350 },
])

const prompt = ref('')
const generating = ref(false)

const generateWorkflow = () => {
  if (!prompt.value) return
  generating.value = true
  setTimeout(() => {
    // Modify nodes to simulate Da Vinci changing the workflow
    nodes.value = [
      { id: 1, type: 'trigger', label: 'Customer Abandons Cart', icon: 'mdi-cart-off', x: 50, y: 50 },
      { id: 2, type: 'condition', label: 'Da Vinci: Predictive Churn Risk', icon: 'mdi-brain', x: 50, y: 180, spark: true },
      { id: 3, type: 'action', label: 'Email: Personalized Retargeting', icon: 'mdi-email-fast', x: -120, y: 320, spark: true },
      { id: 4, type: 'action', label: 'WhatsApp: Support Offer', icon: 'mdi-whatsapp', x: 220, y: 320, spark: true },
    ]
    prompt.value = ''
    generating.value = false
  }, 1500)
}
</script>

<template>
  <div class="h-100 d-flex flex-column" style="background: #fafafa;">
    <!-- Header -->
    <v-toolbar color="white" border density="compact" class="px-2">
      <v-icon color="grey-darken-2" class="mr-3">mdi-graph</v-icon>
      <v-toolbar-title class="text-h6 font-weight-bold">Journeys AI Builder</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn size="small" variant="outlined" class="mr-2">Revert</v-btn>
      <v-btn size="small" color="primary" variant="flat">Activate Journey</v-btn>
    </v-toolbar>

    <div class="d-flex flex-grow-1 overflow-hidden">
      <!-- Node Canvas Area -->
      <div class="flex-grow-1 position-relative background-dot" style="background-color: #f8f9fa;">
        
        <!-- Generate Overlay -->
        <v-overlay :model-value="generating" absolute class="align-center justify-center" scrim="white" opacity="0.8">
          <v-progress-circular indeterminate color="purple" size="64"></v-progress-circular>
          <div class="text-h6 mt-4 font-weight-medium text-purple-darken-2">Da Vinci is restructuring your journey...</div>
        </v-overlay>

        <!-- Node Canvas Simulation -->
        <div class="nodes-container">
          <!-- Flow Lines (Static Simulation) -->
          <svg class="flow-lines" width="100%" height="100%">
            <path v-if="nodes.length > 0" class="flow-path df-animate" d="M 125,120 L 125,180" />
            <path v-if="nodes.length > 0" class="flow-path" d="M 125,270 L 125,300 L -25,300 L -25,350" />
            <path v-if="nodes.length > 0" class="flow-path" d="M 125,270 L 125,300 L 275,300 L 275,350" />
          </svg>

          <!-- Nodes -->
          <v-card
            v-for="node in nodes"
            :key="node.id"
            class="node-card"
            :class="[node.type, { 'ai-enhanced': node.spark }]"
            :style="{ top: `${node.y}px`, left: `calc(50% + ${node.x}px)` }"
            elevation="2"
          >
            <div v-if="node.spark" class="sparkle-badge">
              <v-icon size="14" color="white" class="rotating-sparkle">mdi-auto-fix</v-icon>
            </div>
            <div class="d-flex align-center">
              <v-avatar :color="node.type === 'trigger' ? 'indigo-lighten-4' : (node.spark ? 'purple-lighten-4' : 'grey-lighten-3')" size="38" class="mr-3">
                <v-icon :color="node.type === 'trigger' ? 'indigo' : (node.spark ? 'purple-darken-2' : 'grey-darken-2')">{{ node.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-n1">{{ node.type }}</div>
                <div class="font-weight-medium text-body-2">{{ node.label }}</div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Floating Prompt Bar -->
        <div class="floating-prompt-bar">
          <v-card class="pa-2" elevation="6" rounded="xl" style="border: 1px solid rgba(168,85,247,0.3)">
            <v-text-field
              v-model="prompt"
              density="compact"
              variant="solo"
              hide-details
              placeholder="E.g. Add an SMS condition for high-churn risk users..."
              bg-color="white"
              flat
              class="ai-input"
              @keyup.enter="generateWorkflow"
            >
              <template v-slot:prepend-inner>
                <div class="px-2">
                  <v-icon color="purple" class="rotating-sparkle">mdi-auto-fix</v-icon>
                </div>
              </template>
              <template v-slot:append-inner>
                <v-btn size="small" color="purple" variant="flat" rounded="lg" @click="generateWorkflow" :loading="generating">Update Flow</v-btn>
              </template>
            </v-text-field>
          </v-card>
        </div>

      </div>

      <!-- Settings Sidebar -->
      <v-navigation-drawer location="right" permanent width="320" border="none" class="border-s">
        <v-list density="compact" nav class="pa-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Journey Insight</h3>
          
          <v-alert type="info" color="purple-lighten-5" border="start" variant="flat" class="mb-4">
            <template v-slot:prepend>
              <v-icon color="purple">mdi-lightbulb-on-outline</v-icon>
            </template>
            <span class="text-body-2 text-purple-darken-4">Da Vinci suggests adding a WhatsApp retargeting node for users who ignore emails. This has a <strong>+18% conversion rate</strong> across similar cohorts.</span>
          </v-alert>

          <v-divider class="my-4"></v-divider>
          
          <div class="text-subtitle-2 font-weight-bold mb-2">Selected Node Properties</div>
          <v-text-field density="compact" variant="outlined" label="Node Name" model-value="Customer Abandons Cart" hide-details class="mb-3"></v-text-field>
          <v-select density="compact" variant="outlined" label="Trigger Source" :items="['Storefront', 'API', 'App']" model-value="Storefront" hide-details class="mb-3"></v-select>
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<style scoped>
.background-dot {
  background-image: radial-gradient(#d1d5db 1px, transparent 1px);
  background-size: 20px 20px;
}

.nodes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.node-card {
  position: absolute;
  width: 250px;
  padding: 12px;
  border-radius: 12px;
  transform: translateX(-50%);
  border: 1px solid #e0e0e0;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.node-card.ai-enhanced {
  border: 2px solid #a855f7;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.2) !important;
}

.sparkle-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
}

.flow-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.flow-path {
  fill: none;
  stroke: #cbd5e1;
  stroke-width: 2;
  transition: all 0.5s;
}
.df-animate {
  stroke: #a855f7;
  stroke-dasharray: 6;
  animation: march 1s linear infinite;
}

@keyframes march {
  to { stroke-dashoffset: -12; }
}

.floating-prompt-bar {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  z-index: 10;
}

.ai-input :deep(.v-field__outline) {
  display: none;
}

.rotating-sparkle {
  animation: pulse-slow 2s infinite ease-in-out;
}
@keyframes pulse-slow {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 8px rgba(168, 85, 247, 0.6); }
  100% { transform: scale(1); opacity: 0.8; }
}
</style>
