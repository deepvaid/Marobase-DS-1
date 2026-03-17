export interface MbDividerThemeTokens {
  [token: string]: string;
}

export interface MbDividerTokenBundle {
  light: MbDividerThemeTokens;
  dark: MbDividerThemeTokens;
}

export const mbDividerTokens: MbDividerTokenBundle = {
  light: {
    '--mb-div-line': '#ebedef',
    '--mb-div-text': '#7d868c'
  },
  dark: {
    '--mb-div-line': '#3a495f',
    '--mb-div-text': '#97a3b5'
  }
};
