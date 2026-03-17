export interface MbInputDropdownThemeTokens {
  [token: string]: string;
}

export interface MbInputDropdownTokenBundle {
  light: MbInputDropdownThemeTokens;
  dark: MbInputDropdownThemeTokens;
}

export const mbInputDropdownTokens: MbInputDropdownTokenBundle = {
  light: {
    '--mb-idd-bg': '#ffffff',
    '--mb-idd-border': '#c1c8cd',
    '--mb-idd-border-focus': '#0091ff',
    '--mb-idd-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-idd-menu-bg': '#ffffff'
  },
  dark: {
    '--mb-idd-bg': '#121923',
    '--mb-idd-border': '#405978',
    '--mb-idd-border-focus': '#89a8ff',
    '--mb-idd-focus-ring': '0 0 0 3px #304d84',
    '--mb-idd-menu-bg': '#121923'
  }
};
