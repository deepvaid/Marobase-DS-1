export type MbPaginationItem = number | 'ellipsis';
export type MbPaginationState = 'default' | 'hover' | 'focus' | 'disabled';

export interface MbPaginationProps {
  items: MbPaginationItem[];
  modelValue?: number;
  state?: MbPaginationState;
  disabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  ariaLabel?: string;
}

export interface MbPaginationChangePayload {
  page: number;
  event: MouseEvent | KeyboardEvent;
}
