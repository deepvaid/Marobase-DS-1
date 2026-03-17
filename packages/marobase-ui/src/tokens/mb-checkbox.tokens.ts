export interface MbCheckboxThemeTokens {
  [token: string]: string;
}

export interface MbCheckboxTokenBundle {
  light: MbCheckboxThemeTokens;
  dark: MbCheckboxThemeTokens;
}

export const mbCheckboxTokens: MbCheckboxTokenBundle = {
  light: {
    '--mb-ch-control-bg': '#ffffff',
    '--mb-ch-control-border': '#c1c8cd',
    '--mb-ch-control-fill': '#0091ff',
    '--mb-ch-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-ch-label-color': '#11181c'
  },
  dark: {
    '--mb-ch-control-bg': '#121923',
    '--mb-ch-control-border': '#405978',
    '--mb-ch-control-fill': '#2f84ff',
    '--mb-ch-focus-ring': '0 0 0 3px #304d84',
    '--mb-ch-label-color': '#e5eaf2'
  }
};
