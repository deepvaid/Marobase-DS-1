export interface MbChipThemeTokens {
  [token: string]: string;
}

export interface MbChipTokenBundle {
  light: MbChipThemeTokens;
  dark: MbChipThemeTokens;
}

export const mbChipTokens: MbChipTokenBundle = {
  light: {
    '--mb-chip-bg': '#f0f2f4',
    '--mb-chip-text': '#11181c',
    '--mb-chip-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-chip-bg': '#1f2b39',
    '--mb-chip-text': '#e5eaf2',
    '--mb-chip-focus-ring': '0 0 0 3px #375891'
  }
};
