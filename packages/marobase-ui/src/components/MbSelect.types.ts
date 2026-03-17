export type MbSelectState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbSelectOption {
  id?: string | number;
  label: string;
  disabled?: boolean;
}

export interface MbSelectProps {
  modelValue?: string;
  options?: MbSelectOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  open?: boolean;
  state?: MbSelectState;
  disabled?: boolean;
  ariaLabel?: string;
}
