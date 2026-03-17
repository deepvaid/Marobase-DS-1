export interface MbBadgeThemeTokens {
  [token: string]: string;
}

export interface MbBadgeTokenBundle {
  light: MbBadgeThemeTokens;
  dark: MbBadgeThemeTokens;
}

export const mbBadgeTokens: MbBadgeTokenBundle = {
  light: {
    '--mb-badge-additional-bg': '#fdfaff',
    '--mb-badge-additional-border': '#eddcf9',
    '--mb-badge-additional-text': '#8e4ec6',
    '--mb-badge-danger-bg': '#fff1f0',
    '--mb-badge-danger-border': '#fdd8d3',
    '--mb-badge-danger-text': '#e54d2e'
  },
  dark: {
    '--mb-badge-additional-bg': '#2e233f',
    '--mb-badge-additional-border': '#6f55a5',
    '--mb-badge-additional-text': '#d3b6f6',
    '--mb-badge-danger-bg': '#462729',
    '--mb-badge-danger-border': '#7f4844',
    '--mb-badge-danger-text': '#ff9f8c'
  }
};
