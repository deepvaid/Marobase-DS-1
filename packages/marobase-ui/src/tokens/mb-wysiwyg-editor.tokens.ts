export interface MbWysiwygEditorThemeTokens {
  [token: string]: string;
}

export interface MbWysiwygEditorTokenBundle {
  light: MbWysiwygEditorThemeTokens;
  dark: MbWysiwygEditorThemeTokens;
}

export const mbWysiwygEditorTokens: MbWysiwygEditorTokenBundle = {
  light: {
    '--mb-wy-label-color': '#11181c',
    '--mb-wy-bg': '#ffffff',
    '--mb-wy-border': '#c1c8cd',
    '--mb-wy-border-focus': '#0091ff',
    '--mb-wy-editor-color': '#11181c',
    '--mb-wy-hint-color': '#7d868c',
    '--mb-wy-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-wy-label-color': '#e5eaf2',
    '--mb-wy-bg': '#121923',
    '--mb-wy-border': '#405978',
    '--mb-wy-border-focus': '#89a8ff',
    '--mb-wy-editor-color': '#e5eaf2',
    '--mb-wy-hint-color': '#97a3b5',
    '--mb-wy-focus-ring': '0 0 0 3px #304d84'
  }
};
