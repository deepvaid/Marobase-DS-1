import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'

// Vuetify — full import to ensure all component styles are available in stories
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Global styles
import '../src/design-tokens/generated/variables.css'
import '../src/styles/mp-theme-aliases.css'
import '../src/styles/global.scss'

// Design tokens — auto-generated from tokens.json (same source as vuetify.ts)
import {
  mp_color_light_background, mp_color_light_surface, mp_color_light_surfaceVariant,
  mp_color_light_onSurfaceVariant, mp_color_light_primary, mp_color_light_primaryDarken,
  mp_color_light_secondary, mp_color_light_secondaryDarken, mp_color_light_success,
  mp_color_light_successDarken, mp_color_light_warning, mp_color_light_warningDarken,
  mp_color_light_error, mp_color_light_errorDarken, mp_color_light_info,
  mp_color_light_onPrimary, mp_color_light_onSecondary, mp_color_light_onSuccess,
  mp_color_light_onError, mp_color_light_onWarning, mp_color_light_border,
  mp_color_dark_background, mp_color_dark_surface, mp_color_dark_surfaceVariant,
  mp_color_dark_onSurfaceVariant, mp_color_dark_primary, mp_color_dark_primaryDarken,
  mp_color_dark_secondary, mp_color_dark_secondaryDarken, mp_color_dark_success,
  mp_color_dark_warning, mp_color_dark_error, mp_color_dark_info,
  mp_color_dark_onPrimary, mp_color_dark_border,
  mp_typography_fontFamily_base,
  mp_component_button_typography_fontSize,
  mp_component_button_typography_fontWeight,
  mp_component_button_typography_letterSpacing,
  mp_component_button_radius_default,
  mp_component_input_radius_default,
} from '../src/design-tokens/generated/tokens'

// ── Shared Vuetify instance (driven by design tokens — mirrors src/plugins/vuetify.ts) ─
const maropostLight = {
  dark: false,
  colors: {
    background:          mp_color_light_background,
    surface:             mp_color_light_surface,
    'surface-variant':   mp_color_light_surfaceVariant,
    'on-surface-variant': mp_color_light_onSurfaceVariant,
    primary:             mp_color_light_primary,
    'primary-darken-1':  mp_color_light_primaryDarken,
    secondary:           mp_color_light_secondary,
    'secondary-darken-1': mp_color_light_secondaryDarken,
    success:             mp_color_light_success,
    'success-darken-1':  mp_color_light_successDarken,
    warning:             mp_color_light_warning,
    'warning-darken-1':  mp_color_light_warningDarken,
    error:               mp_color_light_error,
    'error-darken-1':    mp_color_light_errorDarken,
    info:                mp_color_light_info,
    'on-primary':        mp_color_light_onPrimary,
    'on-secondary':      mp_color_light_onSecondary,
    'on-success':        mp_color_light_onSuccess,
    'on-error':          mp_color_light_onError,
    'on-warning':        mp_color_light_onWarning,
    border:              mp_color_light_border,
  },
}

const maropostDark = {
  dark: true,
  colors: {
    background:          mp_color_dark_background,
    surface:             mp_color_dark_surface,
    'surface-variant':   mp_color_dark_surfaceVariant,
    'on-surface-variant': mp_color_dark_onSurfaceVariant,
    primary:             mp_color_dark_primary,
    'primary-darken-1':  mp_color_dark_primaryDarken,
    secondary:           mp_color_dark_secondary,
    'secondary-darken-1': mp_color_dark_secondaryDarken,
    success:             mp_color_dark_success,
    warning:             mp_color_dark_warning,
    error:               mp_color_dark_error,
    info:                mp_color_dark_info,
    'on-primary':        mp_color_dark_onPrimary,
    border:              mp_color_dark_border,
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
      style: `
        letter-spacing: ${mp_component_button_typography_letterSpacing};
        font-weight: ${mp_component_button_typography_fontWeight};
        text-transform: none;
        font-family: ${mp_typography_fontFamily_base};
        font-size: ${mp_component_button_typography_fontSize};
        border-radius: ${mp_component_button_radius_default};
      `,
    },
    VCard: { variant: 'flat', border: true, class: 'mp-card' },
    VTextField: { variant: 'outlined', hideDetails: 'auto', style: `border-radius: ${mp_component_input_radius_default};` },
    VSelect: { variant: 'outlined', hideDetails: 'auto', style: `border-radius: ${mp_component_input_radius_default};` },
    VAutocomplete: { variant: 'outlined', hideDetails: 'auto', style: `border-radius: ${mp_component_input_radius_default};` },
    VCombobox: { variant: 'outlined', hideDetails: 'auto', style: `border-radius: ${mp_component_input_radius_default};` },
    VTextarea: { variant: 'outlined', hideDetails: 'auto', style: `border-radius: ${mp_component_input_radius_default};` },
    VChip: { rounded: 'md' },
    VDataTable: { fixedHeader: true, hover: true, density: 'comfortable', itemsPerPage: 15 },
    VNavigationDrawer: { elevation: 0 },
    VAppBar: { elevation: 0 },
    VDialog: { rounded: 'xl' },
    VDivider: { opacity: 0.6 },
    VList: { elevation: 0, border: true, rounded: 'lg' },
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
    (story, context) => ({
      components: { story },
      // Use setup() so the theme binding is truly reactive when toggled in the toolbar.
      // Crucially we use a plain <div> instead of <v-main> — v-main is a Vuetify layout
      // container that registers itself with the layout system and sets CSS variables
      // (--v-layout-left/right/top/bottom) that confuse v-dialog and v-navigation-drawer
      // overlay positioning in the Storybook iframe environment.
      setup() {
        return { sbTheme: context.globals.theme || 'maropostLight' }
      },
      template: `
        <v-app>
          <v-theme-provider :theme="sbTheme">
            <div class="pa-6 mp-story-canvas">
              <story />
            </div>
          </v-theme-provider>
        </v-app>
      `,
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true }, // Vuetify handles backgrounds
  },
}

export default preview
