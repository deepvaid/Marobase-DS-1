export interface MbMultiSelectThemeTokens {
  [token: string]: string;
}

export interface MbMultiSelectTokenBundle {
  light: MbMultiSelectThemeTokens;
  dark: MbMultiSelectThemeTokens;
}

export const mbMultiSelectTokens: MbMultiSelectTokenBundle = {
  light: {
    '--mb-ms-label-color': '#11181c',
    '--mb-ms-bg': '#ffffff',
    '--mb-ms-border': '#c1c8cd',
    '--mb-ms-border-focus': '#0091ff',
    '--mb-ms-placeholder-color': '#7d868c',
    '--mb-ms-hint-color': '#7d868c',
    '--mb-ms-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-ms-menu-bg': '#ffffff',
    '--mb-ms-menu-border': '#e6e8eb'
  },
  dark: {
    '--mb-ms-label-color': '#e5eaf2',
    '--mb-ms-bg': '#121923',
    '--mb-ms-border': '#405978',
    '--mb-ms-border-focus': '#89a8ff',
    '--mb-ms-placeholder-color': '#97a3b5',
    '--mb-ms-hint-color': '#97a3b5',
    '--mb-ms-focus-ring': '0 0 0 3px #304d84',
    '--mb-ms-menu-bg': '#121923',
    '--mb-ms-menu-border': '#405978'
  }
};
