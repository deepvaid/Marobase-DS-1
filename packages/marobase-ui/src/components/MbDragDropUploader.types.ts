export type MbDragDropUploaderState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbDragDropUploaderProps {
  label?: string;
  browseLabel?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  state?: MbDragDropUploaderState;
  hint?: string;
  ariaLabel?: string;
}
