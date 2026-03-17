export interface MbDrawerThemeTokens {
  [token: string]: string;
}

export interface MbDrawerTokenBundle {
  light: MbDrawerThemeTokens;
  dark: MbDrawerThemeTokens;
}

export const mbDrawerTokens: MbDrawerTokenBundle = {
  light: {
    '--mb-drawer-surface': '#ffffff',
    '--mb-drawer-border-color': '#e6e8eb',
    '--mb-drawer-primary-bg': '#0091ff',
    '--mb-drawer-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-drawer-surface': '#121923',
    '--mb-drawer-border-color': '#2a3342',
    '--mb-drawer-primary-bg': '#4f8bff',
    '--mb-drawer-focus-ring': '0 0 0 3px #304d84'
  }
};
