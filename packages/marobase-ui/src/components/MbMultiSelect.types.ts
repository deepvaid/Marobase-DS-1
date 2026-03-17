export type MbMultiSelectState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbMultiSelectOption {
  id?: string | number;
  label: string;
  disabled?: boolean;
}

export interface MbMultiSelectProps {
  modelValue?: string[];
  options?: MbMultiSelectOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  open?: boolean;
  state?: MbMultiSelectState;
  disabled?: boolean;
  floatingLabel?: boolean;
  ariaLabel?: string;
}
