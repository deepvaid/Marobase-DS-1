// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Design tokens — auto-generated from tokens.json
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
} from '@/design-tokens/generated/tokens'

// ─── Light Theme ──────────────────────────────────────────────────────────────
const maropostLight = {
  dark: false,
  colors: {
    // Core palette — driven by design tokens
    background:          mp_color_light_background,
    surface:             mp_color_light_surface,
    'surface-variant':   mp_color_light_surfaceVariant,
    'on-surface-variant': mp_color_light_onSurfaceVariant,

    // Brand
    primary:             mp_color_light_primary,
    'primary-darken-1':  mp_color_light_primaryDarken,
    secondary:           mp_color_light_secondary,
    'secondary-darken-1': mp_color_light_secondaryDarken,

    // Semantic
    success:             mp_color_light_success,
    'success-darken-1':  mp_color_light_successDarken,
    warning:             mp_color_light_warning,
    'warning-darken-1':  mp_color_light_warningDarken,
    error:               mp_color_light_error,
    'error-darken-1':    mp_color_light_errorDarken,
    info:                mp_color_light_info,

    // Text on brand colours
    'on-primary':        mp_color_light_onPrimary,
    'on-secondary':      mp_color_light_onSecondary,
    'on-success':        mp_color_light_onSuccess,
    'on-error':          mp_color_light_onError,
    'on-warning':        mp_color_light_onWarning,

    // Border
    border:              mp_color_light_border,
  }
}

// ─── Dark Theme ───────────────────────────────────────────────────────────────
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
      style: `
        letter-spacing: ${mp_component_button_typography_letterSpacing};
        font-weight: ${mp_component_button_typography_fontWeight};
        text-transform: none;
        font-family: ${mp_typography_fontFamily_base};
        font-size: ${mp_component_button_typography_fontSize};
        border-radius: ${mp_component_button_radius_default};
      `,
    },

    // Cards — flat (no elevation), bordered, rounded corners
    VCard: {
      variant: 'flat',
      border: true,
      class: 'mp-card',
    },

    // Form inputs
    VTextField: {
      variant: 'outlined',
      hideDetails: 'auto',
      style: `border-radius: ${mp_component_input_radius_default};`,
    },
    VSelect: {
      variant: 'outlined',
      hideDetails: 'auto',
      style: `border-radius: ${mp_component_input_radius_default};`,
    },
    VAutocomplete: {
      variant: 'outlined',
      hideDetails: 'auto',
      style: `border-radius: ${mp_component_input_radius_default};`,
    },
    VCombobox: {
      variant: 'outlined',
      hideDetails: 'auto',
      style: `border-radius: ${mp_component_input_radius_default};`,
    },
    VTextarea: {
      variant: 'outlined',
      hideDetails: 'auto',
      style: `border-radius: ${mp_component_input_radius_default};`,
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

    // Divider — subtle by default
    VDivider: {
      opacity: 0.6,
    },

    // Lists — flat + border (no heavy elevation)
    VList: {
      elevation: 0,
      border: true,
      rounded: 'lg',
    },
  },
})
