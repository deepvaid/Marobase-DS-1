export interface MbAccordionThemeTokens {
  [token: string]: string;
}

export interface MbAccordionTokenBundle {
  light: MbAccordionThemeTokens;
  dark: MbAccordionThemeTokens;
}

export const mbAccordionTokens: MbAccordionTokenBundle = {
  light: {
    '--mb-acc-bg': '#ffffff',
    '--mb-acc-border': '#e6e8eb',
    '--mb-acc-text': '#11181c',
    '--mb-acc-icon': '#7d868c',
    '--mb-acc-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-acc-bg': '#111821',
    '--mb-acc-border': '#324256',
    '--mb-acc-text': '#e5eaf2',
    '--mb-acc-icon': '#9ba9bb',
    '--mb-acc-focus-ring': '0 0 0 3px #2f4d83'
  }
};
