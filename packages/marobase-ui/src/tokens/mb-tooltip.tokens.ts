export interface MbTooltipThemeTokens {
  [token: string]: string;
}

export interface MbTooltipTokenBundle {
  light: MbTooltipThemeTokens;
  dark: MbTooltipThemeTokens;
}

export const mbTooltipTokens: MbTooltipTokenBundle = {
  light: {
    '--mb-tip-bg': '#000000',
    '--mb-tip-text-color': '#ffffff',
    '--mb-tip-trigger-color': '#7d868c',
    '--mb-tip-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-tip-bg': '#e5eaf2',
    '--mb-tip-text-color': '#0f141c',
    '--mb-tip-trigger-color': '#97a3b5',
    '--mb-tip-focus-ring': '0 0 0 3px #304d84'
  }
};
