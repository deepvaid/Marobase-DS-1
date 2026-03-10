/**
 * push-variables.mjs
 *
 * Reads design-kit/figma-export/figma-variables.json and pushes all 64
 * design tokens to a Figma file as local Variables via the REST API.
 *
 * Usage:
 *   FIGMA_TOKEN=<token> FIGMA_FILE_KEY=<key> node design-kit/scripts/push-variables.mjs
 *
 * Env vars:
 *   FIGMA_TOKEN     — Figma Personal Access Token (Settings → Security → Personal access tokens)
 *   FIGMA_FILE_KEY  — Key from the Figma file URL: figma.com/design/<FILE_KEY>/...
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Env validation ───────────────────────────────────────────────────────────
const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY

if (!FIGMA_TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required.')
  console.error('    export FIGMA_TOKEN=your_personal_access_token')
  process.exit(1)
}
if (!FIGMA_FILE_KEY) {
  console.error('❌  FIGMA_FILE_KEY env var is required.')
  console.error('    export FIGMA_FILE_KEY=pIAEPmN8rNAzq3ViXqDOJd')
  console.error('    (extract from: figma.com/design/<FILE_KEY>/...)')
  process.exit(1)
}

// Auto-extract file key if the user passed a full Figma URL
function extractFileKey(input) {
  // Match figma.com/design/<key>/ or figma.com/file/<key>/
  const match = input.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/)
  if (match) return match[1]
  return input // assume it's already a bare key
}

const FILE_KEY = extractFileKey(FIGMA_FILE_KEY)
if (FILE_KEY !== FIGMA_FILE_KEY) {
  console.log(`ℹ️   Extracted file key from URL: ${FILE_KEY}`)
}

// ── Load source JSON ─────────────────────────────────────────────────────────
const sourcePath = join(__dirname, '../figma-export/figma-variables.json')
const source = JSON.parse(readFileSync(sourcePath, 'utf-8'))

console.log(`\n📦  Loaded ${source.variables.length} variables across ${source.variableCollections.length} collections`)

// ── Transform to Figma REST API format ──────────────────────────────────────
//
// Source shape (figma-variables.json):
//   collection: { id, name, modes[{modeId,name}], defaultModeId, variableIds[] }
//   variable:   { id, name, collectionId, resolvedType, description, valuesByMode }
//
// Target shape (POST /v1/files/:key/variables):
//   variableCollections: [{ action:"CREATE", id, name, initialModeId }]
//   variableModes:       [{ action:"CREATE", id, name, variableCollectionId }]
//   variables:           [{ action:"CREATE", id, name, variableCollectionId, resolvedType, description }]
//   variableModeValues:  [{ variableId, modeId, value }]

const variableCollections = source.variableCollections.map((col) => ({
  action: 'CREATE',
  id: col.id,
  name: col.name,
  initialModeId: col.modes[0].modeId,
}))

const variableModes = source.variableCollections.flatMap((col) =>
  col.modes.map((mode) => ({
    action: 'CREATE',
    id: mode.modeId,
    name: mode.name,
    variableCollectionId: col.id,
  }))
)

const variables = source.variables.map((v) => ({
  action: 'CREATE',
  id: v.id,
  name: v.name,
  variableCollectionId: v.collectionId,
  resolvedType: v.resolvedType,
  description: v.description || '',
}))

const variableModeValues = source.variables.flatMap((v) =>
  Object.entries(v.valuesByMode).map(([modeId, modeVal]) => ({
    variableId: v.id,
    modeId,
    value: modeVal.value,
  }))
)

const payload = {
  variableCollections,
  variableModes,
  variables,
  variableModeValues,
}

console.log(`\n🔄  Transformed payload:`)
console.log(`    ${variableCollections.length} collections`)
console.log(`    ${variableModes.length} modes`)
console.log(`    ${variables.length} variables`)
console.log(`    ${variableModeValues.length} mode values`)

// ── POST to Figma REST API ───────────────────────────────────────────────────
const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables`

console.log(`\n🚀  Posting to Figma file: ${FILE_KEY}`)
console.log(`    ${url}\n`)

let response
try {
  response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
} catch (err) {
  console.error('❌  Network error:', err.message)
  process.exit(1)
}

const responseText = await response.text()

if (!response.ok) {
  console.error(`❌  Figma API error (HTTP ${response.status}):`)
  try {
    const json = JSON.parse(responseText)
    console.error(JSON.stringify(json, null, 2))
  } catch {
    console.error(responseText)
  }
  process.exit(1)
}

let result
try {
  result = JSON.parse(responseText)
} catch {
  console.error('❌  Could not parse Figma response as JSON:')
  console.error(responseText)
  process.exit(1)
}

console.log('✅  Variables pushed successfully!\n')
console.log('Next step — open your Figma file and check:')
console.log('  Edit → Local variables → you should see 6 collections:')
console.log('  Colors, Colors/Sidebar, Spacing, Border Radius, Typography, Layout\n')

if (result.meta) {
  console.log('API response meta:', JSON.stringify(result.meta, null, 2))
}
