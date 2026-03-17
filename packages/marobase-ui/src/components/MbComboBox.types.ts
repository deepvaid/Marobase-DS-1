export type MbComboBoxState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbComboBoxOption {
  id?: string | number;
  label: string;
  disabled?: boolean;
}

export interface MbComboBoxProps {
  modelValue?: string;
  options?: MbComboBoxOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  open?: boolean;
  state?: MbComboBoxState;
  disabled?: boolean;
  ariaLabel?: string;
}
