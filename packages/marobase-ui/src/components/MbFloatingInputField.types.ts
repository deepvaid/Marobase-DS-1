export type MbFloatingInputFieldSize = 'lg' | 'md' | 'sm';

export type MbFloatingInputFieldState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'filled'
  | 'disabled'
  | 'error';

export type MbFloatingInputFieldTrailingIcon = 'rhombus' | 'none';

export interface MbFloatingInputFieldProps {
  modelValue?: string;
  size?: MbFloatingInputFieldSize;
  state?: MbFloatingInputFieldState;
  label?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  placeholder?: string;
  trailingIcon?: MbFloatingInputFieldTrailingIcon;
  disabled?: boolean;
  ariaLabel?: string;
}
