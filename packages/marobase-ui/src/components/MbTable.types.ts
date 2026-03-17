export type MbTableColumnType = 'text' | 'person' | 'status' | 'actions';
export type MbTableAlign = 'left' | 'center' | 'right';

export interface MbTableColumn {
  key: string;
  label: string;
  type?: MbTableColumnType;
  width?: string;
  align?: MbTableAlign;
}

export interface MbTableRow {
  id: string;
  name?: string;
  handle?: string;
  avatarInitials?: string;
  status?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface MbTableProps {
  columns?: MbTableColumn[];
  rows?: MbTableRow[];
  modelValue?: string[];
  selectable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  ariaLabel?: string;
}
