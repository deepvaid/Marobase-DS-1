export interface MbSplitButtonThemeTokens {
  [token: string]: string;
}

export interface MbSplitButtonTokenBundle {
  light: MbSplitButtonThemeTokens;
  dark: MbSplitButtonThemeTokens;
}

export const mbSplitButtonTokens: MbSplitButtonTokenBundle = {
  light: {
    '--mb-sb-bg': '#0091ff',
    '--mb-sb-text': '#ffffff',
    '--mb-sb-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-sb-menu-bg': '#ffffff',
    '--mb-sb-menu-border': '#e6e8eb',
    '--mb-sb-menu-item-text': '#11181c'
  },
  dark: {
    '--mb-sb-bg': '#1f4cd2',
    '--mb-sb-text': '#e5eaf2',
    '--mb-sb-focus-ring': '0 0 0 3px #304d84',
    '--mb-sb-menu-bg': '#121923',
    '--mb-sb-menu-border': '#405978',
    '--mb-sb-menu-item-text': '#e5eaf2'
  }
};
