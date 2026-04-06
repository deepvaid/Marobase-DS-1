<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useDaVinciStore } from '@/stores/useDaVinci'
import { useDashboardStore } from '@/stores/useDashboard'

// Import rich components
import DvChartCard from './copilot/DvChartCard.vue'
import DvKpiRow from './copilot/DvKpiRow.vue'
import DvDataTable from './copilot/DvDataTable.vue'
import DvCampaignCard from './copilot/DvCampaignCard.vue'
import DvJourneyCard from './copilot/DvJourneyCard.vue'
import DvContentCard from './copilot/DvContentCard.vue'
import DvSegmentCard from './copilot/DvSegmentCard.vue'
import DvActionCard from './copilot/DvActionCard.vue'
import DvInsightCard from './copilot/DvInsightCard.vue'

const emit = defineEmits<{
  close: []
  expand: []
}>()

const isExpanded = ref(false)

function onExpand() {
  isExpanded.value = !isExpanded.value
  emit('expand')
}

/* ── State ─────────────────────────────────────────────────────── */
const inputText = ref('')
const chatMode = ref(false)
const isTyping = ref(false)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text?: string
  time?: string
  componentData?: {
    type: 'chart' | 'kpi' | 'table' | 'campaign' | 'journey' | 'content' | 'segment' | 'action' | 'insight'
    props: any
  }[]
}

const messages = ref<ChatMessage[]>([])
const chatContainer = ref<HTMLElement | null>(null)

/* ── Pre-configured Use Cases (Simulated AI) ──────────────────── */
const useCaseSimulations: Record<string, ChatMessage['componentData']> = {
  'Top 10 products by revenue': [
    { type: 'kpi', props: { kpis: [{ label: 'Total Revenue (Top 10)', value: '$842K', trend: '12%', trendUp: true }] } },
    { type: 'chart', props: { title: 'Revenue Share (Top 10)', subtitle: 'Last 30 Days', bars: [[400],[350],[300],[250],[200],[150],[100],[80],[60],[40]], labels: ['Prod A','Prod B','Prod C','Prod D','Prod E','Prod F','Prod G','Prod H','Prod I','Prod J'] } },
    { type: 'table', props: { headers: ['Product', 'Revenue', 'Orders'], rows: [['Prod A', '$120K', '842'], ['Prod B', '$95K', '412']] } }
  ],
  'Create a flash sale campaign': [
    { type: 'campaign', props: { name: 'Spring Flash Sale', subject: '⚡ 40% Off Everything - Today Only!', audience: 'VIP Customers', audienceSize: 12500, sendTime: 'Send Now', channel: 'Email' } }
  ],
  'Set up abandoned cart recovery': [
    { type: 'journey', props: { name: 'Abandoned Cart (High Value)', steps: [{type:'trigger', label:'Cart Abandoned'}, {type:'condition', label:'Value > $100'}, {type:'wait', label:'1 Hour'}, {type:'email', label:'Reminder 1'}] } }
  ],
  'Write an email for our spring sale': [
    { type: 'content', props: { type: 'email', title: 'Spring Sale Announcement', content: "Hi {{first_name}},\n\nSpring is finally here, and so is our biggest sale of the year!\n\nGet up to 30% off our new collection." } }
  ],
  'Find high-value customers who haven\'t ordered in 90 days': [
    { type: 'segment', props: { name: 'Lapsed High Value', rules: ['Lifetime Value > $500', 'Last Order Date > 90 days ago'], estimatedSize: 4200 } }
  ],
  'Compare this month vs last month': [
    { type: 'chart', props: { title: 'Revenue Comparison', subtitle: 'This Month vs Last Month', seriesNames: ['This Month', 'Last Month'], bars: [[500, 450],[520, 480],[480, 500],[600, 550]], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] } }
  ]
}

/* ── Actions ───────────────────────────────────────────────────── */
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

function processQuery(text: string) {
  if (!text) return

  const now = new Date()
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

  messages.value.push({ id: Date.now().toString(), role: 'user', text, time })
  chatMode.value = true
  inputText.value = ''
  isTyping.value = true
  scrollToBottom()

  // Find simulated response or fallback
  let responseData = useCaseSimulations[text]
  let fallbackText = ''

  if (!responseData) {
    // Check for partial matches
    const match = Object.keys(useCaseSimulations).find(k => k.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(k.toLowerCase()))
    if (match) {
      responseData = useCaseSimulations[match]
    } else {
      fallbackText = "I've analyzed your request. Here is what I found based on your store's recent activity."
      responseData = [
        { type: 'insight', props: { headline: 'Custom Query Processed', description: 'This is a simulated response. Try asking about "Top 10 products" or "Create a flash sale".', severity: 'info' } }
      ]
    }
  }

  // Simulate AI delay
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: fallbackText || "Here are the results you requested:",
      componentData: responseData
    })
    scrollToBottom()
  }, 1200)
}

function sendQuery() {
  processQuery(inputText.value.trim())
}

function sendSuggestion(text: string) {
  processQuery(text)
}

function newChat() {
  chatMode.value = false
  messages.value = []
  inputText.value = ''
}

/* ── Chart Actions ───────────────────────────────────────────── */
const dashboardStore = useDashboardStore()
const actionSnackbar = ref(false)
const actionSnackbarText = ref('')
const actionSnackbarColor = ref('success')

function getUserQueryForMsg(msg: ChatMessage): string {
  const msgIdx = messages.value.indexOf(msg)
  for (let i = msgIdx - 1; i >= 0; i--) {
    const m = messages.value[i]
    if (m && m.role === 'user' && m.text) return m.text
  }
  return ''
}

function onChartSave(chartComp: { type: string; props: any }, msg: ChatMessage) {
  const query = getUserQueryForMsg(msg)
  const title = chartComp.props?.title || (query ? `Da Vinci: ${query.substring(0, 40)}` : 'Da Vinci Chart')
  dashboardStore.saveChart({
    title,
    query,
    chartData: chartComp,
  })
  showAction('Chart saved to your widget library!', 'success')
}

function onChartDownload(chartComp: { type: string; props: any }) {
  // Create a simple canvas-based PNG from chart data
  const title = chartComp.props?.title || 'Chart'
  const bars: number[][] = chartComp.props?.bars || []
  const labels: string[] = chartComp.props?.labels || []

  const canvas = document.createElement('canvas')
  const w = 800, h = 500
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Title
  ctx.fillStyle = '#1a1a2e'
  ctx.font = 'bold 20px Inter, sans-serif'
  ctx.fillText(title, 40, 40)

  if (chartComp.props?.subtitle) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '14px Inter, sans-serif'
    ctx.fillText(chartComp.props.subtitle, 40, 64)
  }

  // Bars
  const maxVal = Math.max(...bars.map((b: number[]) => b.reduce((s: number, v: number) => s + v, 0)))
  const barW = Math.min(40, (w - 120) / bars.length - 4)
  const chartTop = 100, chartBottom = h - 60
  const chartHeight = chartBottom - chartTop

  bars.forEach((bar, i) => {
    const total = bar.reduce((s, v) => s + v, 0)
    const barH = (total / maxVal) * chartHeight
    const x = 60 + i * ((w - 120) / bars.length)
    ctx.fillStyle = '#1976D2'
    ctx.fillRect(x, chartBottom - barH, barW, barH)

    // Label
    if (labels[i]) {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(labels[i], x + barW / 2, chartBottom + 16)
    }
  })

  // Watermark
  ctx.fillStyle = '#d1d5db'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Generated by Da Vinci · Maropost', w - 20, h - 12)

  // Download
  const link = document.createElement('a')
  link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()

  showAction('Chart downloaded as PNG', 'info')
}

// Expand overlay
const expandOverlay = ref(false)
const expandedChart = ref<{ type: string; props: any } | null>(null)

function onChartExpand(chartComp: { type: string; props: any }) {
  expandedChart.value = chartComp
  expandOverlay.value = true
}

function showAction(text: string, color: string) {
  actionSnackbarText.value = text
  actionSnackbarColor.value = color
  actionSnackbar.value = true
}

/* ── Auto-process queries from Da Vinci store ──────────────────── */
const dvStore = useDaVinciStore()

watch(() => dvStore.pendingQuery, (q) => {
  if (q) {
    const query = dvStore.consumeQuery()
    processQuery(query)
  }
})
</script>

<template>
  <div class="da-vinci-bot d-flex flex-column">
    <!-- ═══ HEADER ═══ -->
    <div class="da-vinci-header d-flex align-center ga-3 px-4 py-3">
      <div class="da-vinci-avatar">
        <v-icon color="white" size="22">mdi-creation</v-icon>
      </div>
      <div class="flex-grow-1">
        <div class="text-subtitle-2 font-weight-bold da-vinci-title">Da Vinci Bot</div>
        <div class="text-caption text-medium-emphasis da-vinci-subtitle">Intelligent AI assistant</div>
      </div>
      <v-btn icon size="32" color="purple" variant="flat" @click="newChat">
        <v-icon size="18">mdi-plus</v-icon>
        <v-tooltip activator="parent" location="bottom">New chat</v-tooltip>
      </v-btn>
      <v-btn icon size="32" variant="text" @click="onExpand">
        <v-icon size="18">{{ isExpanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand' }}</v-icon>
        <v-tooltip activator="parent" location="bottom">{{ isExpanded ? 'Collapse' : 'Expand' }}</v-tooltip>
      </v-btn>
      <v-btn icon size="32" variant="text" @click="emit('close')">
        <v-icon size="18">mdi-close</v-icon>
        <v-tooltip activator="parent" location="bottom">Close</v-tooltip>
      </v-btn>
    </div>

    <!-- ═══ BODY ═══ -->
    <div ref="chatContainer" class="flex-grow-1 da-vinci-chat-scroll">
      <!-- ─── EMPTY STATE ─── -->
      <div v-if="!chatMode" class="da-vinci-empty pa-5">
        <div class="mb-6 mt-2">
          <h3 class="text-h5 font-weight-bold mb-1">Hi, Admin</h3>
          <p class="text-body-2 text-medium-emphasis">Ask me anything about your store, or try a suggestion below.</p>
        </div>

        <!-- Proactive Insight -->
        <DvInsightCard
          headline="Revenue dropped 15% this week"
          description="Your abandoned cart rate increased to 72%. I suggest enabling the Abandoned Cart Recovery journey."
          severity="warning"
          actionLabel="View Report"
          class="mb-6"
        />

        <!-- Categorized Suggestions -->
        <div class="suggestions-grid">
          <!-- Commerce -->
          <div>
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon size="16" color="primary">mdi-cart-outline</v-icon>
              <span class="text-caption font-weight-bold text-uppercase mp-label-caps">Commerce</span>
            </div>
            <div class="d-flex flex-column ga-2">
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Top 10 products by revenue')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Top 10 products by revenue</v-card-text>
              </v-card>
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Compare this month vs last month')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Compare this month vs last month</v-card-text>
              </v-card>
            </div>
          </div>

          <!-- Marketing -->
          <div class="mt-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon size="16" color="primary">mdi-bullhorn-outline</v-icon>
              <span class="text-caption font-weight-bold text-uppercase mp-label-caps">Marketing</span>
            </div>
            <div class="d-flex flex-column ga-2">
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Create a flash sale campaign')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Create a flash sale campaign</v-card-text>
              </v-card>
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Write an email for our spring sale')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Write an email for our spring sale</v-card-text>
              </v-card>
            </div>
          </div>

          <!-- Automation -->
          <div class="mt-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon size="16" color="primary">mdi-robot-outline</v-icon>
              <span class="text-caption font-weight-bold text-uppercase mp-label-caps">Automation & Customers</span>
            </div>
            <div class="d-flex flex-column ga-2">
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Set up abandoned cart recovery')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Set up abandoned cart recovery</v-card-text>
              </v-card>
              <v-card variant="outlined" rounded="lg" class="suggestion-card" @click="sendSuggestion('Find high-value customers who haven\'t ordered in 90 days')">
                <v-card-text class="py-2 px-3 text-body-2 font-weight-medium">Find lapsed high-value customers</v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── CHAT STATE ─── -->
      <div v-else class="pa-4 pt-6">
        <template v-for="msg in messages" :key="msg.id">
          <!-- User bubble -->
          <div v-if="msg.role === 'user'" class="d-flex justify-end mb-6">
            <div class="user-bubble px-4 py-2">
              <span class="text-body-2 text-on-primary user-bubble-text">{{ msg.text }}</span>
            </div>
          </div>

          <!-- Assistant response -->
          <div v-else class="mb-8">
            <div class="d-flex align-start ga-3 mb-2">
              <v-avatar size="24" color="purple" class="mt-1">
                <v-icon size="14" color="white">mdi-creation</v-icon>
              </v-avatar>
              <div class="text-body-2 pt-1 da-vinci-assistant-text">{{ msg.text }}</div>
            </div>

            <!-- Rich Components -->
            <div v-if="msg.componentData" class="pl-10 d-flex flex-column ga-3 mt-3">
              <template v-for="(comp, ci) in msg.componentData" :key="ci">
                <DvChartCard
                  v-if="comp.type === 'chart'"
                  v-bind="comp.props"
                  @save="onChartSave(comp, msg)"
                  @download="onChartDownload(comp)"
                  @expand="onChartExpand(comp)"
                />
                <DvKpiRow v-else-if="comp.type === 'kpi'" v-bind="comp.props" />
                <DvDataTable v-else-if="comp.type === 'table'" v-bind="comp.props" />
                <DvCampaignCard v-else-if="comp.type === 'campaign'" v-bind="comp.props" />
                <DvJourneyCard v-else-if="comp.type === 'journey'" v-bind="comp.props" />
                <DvContentCard v-else-if="comp.type === 'content'" v-bind="comp.props" />
                <DvSegmentCard v-else-if="comp.type === 'segment'" v-bind="comp.props" />
                <DvActionCard v-else-if="comp.type === 'action'" v-bind="comp.props" />
                <DvInsightCard v-else-if="comp.type === 'insight'" v-bind="comp.props" />
              </template>
            </div>

            <!-- Human Feedback Actions (no more "Pin to Dashboard") -->
            <div class="pl-10 mt-2 d-flex align-center ga-1 feedback-row">
              <v-btn icon variant="text" size="x-small" color="medium-emphasis" class="feedback-btn" @click="(msg as any)._fb = 'up'">
                <v-icon size="16" :color="(msg as any)._fb === 'up' ? 'success' : ''">{{ (msg as any)._fb === 'up' ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
                <v-tooltip activator="parent" location="bottom">Good response</v-tooltip>
              </v-btn>
              <v-btn icon variant="text" size="x-small" color="medium-emphasis" class="feedback-btn" @click="(msg as any)._fb = 'down'">
                <v-icon size="16" :color="(msg as any)._fb === 'down' ? 'error' : ''">{{ (msg as any)._fb === 'down' ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
                <v-tooltip activator="parent" location="bottom">Needs improvement</v-tooltip>
              </v-btn>
              <v-btn icon variant="text" size="x-small" color="medium-emphasis" class="feedback-btn">
                <v-icon size="16">mdi-content-copy</v-icon>
                <v-tooltip activator="parent" location="bottom">Copy response</v-tooltip>
              </v-btn>
            </div>
          </div>
        </template>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="mb-4 d-flex align-start ga-3">
           <v-avatar size="24" color="primary" class="mt-1">
              <v-icon size="14" color="white">mdi-creation</v-icon>
           </v-avatar>
           <div class="typing-indicator pa-3 rounded-lg bg-surface-variant d-flex align-center ga-1">
             <span class="dot"></span><span class="dot"></span><span class="dot"></span>
           </div>
        </div>
      </div>
    </div>

    <!-- ═══ INPUT FOOTER ═══ -->
    <div class="da-vinci-input px-4 pt-3 pb-5">
      <v-card variant="outlined" rounded="xl" class="pa-2 da-vinci-input-card" flat border>
        <v-textarea
          v-model="inputText"
          placeholder="Ask Da Vinci..."
          variant="plain"
          density="compact"
          hide-details
          rows="1"
          auto-grow
          max-rows="5"
          class="mb-1 px-1 da-vinci-textarea"
          @keydown.enter.exact.prevent="sendQuery"
        />
        <div class="d-flex align-center justify-space-between mt-1">
          <div class="d-flex align-center ga-1">
            <v-btn icon size="32" variant="text" color="medium-emphasis">
              <v-icon size="20">mdi-paperclip</v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center ga-1">
            <v-btn icon size="32" variant="text" color="medium-emphasis">
              <v-icon size="20">mdi-microphone-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              size="32"
              :color="inputText.trim() ? 'primary' : 'surface-variant'"
              variant="flat"
              @click="sendQuery"
            >
              <v-icon size="18" :color="inputText.trim() ? 'white' : 'medium-emphasis'">mdi-arrow-up</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <!-- ═══ CHART EXPAND OVERLAY ═══ -->
    <v-dialog v-model="expandOverlay" max-width="900" content-class="chart-expand-dialog">
      <v-card rounded="xl" class="pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center ga-2">
            <v-icon color="purple" size="20">mdi-creation</v-icon>
            <span class="text-h6 font-weight-bold">{{ expandedChart?.props?.title || 'Chart Preview' }}</span>
          </div>
          <div class="d-flex ga-1">
            <v-btn variant="tonal" size="small" color="primary" prepend-icon="mdi-download-outline" class="text-none" @click="expandedChart && onChartDownload(expandedChart)">Download</v-btn>
            <v-btn icon size="32" variant="text" @click="expandOverlay = false">
              <v-icon size="18">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div v-if="expandedChart?.props?.subtitle" class="text-body-2 text-medium-emphasis mb-4">{{ expandedChart.props.subtitle }}</div>

        <!-- Large chart rendering -->
        <div v-if="expandedChart" class="expanded-chart-area">
          <div class="chart-bars-wrap-large">
            <div v-for="(bar, bi) in (expandedChart.props?.bars || [])" :key="bi" class="chart-bar-col-large">
              <div
                v-for="(seg, si) in bar"
                :key="si"
                class="chart-bar-seg"
                :style="{
                  height: (seg / Math.max(...(expandedChart.props?.bars || []).map((b: number[]) => b.reduce((s: number, v: number) => s + v, 0)))) * 300 + 'px',
                  background: si === 0 ? 'rgb(var(--v-theme-primary))' : `rgba(var(--v-theme-primary), ${0.65 - si * 0.2})`,
                  borderRadius: si === bar.length - 1 ? '4px 4px 0 0' : '0',
                }"
              />
            </div>
          </div>
          <div v-if="expandedChart.props?.labels" class="d-flex justify-space-between mt-3 px-2">
            <span v-for="l in expandedChart.props.labels" :key="l" class="text-caption text-medium-emphasis">{{ l }}</span>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Action snackbar -->
    <v-snackbar v-model="actionSnackbar" :timeout="3000" location="bottom" color="surface" rounded="lg">
      <div class="d-flex align-center gap-2">
        <v-icon size="18" :color="actionSnackbarColor">{{ actionSnackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-information' }}</v-icon>
        <span class="text-body-2">{{ actionSnackbarText }}</span>
      </div>
      <template #actions>
        <v-btn v-if="actionSnackbarColor === 'success'" variant="text" color="primary" size="small" class="text-none font-weight-bold" @click="dashboardStore.catalogOpen = true; actionSnackbar = false">View in Catalog</v-btn>
        <v-btn variant="text" size="small" class="text-none" @click="actionSnackbar = false">Dismiss</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.da-vinci-bot {
  background: rgb(var(--v-theme-background));
  height: 100%;
  overflow: hidden;
}

.da-vinci-title {
  line-height: var(--mp-typography-lineHeight-tight);
}
.da-vinci-subtitle {
  font-size: var(--mp-typography-fontSize-xs);
}
.da-vinci-chat-scroll {
  overflow-y: auto;
  background: rgb(var(--v-theme-surface));
}
.mp-label-caps {
  letter-spacing: 0.05em;
}
.user-bubble-text {
  white-space: pre-wrap;
  color: rgb(var(--v-theme-on-primary));
}
.da-vinci-assistant-text {
  line-height: var(--mp-typography-lineHeight-loose);
}
.da-vinci-input-card {
  background: rgb(var(--v-theme-surface));
}
.da-vinci-textarea {
  font-size: var(--mp-typography-fontSize-body);
}

.da-vinci-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  z-index: 2;
}

.da-vinci-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #7C3AED 0%,
    #6D28D9 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $mp-shadow-sm;
}

.suggestion-card {
  transition: all $mp-transition-base;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  cursor: pointer;
}
.suggestion-card:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: $mp-shadow-sm;
  background: rgb(var(--v-theme-surface-variant));
}

.user-bubble {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  border-radius: 18px 18px $mp-radius-sm 18px;
  max-width: 85%;
  display: inline-flex;
}

.da-vinci-input {
  background: transparent;
}

/* Typing indicator */
.typing-indicator .dot {
  width: 6px;
  height: 6px;
  background: rgba(var(--v-theme-on-surface), 0.4);
  border-radius: $mp-radius-full;
  animation: typing 1.4s infinite ease-in-out both;
}
.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Expanded chart dialog */
.expanded-chart-area {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 12px;
  padding: 24px;
}
.chart-bars-wrap-large {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 320px;
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 0 4px;
}
.chart-bar-col-large {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
}
.chart-bar-seg {
  transition: height 0.3s ease;
}
.chart-bar-col-large:hover .chart-bar-seg {
  opacity: 0.85;
  filter: brightness(1.1);
}
</style>
