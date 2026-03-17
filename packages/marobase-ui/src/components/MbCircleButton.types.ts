export type MbCircleButtonVariant = 'neutral' | 'danger' | 'brand-outline';
export type MbCircleButtonState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';
export type MbCircleButtonMode = 'icon-only' | 'with-label';

export interface MbCircleButtonProps {
  variant?: MbCircleButtonVariant;
  state?: MbCircleButtonState;
  mode?: MbCircleButtonMode;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
}
