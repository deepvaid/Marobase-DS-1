export type MbDropdownMenuState = 'default' | 'hover' | 'focus' | 'disabled';

export interface MbDropdownMenuOption {
  id?: string;
  label: string;
  meta?: string;
  disabled?: boolean;
}

export interface MbDropdownMenuProps {
  header?: string;
  footer?: string;
  options?: MbDropdownMenuOption[];
  selectedId?: string;
  state?: MbDropdownMenuState;
  disabled?: boolean;
  width?: number;
  ariaLabel?: string;
}
