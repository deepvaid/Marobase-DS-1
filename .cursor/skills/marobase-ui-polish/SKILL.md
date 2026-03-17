---
name: marobase-ui-polish
description: Improves UI consistency, visual polish, and usability in the Marobase Vue 3 + Vuetify playground. Use when the user asks for UI cleanup, aesthetics, spacing/alignment fixes, hierarchy/readability improvements, interaction clarity, or product-quality UX refinement on any screen/component.
---

# Marobase UI Polish

Refines existing screens and components into consistent, production-quality UI while preserving Marobase design-system rules.

## When to Use

- User asks for UI consistency, visual polish, UX cleanup, or readability/usability improvements
- A screen feels visually uneven (spacing, alignment, density, hierarchy, interaction affordance)
- A page has incomplete table/filter/empty-state/bulk-action/form UX

## Non-Negotiables

- Preserve existing Marobase design system and Vuetify patterns.
- Reuse existing `Mp*` components before creating new components.
- Never hardcode visual values (no hex colors, ad-hoc px spacing/radius/shadows, inline style-driven visual design).
- Use design tokens (`src/design-tokens/tokens.json` + `src/design-tokens/generated/_variables.scss`) and Vuetify utilities/theme values.
- Produce concrete code changes, not critique-only feedback.
- If a component changes, add or update its Storybook story.

## Core Workflow

1. **Audit the current UI**
   - Identify visible inconsistencies: spacing rhythm, misalignment, weak hierarchy, noisy density, unclear actions, missing empty/loading states.
   - Locate existing design-system primitives that already solve each issue (`MpPageHeader`, `MpFilterTabs`, `MpDataTableToolbar`, `MpEmptyState`, `MpFloatingBulkBar`, `MpFormDrawer`, `MpSectionHeader`, `MpStatusChip`).

2. **Apply minimal, high-value refinements**
   - Favor practical polish over broad redesign.
   - Improve the current structure and interactions first; avoid introducing novelty that conflicts with Marobase patterns.

3. **Enforce page and component patterns**
   - Keep data pages aligned to the standard flow:
     - `MpPageHeader` (with actions)
     - `MpFilterTabs`
     - `v-card flat border rounded="lg"`
     - `MpDataTableToolbar` (search + filters + actions)
     - `v-data-table`
     - `MpEmptyState` when no data
     - `MpFloatingBulkBar` for multi-select actions
   - For forms, use `MpFormDrawer` instead of `v-dialog`.

4. **Validate responsive behavior**
   - Check both desktop and mobile/tablet behavior.
   - Ensure tap targets, line wrapping, toolbar/action overflow, and drawer/form readability remain usable on smaller widths.

5. **Update docs surface**
   - Add/update Storybook stories for changed components, including meaningful states (default, dense/compact, empty, loading, selected, mobile-sensitive variants where relevant).

## What to Improve (Priority)

### 1) Spacing and alignment

- Normalize vertical rhythm between header, filters, card sections, and table/toolbars.
- Remove visual jitter from inconsistent paddings/margins.
- Align action buttons, chips, icons, and text baselines.

### 2) Hierarchy and readability

- Clarify primary vs secondary information with typography and spacing, not arbitrary color.
- Tighten noisy layouts; keep high-signal content prominent.
- Ensure section headers, subtitles, and helper text form a clear scan path.

### 3) Density and interaction clarity

- Use compact density where tables are content-heavy, but keep controls readable.
- Clarify filter/search/action intent (labels, placement, grouping, affordances).
- Make bulk actions discoverable and predictable when rows are selected.

### 4) Missing UX states

- Add/improve `MpEmptyState` for no results / no data.
- Ensure search + filters work coherently (e.g., empty after filtering vs globally empty).
- Improve form UX: field grouping, validation hints, sensible action order in drawer footer.

### 5) Visual consistency details

- Card styling: `flat border rounded="lg"` as default container style.
- Header actions: consistent placement, button hierarchy, icon usage (`mdi-*` only).
- Status display: use `MpStatusChip` with correct `type` mapping.

## Implementation Rules

- Vue components: `<script setup lang="ts">`, typed props/emits for new or changed reusable components.
- Prefer Vuetify utility classes (`d-flex`, `pa-*`, `gap-*`, `text-medium-emphasis`) and token-backed styling.
- No heavy shadows/elevation for core cards; keep surfaces flat and bordered.
- No unnamed public slots; use explicit slot names (`#actions`, `#filters`, `#footer`).

## Done Checklist

- [ ] UI polish is implemented via concrete code edits.
- [ ] Existing `Mp*` components reused where possible.
- [ ] No hardcoded visual values introduced.
- [ ] Page structure and card/table/drawer/header patterns are consistent.
- [ ] Empty/filter/search/bulk/form UX is improved where gaps existed.
- [ ] Desktop and mobile behavior checked and adjusted.
- [ ] Storybook stories added/updated for changed components.

## References

- `CLAUDE.md` — architecture, component inventory, coding conventions
- `.cursorrules` — required styling and page-view patterns
- `docs/design-system.md` — design tokens and component APIs
- `src/design-tokens/tokens.json` — source-of-truth tokens
- `src/design-tokens/generated/_variables.scss` — token variables for styles
- `src/components/layout/AppBar.vue` and `src/components/layout/AppSidebar.vue` — shell/layout conventions
- `src/components/` — reusable `Mp*` components and stories
- `examples.md` — concrete UI polish playbooks (table page, form drawer, dashboard)
