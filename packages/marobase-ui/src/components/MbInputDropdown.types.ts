export type MbInputDropdownState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbInputDropdownOption {
  id?: string;
  label: string;
  meta?: string;
  icon?: string;
  disabled?: boolean;
}

export interface MbInputDropdownProps {
  modelValue?: string;
  searchValue?: string;
  options?: MbInputDropdownOption[];
  label?: string;
  placeholder?: string;
  leftAddon?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  open?: boolean;
  showSearch?: boolean;
  state?: MbInputDropdownState;
  disabled?: boolean;
  ariaLabel?: string;
}
