export interface MbPopoverProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  dismissible?: boolean;
  closeOnAction?: boolean;
  showArrow?: boolean;
  width?: number;
  ariaLabel?: string;
}

export type MbPopoverActionType = 'primary' | 'secondary' | 'close' | 'escape';

export interface MbPopoverActionPayload {
  action: MbPopoverActionType;
  event: MouseEvent | KeyboardEvent;
}
