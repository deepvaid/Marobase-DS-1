export type MbWysiwygEditorState = 'default' | 'hover' | 'focus' | 'disabled' | 'error';

export interface MbWysiwygEditorProps {
  modelValue?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  state?: MbWysiwygEditorState;
  disabled?: boolean;
  ariaLabel?: string;
}
