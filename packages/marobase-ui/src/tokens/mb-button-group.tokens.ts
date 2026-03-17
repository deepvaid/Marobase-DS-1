export interface MbButtonGroupThemeTokens {
  [token: string]: string;
}

export interface MbButtonGroupTokenBundle {
  light: MbButtonGroupThemeTokens;
  dark: MbButtonGroupThemeTokens;
}

export const mbButtonGroupTokens: MbButtonGroupTokenBundle = {
  light: {
    '--mb-btg-fill-width': '378px',
    '--mb-btg-bg-default': '#ffffff',
    '--mb-btg-bg-active': '#ebedef',
    '--mb-btg-border': '#c1c8cd',
    '--mb-btg-text-default': '#7d868c',
    '--mb-btg-text-active': '#11181c',
    '--mb-btg-focus-ring': '0 0 0 2px #aeb9c2'
  },
  dark: {
    '--mb-btg-fill-width': '378px',
    '--mb-btg-bg-default': '#121923',
    '--mb-btg-bg-active': '#2a3342',
    '--mb-btg-border': '#405978',
    '--mb-btg-text-default': '#c5cfde',
    '--mb-btg-text-active': '#e5eaf2',
    '--mb-btg-focus-ring': '0 0 0 2px #5678b8'
  }
};
