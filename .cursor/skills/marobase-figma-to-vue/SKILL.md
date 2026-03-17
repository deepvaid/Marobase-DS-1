---
name: marobase-figma-to-vue
description: Translates Figma nodes into Marobase Vue 3 + Vuetify code. Use when the user provides a Figma URL or node ID, or when implementing a design that must match Figma. Reuses existing Mp* components, follows app shell and page layout patterns, and generates or updates Storybook stories (and tests when needed).
---

# Marobase Figma to Vue

Turns Figma designs into Marobase Vue/Vuetify code by reusing Mp* components and app patterns.

## When to Use

- User shares a Figma URL (e.g. `figma.com/design/...?node-id=...`)
- User asks to implement a design from Figma
- Design-to-code task where the target is this repo

## Workflow

### 1. Get the design

- Use Figma MCP `get_design_context` with `fileKey` and `nodeId` from the URL.
- Parse URLs: `figma.com/design/:fileKey/:fileName?node-id=:nodeId` (convert `-` to `:` in nodeId for the API).
- Treat the returned code as a **reference** (often React/Tailwind); do not copy it literally.

### 2. Map to Marobase

- **Components:** Prefer existing Mp* components. See `CLAUDE.md` for inventory:
  - Page chrome → `MpPageHeader`, `MpFilterTabs`, `MpDataTableToolbar`, `MpEmptyState`, `MpFloatingBulkBar`
  - Cards → `v-card flat border rounded="lg"`; metrics → `MpKpiCard`
  - Status → `MpStatusChip` (with correct `type`)
  - Forms → `MpFormDrawer`; section titles → `MpSectionHeader`
- **Layout:** Use the standard page pattern from `.cursorrules`: header → filter tabs → card → toolbar → table → empty state → bulk bar.
- **Shell:** For full-page layouts, use `AppBar` + `AppSidebar` patterns from existing views.
- **Stack:** Vue 3 `<script setup lang="ts">`, Vuetify 3, design tokens (no hardcoded colors/spacing).

### 3. Implement

- Create or update files under `src/views/` or `src/components/` as appropriate.
- Use design token SCSS variables or Vuetify utilities; no hex or raw px for layout/color.
- Icons: MDI only (`mdi-*`).

### 4. Stories and tests

- **New Mp* component:** Add `MpComponentName.stories.ts` next to the component (see marobase-component-author skill).
- **New view/page:** Add a story only if it adds value (e.g. key states); not every view needs one.
- **Tests:** Generate or update tests when the user asks for tests or when adding a reusable component that should be covered.

## Output Quality

- Match Figma layout and hierarchy; use screenshot from `get_design_context` to verify.
- Preserve semantic structure (headings, sections, actions) even if simplifying visuals to use Mp* components.
- If the design uses tokens or Code Connect, follow mapped codebase components and docs.

## References

- `CLAUDE.md` — component list and data-table/form patterns
- `.cursorrules` — page view pattern and styling rules
- `docs/figma-integration.md` — Code Connect and token sync
- Figma MCP server instructions in this project for URL parsing and design context
