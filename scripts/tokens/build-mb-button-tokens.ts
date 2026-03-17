import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type FigmaMode = {
  modeId: string;
  name: string;
};

type FigmaVariableCollection = {
  id: string;
  name: string;
  defaultModeId?: string;
  modes: FigmaMode[];
};

type FigmaVariable = {
  id: string;
  name: string;
  resolvedType?: string;
  variableCollectionId?: string;
  valuesByMode?: Record<string, unknown>;
};

type FigmaVariablesLocalPayload = {
  meta?: {
    variableCollections?: Record<string, FigmaVariableCollection>;
    variables?: Record<string, FigmaVariable>;
  };
};

type OverrideEntry = {
  token: string;
  fallback: string;
  reason: string;
  date: string;
};

type OverridesFile = {
  overrides: OverrideEntry[];
};

type OverrideWarning = OverrideEntry & {
  variable?: string;
};

const COLOR_TOKEN_SPECS: Array<{ token: string; variable: string }> = [
  { token: '--mb-btn-bg-filled-default', variable: 'Context/Background/Fill/Brand/Primary/bg-fill-brand-primary' },
  { token: '--mb-btn-bg-filled-hover', variable: 'Context/Background/Fill/Brand/Primary/bg-fill-brand-primary_hover' },
  { token: '--mb-btn-bg-filled-active', variable: 'Context/Background/Fill/Brand/Primary/bg-fill-brand-primary_active' },
  { token: '--mb-btn-bg-filled-disabled', variable: 'Context/Background/Fill/Brand/Primary/bg-fill-brand-primary_disabled' },
  { token: '--mb-btn-bg-outline-default', variable: 'Context/Background/Surface/Base/Primary/bg-surface-base-primary' },
  { token: '--mb-btn-bg-outline-hover', variable: 'Context/Background/Surface/Base/Primary/bg-surface-base-primary' },
  { token: '--mb-btn-bg-outline-active', variable: 'Context/Background/Surface/Base/Primary/bg-surface-base-primary' },
  { token: '--mb-btn-bg-outline-disabled', variable: 'Context/Background/Surface/Base/Primary/bg-surface-base-primary' },
  { token: '--mb-btn-bg-tinted-default', variable: 'Context/Background/Fill/Brand/Tertiary/bg-fill-brand-tertiary' },
  { token: '--mb-btn-bg-tinted-hover', variable: 'Context/Background/Fill/Brand/Tertiary/bg-fill-brand-tertiary_hover' },
  { token: '--mb-btn-bg-tinted-active', variable: 'Context/Background/Fill/Brand/Tertiary/bg-fill-brand-tertiary_active' },
  { token: '--mb-btn-bg-tinted-disabled', variable: 'Context/Background/Fill/Brand/Tertiary/bg-fill-brand-tertiary_disabled' },
  { token: '--mb-btn-bg-plain-default', variable: 'Context/Background/Utility/bg-transparent' },
  { token: '--mb-btn-bg-plain-hover', variable: 'Context/Background/Utility/bg-transparent' },
  { token: '--mb-btn-bg-plain-active', variable: 'Context/Background/Utility/bg-transparent' },
  { token: '--mb-btn-bg-plain-disabled', variable: 'Context/Background/Utility/bg-transparent' },
  { token: '--mb-btn-text-filled-default', variable: 'Context/Text/Overlay White/Primary/text-overlay-w-primary' },
  { token: '--mb-btn-text-outline-default', variable: 'Context/Text/Brand/text-brand' },
  { token: '--mb-btn-text-outline-hover', variable: 'Context/Text/Brand/text-brand_hover' },
  { token: '--mb-btn-text-outline-active', variable: 'Context/Text/Brand/text-brand_active' },
  { token: '--mb-btn-text-outline-disabled', variable: 'Context/Text/Brand/text-brand_disabled' },
  { token: '--mb-btn-text-tinted-default', variable: 'Context/Text/Brand/text-brand' },
  { token: '--mb-btn-text-tinted-hover', variable: 'Context/Text/Brand/text-brand_hover' },
  { token: '--mb-btn-text-tinted-active', variable: 'Context/Text/Brand/text-brand_active' },
  { token: '--mb-btn-text-tinted-disabled', variable: 'Context/Text/Brand/text-brand_disabled' },
  { token: '--mb-btn-text-plain-default', variable: 'Context/Text/Brand/text-brand' },
  { token: '--mb-btn-text-plain-hover', variable: 'Context/Text/Brand/text-brand_hover' },
  { token: '--mb-btn-text-plain-active', variable: 'Context/Text/Brand/text-brand_active' },
  { token: '--mb-btn-text-plain-disabled', variable: 'Context/Text/Brand/text-brand_disabled' },
  { token: '--mb-btn-border-outline-default', variable: 'Context/Border/Brand/Primary/border-brand-primary' },
  { token: '--mb-btn-border-outline-hover', variable: 'Context/Border/Brand/Primary/border-brand-primary_hover' },
  { token: '--mb-btn-border-outline-active', variable: 'Context/Border/Brand/Primary/border-brand-primary_hover' },
  { token: '--mb-btn-border-outline-disabled', variable: 'Context/Border/Brand/Primary/border-brand-primary_disabled' },
  { token: '--mb-btn-focus-ring-color', variable: 'Theme/Brand/300' }
];

const STATIC_SIZING: Record<string, string> = {
  '--mb-btn-radius': '6px',
  '--mb-btn-height-lg': '48px',
  '--mb-btn-height-md': '40px',
  '--mb-btn-height-sm': '32px',
  '--mb-btn-min-width-lg': '80px',
  '--mb-btn-min-width-md': '60px',
  '--mb-btn-min-width-sm': '50px',
  '--mb-btn-padding-x-lg': '14px',
  '--mb-btn-padding-y-lg': '12px',
  '--mb-btn-padding-x-md': '12px',
  '--mb-btn-padding-y-md': '10px',
  '--mb-btn-padding-x-sm': '10px',
  '--mb-btn-padding-y-sm': '6px',
  '--mb-btn-gap-lg': '8px',
  '--mb-btn-gap-md': '8px',
  '--mb-btn-gap-sm': '6px',
  '--mb-btn-font-size-lg': '16px',
  '--mb-btn-line-height-lg': '24px',
  '--mb-btn-font-size-md': '14px',
  '--mb-btn-line-height-md': '20px',
  '--mb-btn-font-size-sm': '14px',
  '--mb-btn-line-height-sm': '20px',
  '--mb-btn-icon-size-lg': '24px',
  '--mb-btn-icon-size-md': '20px',
  '--mb-btn-icon-size-sm': '16px',
  '--mb-btn-icon-only-size-lg': '48px',
  '--mb-btn-icon-only-size-md': '40px',
  '--mb-btn-icon-only-size-sm': '32px',
  '--mb-btn-loading-width-lg': '80px',
  '--mb-btn-loading-width-md': '60px',
  '--mb-btn-loading-width-sm': '50px',
  '--mb-btn-spinner-size': '20px',
  '--mb-btn-spinner-size-md': '18px',
  '--mb-btn-spinner-size-sm': '16px',
  '--mb-btn-spinner-stroke': '2px',
  '--mb-btn-icon-glyph-size': '14px',
  '--mb-btn-icon-stroke': '2px',
  '--mb-btn-icon-corner': '3px',
  '--mb-btn-font-family': "Inter, 'Noto Sans', 'Segoe UI', sans-serif",
  '--mb-btn-font-weight': '500',
  '--mb-btn-letter-spacing': '0px'
};

function toHexColor(input: { r: number; g: number; b: number; a?: number }): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value * 255)));
  const r = clamp(input.r);
  const g = clamp(input.g);
  const b = clamp(input.b);
  const alpha = input.a ?? 1;

  if (alpha >= 0.999) {
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function isAliasValue(value: unknown): value is { type: 'VARIABLE_ALIAS'; id: string } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { type?: unknown; id?: unknown };
  return candidate.type === 'VARIABLE_ALIAS' && typeof candidate.id === 'string';
}

function isColorObject(value: unknown): value is { r: number; g: number; b: number; a?: number } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { r?: unknown; g?: unknown; b?: unknown };
  return typeof candidate.r === 'number' && typeof candidate.g === 'number' && typeof candidate.b === 'number';
}

function pickModeIds(collection: FigmaVariableCollection): { lightModeId: string; darkModeId?: string } {
  const defaultModeId = collection.defaultModeId ?? collection.modes[0]?.modeId;
  const light = collection.modes.find((mode) => /light|default|base|day/i.test(mode.name));
  const dark = collection.modes.find((mode) => /dark|night/i.test(mode.name));

  return {
    lightModeId: light?.modeId ?? defaultModeId ?? collection.modes[0]?.modeId ?? '',
    darkModeId: dark?.modeId ?? collection.modes[1]?.modeId
  };
}

function cssify(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}px`;
  if (isColorObject(value)) return toHexColor(value);
  return null;
}

async function main() {
  const rootDir = path.resolve(process.cwd());
  const variablesPath = path.join(rootDir, 'artifacts/figma/variables-local.json');
  const overridesPath = path.join(rootDir, 'packages/marobase-ui/src/tokens/mb-button.dark-overrides.json');
  const outputCssPath = path.join(rootDir, 'packages/marobase-ui/src/tokens/mb-button.tokens.css');
  const outputTsPath = path.join(rootDir, 'packages/marobase-ui/src/tokens/mb-button.tokens.ts');
  const warningDir = path.join(rootDir, 'artifacts/token-warnings');
  const warningPath = path.join(warningDir, 'mb-button-dark-overrides-report.json');

  const rawVariables = await readFile(variablesPath, 'utf8').catch(() => {
    throw new Error('Missing artifacts/figma/variables-local.json. Run `pnpm tokens:fetch` first.');
  });
  const rawOverrides = await readFile(overridesPath, 'utf8');

  const variablesPayload = JSON.parse(rawVariables) as FigmaVariablesLocalPayload;
  const overridesPayload = JSON.parse(rawOverrides) as OverridesFile;

  const variables = Object.values(variablesPayload.meta?.variables ?? {});
  const collections = new Map(
    Object.values(variablesPayload.meta?.variableCollections ?? {}).map((collection) => [collection.id, collection])
  );
  const byId = new Map(variables.map((variable) => [variable.id, variable]));
  const byName = new Map(variables.map((variable) => [variable.name, variable]));

  const overrides = new Map(overridesPayload.overrides.map((entry) => [entry.token, entry]));
  const warnings: OverrideWarning[] = [];

  function resolveVariableValue(variable: FigmaVariable, modeId: string, depth = 0): string | null {
    if (depth > 8) return null;
    const direct = variable.valuesByMode?.[modeId];

    if (isAliasValue(direct)) {
      const linked = byId.get(direct.id);
      if (!linked) return null;

      const linkedCollection = linked.variableCollectionId
        ? collections.get(linked.variableCollectionId)
        : undefined;
      const linkedMode = linkedCollection ? pickModeIds(linkedCollection).lightModeId : modeId;
      return resolveVariableValue(linked, linkedMode, depth + 1);
    }

    return cssify(direct);
  }

  function getTokenValues(variableName: string, token: string): { light: string; dark: string } {
    const variable = byName.get(variableName);
    if (!variable) {
      throw new Error(`Missing required variable \"${variableName}\" for token ${token}.`);
    }

    const collection = variable.variableCollectionId
      ? collections.get(variable.variableCollectionId)
      : undefined;

    const modeIds = collection ? pickModeIds(collection) : { lightModeId: '', darkModeId: undefined };

    const lightValue = resolveVariableValue(variable, modeIds.lightModeId);
    if (!lightValue) {
      throw new Error(`Missing light mode value for variable \"${variableName}\" (token ${token}).`);
    }

    const darkValue = modeIds.darkModeId ? resolveVariableValue(variable, modeIds.darkModeId) : null;
    if (darkValue) {
      return { light: lightValue, dark: darkValue };
    }

    const override = overrides.get(token);
    if (!override) {
      throw new Error(`Missing dark mode value for token ${token} and no override entry found.`);
    }

    warnings.push({ ...override, variable: variableName });
    return { light: lightValue, dark: override.fallback };
  }

  const lightTheme: Record<string, string> = { ...STATIC_SIZING };
  const darkTheme: Record<string, string> = { ...STATIC_SIZING };

  for (const spec of COLOR_TOKEN_SPECS) {
    const values = getTokenValues(spec.variable, spec.token);
    if (spec.token === '--mb-btn-focus-ring-color') {
      lightTheme['--mb-btn-focus-ring-brand'] = `0 0 0 3px ${values.light}`;
      darkTheme['--mb-btn-focus-ring-brand'] = `0 0 0 3px ${values.dark}`;
      continue;
    }

    lightTheme[spec.token] = values.light;
    darkTheme[spec.token] = values.dark;
  }

  // Derive repeated state tokens from canonical values.
  const derived: Array<[string, string]> = [
    ['--mb-btn-bg-filled-focus', '--mb-btn-bg-filled-default'],
    ['--mb-btn-bg-filled-loading', '--mb-btn-bg-filled-default'],
    ['--mb-btn-text-filled-hover', '--mb-btn-text-filled-default'],
    ['--mb-btn-text-filled-active', '--mb-btn-text-filled-default'],
    ['--mb-btn-text-filled-focus', '--mb-btn-text-filled-default'],
    ['--mb-btn-text-filled-loading', '--mb-btn-text-filled-default'],
    ['--mb-btn-border-filled-default', '--mb-btn-bg-filled-default'],
    ['--mb-btn-border-filled-hover', '--mb-btn-bg-filled-hover'],
    ['--mb-btn-border-filled-active', '--mb-btn-bg-filled-active'],
    ['--mb-btn-border-filled-focus', '--mb-btn-bg-filled-default'],
    ['--mb-btn-border-filled-disabled', '--mb-btn-bg-filled-disabled'],
    ['--mb-btn-border-filled-loading', '--mb-btn-bg-filled-default'],
    ['--mb-btn-bg-outline-focus', '--mb-btn-bg-outline-default'],
    ['--mb-btn-bg-outline-loading', '--mb-btn-bg-outline-default'],
    ['--mb-btn-text-outline-focus', '--mb-btn-text-outline-default'],
    ['--mb-btn-text-outline-loading', '--mb-btn-text-outline-default'],
    ['--mb-btn-border-outline-focus', '--mb-btn-border-outline-default'],
    ['--mb-btn-border-outline-loading', '--mb-btn-border-outline-default'],
    ['--mb-btn-bg-tinted-focus', '--mb-btn-bg-tinted-default'],
    ['--mb-btn-bg-tinted-loading', '--mb-btn-bg-tinted-default'],
    ['--mb-btn-text-tinted-focus', '--mb-btn-text-tinted-default'],
    ['--mb-btn-text-tinted-loading', '--mb-btn-text-tinted-default'],
    ['--mb-btn-border-tinted-default', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-tinted-hover', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-tinted-active', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-tinted-focus', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-tinted-disabled', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-tinted-loading', '--mb-btn-bg-plain-default'],
    ['--mb-btn-bg-plain-focus', '--mb-btn-bg-plain-default'],
    ['--mb-btn-bg-plain-loading', '--mb-btn-bg-plain-default'],
    ['--mb-btn-text-plain-focus', '--mb-btn-text-plain-default'],
    ['--mb-btn-text-plain-loading', '--mb-btn-text-plain-default'],
    ['--mb-btn-border-plain-default', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-plain-hover', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-plain-active', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-plain-focus', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-plain-disabled', '--mb-btn-bg-plain-default'],
    ['--mb-btn-border-plain-loading', '--mb-btn-bg-plain-default']
  ];

  for (const [token, source] of derived) {
    lightTheme[token] = lightTheme[source];
    darkTheme[token] = darkTheme[source];
  }

  const sortedLight = Object.entries(lightTheme).sort(([a], [b]) => a.localeCompare(b));
  const sortedDark = Object.entries(darkTheme).sort(([a], [b]) => a.localeCompare(b));

  const toCssVars = (entries: Array<[string, string]>) =>
    entries.map(([name, value]) => `  ${name}: ${value};`).join('\n');

  const css = [
    ':root,',
    ":root[data-theme='light'],",
    "html[data-theme='light'],",
    'html.theme-light {',
    toCssVars(sortedLight),
    '}',
    '',
    ":root[data-theme='dark'],",
    "html[data-theme='dark'],",
    'html.theme-dark,',
    'html.v-theme--dark {',
    toCssVars(sortedDark),
    '}',
    ''
  ].join('\n');

  const ts = [
    'export interface MbButtonThemeTokens {',
    '  [token: string]: string;',
    '}',
    '',
    'export interface MbButtonTokenBundle {',
    '  light: MbButtonThemeTokens;',
    '  dark: MbButtonThemeTokens;',
    '}',
    '',
    'export const mbButtonTokens: MbButtonTokenBundle = {',
    '  light: {',
    ...sortedLight.map(([name, value]) => `    '${name}': '${value.replace(/'/g, "\\'")}',`),
    '  },',
    '  dark: {',
    ...sortedDark.map(([name, value]) => `    '${name}': '${value.replace(/'/g, "\\'")}',`),
    '  }',
    '};',
    ''
  ].join('\n');

  await mkdir(path.dirname(outputCssPath), { recursive: true });
  await mkdir(path.dirname(outputTsPath), { recursive: true });
  await mkdir(warningDir, { recursive: true });

  await writeFile(outputCssPath, css, 'utf8');
  await writeFile(outputTsPath, ts, 'utf8');
  await writeFile(
    warningPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        warnings
      },
      null,
      2
    ),
    'utf8'
  );

  if (warnings.length > 0) {
    console.warn(`[tokens:build] Used ${warnings.length} dark override token values.`);
  }

  console.log(`[tokens:build] Wrote ${outputCssPath}`);
  console.log(`[tokens:build] Wrote ${outputTsPath}`);
  console.log(`[tokens:build] Wrote ${warningPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
