<script setup lang="ts">
import tokens from '@/design-tokens/tokens.json'

const typo = tokens.typography

const fontSizes = Object.entries(typo.fontSize).map(([key, val]) => ({
  key,
  value: (val as { $value: string }).$value,
  token: `typography.fontSize.${key}`,
}))

const fontWeights = Object.entries(typo.fontWeight).map(([key, val]) => ({
  key,
  value: (val as { $value: string }).$value,
  token: `typography.fontWeight.${key}`,
}))

const lineHeights = Object.entries(typo.lineHeight).map(([key, val]) => ({
  key,
  value: (val as { $value: string }).$value,
  token: `typography.lineHeight.${key}`,
}))

const sampleText = 'The quick brown fox jumps over the lazy dog'
const headingSample = 'Maropost Dashboard'
</script>

<template>
  <div>
    <div class="mb-6">
      <div style="font-size: 28px; font-weight: 700; font-family: Inter, sans-serif; color: #111928;">Typography</div>
      <div class="text-medium-emphasis mt-1">
        Type scale using <strong>Inter</strong> — sourced from <code>tokens.json</code>
      </div>
    </div>

    <!-- Font Families -->
    <v-card flat border rounded="lg" class="mb-6 pa-6">
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Font Families</div>
      <div class="mb-4">
        <div style="font-family: Inter, sans-serif; font-size: 24px; color: #111928;">
          Inter — Base typeface
        </div>
        <div style="font-size: 11px; font-family: JetBrains Mono, monospace; color: #6B7280; margin-top: 4px;">
          typography.fontFamily.base
        </div>
        <div style="font-family: Inter, sans-serif; font-size: 12px; color: #6B7280; margin-top: 4px;">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
        </div>
      </div>
      <v-divider class="mb-4" />
      <div>
        <div style="font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 18px; color: #111928;">
          JetBrains Mono — Code typeface
        </div>
        <div style="font-size: 11px; font-family: JetBrains Mono, monospace; color: #6B7280; margin-top: 4px;">
          typography.fontFamily.mono
        </div>
        <div style="font-family: JetBrains Mono, monospace; font-size: 12px; color: #6B7280; margin-top: 4px;">
          const tokens = import('./tokens.json')
        </div>
      </div>
    </v-card>

    <!-- Font Size Scale -->
    <v-card flat border rounded="lg" class="mb-6 pa-6">
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Font Size Scale</div>
      <div
        v-for="size in [...fontSizes].reverse()"
        :key="size.key"
        style="display: flex; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #F3F4F6;"
      >
        <div style="width: 100px; flex-shrink: 0;">
          <div style="font-size: 11px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ size.key }}</div>
          <div style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ size.value }}</div>
        </div>
        <div
          :style="{
            fontFamily: 'Inter, sans-serif',
            fontSize: size.value,
            fontWeight: '400',
            color: '#111928',
            lineHeight: '1.3',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flex: 1,
          }"
        >
          {{ size.key === 'xs' || size.key === 'sm' || size.key === 'body' ? sampleText : headingSample }}
        </div>
      </div>
    </v-card>

    <!-- Font Weights -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" class="mb-6">
      <v-card flat border rounded="lg" class="pa-6">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Font Weights</div>
        <div
          v-for="w in fontWeights"
          :key="w.key"
          style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #F3F4F6;"
        >
          <div style="width: 90px; flex-shrink: 0;">
            <div style="font-size: 11px; font-family: Inter, sans-serif; font-weight: 600; color: #111928;">{{ w.key }}</div>
            <div style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ w.value }}</div>
          </div>
          <div
            :style="{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: w.value,
              color: '#111928',
            }"
          >
            Maropost Commerce
          </div>
        </div>
      </v-card>

      <v-card flat border rounded="lg" class="pa-6">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #111928;">Line Heights</div>
        <div
          v-for="lh in lineHeights"
          :key="lh.key"
          style="padding: 12px 0; border-bottom: 1px solid #F3F4F6;"
        >
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 600; font-family: Inter, sans-serif; color: #111928;">{{ lh.key }}</span>
            <span style="font-size: 10px; font-family: JetBrains Mono, monospace; color: #6B7280;">{{ lh.value }}</span>
          </div>
          <div
            :style="{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: lh.value,
              color: '#374151',
              background: '#F9FAFB',
              padding: '6px 8px',
              borderRadius: '4px',
            }"
          >
            Manage your orders, customers, and campaigns from a unified dashboard.
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>
