export type MbRadioSize = 'lg' | 'md' | 'sm';
export type MbRadioState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'error';

export interface MbRadioProps {
  modelValue?: boolean;
  size?: MbRadioSize;
  state?: MbRadioState;
  label?: string;
  caption?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  allowDeselect?: boolean;
  required?: boolean;
  ariaLabel?: string;
}
