export type MbSplitButtonSize = 'md' | 'lg';

export interface MbSplitButtonOption {
  id?: string | number;
  label: string;
  disabled?: boolean;
}

export interface MbSplitButtonProps {
  label?: string;
  options?: MbSplitButtonOption[];
  open?: boolean;
  size?: MbSplitButtonSize;
  disabled?: boolean;
  ariaLabel?: string;
  menuAriaLabel?: string;
}

export interface MbSplitButtonTogglePayload {
  open: boolean;
  event: MouseEvent;
}

export interface MbSplitButtonSelectPayload {
  index: number;
  option: MbSplitButtonOption;
  event: MouseEvent;
}
