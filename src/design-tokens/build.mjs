/**
 * Zero-dependency design token generator for Maropost.
 *
 * Reads tokens.json and generates:
 *   generated/_variables.scss   — SCSS variables
 *   generated/variables.css     — CSS custom properties
 *   generated/tokens.ts         — TypeScript constants
 *
 * Usage:
 *   node src/design-tokens/build.mjs          # one-shot
 *   node src/design-tokens/build.mjs --watch  # watch mode
 */

import { readFileSync, writeFileSync, mkdirSync, watch } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKENS_PATH = resolve(__dirname, 'tokens.json')
const OUT_DIR = resolve(__dirname, 'generated')

// ── Flatten nested token object into path→value pairs ──────────────────────
function flatten(obj, prefix = []) {
  const result = []
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue // skip meta keys
    if (val && typeof val === 'object' && '$value' in val) {
      result.push({ path: [...prefix, key], value: val.$value, type: val.$type || 'unknown' })
    } else if (val && typeof val === 'object') {
      result.push(...flatten(val, [...prefix, key]))
    }
  }
  return result
}

// ── Generators ─────────────────────────────────────────────────────────────
function toScssName(path) {
  return '$mp-' + path.join('-')
}

function toCssName(path) {
  return '--mp-' + path.join('-')
}

function toTsName(path) {
  return 'mp_' + path.map(p => p.replace(/-/g, '_')).join('_')
}

function generateScss(tokens) {
  const header = '// Auto-generated from tokens.json — do not edit\n\n'
  const lines = tokens.map(t => `${toScssName(t.path)}: ${t.value};`)
  return header + lines.join('\n') + '\n'
}

function generateCss(tokens) {
  const header = '/* Auto-generated from tokens.json — do not edit */\n\n:root {\n'
  const lines = tokens.map(t => `  ${toCssName(t.path)}: ${t.value};`)
  return header + lines.join('\n') + '\n}\n'
}

function generateTs(tokens) {
  const header = '// Auto-generated from tokens.json — do not edit\n\n'
  const lines = tokens.map(t => {
    if (typeof t.value === 'number') {
      return `export const ${toTsName(t.path)} = ${t.value}`
    }
    // Escape single quotes inside values, or use backticks for safety
    const escaped = String(t.value).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
    return `export const ${toTsName(t.path)} = \`${escaped}\``
  })
  return header + lines.join('\n') + '\n'
}

// ── Build ──────────────────────────────────────────────────────────────────
function build() {
  const raw = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  const tokens = flatten(raw)

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(resolve(OUT_DIR, '_variables.scss'), generateScss(tokens))
  writeFileSync(resolve(OUT_DIR, 'variables.css'), generateCss(tokens))
  writeFileSync(resolve(OUT_DIR, 'tokens.ts'), generateTs(tokens))

  console.log(`✓ Generated ${tokens.length} tokens → ${OUT_DIR}/`)
}

// ── Entry ──────────────────────────────────────────────────────────────────
build()

if (process.argv.includes('--watch')) {
  console.log('Watching tokens.json for changes…')
  let debounce = null
  watch(TOKENS_PATH, { persistent: true }, () => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      console.log('tokens.json changed — rebuilding…')
      try { build() } catch (e) { console.error(e) }
    }, 200)
  })
}
