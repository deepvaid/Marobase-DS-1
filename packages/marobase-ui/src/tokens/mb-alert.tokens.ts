export interface MbAlertThemeTokens {
  [token: string]: string;
}

export interface MbAlertTokenBundle {
  light: MbAlertThemeTokens;
  dark: MbAlertThemeTokens;
}

export const mbAlertTokens: MbAlertTokenBundle = {
  light: {
    '--mb-alert-bg': '#ffffff',
    '--mb-alert-border': '#e6e8eb',
    '--mb-alert-accent': '#0091ff'
  },
  dark: {
    '--mb-alert-bg': '#141d28',
    '--mb-alert-border': '#314255',
    '--mb-alert-accent': '#4da3ff'
  }
};
