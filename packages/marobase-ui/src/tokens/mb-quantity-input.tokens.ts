export interface MbQuantityInputThemeTokens {
  [token: string]: string;
}

export interface MbQuantityInputTokenBundle {
  light: MbQuantityInputThemeTokens;
  dark: MbQuantityInputThemeTokens;
}

export const mbQuantityInputTokens: MbQuantityInputTokenBundle = {
  light: {
    '--mb-qi-label-color': '#11181c',
    '--mb-qi-border': '#c1c8cd',
    '--mb-qi-value-border-focus': '#0091ff',
    '--mb-qi-step-icon-color': '#7d868c',
    '--mb-qi-value-text': '#11181c',
    '--mb-qi-hint-color': '#7d868c',
    '--mb-qi-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-qi-label-color': '#e5eaf2',
    '--mb-qi-border': '#405978',
    '--mb-qi-value-border-focus': '#89a8ff',
    '--mb-qi-step-icon-color': '#c5cfde',
    '--mb-qi-value-text': '#e5eaf2',
    '--mb-qi-hint-color': '#97a3b5',
    '--mb-qi-focus-ring': '0 0 0 3px #304d84'
  }
};
