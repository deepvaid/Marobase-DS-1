export type MbDividerOrientation = 'horizontal' | 'vertical';
export type MbDividerTextAlign = 'start' | 'center' | 'end';

export interface MbDividerProps {
  text?: string;
  orientation?: MbDividerOrientation;
  textAlign?: MbDividerTextAlign;
  inset?: boolean;
}
