export type MbQuantityInputState = 'default' | 'focus' | 'disabled' | 'error';

export interface MbQuantityInputProps {
  modelValue?: number;
  state?: MbQuantityInputState;
  label?: string;
  hint?: string;
  errorMessage?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
}
