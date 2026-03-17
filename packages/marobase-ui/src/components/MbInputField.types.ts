export type MbInputFieldState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';
export type MbInputFieldTrailingIcon = 'rhombus' | 'none';

export interface MbInputFieldProps {
  modelValue?: string;
  state?: MbInputFieldState;
  label?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  placeholder?: string;
  leftAddon?: string;
  trailingIcon?: MbInputFieldTrailingIcon;
  width?: number;
  disabled?: boolean;
  ariaLabel?: string;
}
