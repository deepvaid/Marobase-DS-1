export interface MbSliderThemeTokens {
  [token: string]: string;
}

export interface MbSliderTokenBundle {
  light: MbSliderThemeTokens;
  dark: MbSliderThemeTokens;
}

export const mbSliderTokens: MbSliderTokenBundle = {
  light: {
    '--mb-sr-track-bg': '#ebedef',
    '--mb-sr-range-bg': '#0091ff',
    '--mb-sr-thumb-bg': '#0091ff',
    '--mb-sr-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-sr-label-color': '#11181c'
  },
  dark: {
    '--mb-sr-track-bg': '#2a3342',
    '--mb-sr-range-bg': '#2f84ff',
    '--mb-sr-thumb-bg': '#2f84ff',
    '--mb-sr-focus-ring': '0 0 0 3px #304d84',
    '--mb-sr-label-color': '#e5eaf2'
  }
};
