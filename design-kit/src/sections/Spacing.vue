<script setup lang="ts">
import tokens from '@/design-tokens/tokens.json'

// Spacing
const spacingEntries = Object.entries(tokens.spacing)
  .filter(([k]) => k !== '$description')
  .map(([key, val]) => ({
    key,
    value: (val as { $value: string }).$value,
    token: `spacing.${key}`,
    px: parseInt((val as { $value: string }).$value),
  }))

// Border radius
const radiusEntries = Object.entries(tokens.borderRadius)
  .filter(([k]) => k !== '$description')
  .map(([key, val]) => ({
    key,
    value: (val as { $value: string }).$value,
    token: `borderRadius.${key}`,
  }))

// Shadows
const shadowEntries = Object.entries(tokens.shadow)
  .filter(([k]) => k !== '$description')
  .map(([key, val]) => ({
    key,
    value: (val as { $value: string }).$value,
    token: `shadow.${key}`,
  }))

// Layout
const layoutEntries = Object.entries(tokens.layout)
  .filter(([k]) => k !== '$description')
  .map(([key, val]) => ({
    key,
    value: (val as { $value: string }).$value,
    token: `layout.${key}`,
  }))
</script>

<template>
  <div>
    <div class="mb-6">
      <div style="font-size: 28px; font-weight: 700; font-family: Inter, sans-serif; color: #111928;">Spacing &amp; Layout</div>
      <div class="text-medium-emphasis mt-1">4px base spacing scale, radii, shadows, and layout dimensions</div>
    </div>

    <!-- Spacing scale -->
    <v-card flat border rounded="lg" class="mb-6 pa-6">
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Spacing Scale</div>
      <div
        v-for="s in spacingEntries"
        :key="s.key"
        style="display: flex; align-items: center; gap: 16px; padding: 6px 0; border-bottom: 1px solid #F3F4F6;"
      >
        <!-- Label -->
        <div style="width: 60px; flex-shrink: 0; text-align: right;">
          <span style="font-size: 11px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ s.key }}</span>
        </div>
        <!-- Bar -->
        <div
          :style="{
            width: s.value,
            height: '16px',
            background: '#1A56DB',
            borderRadius: '2px',
            flexShrink: 0,
            minWidth: '4px',
          }"
        />
        <!-- Value -->
        <div>
          <span style="font-size: 12px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ s.value }}</span>
          <span style="font-size: 11px; color: #9CA3AF; margin-left: 8px;">{{ s.token }}</span>
        </div>
      </div>
    </v-card>

    <!-- Border radius + Shadows side by side -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <!-- Border Radius -->
      <v-card flat border rounded="lg" class="pa-6">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Border Radius</div>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
          <div v-for="r in radiusEntries" :key="r.key" style="text-align: center;">
            <div
              :style="{
                width: '64px',
                height: '64px',
                background: '#EEF2FF',
                border: '2px solid #1A56DB',
                borderRadius: r.value,
                margin: '0 auto 8px',
              }"
            />
            <div style="font-size: 11px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ r.key }}</div>
            <div style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ r.value }}</div>
          </div>
        </div>
      </v-card>

      <!-- Shadows -->
      <v-card flat border rounded="lg" class="pa-6">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Shadows</div>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div v-for="s in shadowEntries" :key="s.key" style="display: flex; align-items: center; gap: 16px;">
            <div
              :style="{
                width: '80px',
                height: '48px',
                background: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: s.value,
                flexShrink: 0,
              }"
            />
            <div>
              <div style="font-size: 12px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ s.key }}</div>
              <div style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280; margin-top: 2px;">{{ s.value }}</div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Layout dimensions -->
    <v-card flat border rounded="lg" class="pa-6">
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Layout Dimensions</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
        <div
          v-for="l in layoutEntries"
          :key="l.key"
          style="background: #F9FAFB; border-radius: 8px; padding: 12px 16px; border: 1px solid #E5E7EB;"
        >
          <div style="font-size: 12px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ l.key }}</div>
          <div style="font-size: 20px; font-weight: 700; font-family: Inter, sans-serif; color: #1A56DB; margin: 4px 0;">{{ l.value }}</div>
          <div style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ l.token }}</div>
        </div>
      </div>
    </v-card>
  </div>
</template>
