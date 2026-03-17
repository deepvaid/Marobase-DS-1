export interface MbAvatarThemeTokens {
  [token: string]: string;
}

export interface MbAvatarTokenBundle {
  light: MbAvatarThemeTokens;
  dark: MbAvatarThemeTokens;
}

export const mbAvatarTokens: MbAvatarTokenBundle = {
  light: {
    '--mb-av-bg': '#ebedef',
    '--mb-av-text': '#11181c',
    '--mb-av-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-av-hover-ring': '0 0 0 2px #d6dade'
  },
  dark: {
    '--mb-av-bg': '#273547',
    '--mb-av-text': '#e5eaf2',
    '--mb-av-focus-ring': '0 0 0 3px #385a95',
    '--mb-av-hover-ring': '0 0 0 2px #3b4e66'
  }
};
