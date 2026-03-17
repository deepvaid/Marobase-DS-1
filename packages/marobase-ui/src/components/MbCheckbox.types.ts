export type MbCheckboxSize = 'lg' | 'md' | 'sm';
export type MbCheckboxState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'error';

export interface MbCheckboxProps {
  modelValue?: boolean;
  indeterminate?: boolean;
  size?: MbCheckboxSize;
  state?: MbCheckboxState;
  label?: string;
  caption?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
}
