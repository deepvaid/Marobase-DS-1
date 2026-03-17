import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type FigmaNode = {
  id?: string;
  name?: string;
  children?: FigmaNode[];
};

type FigmaNodesResponse = {
  nodes?: Record<string, { document?: FigmaNode }>;
};

const FIGMA_API = 'https://api.figma.com/v1';
const BUTTON_NODE_ID = '1902:151171';

const styles = ['filled', 'outline', 'tinted', 'plain'] as const;
const states = ['default', 'hover', 'active', 'focus', 'disabled', 'loading'] as const;
const sizes = ['lg', 'md', 'sm'] as const;
const iconModes = ['with-label', 'icon-only'] as const;

function maskSecret(secret: string): string {
  if (!secret) return '***';
  if (secret.length < 10) return `${secret.slice(0, 2)}***`;
  return `${secret.slice(0, 6)}...${secret.slice(-4)}`;
}

function normalizeNodeId(value: string) {
  return value.replace(/-/g, ':');
}

function styleNameToKey(name: string): string {
  if (name === 'Outline') return 'outline';
  if (name === 'Tinted') return 'tinted';
  if (name === 'Plain') return 'plain';
  return 'filled';
}

function sizeNameToKey(name: string): string {
  if (name === 'LG') return 'lg';
  if (name === 'MD') return 'md';
  return 'sm';
}

function stateNameToKey(name: string): string {
  return name.toLowerCase();
}

function iconModeToKey(onlyIcon: string): string {
  return onlyIcon === 'True' ? 'icon-only' : 'with-label';
}

function parseVariantName(name: string) {
  const match = /^Style=(.+),\sColor=(.+),\sState=(.+),\sSize=(.+),\sOnly Icon=(.+)$/.exec(name);
  if (!match) return null;

  const [, style, color, state, size, onlyIcon] = match;
  if (color !== 'Primary') return null;

  return {
    style: styleNameToKey(style),
    state: stateNameToKey(state),
    size: sizeNameToKey(size),
    iconMode: iconModeToKey(onlyIcon)
  };
}

function walkNodes(root: FigmaNode, collector: FigmaNode[]) {
  collector.push(root);
  for (const child of root.children ?? []) {
    walkNodes(child, collector);
  }
}

function expectedKeys(): string[] {
  const keys: string[] = [];
  for (const style of styles) {
    for (const state of states) {
      for (const size of sizes) {
        for (const iconMode of iconModes) {
          keys.push(`style=${style};state=${state};size=${size};iconMode=${iconMode}`);
        }
      }
    }
  }
  return keys;
}

async function requestJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Figma request failed (${response.status}) for ${url}: ${body}`);
  }

  return (await response.json()) as T;
}

async function main() {
  const figmaToken = process.env.FIGMA_TOKEN;
  const figmaFileKey = process.env.FIGMA_FILE_KEY;

  if (!figmaToken) {
    throw new Error('FIGMA_TOKEN is required. Export FIGMA_TOKEN before running tokens fetch.');
  }

  if (!figmaFileKey) {
    throw new Error('FIGMA_FILE_KEY is required. Export FIGMA_FILE_KEY before running tokens fetch.');
  }

  const rootDir = path.resolve(process.cwd());
  const artifactsDir = path.join(rootDir, 'artifacts/figma');
  await mkdir(artifactsDir, { recursive: true });

  console.log(
    `[tokens:fetch] FIGMA_FILE_KEY=${figmaFileKey} FIGMA_TOKEN=${maskSecret(figmaToken)}`
  );

  const variablesUrl = `${FIGMA_API}/files/${figmaFileKey}/variables/local`;
  const variablesPayload = await requestJson<unknown>(variablesUrl, figmaToken);
  const variablesPath = path.join(artifactsDir, 'variables-local.json');
  await writeFile(variablesPath, JSON.stringify(variablesPayload, null, 2), 'utf8');

  const nodesUrl = `${FIGMA_API}/files/${figmaFileKey}/nodes?ids=${encodeURIComponent(BUTTON_NODE_ID)}`;
  const nodesPayload = await requestJson<FigmaNodesResponse>(nodesUrl, figmaToken);
  const rootNode = nodesPayload.nodes?.[BUTTON_NODE_ID]?.document;

  if (!rootNode) {
    throw new Error(`Node ${BUTTON_NODE_ID} not found in Figma response.`);
  }

  const allNodes: FigmaNode[] = [];
  walkNodes(rootNode, allNodes);

  const mapping: Record<string, { nodeId: string; name: string }> = {};

  for (const node of allNodes) {
    if (!node.id || !node.name) continue;
    const parsed = parseVariantName(node.name);
    if (!parsed) continue;

    const key = `style=${parsed.style};state=${parsed.state};size=${parsed.size};iconMode=${parsed.iconMode}`;
    mapping[key] = {
      nodeId: normalizeNodeId(node.id),
      name: node.name
    };
  }

  const expected = expectedKeys();
  const missing = expected.filter((key) => !mapping[key]);

  const mappingPayload = {
    generatedAt: new Date().toISOString(),
    figmaFileKey,
    sourceNodeId: BUTTON_NODE_ID,
    totalExpected: expected.length,
    totalMapped: Object.keys(mapping).length,
    missing,
    mapping
  };

  const mappingPath = path.join(artifactsDir, 'mb-button-primary-node-map.json');
  await writeFile(mappingPath, JSON.stringify(mappingPayload, null, 2), 'utf8');

  console.log(`[tokens:fetch] Wrote ${variablesPath}`);
  console.log(`[tokens:fetch] Wrote ${mappingPath}`);
  if (missing.length > 0) {
    console.warn(`[tokens:fetch] Missing ${missing.length} expected button variants.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
