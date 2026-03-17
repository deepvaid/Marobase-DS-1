export interface MbComboBoxThemeTokens {
  [token: string]: string;
}

export interface MbComboBoxTokenBundle {
  light: MbComboBoxThemeTokens;
  dark: MbComboBoxThemeTokens;
}

export const mbComboBoxTokens: MbComboBoxTokenBundle = {
  light: {
    '--mb-cb-label-color': '#11181c',
    '--mb-cb-bg': '#ffffff',
    '--mb-cb-border': '#c1c8cd',
    '--mb-cb-border-focus': '#0091ff',
    '--mb-cb-placeholder-color': '#7d868c',
    '--mb-cb-hint-color': '#7d868c',
    '--mb-cb-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-cb-menu-bg': '#ffffff',
    '--mb-cb-menu-border': '#e6e8eb'
  },
  dark: {
    '--mb-cb-label-color': '#e5eaf2',
    '--mb-cb-bg': '#121923',
    '--mb-cb-border': '#405978',
    '--mb-cb-border-focus': '#89a8ff',
    '--mb-cb-placeholder-color': '#97a3b5',
    '--mb-cb-hint-color': '#97a3b5',
    '--mb-cb-focus-ring': '0 0 0 3px #304d84',
    '--mb-cb-menu-bg': '#121923',
    '--mb-cb-menu-border': '#405978'
  }
};
