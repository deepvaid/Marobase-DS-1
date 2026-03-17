export type MbSliderState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled';

export interface MbSliderProps {
  modelValue?: number;
  rangeStart?: number | null;
  min?: number;
  max?: number;
  step?: number;
  state?: MbSliderState;
  label?: string;
  showTicks?: boolean;
  showValueLabels?: boolean;
  disabled?: boolean;
  hint?: string;
  ariaLabel?: string;
}
