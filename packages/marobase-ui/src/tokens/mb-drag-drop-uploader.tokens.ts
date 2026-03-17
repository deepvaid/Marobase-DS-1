export interface MbDragDropUploaderThemeTokens {
  [token: string]: string;
}

export interface MbDragDropUploaderTokenBundle {
  light: MbDragDropUploaderThemeTokens;
  dark: MbDragDropUploaderThemeTokens;
}

export const mbDragDropUploaderTokens: MbDragDropUploaderTokenBundle = {
  light: {
    '--mb-dd-label-color': '#11181c',
    '--mb-dd-field-bg': '#ffffff',
    '--mb-dd-field-border': '#c1c8cd',
    '--mb-dd-field-border-focus': '#0091ff',
    '--mb-dd-title-color': '#7d868c',
    '--mb-dd-link-color': '#0091ff',
    '--mb-dd-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-dd-label-color': '#e5eaf2',
    '--mb-dd-field-bg': '#121923',
    '--mb-dd-field-border': '#405978',
    '--mb-dd-field-border-focus': '#89a8ff',
    '--mb-dd-title-color': '#97a3b5',
    '--mb-dd-link-color': '#89a8ff',
    '--mb-dd-focus-ring': '0 0 0 3px #304d84'
  }
};
