export interface MbPopoverThemeTokens {
  [token: string]: string;
}

export interface MbPopoverTokenBundle {
  light: MbPopoverThemeTokens;
  dark: MbPopoverThemeTokens;
}

export const mbPopoverTokens: MbPopoverTokenBundle = {
  light: {
    '--mb-pop-surface': '#ffffff',
    '--mb-pop-primary-bg': '#0091ff',
    '--mb-pop-secondary-border': '#c1c8cd',
    '--mb-pop-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-pop-surface': '#121923',
    '--mb-pop-primary-bg': '#4f8bff',
    '--mb-pop-secondary-border': '#405978',
    '--mb-pop-focus-ring': '0 0 0 3px #304d84'
  }
};
