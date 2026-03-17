export interface MbBreadcrumbsThemeTokens {
  [token: string]: string;
}

export interface MbBreadcrumbsTokenBundle {
  light: MbBreadcrumbsThemeTokens;
  dark: MbBreadcrumbsThemeTokens;
}

export const mbBreadcrumbsTokens: MbBreadcrumbsTokenBundle = {
  light: {
    '--mb-bc-link-color': '#7d868c',
    '--mb-bc-current-color': '#11181c',
    '--mb-bc-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-bc-link-color': '#97a3b5',
    '--mb-bc-current-color': '#e5eaf2',
    '--mb-bc-focus-ring': '0 0 0 3px #304d84'
  }
};
