import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type VisualViewport = 'desktop' | 'tablet' | 'mobile';
export type VisualTheme = 'light' | 'dark';

export interface VisualCase {
  id: string;
  component: string;
  storyId: string;
  figmaNodeId: string;
  viewport: VisualViewport;
  theme: VisualTheme;
  state: string;
  variant: string;
  captureSelector?: string;
}

export interface VisualManifest {
  version: number;
  figmaFileKey?: string;
  figmaFileKeyEnv?: string;
  tolerancePercent: number;
  storyBaseUrl: string;
  viewports: Record<VisualViewport, { width: number; height: number }>;
  rules: {
    requireFontsLoaded: boolean;
    disableAnimations: boolean;
    requireStableCaptureHook: boolean;
  };
  cases: VisualCase[];
}

export function normalizeNodeId(nodeId: string): string {
  return nodeId.replace(/-/g, ':');
}

export function caseFileName(testCase: Pick<VisualCase, 'id'>): string {
  return `${testCase.id}.png`;
}

export function storySnapshotFileName(storyId: string): string {
  return `${storyId.replace(/[\\/]/g, '-')}.png`;
}

export function baselineRelativePath(testCase: Pick<VisualCase, 'viewport' | 'theme' | 'storyId'>): string {
  return path.join(testCase.viewport, testCase.theme, storySnapshotFileName(testCase.storyId));
}

export async function loadManifest(rootDir: string): Promise<VisualManifest> {
  const manifestPath = path.join(rootDir, 'apps/storybook/src/visual-manifest.json');
  const raw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw) as VisualManifest;

  if (!manifest.cases || manifest.cases.length === 0) {
    throw new Error('visual-manifest.json has no cases.');
  }

  return manifest;
}
