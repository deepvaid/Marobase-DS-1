export interface MbTextAreaThemeTokens {
  [token: string]: string;
}

export interface MbTextAreaTokenBundle {
  light: MbTextAreaThemeTokens;
  dark: MbTextAreaThemeTokens;
}

export const mbTextAreaTokens: MbTextAreaTokenBundle = {
  light: {
    '--mb-ta-label-color': '#11181c',
    '--mb-ta-control-bg': '#ffffff',
    '--mb-ta-control-border': '#c1c8cd',
    '--mb-ta-control-border-focus': '#0091ff',
    '--mb-ta-placeholder-color': '#7d868c',
    '--mb-ta-hint-color': '#7d868c',
    '--mb-ta-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-ta-label-color': '#e5eaf2',
    '--mb-ta-control-bg': '#121923',
    '--mb-ta-control-border': '#405978',
    '--mb-ta-control-border-focus': '#89a8ff',
    '--mb-ta-placeholder-color': '#97a3b5',
    '--mb-ta-hint-color': '#97a3b5',
    '--mb-ta-focus-ring': '0 0 0 3px #304d84'
  }
};
