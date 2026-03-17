export interface MbSwitchThemeTokens {
  [token: string]: string;
}

export interface MbSwitchTokenBundle {
  light: MbSwitchThemeTokens;
  dark: MbSwitchThemeTokens;
}

export const mbSwitchTokens: MbSwitchTokenBundle = {
  light: {
    '--mb-sw-track-off-bg': '#d7dbdf',
    '--mb-sw-track-on-bg': '#0091ff',
    '--mb-sw-thumb-bg': '#ffffff',
    '--mb-sw-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-sw-label-color': '#11181c'
  },
  dark: {
    '--mb-sw-track-off-bg': '#405978',
    '--mb-sw-track-on-bg': '#2f84ff',
    '--mb-sw-thumb-bg': '#ffffff',
    '--mb-sw-focus-ring': '0 0 0 3px #304d84',
    '--mb-sw-label-color': '#e5eaf2'
  }
};
