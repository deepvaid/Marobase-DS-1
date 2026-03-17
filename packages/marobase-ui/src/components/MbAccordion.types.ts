export type MbAccordionState = 'default' | 'hover' | 'focus' | 'disabled';

export interface MbAccordionItem {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface MbAccordionTogglePayload {
  id: string;
  open: boolean;
  item: MbAccordionItem;
  event: MouseEvent | KeyboardEvent;
}

export interface MbAccordionProps {
  items?: MbAccordionItem[];
  modelValue?: string[];
  multiple?: boolean;
  state?: MbAccordionState;
  disabled?: boolean;
  ariaLabel?: string;
}
