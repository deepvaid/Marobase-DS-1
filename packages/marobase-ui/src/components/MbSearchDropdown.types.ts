export type MbSearchDropdownState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbSearchDropdownOption {
  id?: string | number;
  label: string;
  prefix?: string;
  disabled?: boolean;
}

export interface MbSearchDropdownProps {
  modelValue?: string;
  options?: MbSearchDropdownOption[];
  placeholder?: string;
  open?: boolean;
  state?: MbSearchDropdownState;
  disabled?: boolean;
  ariaLabel?: string;
}
