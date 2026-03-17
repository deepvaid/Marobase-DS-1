export type MbTimelineItemState = 'completed' | 'active' | 'upcoming';

export interface MbTimelineItem {
  id: string;
  label: string;
  detail?: string;
  state?: MbTimelineItemState;
}

export interface MbTimelineProps {
  items?: MbTimelineItem[];
  modelValue?: string;
  ariaLabel?: string;
}
