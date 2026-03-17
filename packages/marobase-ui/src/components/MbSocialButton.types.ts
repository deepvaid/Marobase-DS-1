export type MbSocialButtonProvider = 'google';
export type MbSocialButtonState = 'default' | 'hover' | 'active' | 'disabled';

export interface MbSocialButtonProps {
  provider?: MbSocialButtonProvider;
  state?: MbSocialButtonState;
  label?: string;
  iconOnly?: boolean;
  width?: number;
  disabled?: boolean;
  ariaLabel?: string;
}
