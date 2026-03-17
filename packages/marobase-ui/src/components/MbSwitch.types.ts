export type MbSwitchSize = 'md' | 'sm';
export type MbSwitchState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'error';

export interface MbSwitchProps {
  modelValue?: boolean;
  indeterminate?: boolean;
  loading?: boolean;
  size?: MbSwitchSize;
  state?: MbSwitchState;
  label?: string;
  caption?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
