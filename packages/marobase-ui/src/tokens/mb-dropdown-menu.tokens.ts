export interface MbDropdownMenuThemeTokens {
  [token: string]: string;
}

export interface MbDropdownMenuTokenBundle {
  light: MbDropdownMenuThemeTokens;
  dark: MbDropdownMenuThemeTokens;
}

export const mbDropdownMenuTokens: MbDropdownMenuTokenBundle = {
  light: {
    '--mb-dm-bg': '#ffffff',
    '--mb-dm-border': '#e6e8eb',
    '--mb-dm-option-hover-bg': '#f5f7f9',
    '--mb-dm-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-dm-bg': '#121923',
    '--mb-dm-border': '#405978',
    '--mb-dm-option-hover-bg': '#1a2430',
    '--mb-dm-focus-ring': '0 0 0 3px #304d84'
  }
};
