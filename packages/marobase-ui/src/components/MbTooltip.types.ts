export type MbTooltipPlacement = 'top' | 'bottom';

export interface MbTooltipProps {
  modelValue?: boolean;
  text?: string;
  placement?: MbTooltipPlacement;
  disabled?: boolean;
  triggerAriaLabel?: string;
}
