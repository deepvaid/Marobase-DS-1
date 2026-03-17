import { spawnSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { constants as fsConstants } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

type RequiredEnv = 'SUPERNOVA_TOKEN' | 'SUPERNOVA_DESIGN_SYSTEM_ID';

const REQUIRED_ENV: RequiredEnv[] = ['SUPERNOVA_TOKEN', 'SUPERNOVA_DESIGN_SYSTEM_ID'];
const storybookDir = process.env.SUPERNOVA_STORYBOOK_PATH
  ? path.resolve(rootDir, process.env.SUPERNOVA_STORYBOOK_PATH)
  : path.resolve(rootDir, 'apps/storybook/storybook-static');

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length === 0 ? undefined : normalized;
}

function missingEnvNames() {
  return REQUIRED_ENV.filter((name) => !getEnv(name));
}

async function ensureStorybookExists() {
  try {
    await access(storybookDir, fsConstants.R_OK);
  } catch {
    throw new Error(
      [
        `Storybook static directory not found: ${storybookDir}`,
        'Build Storybook first:',
        'pnpm storybook:build'
      ].join('\n')
    );
  }
}

async function main() {
  const missing = missingEnvNames();
  if (missing.length > 0) {
    throw new Error(
      [
        `Missing required environment variables: ${missing.join(', ')}`,
        'Define these values in your environment or GitHub repository secrets.'
      ].join('\n')
    );
  }

  await ensureStorybookExists();
  const sourceId = getEnv('SUPERNOVA_STORYBOOK_SOURCE_ID');

  const designSystemId = getEnv('SUPERNOVA_DESIGN_SYSTEM_ID')!;
  const name = getEnv('SUPERNOVA_STORYBOOK_NAME') ?? 'marobase-ui-main';
  const versionId = getEnv('SUPERNOVA_VERSION_ID');
  const brandId = getEnv('SUPERNOVA_BRAND_ID');

  if (!sourceId) {
    console.warn(
      '[supernova-sync] SUPERNOVA_STORYBOOK_SOURCE_ID is not set; using name-based sync. Configure sourceId later for stricter targeting.'
    );
  }

  const args = ['storybook-import', '--from', storybookDir, '--name', name, '--designSystemId', designSystemId];

  if (sourceId) {
    args.push('--sourceId', sourceId);
  }
  if (versionId) {
    args.push('--versionId', versionId);
  }
  if (brandId) {
    args.push('--brandId', brandId);
  }

  const result = spawnSync('supernova', args, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit'
  });

  if (result.error) {
    const maybeErrno = result.error as { code?: string };
    if (maybeErrno.code === 'ENOENT') {
      throw new Error(
        [
          'Supernova CLI is not installed or not available on PATH.',
          'Install it before syncing:',
          'npm install -g @supernovaio/cli'
        ].join('\n')
      );
    }
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Supernova Storybook sync failed with exit code ${result.status}.`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[supernova-sync] ${message}`);
  process.exitCode = 1;
});
