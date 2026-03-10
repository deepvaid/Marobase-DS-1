import { create } from '@storybook/theming/create'

export default create({
  base: 'light',
  brandTitle: 'Maropost Design System',
  brandUrl: 'https://maropost.com',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#1A56DB',
  colorSecondary: '#7E3AF2',

  // UI
  appBg: '#F9FAFB',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Text
  textColor: '#111928',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B7280',

  // Toolbar
  barTextColor: '#6B7280',
  barSelectedColor: '#1A56DB',
  barHoverColor: '#1A56DB',
  barBg: '#FFFFFF',

  // Inputs
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputTextColor: '#111928',
  inputBorderRadius: 8,

  // Font
  fontBase: '"Inter", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',
})
