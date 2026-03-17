import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { baselineRelativePath, loadManifest, normalizeNodeId, storySnapshotFileName } from './manifest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const FIGMA_API = 'https://api.figma.com/v1';
const MAX_RETRIES = Number(process.env.FIGMA_MAX_RETRIES ?? '5');
const BASE_BACKOFF_MS = Number(process.env.FIGMA_BACKOFF_MS ?? '500');
const RATE_LIMIT_MS = Number(process.env.FIGMA_RATE_LIMIT_MS ?? '150');
const REQUEST_TIMEOUT_MS = Number(process.env.FIGMA_REQUEST_TIMEOUT_MS ?? '45000');
const FIGMA_IMAGE_SCALE = Number(process.env.FIGMA_IMAGE_SCALE ?? '1');
const STAGE_WIDTH = Number(process.env.VISUAL_STAGE_WIDTH ?? '960');
const STAGE_HEIGHT = Number(process.env.VISUAL_STAGE_HEIGHT ?? '540');
const STAGE_PADDING = Number(process.env.VISUAL_STAGE_PADDING ?? '24');
const STAGE_BORDER = Number(process.env.VISUAL_STAGE_BORDER ?? '1');
const NORMALIZE_TO_STAGE = process.env.FIGMA_NORMALIZE_TO_STAGE !== 'false';
const LIGHT_STAGE_BG = process.env.VISUAL_STAGE_BG_LIGHT ?? '#f2f4f8';
const DARK_STAGE_BG = process.env.VISUAL_STAGE_BG_DARK ?? '#0f141c';
const LIGHT_STAGE_BORDER = process.env.VISUAL_STAGE_BORDER_LIGHT ?? '#d0d5dd';
const DARK_STAGE_BORDER = process.env.VISUAL_STAGE_BORDER_DARK ?? '#2a3342';

let nextAllowedRequestAt = 0;

class FigmaApiError extends Error {
  status: number;
  url: string;
  body: string;

  constructor(status: number, url: string, body: string) {
    super(`Figma API request failed (${status}) for ${url}${body ? `: ${body}` : ''}`);
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

type FigmaNodeEntry = {
  document?: unknown;
};

type FigmaNodesResponse = {
  nodes: Record<string, FigmaNodeEntry | null>;
};

type FigmaImagesResponse = {
  images: Record<string, string | null>;
};

type BaselineTarget = {
  caseId: string;
  storyId: string;
  figmaNodeId: string;
  viewport: string;
  theme: string;
};

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

function maskSecret(secret: string): string {
  if (!secret) return '***';
  if (secret.length <= 10) return `${secret.slice(0, 2)}***`;
  return `${secret.slice(0, 6)}...${secret.slice(-4)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRateLimit() {
  const now = Date.now();
  if (now < nextAllowedRequestAt) {
    await sleep(nextAllowedRequestAt - now);
  }
  nextAllowedRequestAt = Date.now() + RATE_LIMIT_MS;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function retryDelayMs(attempt: number, retryAfterHeader: string | null): number {
  const retryAfterSeconds = Number(retryAfterHeader ?? '');
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.ceil(retryAfterSeconds * 1000);
  }

  const jitter = Math.floor(Math.random() * 150);
  return BASE_BACKOFF_MS * 2 ** attempt + jitter;
}

async function requestJson<T>(url: string, token?: string): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    await waitForRateLimit();

    try {
      const response = await fetch(url, {
        headers: token ? { 'X-Figma-Token': token } : {},
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });

      if (response.ok) {
        return (await response.json()) as T;
      }

      const body = await response.text();

      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        await sleep(retryDelayMs(attempt, response.headers.get('retry-after')));
        continue;
      }

      throw new FigmaApiError(response.status, url, body);
    } catch (error) {
      if (error instanceof FigmaApiError) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        await sleep(retryDelayMs(attempt, null));
        continue;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Network request failed for ${url}: ${message}`);
    }
  }

  throw new Error(`Exceeded retry budget for ${url}`);
}

async function requestBinary(url: string): Promise<Buffer> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    await waitForRateLimit();

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }

      const body = await response.text();

      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        await sleep(retryDelayMs(attempt, response.headers.get('retry-after')));
        continue;
      }

      throw new FigmaApiError(response.status, url, body);
    } catch (error) {
      if (error instanceof FigmaApiError) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        await sleep(retryDelayMs(attempt, null));
        continue;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Image download failed for ${url}: ${message}`);
    }
  }

  throw new Error(`Exceeded retry budget for image download: ${url}`);
}

function readPixel(png: PNG, x: number, y: number): [number, number, number, number] {
  const clampedX = Math.max(0, Math.min(png.width - 1, x));
  const clampedY = Math.max(0, Math.min(png.height - 1, y));
  const idx = (clampedY * png.width + clampedX) * 4;
  return [png.data[idx], png.data[idx + 1], png.data[idx + 2], png.data[idx + 3]];
}

function writePixel(png: PNG, x: number, y: number, rgba: [number, number, number, number]) {
  const idx = (y * png.width + x) * 4;
  png.data[idx] = rgba[0];
  png.data[idx + 1] = rgba[1];
  png.data[idx + 2] = rgba[2];
  png.data[idx + 3] = rgba[3];
}

function parseHexColor(value: string): [number, number, number, number] {
  const normalized = value.trim().replace('#', '');
  if (normalized.length !== 6) {
    throw new Error(`Invalid hex color "${value}". Expected format "#RRGGBB".`);
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    throw new Error(`Invalid hex color "${value}".`);
  }

  return [r, g, b, 255];
}

function blendOver(
  background: [number, number, number, number],
  foreground: [number, number, number, number]
): [number, number, number, number] {
  const alpha = foreground[3] / 255;
  const invAlpha = 1 - alpha;
  return [
    Math.round(foreground[0] * alpha + background[0] * invAlpha),
    Math.round(foreground[1] * alpha + background[1] * invAlpha),
    Math.round(foreground[2] * alpha + background[2] * invAlpha),
    255
  ];
}

function themeColors(theme: string): { bg: [number, number, number, number]; border: [number, number, number, number] } {
  if (theme === 'dark') {
    return {
      bg: parseHexColor(DARK_STAGE_BG),
      border: parseHexColor(DARK_STAGE_BORDER)
    };
  }

  return {
    bg: parseHexColor(LIGHT_STAGE_BG),
    border: parseHexColor(LIGHT_STAGE_BORDER)
  };
}

function normalizeToStage(source: PNG, theme: string): PNG {
  const stage = new PNG({ width: STAGE_WIDTH, height: STAGE_HEIGHT });
  const colors = themeColors(theme);
  for (let y = 0; y < stage.height; y += 1) {
    for (let x = 0; x < stage.width; x += 1) {
      const isBorder =
        x < STAGE_BORDER
        || y < STAGE_BORDER
        || x >= stage.width - STAGE_BORDER
        || y >= stage.height - STAGE_BORDER;
      writePixel(stage, x, y, isBorder ? colors.border : colors.bg);
    }
  }

  const contentInset = STAGE_PADDING + STAGE_BORDER;
  const innerWidth = Math.max(1, STAGE_WIDTH - contentInset * 2);
  const innerHeight = Math.max(1, STAGE_HEIGHT - contentInset * 2);

  const scale = Math.min(innerWidth / source.width, innerHeight / source.height);
  const targetWidth = Math.max(1, Math.floor(source.width * scale));
  const targetHeight = Math.max(1, Math.floor(source.height * scale));
  const offsetX = contentInset + Math.floor((innerWidth - targetWidth) / 2);
  const offsetY = contentInset + Math.floor((innerHeight - targetHeight) / 2);

  for (let y = 0; y < targetHeight; y += 1) {
    const srcY = Math.min(source.height - 1, Math.floor(y / scale));
    for (let x = 0; x < targetWidth; x += 1) {
      const srcX = Math.min(source.width - 1, Math.floor(x / scale));
      const sourcePixel = readPixel(source, srcX, srcY);
      const stagePixel = readPixel(stage, offsetX + x, offsetY + y);
      writePixel(stage, offsetX + x, offsetY + y, blendOver(stagePixel, sourcePixel));
    }
  }

  return stage;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function fetchImageUrlsForIds(fileKey: string, ids: string[], token: string): Promise<Map<string, string>> {
  if (ids.length === 0) {
    return new Map<string, string>();
  }

  const query = encodeURIComponent(ids.join(','));
  const url = `${FIGMA_API}/images/${fileKey}?ids=${query}&format=png&scale=${FIGMA_IMAGE_SCALE}`;

  try {
    const data = await requestJson<FigmaImagesResponse>(url, token);
    const urls = new Map<string, string>();

    for (const [nodeId, imageUrl] of Object.entries(data.images ?? {})) {
      if (imageUrl) {
        urls.set(nodeId, imageUrl);
      }
    }

    return urls;
  } catch (error) {
    if (error instanceof FigmaApiError && error.status === 400 && ids.length > 1) {
      const shouldSplit =
        /request too large/i.test(error.body)
        || /render timeout/i.test(error.body)
        || /requesting fewer or smaller images/i.test(error.body);

      if (!shouldSplit) {
        throw error;
      }

      const mid = Math.ceil(ids.length / 2);
      const left = await fetchImageUrlsForIds(fileKey, ids.slice(0, mid), token);
      const right = await fetchImageUrlsForIds(fileKey, ids.slice(mid), token);
      return new Map([...left.entries(), ...right.entries()]);
    }

    throw error;
  }
}

function buildTargets(manifestCases: Array<{ id: string; storyId: string; figmaNodeId: string; viewport: string; theme: string }>): BaselineTarget[] {
  return manifestCases.map((visualCase) => ({
    caseId: visualCase.id,
    storyId: visualCase.storyId,
    figmaNodeId: normalizeNodeId(visualCase.figmaNodeId),
    viewport: visualCase.viewport,
    theme: visualCase.theme
  }));
}

async function main() {
  const manifest = await loadManifest(rootDir);
  const figmaFileKey = process.env.FIGMA_FILE_KEY;
  const figmaToken = process.env.FIGMA_TOKEN;

  if (!figmaFileKey) {
    throw new Error('FIGMA_FILE_KEY is required. Set FIGMA_FILE_KEY before running `pnpm visual:baseline`.');
  }

  if (!figmaToken) {
    throw new Error('FIGMA_TOKEN is required. Set FIGMA_TOKEN before running `pnpm visual:baseline`.');
  }

  const targets = buildTargets(manifest.cases);
  const baselineDir = path.join(rootDir, 'artifacts/figma-baselines');
  const cacheDir = path.join(rootDir, '.cache/figma', figmaFileKey);
  await ensureDirectory(baselineDir);
  await ensureDirectory(cacheDir);

  console.log(`[visual:baseline] Using FIGMA_FILE_KEY=${figmaFileKey}, FIGMA_TOKEN=${maskSecret(figmaToken)}`);
  console.log(`[visual:baseline] Cases=${targets.length}`);
  console.log(`[visual:baseline] Stage ${STAGE_WIDTH}x${STAGE_HEIGHT} padding=${STAGE_PADDING} normalize=${String(NORMALIZE_TO_STAGE)}`);

  const storyToNode = new Map<string, string>();
  for (const target of targets) {
    const existingNode = storyToNode.get(target.storyId);
    if (existingNode && existingNode !== target.figmaNodeId) {
      throw new Error(`Manifest conflict: storyId '${target.storyId}' maps to multiple node IDs (${existingNode}, ${target.figmaNodeId}).`);
    }
    storyToNode.set(target.storyId, target.figmaNodeId);
  }

  const uniqueNodeIds = [...new Set([...storyToNode.values()])];
  const nodeChunks = chunk(uniqueNodeIds, 40);
  const imageChunkSize = Math.max(1, Number(process.env.FIGMA_IMAGE_CHUNK_SIZE ?? '1'));

  for (const ids of nodeChunks) {
    const query = encodeURIComponent(ids.join(','));
    const url = `${FIGMA_API}/files/${figmaFileKey}/nodes?ids=${query}`;
    const data = await requestJson<FigmaNodesResponse>(url, figmaToken);

    const missingInResponse = ids.filter((id) => !data.nodes?.[id] || !data.nodes[id]?.document);
    if (missingInResponse.length > 0) {
      throw new Error(`Figma node validation failed. Missing/invalid nodes: ${missingInResponse.join(', ')}`);
    }

    const cacheName = `nodes-${ids[0].replace(':', '_')}-${ids[ids.length - 1].replace(':', '_')}.json`;
    await writeFile(path.join(cacheDir, cacheName), JSON.stringify(data, null, 2), 'utf8');
  }

  const imageUrls = new Map<string, string>();
  const imageChunks = chunk(uniqueNodeIds, imageChunkSize);

  for (const [chunkIndex, ids] of imageChunks.entries()) {
    console.log(`[visual:baseline] Resolving image URLs ${chunkIndex + 1}/${imageChunks.length}`);
    const chunkUrls = await fetchImageUrlsForIds(figmaFileKey, ids, figmaToken);
    for (const [nodeId, imageUrl] of chunkUrls.entries()) {
      imageUrls.set(nodeId, imageUrl);
    }
  }

  const missingImageUrls = uniqueNodeIds.filter((nodeId) => !imageUrls.has(nodeId));
  if (missingImageUrls.length > 0) {
    throw new Error(`Figma image export failed. Missing image URLs for nodes: ${missingImageUrls.join(', ')}`);
  }

  const baselineIndex: Record<
    string,
    {
      caseId: string;
      storyId: string;
      figmaNodeId: string;
      viewport: string;
      theme: string;
      file: string;
    }
  > = {};

  for (const [index, target] of targets.entries()) {
    if (index === 0 || (index + 1) % 10 === 0 || index + 1 === targets.length) {
      console.log(`[visual:baseline] Downloading ${index + 1}/${targets.length}`);
    }

    const imageUrl = imageUrls.get(target.figmaNodeId);
    if (!imageUrl) {
      throw new Error(`No image URL returned for node ${target.figmaNodeId}`);
    }

    const relativePath = baselineRelativePath({
      viewport: target.viewport,
      theme: target.theme,
      storyId: target.storyId
    });

    const outputPath = path.join(baselineDir, relativePath);
    await ensureDirectory(path.dirname(outputPath));

    const sourceBuffer = await requestBinary(imageUrl);
    let finalBuffer = sourceBuffer;

    if (NORMALIZE_TO_STAGE) {
      const sourcePng = PNG.sync.read(sourceBuffer);
      const normalized = normalizeToStage(sourcePng, target.theme);
      finalBuffer = PNG.sync.write(normalized);
    }

    await writeFile(outputPath, finalBuffer);

    baselineIndex[target.caseId] = {
      caseId: target.caseId,
      storyId: target.storyId,
      figmaNodeId: target.figmaNodeId,
      viewport: target.viewport,
      theme: target.theme,
      file: relativePath
    };
  }

  const storyToNodeObject = Object.fromEntries(
    [...storyToNode.entries()].map(([storyId, nodeId]) => [storyId, nodeId])
  );

  await writeFile(
    path.join(baselineDir, 'index.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        figmaFileKey,
        stories: storyToNodeObject,
        cases: baselineIndex
      },
      null,
      2
    ),
    'utf8'
  );

  const firstTarget = targets[0];
  if (firstTarget) {
    const sample = path.join(firstTarget.viewport, firstTarget.theme, storySnapshotFileName(firstTarget.storyId));
    console.log(`[visual:baseline] Example baseline path: ${sample}`);
  }

  console.log(`[visual:baseline] Exported ${targets.length} baselines to ${baselineDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
