# Marobase UI Polish Examples

Use these playbooks when applying practical UI refinements. Focus on shipping concrete code updates aligned with Marobase patterns.

## Playbook 1: Data Table Screen Polish

### Typical symptoms

- Header actions feel disconnected from filters/table
- Search and filters are missing or visually inconsistent
- Empty table state has no guidance or action
- Bulk actions are absent or unclear after selection

### Target structure

```vue
<MpPageHeader title="..." subtitle="..." :breadcrumbs="[...]">
  <template #actions>
    <v-btn color="primary" prepend-icon="mdi-plus">Create</v-btn>
  </template>
</MpPageHeader>

<MpFilterTabs v-model="activeTab" :tabs="tabs" />

<v-card flat border rounded="lg" class="mt-4">
  <MpDataTableToolbar v-model:search="search">
    <template #filters>
      <!-- domain filters -->
    </template>
    <template #actions>
      <!-- export/import/etc -->
    </template>
  </MpDataTableToolbar>

  <v-data-table :headers="headers" :items="filteredItems" />

  <MpEmptyState
    v-if="!filteredItems.length"
    icon="mdi-database-search"
    title="No matching records"
    description="Adjust filters or create a new record."
    action-label="Create"
    @action="openCreate()"
  />
</v-card>

<MpFloatingBulkBar :count="selected.length" @clear="selected = []">
  <v-btn size="small" variant="text">Archive</v-btn>
  <v-btn size="small" color="error" variant="text">Delete</v-btn>
</MpFloatingBulkBar>
```

### Refinement checklist

- Normalize outer spacing (`mt-*`, `pa-*`, `gap-*`) using Vuetify utilities.
- Keep card styling as `flat border rounded="lg"`.
- Use `MpStatusChip` for status columns instead of custom chips/colors.
- Distinguish “no results” (filtered empty) vs “no data yet” messaging.
- Ensure toolbar actions wrap or collapse cleanly on small screens.
- Update related stories to include at least default + empty/filter-selected states.

---

## Playbook 2: Form Drawer UX Cleanup

### Typical symptoms

- Forms use modal dialogs instead of standard drawers
- Field order and grouping feel random
- Validation/help text is inconsistent
- Footer actions are unclear or reversed

### Target structure

```vue
<MpFormDrawer
  v-model="drawerOpen"
  title="Create Promotion"
  subtitle="Configure campaign details"
>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field label="Name" />
    </v-col>
    <v-col cols="12" md="6">
      <v-select label="Status" :items="statuses" />
    </v-col>
    <v-col cols="12">
      <v-textarea label="Description" rows="3" />
    </v-col>
  </v-row>

  <template #footer>
    <v-btn variant="text" @click="drawerOpen = false">Cancel</v-btn>
    <v-btn color="primary" @click="submit">Save</v-btn>
  </template>
</MpFormDrawer>
```

### Refinement checklist

- Replace `v-dialog` forms with `MpFormDrawer`.
- Group related fields in predictable sections (identity, status, schedule, advanced).
- Keep labels/help/validation concise and consistently placed.
- Use logical action order in footer: secondary first, primary last.
- Verify drawer usability on narrow widths (scroll, sticky footer, tap targets).
- Add or update component/page stories for default, validation-error, and loading-save states.

---

## Playbook 3: Dashboard/KPI Section Polish

### Typical symptoms

- KPI cards are visually uneven in spacing and content hierarchy
- Section actions and labels compete visually
- Dense widgets reduce readability

### Target structure

```vue
<MpSectionHeader title="Performance Overview">
  <template #actions>
    <v-btn size="small" variant="text" prepend-icon="mdi-filter-variant">Filter</v-btn>
  </template>
</MpSectionHeader>

<v-row class="mt-2" dense>
  <v-col cols="12" md="6" lg="3">
    <MpKpiCard label="Revenue" value="$124,890" trend="+8.4%" :trend-positive="true" />
  </v-col>
  <v-col cols="12" md="6" lg="3">
    <MpKpiCard label="Orders" value="1,240" trend="+3.1%" :trend-positive="true" />
  </v-col>
  <!-- more KPI cards -->
</v-row>
```

### Refinement checklist

- Standardize card grid breakpoints and spacing rhythm.
- Keep KPI labels subdued and values dominant for scan speed.
- Use token/Vuetify typography and spacing utilities, no hardcoded visual values.
- Reduce visual noise: avoid heavy shadows and unnecessary decorative elements.
- Confirm mobile stacking order and readability of numbers/trends.
- Update stories for key dashboard components where behavior or visuals changed.

---

## Quick Decision Rules

- If an issue is solved by an existing `Mp*` component, use it.
- If introducing a new reusable component, type props/emits and add a co-located story.
- Prefer small, shippable refinements over speculative redesigns.
- Every polish task should end with code + responsive verification + story updates where relevant.
