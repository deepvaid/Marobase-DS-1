<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MbTableColumn, MbTableProps, MbTableRow } from './MbTable.types';
import '../styles/mb-table.css';

const defaultColumns: MbTableColumn[] = [
  { key: 'user', label: 'User', type: 'person', width: '260px' },
  { key: 'email', label: 'Email', type: 'text', width: '250px' },
  { key: 'status', label: 'Status', type: 'status', width: '110px' },
  { key: 'team', label: 'Team', type: 'text', width: '190px' },
  { key: 'role', label: 'Role', type: 'text', width: '200px' },
  { key: 'actions', label: '', type: 'actions', width: '64px', align: 'center' }
];

const defaultRows: MbTableRow[] = [
  {
    id: 'darlene',
    name: 'Darlene Robertson',
    handle: '@Darlene',
    avatarInitials: 'DR',
    email: 'darlene.robertson@company.com',
    status: 'Active',
    team: 'Design',
    role: 'UX Designer'
  },
  {
    id: 'eleanor',
    name: 'Eleanor Pena',
    handle: '@Eleanor',
    avatarInitials: 'EP',
    email: 'eleanor.pena@company.com',
    status: 'Active',
    team: 'Marketing',
    role: 'Graphic Designer'
  },
  {
    id: 'albert',
    name: 'Albert Flores',
    handle: '@Albert',
    avatarInitials: 'AF',
    email: 'albert.flores@company.com',
    status: 'Active',
    team: 'iOS Development',
    role: 'Back-end Developer'
  },
  {
    id: 'brooklyn',
    name: 'Brooklyn Simmons',
    handle: '@Brooklyn',
    avatarInitials: 'BS',
    email: 'brooklyn.simmons@company.com',
    status: 'Active',
    team: 'Web Development',
    role: 'Front-end Developer'
  },
  {
    id: 'jerome',
    name: 'Jerome Bell',
    handle: '@Jerome',
    avatarInitials: 'JB',
    email: 'jerome.bell@company.com',
    status: 'Active',
    team: 'Design',
    role: 'UI Designer'
  },
  {
    id: 'esther',
    name: 'Esther Howard',
    handle: '@Esther',
    avatarInitials: 'EH',
    email: 'esther.howard@company.com',
    status: 'Active',
    team: 'iOS Development',
    role: 'iOS Developer'
  },
  {
    id: 'marvin',
    name: 'Marvin McKinney',
    handle: '@Marvin',
    avatarInitials: 'MM',
    email: 'marvin.mckinney@company.com',
    status: 'On Leave',
    team: 'Business',
    role: 'Salesman'
  },
  {
    id: 'robert',
    name: 'Robert Fox',
    handle: '@Robert',
    avatarInitials: 'RF',
    email: 'robert.fox@company.com',
    status: 'Active',
    team: 'Business',
    role: 'Salesman'
  },
  {
    id: 'cameron',
    name: 'Cameron Williamson',
    handle: '@Cameron',
    avatarInitials: 'CW',
    email: 'cameron.williamson@company.com',
    status: 'On Leave',
    team: 'iOS Development',
    role: 'Lead iOS Developer'
  },
  {
    id: 'bessie',
    name: 'Bessie Cooper',
    handle: '@Bessie',
    avatarInitials: 'BC',
    email: 'bessie.cooper@company.com',
    status: 'Active',
    team: 'Marketing',
    role: 'Copywriter'
  }
];

const props = withDefaults(defineProps<MbTableProps>(), {
  columns: () => [],
  rows: () => [],
  modelValue: undefined,
  selectable: true,
  striped: true,
  hoverable: true,
  ariaLabel: 'Data table'
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void;
  (event: 'row-click', payload: MbTableRow): void;
  (event: 'row-action', payload: MbTableRow): void;
}>();

const columns = computed(() => (props.columns.length > 0 ? props.columns : defaultColumns));
const rows = computed(() => (props.rows.length > 0 ? props.rows : defaultRows));
const isControlled = computed(() => Array.isArray(props.modelValue));
const internalSelection = ref<string[]>([]);

watch(
  () => props.modelValue,
  (value) => {
    if (Array.isArray(value)) {
      internalSelection.value = value;
    }
  },
  { immediate: true }
);

const selection = computed(() => {
  if (isControlled.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }

  return internalSelection.value;
});

const allIds = computed(() => rows.value.map((row) => row.id));
const allSelected = computed(() => allIds.value.length > 0 && allIds.value.every((id) => selection.value.includes(id)));
const partlySelected = computed(
  () => selection.value.length > 0 && selection.value.length < allIds.value.length
);

function commitSelection(next: string[]) {
  if (!isControlled.value) {
    internalSelection.value = next;
  }

  emit('update:modelValue', next);
}

function toggleAll() {
  if (allSelected.value) {
    commitSelection([]);
    return;
  }

  commitSelection([...allIds.value]);
}

function toggleRow(row: MbTableRow) {
  if (!props.selectable) {
    return;
  }

  const exists = selection.value.includes(row.id);
  if (exists) {
    commitSelection(selection.value.filter((id) => id !== row.id));
    return;
  }

  commitSelection([...selection.value, row.id]);
}

function isSelected(row: MbTableRow) {
  return selection.value.includes(row.id);
}

function onRowClick(row: MbTableRow) {
  emit('row-click', row);
}

function onRowAction(row: MbTableRow) {
  emit('row-action', row);
}

function statusTone(status: string | undefined) {
  const normalized = String(status ?? '').toLowerCase();
  if (normalized.includes('active')) {
    return 'success';
  }

  if (normalized.includes('leave')) {
    return 'additional';
  }

  return 'neutral';
}
</script>

<template>
  <section class="mb-table" :data-selectable="selectable ? 'true' : 'false'" :aria-label="ariaLabel">
    <div class="mb-table__scroller">
      <table>
        <thead>
          <tr>
            <th v-if="selectable" class="mb-table__col-check">
              <button
                type="button"
                class="mb-table__checkbox"
                role="checkbox"
                :aria-checked="allSelected ? 'true' : partlySelected ? 'mixed' : 'false'"
                aria-label="Select all rows"
                @click="toggleAll"
              >
                <span v-if="allSelected" class="mb-table__checkbox-mark">✓</span>
                <span v-else-if="partlySelected" class="mb-table__checkbox-mark">−</span>
              </button>
            </th>
            <th v-for="column in columns" :key="column.key" :style="column.width ? { width: column.width } : undefined">
              <span class="mb-table__head" :data-align="column.align ?? 'left'">
                {{ column.label }}
                <span v-if="column.key === 'user'" class="mb-table__sort" aria-hidden="true">↓</span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="row.id"
            :data-selected="isSelected(row) ? 'true' : 'false'"
            :data-striped="striped && rowIndex % 2 === 1 ? 'true' : 'false'"
            :data-hoverable="hoverable ? 'true' : 'false'"
            @click="onRowClick(row)"
          >
            <td v-if="selectable" class="mb-table__col-check">
              <button
                type="button"
                class="mb-table__checkbox"
                role="checkbox"
                :aria-checked="isSelected(row) ? 'true' : 'false'"
                :aria-label="`Select ${row.name ?? row.id}`"
                @click.stop="toggleRow(row)"
              >
                <span v-if="isSelected(row)" class="mb-table__checkbox-mark">✓</span>
              </button>
            </td>

            <td
              v-for="column in columns"
              :key="`${row.id}-${column.key}`"
              :data-align="column.align ?? 'left'"
            >
              <template v-if="column.type === 'person'">
                <div class="mb-table__person">
                  <span class="mb-table__avatar">{{ row.avatarInitials || 'MB' }}</span>
                  <span class="mb-table__person-text">
                    <span class="mb-table__person-name">{{ row.name }}</span>
                    <span class="mb-table__person-handle">{{ row.handle }}</span>
                  </span>
                </div>
              </template>

              <template v-else-if="column.type === 'status'">
                <span class="mb-table__status" :data-tone="statusTone(String(row[column.key]))">
                  {{ row[column.key] }}
                </span>
              </template>

              <template v-else-if="column.type === 'actions'">
                <button
                  type="button"
                  class="mb-table__action"
                  aria-label="Open row actions"
                  @click.stop="onRowAction(row)"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="12" cy="6" r="1.8" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.8" fill="currentColor" />
                  </svg>
                </button>
              </template>

              <template v-else>
                <span class="mb-table__cell">{{ row[column.key] }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer class="mb-table__footer">
      <nav class="mb-table__pagination" aria-label="Pagination">
        <button type="button" class="mb-table__page is-active">1</button>
        <button type="button" class="mb-table__page">2</button>
        <button type="button" class="mb-table__page">3</button>
        <button type="button" class="mb-table__page">4</button>
        <button type="button" class="mb-table__page">5</button>
        <button type="button" class="mb-table__page">6</button>
        <button type="button" class="mb-table__page">...</button>
        <button type="button" class="mb-table__page">24</button>
        <button type="button" class="mb-table__page mb-table__page--next">
          Next
          <span aria-hidden="true">›</span>
        </button>
      </nav>

      <label class="mb-table__page-size">
        <span>Show Items:</span>
        <select>
          <option selected>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </label>
    </footer>
  </section>
</template>
