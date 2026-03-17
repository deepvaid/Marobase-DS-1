export type MbChipTone = 'neutral' | 'brand' | 'danger';

export interface MbChipProps {
  label?: string;
  tone?: MbChipTone;
  selected?: boolean;
  dismissible?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
