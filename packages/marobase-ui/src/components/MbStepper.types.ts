export type MbStepperItemState = 'complete' | 'active' | 'upcoming';
export type MbStepperState = 'default' | 'disabled';

export interface MbStepperItem {
  id: string;
  title: string;
  description?: string;
  state?: MbStepperItemState;
  disabled?: boolean;
}

export interface MbStepperProps {
  items: MbStepperItem[];
  modelValue?: number;
  clickable?: boolean;
  state?: MbStepperState;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface MbStepperChangePayload {
  index: number;
  item: MbStepperItem;
  event: MouseEvent | KeyboardEvent;
}
