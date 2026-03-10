<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContactsStore } from '@/stores/useContacts'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpStatusChip from '@/components/MpStatusChip.vue'
import MpFormDrawer from '@/components/MpFormDrawer.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const store = useContactsStore()
const search = ref('')
const searchActive = ref(false)
const selected = ref<number[]>([])

// Quick-Add drawer
const addDrawer = ref(false)
const addStep = ref(1)
const newContact = ref({ firstName: '', lastName: '', email: '', phone: '', company: '', role: '', tags: [] as string[], list: 'Newsletter Subscribers', status: 'Active' })
const tagInput = ref('')
function addTag() { if (tagInput.value.trim()) { newContact.value.tags.push(tagInput.value.trim()); tagInput.value = '' } }
function removeTag(i: number) { newContact.value.tags.splice(i, 1) }
function saveContact() { addDrawer.value = false; addStep.value = 1; newContact.value = { firstName:'', lastName:'', email:'', phone:'', company:'', role:'', tags:[], list:'Newsletter Subscribers', status:'Active' }; saveSnack.value = true }

// Import wizard
const importDialog = ref(false)
const importStep = ref(1)
const importList = ref('Newsletter Subscribers')
const fieldMappings = ref([
  { csvCol: 'First Name', field: 'First Name', sample: 'John' },
  { csvCol: 'Last Name',  field: 'Last Name',  sample: 'Doe' },
  { csvCol: 'Email',      field: 'Email',       sample: 'john@example.com' },
  { csvCol: 'Phone',      field: 'Phone',       sample: '+1 555 000 0000' },
  { csvCol: 'Company',    field: 'Company',     sample: 'Acme Corp' },
])
const contactFields = ['Email','First Name','Last Name','Phone','Company','City','Country','Tag','Custom Field 1','— Skip —']
function startImport() { importDialog.value = true; importStep.value = 1 }

// Filters
const filters = ref({
  status: null as string | null,
  list: null as string | null,
  score: null as string | null,
  activity: null as string | null,
})

const filterOptions = {
  status: ['Active', 'Unsubscribed', 'Bounced'],
  list: ['Newsletter Subscribers', 'VIP Customer Circle', 'Win-Back Segment'],
  score: ['80–100 (Hot)', '50–79 (Warm)', '0–49 (Cold)'],
  activity: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Over 90 days'],
}

const filterLabels: Record<string, string> = {
  status: 'Status',
  list: 'List',
  score: 'Score',
  activity: 'Last Activity',
}

const activeFilterEntries = computed(() => {
  return Object.entries(filters.value)
    .filter(([, v]) => v !== null)
    .map(([key, value]) => ({ key, label: `${filterLabels[key]}: ${value}` }))
})


function removeFilter(key: string) {
  filters.value[key as keyof typeof filters.value] = null
}

function clearAllFilters() {
  filters.value = { status: null, list: null, score: null, activity: null }
}

// Table
const headers = [
  { title: 'Contact', key: 'contact', sortable: true },
  { title: 'Company', key: 'company' },
  { title: 'Tags', key: 'tags', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Score', key: 'score', align: 'end' as const },
  { title: 'Last Active', key: 'lastActive', align: 'end' as const },
  { title: '', key: 'actions', align: 'end' as const, sortable: false, width: '48px' },
]

const scoreColor = (s: number) => s >= 80 ? 'success' : s >= 50 ? 'warning' : 'error'
const saveSnack = ref(false)

function selectAll() {
  selected.value = store.contacts.map((_, i) => i)
}
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">

    <!-- Header -->
    <MpPageHeader
      title="Contacts"
      :subtitle="`${store.contacts.length.toLocaleString()} total contacts · ${store.contacts.filter(c => c.status === 'Active').length.toLocaleString()} active`"
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Contacts', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn variant="outlined" prepend-icon="mdi-upload" class="text-none" @click="startImport">Import</v-btn>
        <v-btn class="text-none mp-btn-dark" variant="flat" prepend-icon="mdi-export-variant" @click="startImport">Export</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" @click="addDrawer=true;addStep=1">Add Contact</v-btn>
      </template>
    </MpPageHeader>

    <!-- Single Card: Table with integrated toolbar, filters, bulk bar -->
    <v-card variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">

      <!-- Toolbar: title, search, filter, filter chips, bulk bar -->
      <MpDataTableToolbar
        v-model:search="search"
        title="All Contacts"
        :active-filters="activeFilterEntries"
        :selected-count="selected.length"
        :total-count="store.contacts.length"
        @remove-filter="removeFilter"
        @clear-filters="clearAllFilters"
        @clear-selection="selected = []"
        @select-all="selectAll"
      >
        <template #filter-content>
          <div class="pa-4 pb-2">
            <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
            <div v-for="(options, key) in filterOptions" :key="key" class="mb-3">
              <v-select
                v-model="filters[key as keyof typeof filters]"
                :label="filterLabels[key]"
                :items="options"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              />
            </div>
          </div>
        </template>
        <template #bulk-actions>
          <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-export-variant" rounded="lg">Export</v-btn>
          <v-btn variant="outlined" size="small" class="text-none" prepend-icon="mdi-content-copy" rounded="lg">Duplicate</v-btn>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="outlined" size="small" class="text-none" append-icon="mdi-chevron-down" rounded="lg">More Actions</v-btn>
            </template>
            <v-list density="compact" rounded="lg" elevation="3" class="py-1">
              <v-list-item prepend-icon="mdi-playlist-plus" title="Add to List" />
              <v-list-item prepend-icon="mdi-tag-plus" title="Apply Tag" />
              <v-list-item prepend-icon="mdi-minus-circle-outline" title="Unsubscribe" />
              <v-divider class="my-1" style="opacity: 0.4" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
            </v-list>
          </v-menu>
        </template>
      </MpDataTableToolbar>

      <!-- Data Table -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="store.contacts"
        :search="search"
        show-select
        hover
        density="comfortable"
        :items-per-page="15"
        fixed-header
        class="flex-grow-1"
      >
        <template v-slot:item.contact="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="blue-lighten-5" class="text-primary font-weight-bold mr-3 border" size="36">
              {{ ((item as any).firstName?.[0] ?? '?') }}
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium text-decoration-underline cursor-pointer">
                {{ (item as any).firstName + ' ' + ((item as any).lastName ?? '') }}
              </div>
              <div class="text-caption text-medium-emphasis">{{ (item as any).email }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.company="{ item }">
          <span class="text-body-2">{{ (item as any).company }}</span>
        </template>

        <template v-slot:item.tags="{ item }">
          <div class="d-flex gap-1 flex-wrap py-1">
            <v-chip v-for="tag in (item as any).tags ?? []" :key="tag" size="x-small" variant="tonal" color="secondary">{{ tag }}</v-chip>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <MpStatusChip :status="item.status" type="contact" size="x-small" variant="flat" />
        </template>

        <template v-slot:item.score="{ item }">
          <div class="d-flex align-center gap-2" style="min-width:80px;">
            <v-progress-linear :model-value="item.score" :color="scoreColor(item.score)" rounded height="6" bg-color="surface-variant" style="width:48px;" />
            <span class="text-caption font-weight-bold">{{ item.score }}</span>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" color="medium-emphasis" />
            </template>
            <v-list density="compact" rounded="lg" min-width="160" elevation="3" class="py-1">
              <v-list-item prepend-icon="mdi-open-in-new" title="View" />
              <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
              <v-list-item prepend-icon="mdi-content-copy" title="Duplicate" />
              <v-divider class="my-1" style="opacity: 0.4" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <!-- Quick-Add Contact Drawer -->
    <MpFormDrawer v-model="addDrawer" title="Add Contact" :subtitle="`Step ${addStep} of 2`" :width="460">
      <!-- Step 1: Basic Info -->
      <div v-if="addStep===1">
        <div class="d-flex justify-center mb-5">
          <v-avatar color="primary" size="72" class="text-h4 font-weight-bold">
            {{ newContact.firstName?.[0]?.toUpperCase() ?? '?' }}
          </v-avatar>
        </div>
        <v-row dense>
          <v-col cols="6"><v-text-field v-model="newContact.firstName" label="First Name *" variant="outlined" density="comfortable" /></v-col>
          <v-col cols="6"><v-text-field v-model="newContact.lastName" label="Last Name" variant="outlined" density="comfortable" /></v-col>
          <v-col cols="12"><v-text-field v-model="newContact.email" label="Email Address *" type="email" variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline" /></v-col>
          <v-col cols="12"><v-text-field v-model="newContact.phone" label="Phone Number" variant="outlined" density="comfortable" prepend-inner-icon="mdi-phone-outline" /></v-col>
          <v-col cols="12"><v-text-field v-model="newContact.company" label="Company" variant="outlined" density="comfortable" prepend-inner-icon="mdi-office-building-outline" /></v-col>
        </v-row>
      </div>

      <!-- Step 2: List, Tags, Status -->
      <div v-else>
        <v-select v-model="newContact.list" label="Subscribe to List" :items="['Newsletter Subscribers','VIP Customer Circle','Win-Back Segment','All Contacts']" variant="outlined" density="comfortable" class="mb-4" prepend-inner-icon="mdi-playlist-check" />
        <v-select v-model="newContact.status" label="Status" :items="['Active','Unsubscribed']" variant="outlined" density="comfortable" class="mb-4" />
        <div class="text-subtitle-2 font-weight-bold mb-2">Tags</div>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <v-chip v-for="(t,i) in newContact.tags" :key="i" closable size="small" color="secondary" variant="tonal" @click:close="removeTag(i)">{{ t }}</v-chip>
        </div>
        <v-text-field v-model="tagInput" label="Add tag..." variant="outlined" density="compact" hide-details
          @keyup.enter="addTag" append-inner-icon="mdi-plus" @click:append-inner="addTag" />
      </div>

      <template #footer>
        <v-btn v-if="addStep===2" variant="text" class="text-none" @click="addStep=1">Back</v-btn>
        <v-btn v-else variant="text" class="text-none" @click="addDrawer=false">Cancel</v-btn>
        <v-btn v-if="addStep===1" color="primary" variant="elevated" class="text-none" :disabled="!newContact.email||!newContact.firstName" @click="addStep=2">Next</v-btn>
        <v-btn v-else color="primary" variant="elevated" class="text-none" prepend-icon="mdi-check" @click="saveContact">Save Contact</v-btn>
      </template>
    </MpFormDrawer>

    <!-- Import Wizard Dialog -->
    <v-dialog v-model="importDialog" max-width="680" rounded="xl" persistent>
      <v-card rounded="xl">
        <v-stepper v-model="importStep" :items="['Upload File','Map Fields','Review & Import']" flat>
          <template v-slot:item.1>
            <div class="pa-6">
              <div class="text-subtitle-1 font-weight-bold mb-1">Upload your CSV file</div>
              <div class="text-body-2 text-medium-emphasis mb-5">Supported: CSV, XLSX. Max 25MB. First row should be column headers.</div>
              <v-card variant="outlined" rounded="xl" class="pa-8 text-center" style="border-style:dashed;cursor:pointer;">
                <v-icon size="48" color="primary" class="mb-3">mdi-cloud-upload-outline</v-icon>
                <div class="text-body-1 font-weight-medium mb-1">Drag & drop file here</div>
                <div class="text-caption text-medium-emphasis mb-4">or click to browse</div>
                <v-btn variant="outlined" color="primary" class="text-none" prepend-icon="mdi-folder-open">Browse File</v-btn>
              </v-card>
              <v-select v-model="importList" label="Import into list" :items="['Newsletter Subscribers','VIP Customer Circle','Win-Back Segment']" variant="outlined" density="comfortable" class="mt-4" />
            </div>
          </template>
          <template v-slot:item.2>
            <div class="pa-6">
              <div class="text-subtitle-1 font-weight-bold mb-1">Map CSV columns to contact fields</div>
              <div class="text-body-2 text-medium-emphasis mb-4">We auto-detected {{ fieldMappings.length }} columns. Adjust mappings if needed.</div>
              <v-table density="compact">
                <thead><tr><th>CSV Column</th><th>Sample Value</th><th>Maps To</th></tr></thead>
                <tbody>
                  <tr v-for="(m,i) in fieldMappings" :key="i">
                    <td class="py-2 text-body-2 font-weight-medium">{{ m.csvCol }}</td>
                    <td class="text-caption text-medium-emphasis">{{ m.sample }}</td>
                    <td>
                      <v-select v-model="m.field" :items="contactFields" variant="outlined" density="compact" hide-details style="min-width:180px;" />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </template>
          <template v-slot:item.3>
            <div class="pa-6">
              <div class="text-subtitle-1 font-weight-bold mb-4">Review before importing</div>
              <v-row dense class="mb-4">
                <v-col cols="4"><v-card variant="tonal" color="primary" rounded="xl" class="pa-4 text-center"><div class="text-h4 font-weight-bold">1,284</div><div class="text-caption">Rows detected</div></v-card></v-col>
                <v-col cols="4"><v-card variant="tonal" color="success" rounded="xl" class="pa-4 text-center"><div class="text-h4 font-weight-bold">1,241</div><div class="text-caption">Valid contacts</div></v-card></v-col>
                <v-col cols="4"><v-card variant="tonal" color="warning" rounded="xl" class="pa-4 text-center"><div class="text-h4 font-weight-bold">43</div><div class="text-caption">Skipped (invalid)</div></v-card></v-col>
              </v-row>
              <v-alert type="info" variant="tonal" density="compact" rounded="xl" class="text-body-2 mb-3">
                <strong>Duplicates:</strong> 23 contacts with matching emails will be <strong>merged</strong> (fields updated, not replaced).
              </v-alert>
              <v-alert type="success" variant="tonal" density="compact" rounded="xl" class="text-body-2">
                Importing into: <strong>{{ importList }}</strong>
              </v-alert>
            </div>
          </template>

          <template v-slot:actions>
            <div class="pa-4 border-t d-flex justify-space-between w-100">
              <v-btn variant="text" class="text-none" @click="importStep > 1 ? importStep-- : importDialog=false">
                {{ importStep === 1 ? 'Cancel' : 'Back' }}
              </v-btn>
              <v-btn v-if="importStep < 3" color="primary" variant="elevated" class="text-none" @click="importStep++">Continue</v-btn>
              <v-btn v-else color="success" variant="elevated" class="text-none" prepend-icon="mdi-upload" @click="importDialog=false;saveSnack=true">Import 1,241 Contacts</v-btn>
            </div>
          </template>
        </v-stepper>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="saveSnack" :timeout="2500" color="success" rounded="pill" location="bottom center">
      <div class="d-flex align-center gap-2"><v-icon>mdi-check-circle</v-icon> Contact saved successfully</div>
    </v-snackbar>
  </div>
</template>

<style scoped>
.mp-btn-dark {
  background: rgb(var(--v-theme-on-surface));
  color: rgb(var(--v-theme-surface));
}
.mp-btn-dark:hover {
  opacity: 0.88;
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

:deep(.v-data-table > .v-divider) {
  opacity: 0.15;
}

:deep(.v-data-table thead tr) {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
}
</style>
