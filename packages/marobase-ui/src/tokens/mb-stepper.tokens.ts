export interface MbStepperThemeTokens {
  [token: string]: string;
}

export interface MbStepperTokenBundle {
  light: MbStepperThemeTokens;
  dark: MbStepperThemeTokens;
}

export const mbStepperTokens: MbStepperTokenBundle = {
  light: {
    '--mb-stepper-indicator-border': '#c1c8cd',
    '--mb-stepper-track-color': '#c1c8cd',
    '--mb-stepper-active-border': '#0091ff',
    '--mb-stepper-focus-ring': '0 0 0 3px #cde6fe'
  },
  dark: {
    '--mb-stepper-indicator-border': '#405978',
    '--mb-stepper-track-color': '#405978',
    '--mb-stepper-active-border': '#89a8ff',
    '--mb-stepper-focus-ring': '0 0 0 3px #304d84'
  }
};
