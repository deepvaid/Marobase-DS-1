export interface MbModalThemeTokens {
  [token: string]: string;
}

export interface MbModalTokenBundle {
  light: MbModalThemeTokens;
  dark: MbModalThemeTokens;
}

export const mbModalTokens: MbModalTokenBundle = {
  light: {
    '--mb-modal-overlay-bg': 'rgba(0, 0, 0, 0.22)',
    '--mb-modal-surface': '#ffffff',
    '--mb-modal-primary-bg': '#0091ff',
    '--mb-modal-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-modal-overlay-bg': 'rgba(0, 0, 0, 0.5)',
    '--mb-modal-surface': '#121923',
    '--mb-modal-primary-bg': '#4f8bff',
    '--mb-modal-focus-ring': '0 0 0 3px #304d84'
  }
};
