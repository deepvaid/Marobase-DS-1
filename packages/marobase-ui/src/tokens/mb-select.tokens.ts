export interface MbSelectThemeTokens {
  [token: string]: string;
}

export interface MbSelectTokenBundle {
  light: MbSelectThemeTokens;
  dark: MbSelectThemeTokens;
}

export const mbSelectTokens: MbSelectTokenBundle = {
  light: {
    '--mb-sl-label-color': '#11181c',
    '--mb-sl-bg': '#ffffff',
    '--mb-sl-border': '#c1c8cd',
    '--mb-sl-border-focus': '#0091ff',
    '--mb-sl-placeholder-color': '#7d868c',
    '--mb-sl-hint-color': '#7d868c',
    '--mb-sl-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-sl-menu-bg': '#ffffff',
    '--mb-sl-menu-border': '#e6e8eb'
  },
  dark: {
    '--mb-sl-label-color': '#e5eaf2',
    '--mb-sl-bg': '#121923',
    '--mb-sl-border': '#405978',
    '--mb-sl-border-focus': '#89a8ff',
    '--mb-sl-placeholder-color': '#97a3b5',
    '--mb-sl-hint-color': '#97a3b5',
    '--mb-sl-focus-ring': '0 0 0 3px #304d84',
    '--mb-sl-menu-bg': '#121923',
    '--mb-sl-menu-border': '#405978'
  }
};
