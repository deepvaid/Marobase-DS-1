export interface MbPaginationThemeTokens {
  [token: string]: string;
}

export interface MbPaginationTokenBundle {
  light: MbPaginationThemeTokens;
  dark: MbPaginationThemeTokens;
}

export const mbPaginationTokens: MbPaginationTokenBundle = {
  light: {
    '--mb-pg-border': '#c1c8cd',
    '--mb-pg-text': '#11181c',
    '--mb-pg-active-bg': '#f0f2f4',
    '--mb-pg-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-pg-border': '#405978',
    '--mb-pg-text': '#e5eaf2',
    '--mb-pg-active-bg': '#1f2d3f',
    '--mb-pg-focus-ring': '0 0 0 3px #304d84'
  }
};
