export interface MbTableThemeTokens {
  [token: string]: string;
}

export interface MbTableTokenBundle {
  light: MbTableThemeTokens;
  dark: MbTableThemeTokens;
}

export const mbTableTokens: MbTableTokenBundle = {
  light: {
    '--mb-table-bg': '#ffffff',
    '--mb-table-border': '#e6e8eb',
    '--mb-table-text': '#11181c'
  },
  dark: {
    '--mb-table-bg': '#111821',
    '--mb-table-border': '#314255',
    '--mb-table-text': '#e5eaf2'
  }
};
