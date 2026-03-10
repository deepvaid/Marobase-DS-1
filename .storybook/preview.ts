import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Global styles
import '../src/styles/global.scss'

// ── Shared Vuetify instance (mirrors src/plugins/vuetify.ts) ───────────────
const maropostLight = {
  dark: false,
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    'surface-variant': '#F3F4F6',
    'on-surface-variant': '#6B7280',
    primary: '#1A56DB',
    'primary-darken-1': '#1447B8',
    secondary: '#7E3AF2',
    'secondary-darken-1': '#6627CC',
    success: '#0E9F6E',
    'success-darken-1': '#057A55',
    warning: '#D97706',
    'warning-darken-1': '#B45309',
    error: '#E02424',
    'error-darken-1': '#C81E1E',
    info: '#1A56DB',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-warning': '#FFFFFF',
    border: '#E5E7EB',
  },
}

const maropostDark = {
  dark: true,
  colors: {
    background: '#111928',
    surface: '#1F2937',
    'surface-variant': '#374151',
    'on-surface-variant': '#9CA3AF',
    primary: '#60A5FA',
    'primary-darken-1': '#3B82F6',
    secondary: '#A78BFA',
    'secondary-darken-1': '#8B5CF6',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    'on-primary': '#111928',
    border: '#374151',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'maropostLight',
    themes: { maropostLight, maropostDark },
  },
  defaults: {
    VBtn: {
      style: 'letter-spacing: 0; font-weight: 500; text-transform: none; font-family: Inter, sans-serif;',
      rounded: 'lg',
    },
    VCard: { rounded: 'xl', variant: 'flat', border: true },
    VTextField: { rounded: 'lg', variant: 'outlined', hideDetails: 'auto' },
    VSelect: { rounded: 'lg', variant: 'outlined', hideDetails: 'auto' },
    VChip: { rounded: 'md' },
    VDataTable: { fixedHeader: true, hover: true, density: 'comfortable', itemsPerPage: 15 },
    VNavigationDrawer: { elevation: 0 },
    VAppBar: { elevation: 0 },
    VDialog: { rounded: 'xl' },
    VDivider: { opacity: 1 },
  },
})

// ── Register plugins globally for all stories ──────────────────────────────
setup((app) => {
  app.use(vuetify)
  app.use(createPinia())
})

// ── Storybook preview config ───────────────────────────────────────────────
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Vuetify theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'maropostLight', title: 'Light' },
          { value: 'maropostDark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'maropostLight',
  },
  decorators: [
    (story, context) => {
      const themeName = context.globals.theme || 'maropostLight'
      return {
        components: { story },
        template: `
          <v-app>
            <v-theme-provider :theme="'${themeName}'">
              <v-main class="pa-6" style="background: rgb(var(--v-theme-background));">
                <story />
              </v-main>
            </v-theme-provider>
          </v-app>
        `,
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true }, // Vuetify handles backgrounds
  },
}

export default preview
