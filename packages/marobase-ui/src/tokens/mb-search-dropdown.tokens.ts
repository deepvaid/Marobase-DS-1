export interface MbSearchDropdownThemeTokens {
  [token: string]: string;
}

export interface MbSearchDropdownTokenBundle {
  light: MbSearchDropdownThemeTokens;
  dark: MbSearchDropdownThemeTokens;
}

export const mbSearchDropdownTokens: MbSearchDropdownTokenBundle = {
  light: {
    '--mb-sd-bg': '#ffffff',
    '--mb-sd-border': '#c1c8cd',
    '--mb-sd-border-focus': '#0091ff',
    '--mb-sd-value-color': '#11181c',
    '--mb-sd-placeholder-color': '#7d868c',
    '--mb-sd-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-sd-menu-bg': '#ffffff',
    '--mb-sd-menu-border': '#e6e8eb'
  },
  dark: {
    '--mb-sd-bg': '#121923',
    '--mb-sd-border': '#405978',
    '--mb-sd-border-focus': '#89a8ff',
    '--mb-sd-value-color': '#e5eaf2',
    '--mb-sd-placeholder-color': '#97a3b5',
    '--mb-sd-focus-ring': '0 0 0 3px #304d84',
    '--mb-sd-menu-bg': '#121923',
    '--mb-sd-menu-border': '#405978'
  }
};
