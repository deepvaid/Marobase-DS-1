export interface MbInputFieldThemeTokens {
  [token: string]: string;
}

export interface MbInputFieldTokenBundle {
  light: MbInputFieldThemeTokens;
  dark: MbInputFieldThemeTokens;
}

export const mbInputFieldTokens: MbInputFieldTokenBundle = {
  light: {
    '--mb-if-label-color': '#11181c',
    '--mb-if-bg': '#ffffff',
    '--mb-if-border': '#c1c8cd',
    '--mb-if-border-focus': '#0091ff',
    '--mb-if-placeholder-color': '#7d868c',
    '--mb-if-hint-color': '#889096',
    '--mb-if-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-if-label-color': '#e5eaf2',
    '--mb-if-bg': '#121923',
    '--mb-if-border': '#405978',
    '--mb-if-border-focus': '#89a8ff',
    '--mb-if-placeholder-color': '#97a3b5',
    '--mb-if-hint-color': '#97a3b5',
    '--mb-if-focus-ring': '0 0 0 3px #304d84'
  }
};
