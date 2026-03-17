export type MbSectionMessageTone = 'additional' | 'info' | 'success' | 'warning' | 'danger';

export interface MbSectionMessageProps {
  tone?: MbSectionMessageTone;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  ariaLabel?: string;
}
