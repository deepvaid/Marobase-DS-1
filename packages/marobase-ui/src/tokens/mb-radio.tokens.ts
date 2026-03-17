export interface MbRadioThemeTokens {
  [token: string]: string;
}

export interface MbRadioTokenBundle {
  light: MbRadioThemeTokens;
  dark: MbRadioThemeTokens;
}

export const mbRadioTokens: MbRadioTokenBundle = {
  light: {
    '--mb-rd-control-bg': '#ffffff',
    '--mb-rd-control-border': '#c1c8cd',
    '--mb-rd-control-fill': '#0091ff',
    '--mb-rd-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-rd-label-color': '#11181c'
  },
  dark: {
    '--mb-rd-control-bg': '#121923',
    '--mb-rd-control-border': '#405978',
    '--mb-rd-control-fill': '#2f84ff',
    '--mb-rd-focus-ring': '0 0 0 3px #304d84',
    '--mb-rd-label-color': '#e5eaf2'
  }
};
