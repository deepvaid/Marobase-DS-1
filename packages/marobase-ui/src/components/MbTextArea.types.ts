export type MbTextAreaState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbTextAreaProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  state?: MbTextAreaState;
  disabled?: boolean;
  floatingLabel?: boolean;
  rows?: number;
  ariaLabel?: string;
}
