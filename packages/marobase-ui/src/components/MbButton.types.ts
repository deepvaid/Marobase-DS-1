export type MbButtonStyleType = 'filled' | 'outline' | 'tinted' | 'plain';
export type MbButtonSize = 'lg' | 'md' | 'sm';
export type MbButtonState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';
export type MbButtonIconMode = 'with-label' | 'icon-only';

export interface MbButtonProps {
  styleType?: MbButtonStyleType;
  size?: MbButtonSize;
  state?: MbButtonState;
  iconMode?: MbButtonIconMode;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  ariaLabel?: string;
}

export type MbButtonResolvedState = MbButtonState;
