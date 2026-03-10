// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// ─── Light Theme ──────────────────────────────────────────────────────────────
const maropostLight = {
  dark: false,
  colors: {
    // Core palette — Shopify Polaris inspired
    background:          '#F9FAFB',   // page canvas — very light grey
    surface:             '#FFFFFF',   // card / drawer / modal
    'surface-variant':   '#F3F4F6',   // subtle tinted surface (input backgrounds, code blocks)
    'on-surface-variant':'#6B7280',   // muted text on surface-variant

    // Brand
    primary:             '#1A56DB',   // action blue — buttons, links, active states
    'primary-darken-1':  '#1447B8',
    secondary:           '#7E3AF2',   // marketing purple — journey/campaign accents
    'secondary-darken-1':'#6627CC',

    // Semantic
    success:             '#0E9F6E',
    'success-darken-1':  '#057A55',
    warning:             '#D97706',
    'warning-darken-1':  '#B45309',
    error:               '#E02424',
    'error-darken-1':    '#C81E1E',
    info:                '#1A56DB',

    // Text on brand colours
    'on-primary':        '#FFFFFF',
    'on-secondary':      '#FFFFFF',
    'on-success':        '#FFFFFF',
    'on-error':          '#FFFFFF',
    'on-warning':        '#FFFFFF',

    // Border
    border:              '#E5E7EB',
  }
}

// ─── Dark Theme ───────────────────────────────────────────────────────────────
const maropostDark = {
  dark: true,
  colors: {
    background:          '#111928',
    surface:             '#1F2937',
    'surface-variant':   '#374151',
    'on-surface-variant':'#9CA3AF',
    primary:             '#60A5FA',
    'primary-darken-1':  '#3B82F6',
    secondary:           '#A78BFA',
    'secondary-darken-1':'#8B5CF6',
    success:             '#34D399',
    warning:             '#FBBF24',
    error:               '#F87171',
    info:                '#60A5FA',
    'on-primary':        '#111928',
    border:              '#374151',
  }
}

// ─── Vuetify Instance ─────────────────────────────────────────────────────────
export default createVuetify({
  theme: {
    defaultTheme: 'maropostLight',
    themes: { maropostLight, maropostDark },
  },

  // ─── Global component defaults ────────────────────────────────────────────
  defaults: {
    // Buttons — Inter font, no all-caps
    VBtn: {
      style: 'letter-spacing: 0; font-weight: 500; text-transform: none; font-family: Inter, sans-serif;',
      rounded: 'lg',
    },

    // Cards — flat (no elevation), bordered, rounded corners
    VCard: {
      rounded: 'xl',
      variant: 'flat',
      border: true,
    },

    // Form inputs
    VTextField: {
      rounded: 'lg',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VSelect: {
      rounded: 'lg',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      rounded: 'lg',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VCombobox: {
      rounded: 'lg',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VTextarea: {
      rounded: 'lg',
      variant: 'outlined',
      hideDetails: 'auto',
    },

    // Chips — medium radius, consistent sizing
    VChip: {
      rounded: 'md',
    },

    // Data table — fixed header, hover rows, comfortable density
    VDataTable: {
      fixedHeader: true,
      hover: true,
      density: 'comfortable',
      itemsPerPage: 15,
    },

    // Navigation drawer — no elevation shadow
    VNavigationDrawer: {
      elevation: 0,
    },

    // App bar
    VAppBar: {
      elevation: 0,
    },

    // Dialog
    VDialog: {
      rounded: 'xl',
    },

    // Divider
    VDivider: {
      opacity: 1,
    },
  },
})
