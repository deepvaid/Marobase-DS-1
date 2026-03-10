<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const sections = [
  { key: 'colors',     label: 'Colors',      icon: 'mdi-palette' },
  { key: 'typography', label: 'Typography',  icon: 'mdi-format-text' },
  { key: 'spacing',    label: 'Spacing',     icon: 'mdi-ruler' },
  { key: 'components', label: 'Components',  icon: 'mdi-widgets' },
]

const active = ref('colors')

const sectionComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  colors:     defineAsyncComponent(() => import('./sections/Colors.vue')),
  typography: defineAsyncComponent(() => import('./sections/Typography.vue')),
  spacing:    defineAsyncComponent(() => import('./sections/Spacing.vue')),
  components: defineAsyncComponent(() => import('./sections/Components.vue')),
}
</script>

<template>
  <v-app>
    <!-- Top bar -->
    <v-app-bar color="surface" border="b" height="56">
      <v-app-bar-title>
        <span style="font-weight: 700; font-size: 16px; font-family: Inter, sans-serif;">
          Maropost Design Kit
        </span>
        <v-chip size="x-small" color="primary" class="ml-2" label>v1.0</v-chip>
      </v-app-bar-title>
      <template #append>
        <v-btn
          href="https://github.com"
          target="_blank"
          variant="text"
          size="small"
          prepend-icon="mdi-github"
        >
          GitHub
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Left rail nav -->
    <v-navigation-drawer width="220" border="r" permanent>
      <v-list nav density="compact" class="mt-2">
        <v-list-subheader>Design Tokens</v-list-subheader>
        <v-list-item
          v-for="s in sections.slice(0, 3)"
          :key="s.key"
          :prepend-icon="s.icon"
          :title="s.label"
          :value="s.key"
          :active="active === s.key"
          active-color="primary"
          rounded="lg"
          @click="active = s.key"
        />
        <v-divider class="my-2" />
        <v-list-subheader>Component Gallery</v-list-subheader>
        <v-list-item
          v-for="s in sections.slice(3)"
          :key="s.key"
          :prepend-icon="s.icon"
          :title="s.label"
          :value="s.key"
          :active="active === s.key"
          active-color="primary"
          rounded="lg"
          @click="active = s.key"
        />
      </v-list>

      <template #append>
        <v-divider />
        <div class="pa-4 text-caption text-medium-emphasis">
          <div>Maropost Design System</div>
          <div>Tokens synced from tokens.json</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main style="background: #F9FAFB;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 32px;">
        <component :is="sectionComponents[active]" />
      </div>
    </v-main>
  </v-app>
</template>
