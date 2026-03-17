export type MbBreadcrumbIcon = 'none' | 'home';

export interface MbBreadcrumbItem {
  id: string;
  label: string;
  icon?: MbBreadcrumbIcon;
  iconOnly?: boolean;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export type MbBreadcrumbsState = 'default' | 'hover' | 'focus' | 'disabled';

export interface MbBreadcrumbsProps {
  items: MbBreadcrumbItem[];
  modelValue?: string;
  state?: MbBreadcrumbsState;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface MbBreadcrumbNavigatePayload {
  item: MbBreadcrumbItem;
  index: number;
  event: MouseEvent | KeyboardEvent;
}
