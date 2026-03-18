#!/usr/bin/env node
/**
 * sync-from-figma.mjs
 *
 * Reads design-kit/figma-export/tokens-studio.json (pushed by Tokens Studio
 * from Figma via GitHub) and writes the values back into
 * src/design-tokens/tokens.json (the app's source of truth).
 *
 * Usage:
 *   git pull                                      # get Figma changes
 *   node design-kit/scripts/sync-from-figma.mjs   # sync into tokens.json
 *   npm run tokens:build                           # rebuild all outputs
 *
 * Or use the shortcut:
 *   npm run tokens:sync-figma
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKENS_STUDIO_PATH = resolve(__dirname, '../figma-export/tokens-studio.json')
const TOKENS_JSON_PATH = resolve(__dirname, '../../src/design-tokens/tokens.json')

// ── Load both files ─────────────────────────────────────────────────────────
const studio = JSON.parse(readFileSync(TOKENS_STUDIO_PATH, 'utf-8'))
const tokens = JSON.parse(readFileSync(TOKENS_JSON_PATH, 'utf-8'))

const global = studio.global || {}
let updatedCount = 0

// ── Mapping: Tokens Studio group name → tokens.json path ─────────────────
// Tokens Studio uses flat groups like "color-light", "fontSize", etc.
// tokens.json uses nested W3C format like color.light, typography.fontSize, etc.

function setTokenValue(obj, path, value) {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) return false
    current = current[path[i]]
  }
  const key = path[path.length - 1]
  if (current[key] && current[key].$value !== undefined) {
    if (current[key].$value !== value) {
      current[key].$value = value
      return true
    }
  }
  return false
}

// Spacing
if (global.spacing) {
  for (const [key, val] of Object.entries(global.spacing)) {
    if (setTokenValue(tokens, ['spacing', key], val.value)) updatedCount++
  }
}

// Border radius
if (global.borderRadius) {
  for (const [key, val] of Object.entries(global.borderRadius)) {
    if (setTokenValue(tokens, ['borderRadius', key], val.value)) updatedCount++
  }
}

// Box shadows → shadow
if (global.boxShadow) {
  for (const [key, val] of Object.entries(global.boxShadow)) {
    if (setTokenValue(tokens, ['shadow', key], val.value)) updatedCount++
  }
}

// Colors — light, dark, sidebar
for (const theme of ['light', 'dark', 'sidebar']) {
  const studioGroup = global[`color-${theme}`]
  if (!studioGroup) continue
  for (const [key, val] of Object.entries(studioGroup)) {
    if (setTokenValue(tokens, ['color', theme, key], val.value)) updatedCount++
  }
}

// Typography — font sizes
if (global.fontSize) {
  for (const [key, val] of Object.entries(global.fontSize)) {
    if (setTokenValue(tokens, ['typography', 'fontSize', key], val.value)) updatedCount++
  }
}

// Typography — font weights
if (global.fontWeight) {
  for (const [key, val] of Object.entries(global.fontWeight)) {
    if (setTokenValue(tokens, ['typography', 'fontWeight', key], val.value)) updatedCount++
  }
}

// Typography — line heights
if (global.lineHeight) {
  for (const [key, val] of Object.entries(global.lineHeight)) {
    if (setTokenValue(tokens, ['typography', 'lineHeight', key], val.value)) updatedCount++
  }
}
if (global.fontFamily) {
  for (const [key, val] of Object.entries(global.fontFamily)) {
    if (setTokenValue(tokens, ['typography', 'fontFamily', key], val.value)) updatedCount++
  }
}

// Component — button radius
if (global['component-button-radius']) {
  for (const [key, val] of Object.entries(global['component-button-radius'])) {
    if (setTokenValue(tokens, ['component', 'button', 'radius', key], val.value)) updatedCount++
  }
}

// Component — button typography
if (global['component-button-typography']) {
  for (const [key, val] of Object.entries(global['component-button-typography'])) {
    if (setTokenValue(tokens, ['component', 'button', 'typography', key], val.value)) updatedCount++
  }
}

// Component — input radius
if (global['component-input-radius']) {
  for (const [key, val] of Object.entries(global['component-input-radius'])) {
    if (setTokenValue(tokens, ['component', 'input', 'radius', key], val.value)) updatedCount++
  }
}

// Component — card radius
if (global['component-card-radius']) {
  for (const [key, val] of Object.entries(global['component-card-radius'])) {
    if (setTokenValue(tokens, ['component', 'card', 'radius', key], val.value)) updatedCount++
  }
}

// Layout
if (global.layout) {
  for (const [key, val] of Object.entries(global.layout)) {
    if (setTokenValue(tokens, ['layout', key], val.value)) updatedCount++
  }
}

// ── Write back ──────────────────────────────────────────────────────────────
writeFileSync(TOKENS_JSON_PATH, JSON.stringify(tokens, null, 2) + '\n')

if (updatedCount > 0) {
  console.log(`✓ Synced ${updatedCount} changed token(s) from Figma → tokens.json`)
} else {
  console.log('✓ No changes detected — tokens.json is already in sync with Figma')
}
