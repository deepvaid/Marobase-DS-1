export interface MbSectionMessageThemeTokens {
  [token: string]: string;
}

export interface MbSectionMessageTokenBundle {
  light: MbSectionMessageThemeTokens;
  dark: MbSectionMessageThemeTokens;
}

export const mbSectionMessageTokens: MbSectionMessageTokenBundle = {
  light: {
    '--mb-secmsg-bg': '#fdfaff',
    '--mb-secmsg-border': '#eddcf9',
    '--mb-secmsg-accent': '#8e4ec6'
  },
  dark: {
    '--mb-secmsg-bg': '#261f33',
    '--mb-secmsg-border': '#5e4a86',
    '--mb-secmsg-accent': '#c89cf2'
  }
};
