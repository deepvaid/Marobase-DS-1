export interface MbCircleButtonThemeTokens {
  [token: string]: string;
}

export interface MbCircleButtonTokenBundle {
  light: MbCircleButtonThemeTokens;
  dark: MbCircleButtonThemeTokens;
}

export const mbCircleButtonTokens: MbCircleButtonTokenBundle = {
  light: {
    '--mb-circle-btn-focus-ring': '0 0 0 3px #cde6fe',
    '--mb-circle-btn-neutral-bg-default': '#e6e8eb',
    '--mb-circle-btn-neutral-text-default': '#7d868c',
    '--mb-circle-btn-danger-bg-default': '#fdd8d3',
    '--mb-circle-btn-danger-text-default': '#db4224',
    '--mb-circle-btn-brand-outline-bg-default': '#ffffff',
    '--mb-circle-btn-brand-outline-text-default': '#0080f0',
    '--mb-circle-btn-brand-outline-border-default': '#5db0ef'
  },
  dark: {
    '--mb-circle-btn-focus-ring': '0 0 0 3px #304d84',
    '--mb-circle-btn-neutral-bg-default': '#2a323d',
    '--mb-circle-btn-neutral-text-default': '#c3ccd7',
    '--mb-circle-btn-danger-bg-default': '#5a312a',
    '--mb-circle-btn-danger-text-default': '#ffbaa8',
    '--mb-circle-btn-brand-outline-bg-default': '#121923',
    '--mb-circle-btn-brand-outline-text-default': '#89a8ff',
    '--mb-circle-btn-brand-outline-border-default': '#5678b8'
  }
};
