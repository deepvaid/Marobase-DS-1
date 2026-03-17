export type VisualViewport = 'desktop' | 'tablet' | 'mobile';
export type VisualTheme = 'light' | 'dark';

export interface VisualMapping {
  figmaNodeId: string;
  viewport: VisualViewport;
  theme: VisualTheme;
  state: string;
  variant: string;
}

export interface VisualStoryParameters {
  visualParity: true;
  visual: VisualMapping;
}

export function visualParameters(mapping: VisualMapping): VisualStoryParameters {
  return { visualParity: true, visual: mapping };
}
