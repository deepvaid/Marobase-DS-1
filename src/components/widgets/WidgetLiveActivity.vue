<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const items = ref([
  { id: 1, icon: 'mdi-email-open', color: 'success', text: 'Alex opened "Spring Sale" email', time: 'Just now' },
  { id: 2, icon: 'mdi-cart-plus', color: 'primary', text: 'Sarah added 3 items to cart', time: '12s ago' },
  { id: 3, icon: 'mdi-cash-check', color: 'success', text: 'New order #8992 received ($142.50)', time: '28s ago' },
  { id: 4, icon: 'mdi-cursor-default-click', color: 'info', text: 'David clicked "View Collection"', time: '45s ago' },
  { id: 5, icon: 'mdi-account-plus', color: 'purple', text: 'New subscriber joined from popup', time: '1m ago' },
])

const eventPool = [
  { icon: 'mdi-cart-heart', color: 'primary', text: 'Michael started checkout process' },
  { icon: 'mdi-cash-check', color: 'success', text: 'New order #8993 received ($89.00)' },
  { icon: 'mdi-email', color: 'info', text: 'Sent Abandoned Cart reminder to Emma' },
  { icon: 'mdi-account-star', color: 'warning', text: 'John reached VIP tier' },
  { icon: 'mdi-form-select', color: 'secondary', text: 'New form submission: "Contact Us"' },
  { icon: 'mdi-gift', color: 'purple', text: 'Applied discount code SPRING24' },
]

let timer: ReturnType<typeof setInterval>
let idCounter = 6

// Animation flag to trigger Vue transitions
onMounted(() => {
  timer = setInterval(() => {
    // Add new event to top, remove from bottom
    const evt = eventPool[Math.floor(Math.random() * eventPool.length)]
    if (!evt) return
    
    // Update existing times
    items.value.forEach(item => {
      if (item.time === 'Just now') item.time = '10s ago'
      else if (item.time.includes('s ago')) {
        const sec = parseInt(item.time) + 10
        item.time = sec > 59 ? '1m ago' : `${sec}s ago`
      }
    })

    items.value.unshift({
      id: idCounter++,
      ...evt,
      time: 'Just now'
    })
    
    if (items.value.length > 5) {
      items.value.pop()
    }
  }, 4000) // update every 4 seconds for a "live" feel
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="h-100 d-flex flex-column pt-1">
    <div class="d-flex align-center justify-space-between mb-3 px-2">
      <div class="d-flex align-center gap-2">
        <div class="live-indicator"></div>
        <span class="text-caption font-weight-bold text-success text-uppercase" style="letter-spacing: 1px;">Live Activity</span>
      </div>
      <span class="text-caption text-medium-emphasis">14 events/min</span>
    </div>

    <div class="flex-grow-1 overflow-hidden position-relative">
      <TransitionGroup name="list" tag="div" class="d-flex flex-column gap-2 px-2">
        <v-card 
          v-for="item in items" 
          :key="item.id"
          variant="tonal"
          :color="item.color"
          class="live-item-card"
        >
          <v-card-text class="pa-3 d-flex align-center gap-3">
            <v-icon size="16" :color="item.color">{{ item.icon }}</v-icon>
            <div class="flex-grow-1 min-width-0">
              <div class="text-caption font-weight-medium text-truncate" style="line-height: 1.2;">{{ item.text }}</div>
            </div>
            <div class="text-caption text-medium-emphasis" style="font-size: 10px !important; white-space: nowrap;">{{ item.time }}</div>
          </v-card-text>
        </v-card>
      </TransitionGroup>
      
      <!-- Gradient fade at bottom -->
      <div class="fade-out-bottom"></div>
    </div>
  </div>
</template>

<style scoped>
.live-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-success));
  box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(var(--v-theme-success), 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0); }
}

.live-item-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

.fade-out-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, rgba(var(--v-theme-surface), 0) 0%, rgba(var(--v-theme-surface), 1) 100%);
  pointer-events: none;
}

.min-width-0 { min-width: 0; }

/* Transition animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.list-leave-active {
  position: absolute;
  width: calc(100% - 16px);
}
</style>
