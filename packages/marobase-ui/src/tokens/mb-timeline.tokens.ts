export interface MbTimelineThemeTokens {
  [token: string]: string;
}

export interface MbTimelineTokenBundle {
  light: MbTimelineThemeTokens;
  dark: MbTimelineThemeTokens;
}

export const mbTimelineTokens: MbTimelineTokenBundle = {
  light: {
    '--mb-tl-line': '#c1c8cd',
    '--mb-tl-line-active': '#0091ff',
    '--mb-tl-dot-active-bg': '#0091ff'
  },
  dark: {
    '--mb-tl-line': '#465a76',
    '--mb-tl-line-active': '#4da3ff',
    '--mb-tl-dot-active-bg': '#4da3ff'
  }
};
