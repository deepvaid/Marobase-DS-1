#!/usr/bin/env node
/**
 * Maropost Design Kit — Figma Token Exporter
 *
 * Reads src/design-tokens/tokens.json and outputs:
 *   design-kit/figma-export/figma-variables.json  — Figma Variables REST API v1 format
 *   design-kit/figma-export/tokens-studio.json    — W3C / Tokens Studio plugin format
 *
 * Usage: node design-kit/scripts/export-figma.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const TOKENS_PATH = resolve(ROOT, 'src/design-tokens/tokens.json')
const OUTPUT_DIR = resolve(__dirname, '../figma-export')

const tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function parseHex(hex) {
  const clean = hex.replace('#', '')
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16) / 255,
      g: parseInt(clean.slice(2, 4), 16) / 255,
      b: parseInt(clean.slice(4, 6), 16) / 255,
      a: 1,
    }
  }
  return null
}

function parseColor(value) {
  if (value.startsWith('#')) return parseHex(value)
  if (value.startsWith('rgba(')) {
    const m = value.match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/)
    if (m) {
      return {
        r: parseInt(m[1]) / 255,
        g: parseInt(m[2]) / 255,
        b: parseInt(m[3]) / 255,
        a: parseFloat(m[4]),
      }
    }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

function parseDimension(value) {
  return parseFloat(value.replace('px', ''))
}

let varIdCounter = 1
function nextId(prefix = 'VAR') {
  return `${prefix}:${String(varIdCounter++).padStart(4, '0')}`
}

// ─── Build Figma Variables JSON ────────────────────────────────────────────────

function buildFigmaVariables() {
  const collections = []
  const variables = []

  // ── Color Collection (Light + Dark modes) ──────────────────────────────────
  const colorCollectionId = 'COL:0001'
  collections.push({
    id: colorCollectionId,
    name: 'Colors',
    modes: [
      { modeId: 'MODE:light', name: 'Light' },
      { modeId: 'MODE:dark',  name: 'Dark'  },
    ],
    defaultModeId: 'MODE:light',
    variableIds: [],
  })

  const lightColors = tokens.color.light
  const darkColors  = tokens.color.dark

  const allColorKeys = new Set([
    ...Object.keys(lightColors).filter(k => k !== '$description'),
    ...Object.keys(darkColors).filter(k => k !== '$description'),
  ])

  for (const key of allColorKeys) {
    const id = nextId('COLOR')
    const lightVal = lightColors[key]?.$value ?? '#000000'
    const darkVal  = darkColors[key]?.$value  ?? lightVal

    const variable = {
      id,
      name: `Colors/${key}`,
      collectionId: colorCollectionId,
      resolvedType: 'COLOR',
      description: '',
      valuesByMode: {
        'MODE:light': { type: 'COLOR', value: parseColor(lightVal) },
        'MODE:dark':  { type: 'COLOR', value: parseColor(darkVal)  },
      },
    }
    variables.push(variable)
    collections[0].variableIds.push(id)
  }

  // Sidebar colors (single mode)
  const sidebarCollectionId = 'COL:0002'
  collections.push({
    id: sidebarCollectionId,
    name: 'Colors/Sidebar',
    modes: [{ modeId: 'MODE:sidebar', name: 'Default' }],
    defaultModeId: 'MODE:sidebar',
    variableIds: [],
  })

  const sidebarColors = tokens.color.sidebar
  for (const [key, val] of Object.entries(sidebarColors)) {
    if (key === '$description') continue
    const id = nextId('COLOR_SB')
    variables.push({
      id,
      name: `Colors/Sidebar/${key}`,
      collectionId: sidebarCollectionId,
      resolvedType: 'COLOR',
      description: '',
      valuesByMode: {
        'MODE:sidebar': { type: 'COLOR', value: parseColor(val.$value) },
      },
    })
    collections[1].variableIds.push(id)
  }

  // ── Spacing Collection ─────────────────────────────────────────────────────
  const spacingCollectionId = 'COL:0003'
  collections.push({
    id: spacingCollectionId,
    name: 'Spacing',
    modes: [{ modeId: 'MODE:default', name: 'Default' }],
    defaultModeId: 'MODE:default',
    variableIds: [],
  })

  for (const [key, val] of Object.entries(tokens.spacing)) {
    if (key === '$description') continue
    const id = nextId('SP')
    variables.push({
      id,
      name: `Spacing/${key}`,
      collectionId: spacingCollectionId,
      resolvedType: 'FLOAT',
      description: `${val.$value} spacing`,
      valuesByMode: {
        'MODE:default': { type: 'FLOAT', value: parseDimension(val.$value) },
      },
    })
    collections[2].variableIds.push(id)
  }

  // ── Border Radius Collection ───────────────────────────────────────────────
  const radiusCollectionId = 'COL:0004'
  collections.push({
    id: radiusCollectionId,
    name: 'Border Radius',
    modes: [{ modeId: 'MODE:default', name: 'Default' }],
    defaultModeId: 'MODE:default',
    variableIds: [],
  })

  for (const [key, val] of Object.entries(tokens.borderRadius)) {
    if (key === '$description') continue
    const pxVal = val.$value === '9999px' ? 9999 : parseDimension(val.$value)
    const id = nextId('RADIUS')
    variables.push({
      id,
      name: `BorderRadius/${key}`,
      collectionId: radiusCollectionId,
      resolvedType: 'FLOAT',
      description: val.$value,
      valuesByMode: {
        'MODE:default': { type: 'FLOAT', value: pxVal },
      },
    })
    collections[3].variableIds.push(id)
  }

  // ── Typography Collection ──────────────────────────────────────────────────
  const typoCollectionId = 'COL:0005'
  collections.push({
    id: typoCollectionId,
    name: 'Typography',
    modes: [{ modeId: 'MODE:default', name: 'Default' }],
    defaultModeId: 'MODE:default',
    variableIds: [],
  })

  for (const [key, val] of Object.entries(tokens.typography.fontSize)) {
    if (key === '$description') continue
    const id = nextId('FONT_SIZE')
    variables.push({
      id,
      name: `Typography/FontSize/${key}`,
      collectionId: typoCollectionId,
      resolvedType: 'FLOAT',
      description: val.$value,
      valuesByMode: {
        'MODE:default': { type: 'FLOAT', value: parseDimension(val.$value) },
      },
    })
    collections[4].variableIds.push(id)
  }

  for (const [key, val] of Object.entries(tokens.typography.fontWeight)) {
    if (key === '$description') continue
    const id = nextId('FONT_WEIGHT')
    variables.push({
      id,
      name: `Typography/FontWeight/${key}`,
      collectionId: typoCollectionId,
      resolvedType: 'FLOAT',
      description: `${val.$value} weight`,
      valuesByMode: {
        'MODE:default': { type: 'FLOAT', value: parseFloat(val.$value) },
      },
    })
    collections[4].variableIds.push(id)
  }

  // ── Layout Collection ──────────────────────────────────────────────────────
  const layoutCollectionId = 'COL:0006'
  collections.push({
    id: layoutCollectionId,
    name: 'Layout',
    modes: [{ modeId: 'MODE:default', name: 'Default' }],
    defaultModeId: 'MODE:default',
    variableIds: [],
  })

  for (const [key, val] of Object.entries(tokens.layout)) {
    if (key === '$description') continue
    const id = nextId('LAYOUT')
    variables.push({
      id,
      name: `Layout/${key}`,
      collectionId: layoutCollectionId,
      resolvedType: 'FLOAT',
      description: val.$value,
      valuesByMode: {
        'MODE:default': { type: 'FLOAT', value: parseDimension(val.$value) },
      },
    })
    collections[5].variableIds.push(id)
  }

  return { variableCollections: collections, variables }
}

// ─── Build Tokens Studio JSON ──────────────────────────────────────────────────

function buildTokensStudio() {
  const out = {
    $type: 'designTokens',
    $version: tokens.$version ?? '1.0.0',
    $description: 'Maropost Design System — Tokens Studio import format',
    global: {},
  }

  // Spacing
  out.global.spacing = {}
  for (const [key, val] of Object.entries(tokens.spacing)) {
    if (key === '$description') continue
    out.global.spacing[key] = {
      value: val.$value,
      type: 'spacing',
      description: `spacing.${key}`,
    }
  }

  // Border radius
  out.global.borderRadius = {}
  for (const [key, val] of Object.entries(tokens.borderRadius)) {
    if (key === '$description') continue
    out.global.borderRadius[key] = {
      value: val.$value,
      type: 'borderRadius',
      description: `borderRadius.${key}`,
    }
  }

  // Shadows
  out.global.boxShadow = {}
  for (const [key, val] of Object.entries(tokens.shadow)) {
    if (key === '$description') continue
    out.global.boxShadow[key] = {
      value: val.$value,
      type: 'boxShadow',
      description: `shadow.${key}`,
    }
  }

  // Colors — Light
  out.global['color-light'] = {}
  for (const [key, val] of Object.entries(tokens.color.light)) {
    if (key === '$description') continue
    out.global['color-light'][key] = {
      value: val.$value,
      type: 'color',
      description: `color.light.${key}`,
    }
  }

  // Colors — Dark
  out.global['color-dark'] = {}
  for (const [key, val] of Object.entries(tokens.color.dark)) {
    if (key === '$description') continue
    out.global['color-dark'][key] = {
      value: val.$value,
      type: 'color',
      description: `color.dark.${key}`,
    }
  }

  // Colors — Sidebar
  out.global['color-sidebar'] = {}
  for (const [key, val] of Object.entries(tokens.color.sidebar)) {
    if (key === '$description') continue
    out.global['color-sidebar'][key] = {
      value: val.$value,
      type: 'color',
      description: `color.sidebar.${key}`,
    }
  }

  // Typography — font sizes
  out.global.fontSize = {}
  for (const [key, val] of Object.entries(tokens.typography.fontSize)) {
    if (key === '$description') continue
    out.global.fontSize[key] = {
      value: val.$value,
      type: 'fontSizes',
      description: `typography.fontSize.${key}`,
    }
  }

  // Typography — font weights
  out.global.fontWeight = {}
  for (const [key, val] of Object.entries(tokens.typography.fontWeight)) {
    if (key === '$description') continue
    out.global.fontWeight[key] = {
      value: val.$value,
      type: 'fontWeights',
      description: `typography.fontWeight.${key}`,
    }
  }

  // Typography — line heights
  out.global.lineHeight = {}
  for (const [key, val] of Object.entries(tokens.typography.lineHeight)) {
    if (key === '$description') continue
    out.global.lineHeight[key] = {
      value: val.$value,
      type: 'lineHeights',
      description: `typography.lineHeight.${key}`,
    }
  }

  // Layout
  out.global.layout = {}
  for (const [key, val] of Object.entries(tokens.layout)) {
    if (key === '$description') continue
    out.global.layout[key] = {
      value: val.$value,
      type: 'sizing',
      description: `layout.${key}`,
    }
  }

  return out
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Maropost Design Kit — Figma Export\n')
  ensureDir(OUTPUT_DIR)

  // Figma Variables
  const figmaVars = buildFigmaVariables()
  const figmaVarsPath = resolve(OUTPUT_DIR, 'figma-variables.json')
  writeFileSync(figmaVarsPath, JSON.stringify(figmaVars, null, 2))
  console.log(`✓ figma-variables.json`)
  console.log(`  ${figmaVars.variableCollections.length} collections, ${figmaVars.variables.length} variables`)

  // Tokens Studio
  const tokensStudio = buildTokensStudio()
  const tsPath = resolve(OUTPUT_DIR, 'tokens-studio.json')
  writeFileSync(tsPath, JSON.stringify(tokensStudio, null, 2))
  console.log(`✓ tokens-studio.json`)
  const groupCount = Object.keys(tokensStudio.global).length
  const tokenCount = Object.values(tokensStudio.global).reduce((sum, g) => sum + Object.keys(g).length, 0)
  console.log(`  ${groupCount} groups, ${tokenCount} tokens`)

  console.log(`\nOutput: ${OUTPUT_DIR}`)
  console.log('\nNext steps:')
  console.log('  1. Import tokens-studio.json via Tokens Studio Figma plugin')
  console.log('  2. Use figma-variables.json with Figma Variables REST API')
  console.log('  3. Fill in Figma node IDs in figma.config.ts then run:')
  console.log('     npm run design-kit:push-connect')
}

main()
