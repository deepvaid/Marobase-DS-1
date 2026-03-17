---
name: marobase-component-author
description: Enforces Mp* component conventions for the Marobase Vue 3 + Vuetify design system. Use when creating or modifying components in src/components/, ensuring typed props/emits, scoped styles, co-located Storybook stories, design token usage, and no hardcoded colors/spacing/radius.
---

# Marobase Component Author

Enforces Mp* component conventions so new or updated components match the design system.

## When to Use

- Creating a new `Mp*` component in `src/components/`
- Modifying an existing Mp* component or its story
- Reviewing component code for design-system compliance

## File and Naming

- **Component:** `src/components/MpComponentName.vue` (PascalCase, `Mp` prefix)
- **Story:** `src/components/MpComponentName.stories.ts` (co-located)
- Layout components live in `src/components/layout/` (e.g. `AppBar.vue`, `AppSidebar.vue`)

## Component Requirements

### Script

- Use `<script setup lang="ts">` only.
- **Props:** Type with `defineProps<{ ... }>()`. Use `withDefaults()` for optional props and defaults.
- **Emits:** Type with `defineEmits<{ (e: 'eventName', payload?: Type): void }>()`.
- No inline styles in template; no `!important` in styles except rare overrides.

### Template

- Prefer Vuetify utility classes: `d-flex`, `pa-4`, `gap-3`, `text-medium-emphasis`.
- Cards: `v-card flat border rounded="lg"` (no elevation).
- Use `MpStatusChip` for any status display (with correct `type` prop).
- Icons: MDI only via `mdi-*` (e.g. `prepend-icon="mdi-plus"`).
- Forms: use `MpFormDrawer`, not `v-dialog`.
- Slots must be named (e.g. `#actions`, `#footer`); no unnamed default-only slots for public API.

### Styles

- **Scoped only:** `<style scoped>`; no global styles in the component file.
- **No hardcoded values:** no hex colors, raw px for spacing/radius/shadows in template or style.
- Use design token SCSS: `$mp-spacing-4`, `$mp-borderRadius-md`, etc. from `src/design-tokens/generated/_variables.scss`, or Vuetify theme/utilities.

## Story Requirements

- Co-located: `MpComponentName.stories.ts` next to the component.
- Use `@storybook/vue3`: `Meta<typeof Component>`, `StoryObj<typeof meta>`.
- Include: `title: 'Category/MpComponentName'`, `component`, `tags: ['autodocs']`.
- Provide `argTypes` for props that should be controlled.
- Export at least one default story and variant stories (e.g. states, sizes).
- Optional: `parameters.docs.description.component` for do's/don'ts and usage.

## Checklist Before Finishing

- [ ] Props and emits are fully typed.
- [ ] Styles are scoped; no hardcoded colors/spacing/radius/shadows.
- [ ] Story file exists and runs in Storybook (`npm run storybook`).
- [ ] No `elevation` on cards; use `flat border`.
- [ ] Status UI uses `MpStatusChip` with appropriate `type`.

## References

- `CLAUDE.md` — component inventory and patterns
- `.cursorrules` — styling do's/don'ts and page layout pattern
- `src/design-tokens/tokens.json` — token source; use generated `_variables.scss` in styles
