export type MbButtonGroupSize = 'lg' | 'md' | 'sm';
export type MbButtonGroupMode = 'icon-only' | 'with-label';
export type MbButtonGroupIcon = 'eye' | 'pencil' | 'trash' | 'rhombus';

export interface MbButtonGroupItem {
  id?: string | number;
  label?: string;
  icon?: MbButtonGroupIcon;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface MbButtonGroupProps {
  items?: MbButtonGroupItem[];
  modelValue?: number;
  size?: MbButtonGroupSize;
  mode?: MbButtonGroupMode;
  hug?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface MbButtonGroupClickPayload {
  index: number;
  item: MbButtonGroupItem;
  event: MouseEvent;
}
