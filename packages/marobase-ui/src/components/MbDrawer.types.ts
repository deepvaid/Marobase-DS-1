export interface MbDrawerProps {
  modelValue?: boolean;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  width?: number;
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  dismissible?: boolean;
  ariaLabel?: string;
}

export type MbDrawerCloseReason = 'close' | 'escape' | 'backdrop' | 'cancel' | 'primary';

export interface MbDrawerActionPayload {
  reason: MbDrawerCloseReason;
  event: MouseEvent | KeyboardEvent;
}
