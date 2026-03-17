export type MbBadgeTone = 'additional' | 'danger' | 'success' | 'brand' | 'neutral';
export type MbBadgeVariant = 'solid' | 'soft' | 'outline';
export type MbBadgeIcon = 'none' | 'star' | 'alert';

export interface MbBadgeProps {
  label?: string;
  tone?: MbBadgeTone;
  variant?: MbBadgeVariant;
  icon?: MbBadgeIcon;
  interactive?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
