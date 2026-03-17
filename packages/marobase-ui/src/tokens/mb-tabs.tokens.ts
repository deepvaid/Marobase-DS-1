export interface MbTabsThemeTokens {
  [token: string]: string;
}

export interface MbTabsTokenBundle {
  light: MbTabsThemeTokens;
  dark: MbTabsThemeTokens;
}

export const mbTabsTokens: MbTabsTokenBundle = {
  light: {
    '--mb-tabs-border-color': '#e6e8eb',
    '--mb-tabs-tab-color': '#7d868c',
    '--mb-tabs-active-border-color': '#0091ff',
    '--mb-tabs-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-tabs-border-color': '#2a3342',
    '--mb-tabs-tab-color': '#97a3b5',
    '--mb-tabs-active-border-color': '#89a8ff',
    '--mb-tabs-focus-ring': '0 0 0 3px #304d84'
  }
};
