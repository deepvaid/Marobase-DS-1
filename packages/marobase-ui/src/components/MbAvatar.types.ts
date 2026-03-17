export type MbAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type MbAvatarTone = 'neutral' | 'brand' | 'danger';

export interface MbAvatarProps {
  name?: string;
  initials?: string;
  src?: string;
  alt?: string;
  size?: MbAvatarSize;
  tone?: MbAvatarTone;
  interactive?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
