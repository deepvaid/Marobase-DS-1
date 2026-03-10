<script setup lang="ts">
import tokens from '@/design-tokens/tokens.json'

interface ColorEntry {
  name: string
  value: string
  token: string
}

interface ColorGroup {
  label: string
  colors: ColorEntry[]
}

const colorData = tokens.color as Record<string, Record<string, { $value: string }> | { $description?: string }>

function buildGroups(): ColorGroup[] {
  const groups: ColorGroup[] = []

  for (const [groupKey, groupVal] of Object.entries(colorData)) {
    if (typeof groupVal !== 'object' || '$value' in groupVal) continue
    const colors: ColorEntry[] = []

    for (const [colorKey, colorVal] of Object.entries(groupVal)) {
      if (colorKey === '$description') continue
      if (typeof colorVal === 'object' && '$value' in colorVal) {
        colors.push({
          name: colorKey,
          value: (colorVal as { $value: string }).$value,
          token: `color.${groupKey}.${colorKey}`,
        })
      }
    }

    if (colors.length > 0) {
      groups.push({
        label: groupKey.charAt(0).toUpperCase() + groupKey.slice(1),
        colors,
      })
    }
  }

  return groups
}

const groups = buildGroups()

function textColor(hex: string): string {
  // Return black or white based on luminance
  const clean = hex.replace('#', '')
  if (clean.startsWith('rgba') || clean.length < 6) return '#111928'
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111928' : '#FFFFFF'
}
</script>

<template>
  <div>
    <div class="mb-6">
      <div style="font-size: 28px; font-weight: 700; font-family: Inter, sans-serif; color: #111928;">Colors</div>
      <div class="text-medium-emphasis mt-1">Semantic color palette from <code>tokens.json</code> — light, dark, and sidebar themes</div>
    </div>

    <div v-for="group in groups" :key="group.label" class="mb-8">
      <div style="font-size: 16px; font-weight: 600; font-family: Inter, sans-serif; margin-bottom: 12px; color: #111928;">
        {{ group.label }}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
        <div
          v-for="color in group.colors"
          :key="color.token"
          style="border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;"
        >
          <!-- Color swatch -->
          <div
            :style="{
              background: color.value,
              height: '72px',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '8px',
            }"
          >
            <span
              :style="{
                color: textColor(color.value),
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: 'JetBrains Mono, monospace',
                opacity: 0.9,
              }"
            >
              {{ color.value }}
            </span>
          </div>

          <!-- Meta -->
          <div style="background: #FFFFFF; padding: 8px 10px;">
            <div style="font-size: 12px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">
              {{ color.name }}
            </div>
            <div style="font-size: 11px; font-family: JetBrains Mono, monospace; color: #6B7280; margin-top: 2px;">
              {{ color.token }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
