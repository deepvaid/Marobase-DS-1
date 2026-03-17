export interface MbSocialButtonThemeTokens {
  [token: string]: string;
}

export interface MbSocialButtonTokenBundle {
  light: MbSocialButtonThemeTokens;
  dark: MbSocialButtonThemeTokens;
}

export const mbSocialButtonTokens: MbSocialButtonTokenBundle = {
  light: {
    '--mb-social-btn-google-bg-default': '#4285f4',
    '--mb-social-btn-google-text-default': '#ffffff',
    '--mb-social-btn-icon-wrapper-bg': '#ffffff',
    '--mb-social-btn-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-social-btn-google-bg-default': '#376fd0',
    '--mb-social-btn-google-text-default': '#e5eaf2',
    '--mb-social-btn-icon-wrapper-bg': '#ffffff',
    '--mb-social-btn-focus-ring': '0 0 0 3px #304d84'
  }
};
