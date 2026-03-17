export type MbAlertTone = 'info' | 'success' | 'warning' | 'danger' | 'additional';

export interface MbAlertProps {
  modelValue?: boolean;
  tone?: MbAlertTone;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  dismissible?: boolean;
  ariaLabel?: string;
}
