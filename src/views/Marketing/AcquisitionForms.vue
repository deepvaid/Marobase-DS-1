<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MpPageHeader from '@/components/MpPageHeader.vue'
import MpDataTableToolbar from '@/components/MpDataTableToolbar.vue'

const router = useRouter()

const forms = ref([
  { id:1, name:'Main Website Pop-up',   type:'Modal',    views:45000, conversions:1200, rate:2.7, status:'Active',  updated:'Mar 5, 2026' },
  { id:2, name:'Blog Sidebar Form',      type:'Embedded', views:85000, conversions:350,  rate:0.4, status:'Active',  updated:'Feb 28, 2026' },
  { id:3, name:'Exit Intent 2026',       type:'Modal',    views:12000, conversions:45,   rate:0.4, status:'Draft',   updated:'Mar 1, 2026' },
  { id:4, name:'Holiday VIP Sign-up',    type:'Modal',    views:0,     conversions:0,    rate:0,   status:'Draft',   updated:'Mar 7, 2026' },
  { id:5, name:'Footer Newsletter',      type:'Embedded', views:32000, conversions:880,  rate:2.8, status:'Paused',  updated:'Jan 15, 2026' },
])

const statusColor = (s: string) => ({ Active:'success', Draft:'grey', Paused:'warning' })[s as string] ?? 'default'
const statusIcon  = (s: string) => ({ Active:'mdi-check-circle', Draft:'mdi-pencil-circle', Paused:'mdi-pause-circle' })[s as string] ?? 'mdi-help'

// Template chooser dialog
const chooseDialog = ref(false)
const selectedTemplate = ref<number|null>(null)
const templateSearch = ref('')

const templates = [
  { id:0,  name:'Blank Canvas',            type:'Modal',    desc:'Start from scratch with full creative control', icon:'mdi-vector-square', color:'grey', popular:false },
  { id:1,  name:'Newsletter Sign-up',       type:'Modal',    desc:'Simple email capture with high conversion rate', icon:'mdi-email-newsletter', color:'primary', popular:true },
  { id:2,  name:'Exit Intent',              type:'Modal',    desc:'Appear just as visitors are about to leave', icon:'mdi-exit-to-app', color:'warning', popular:true },
  { id:3,  name:'Discount Offer',           type:'Modal',    desc:'Offer a coupon code in exchange for email', icon:'mdi-ticket-percent', color:'success', popular:true },
  { id:4,  name:'VIP Club Invite',          type:'Modal',    desc:'Exclusive membership feel for top customers', icon:'mdi-crown', color:'warning', popular:false },
  { id:5,  name:'Product Announcement',     type:'Modal',    desc:'Announce new products with email capture', icon:'mdi-new-box', color:'secondary', popular:false },
  { id:6,  name:'Sidebar Newsletter',       type:'Embedded', desc:'Non-intrusive embedded form for blog/content pages', icon:'mdi-view-split-vertical', color:'primary', popular:true },
  { id:7,  name:'Footer Subscribe',         type:'Embedded', desc:'Footer-anchored form following GDPR best practices', icon:'mdi-page-layout-footer', color:'info', popular:false },
  { id:8,  name:'Two-Step Lead Capture',    type:'Modal',    desc:'Button click reveals form to improve qualified leads', icon:'mdi-numeric-2-circle', color:'purple', popular:false },
  { id:9,  name:'Countdown Urgency',        type:'Modal',    desc:'Timer-driven popup for limited-time offers', icon:'mdi-timer-outline', color:'error', popular:false },
]

const filterType = ref('All')
const filteredTemplates = computed(() =>
  templates.filter(t =>
    (filterType.value === 'All' || t.type === filterType.value) &&
    (!templateSearch.value || t.name.toLowerCase().includes(templateSearch.value.toLowerCase()))
  )
)

function openBuilder() {
  if (selectedTemplate.value === null) return
  chooseDialog.value = false
  router.push('/acquisition/forms/create')
}

const viewMode = ref<'grid'|'list'>('grid')
const search = ref('')

const filters = ref({
  status: '',
  type: '',
})

const activeFilterEntries = computed(() => {
  const entries: Array<{ key: string; label: string }> = []
  if (filters.value.status) entries.push({ key: 'status', label: `Status: ${filters.value.status}` })
  if (filters.value.type) entries.push({ key: 'type', label: `Type: ${filters.value.type}` })
  return entries
})

function removeFilter(key: string) {
  if (key === 'status') filters.value.status = ''
  if (key === 'type') filters.value.type = ''
}

function clearAllFilters() {
  filters.value.status = ''
  filters.value.type = ''
}
</script>

<template>
  <div class="h-100 d-flex flex-column gap-5">

    <!-- Header -->
    <MpPageHeader
      title="Acquisition Forms"
      subtitle="Capture leads and grow your audience across your channels."
      :breadcrumbs="[
        { title: 'Home', to: '/dashboard' },
        { title: 'Marketing', disabled: true },
        { title: 'Acquisition Forms', disabled: true },
      ]"
    >
      <template #actions>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="text-none" @click="chooseDialog=true">Create Form</v-btn>
      </template>
    </MpPageHeader>

    <!-- KPIs Row -->
    <div class="d-flex gap-4">
      <v-col v-for="s in [
        {label:'Total Views',      value:forms.reduce((a,f)=>a+f.views,0).toLocaleString(), color:'primary', icon:'mdi-eye-outline'},
        {label:'Total Conversions',value:forms.reduce((a,f)=>a+f.conversions,0).toLocaleString(), color:'success', icon:'mdi-account-plus'},
        {label:'Avg. Conv. Rate',  value:((forms.reduce((a,f)=>a+f.rate,0)/forms.length)).toFixed(1)+'%', color:'warning', icon:'mdi-percent'},
        {label:'Active Forms',     value:forms.filter(f=>f.status==='Active').length, color:'secondary', icon:'mdi-check-circle-outline'},
      ]" :key="s.label" cols="12" sm="3">
        <v-card variant="flat" border rounded="xl" class="pa-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase">{{ s.label }}</div>
            <v-icon :color="s.color" size="18">{{ s.icon }}</v-icon>
          </div>
          <div class="text-h5 font-weight-bold" :class="`text-${s.color}`">{{ s.value }}</div>
        </v-card>
      </v-col>
    </div>

    <!-- Filter chips -->
    <div class="d-flex align-center gap-2 overflow-x-auto hide-scrollbar mt-3">
      <v-btn-toggle v-model="viewMode" density="comfortable" mandatory class="bg-transparent" selected-class="bg-blue-darken-3 text-white">
        <v-btn v-for="v in [{val:'grid',icon:'grid',label:'Grid'},{val:'list',icon:'format-list-bulleted',label:'List'}]" :key="v.val" :value="v.val" rounded="pill" variant="flat" size="small"
               class="text-none px-4 mr-2" :class="viewMode === v.val ? '' : 'bg-grey-lighten-4 text-medium-emphasis border'">
          <v-icon size="small" class="mr-1">mdi-{{ v.icon }}</v-icon> {{ v.label }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- Grid View -->
    <v-row v-if="viewMode==='grid'" dense>
      <v-col v-for="form in forms.filter(f=>!search||f.name.toLowerCase().includes(search.toLowerCase()))" :key="form.id" cols="12" sm="6" md="4">
        <v-card variant="flat" border rounded="xl" class="form-card overflow-hidden">
          <!-- Preview thumbnail -->
          <div class="form-preview d-flex align-center justify-center pa-4" style="height:120px;background:linear-gradient(135deg,rgb(var(--v-theme-primary),0.08),rgb(var(--v-theme-secondary),0.05));">
            <v-icon size="48" color="primary" style="opacity:0.4;">{{ form.type==='Modal'?'mdi-dock-window':'mdi-view-split-vertical' }}</v-icon>
          </div>
          <div class="pa-4">
            <div class="d-flex align-start justify-space-between mb-2">
              <div>
                <div class="text-body-1 font-weight-bold mb-0.5">{{ form.name }}</div>
                <div class="d-flex align-center gap-2">
                  <v-chip size="x-small" variant="outlined" color="secondary">{{ form.type }}</v-chip>
                  <v-chip :color="statusColor(form.status)" :prepend-icon="statusIcon(form.status)" size="x-small" variant="flat">{{ form.status }}</v-chip>
                </div>
              </div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
                </template>
                <v-list density="compact" rounded="xl" nav min-width="160" elevation="8">
                  <v-list-item prepend-icon="mdi-pencil-outline" @click="router.push('/acquisition/forms/create')">Edit in Builder</v-list-item>
                  <v-list-item prepend-icon="mdi-content-copy">Duplicate</v-list-item>
                  <v-list-item prepend-icon="mdi-code-tags">Get Embed Code</v-list-item>
                  <v-divider></v-divider>
                  <v-list-item prepend-icon="mdi-delete-outline" class="text-error">Delete</v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="d-flex gap-4 mt-3 pt-3 border-t">
              <div class="text-center flex-grow-1">
                <div class="text-h6 font-weight-bold">{{ form.views.toLocaleString() }}</div>
                <div class="text-caption text-medium-emphasis">Views</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="text-center flex-grow-1">
                <div class="text-h6 font-weight-bold text-success">{{ form.conversions.toLocaleString() }}</div>
                <div class="text-caption text-medium-emphasis">Conversions</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="text-center flex-grow-1">
                <div class="text-h6 font-weight-bold text-primary">{{ form.rate }}%</div>
                <div class="text-caption text-medium-emphasis">Conv. Rate</div>
              </div>
            </div>
          </div>
          <div class="px-4 pb-4">
            <v-btn block variant="outlined" color="primary" size="small" class="text-none" prepend-icon="mdi-pencil-outline" @click="router.push('/acquisition/forms/create')">Edit in Builder</v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Empty state / add card -->
      <v-col cols="12" sm="6" md="4">
        <v-card variant="outlined" rounded="xl" class="pa-6 d-flex flex-column align-center justify-center text-center cursor-pointer add-card" style="min-height:280px;border-style:dashed;" @click="chooseDialog=true">
          <v-icon size="40" color="primary" class="mb-3">mdi-plus-circle-outline</v-icon>
          <div class="text-body-1 font-weight-bold mb-1">Create New Form</div>
          <div class="text-caption text-medium-emphasis">Choose a template and launch the form builder</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- List View -->
    <v-card v-else variant="flat" border rounded="xl" class="flex-grow-1 d-flex flex-column overflow-hidden">
      <MpDataTableToolbar
        v-model:search="search"
        title="Forms"
        search-placeholder="Search forms..."
        :active-filters="activeFilterEntries"
        :total-count="forms.length"
        @remove-filter="removeFilter"
        @clear-filters="clearAllFilters"
      >
        <template #filter-content>
          <div class="pa-4 pb-2">
            <div class="text-subtitle-2 font-weight-bold mb-3">Filter by</div>
            <v-select
              v-model="filters.status"
              label="Status"
              :items="['', 'Active', 'Draft', 'Paused']"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />
            <v-select
              v-model="filters.type"
              label="Type"
              :items="['', 'Modal', 'Embedded']"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />
          </div>
        </template>
      </MpDataTableToolbar>

      <v-data-table
        :headers="[{title:'Form',key:'name'},{title:'Type',key:'type'},{title:'Views',key:'views',align:'end'},{title:'Conversions',key:'conversions',align:'end'},{title:'Rate',key:'rate',align:'end'},{title:'Status',key:'status'},{title:'Updated',key:'updated'},{title:'',key:'actions',align:'end',sortable:false}]"
        :items="forms" hover density="comfortable" :search="search" class="flex-grow-1">
        <template v-slot:item.name="{ item }">
          <div class="py-1"><div class="text-body-2 font-weight-medium">{{ item.name }}</div></div>
        </template>
        <template v-slot:item.type="{ item }"><v-chip size="x-small" variant="outlined" color="secondary">{{ item.type }}</v-chip></template>
        <template v-slot:item.views="{ item }"><span class="font-weight-medium">{{ item.views.toLocaleString() }}</span></template>
        <template v-slot:item.conversions="{ item }"><span class="font-weight-medium text-success">{{ item.conversions.toLocaleString() }}</span></template>
        <template v-slot:item.rate="{ item }"><span class="font-weight-bold text-primary">{{ item.rate }}%</span></template>
        <template v-slot:item.status="{ item }"><v-chip :color="statusColor(item.status)" size="x-small" variant="flat">{{ item.status }}</v-chip></template>
        <template v-slot:item.actions>
          <div class="ActionButtons d-flex justify-end gap-1">
            <v-tooltip text="Edit in Builder" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="primary" @click="router.push('/acquisition/forms/create')"></v-btn></template></v-tooltip>
            <v-tooltip text="Duplicate" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-content-copy" variant="text" size="small"></v-btn></template></v-tooltip>
            <v-tooltip text="Delete" location="top"><template v-slot:activator="{props}"><v-btn v-bind="props" icon="mdi-delete-outline" variant="text" size="small" color="error"></v-btn></template></v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Template Chooser Dialog ──────────────────────────────── -->
    <v-dialog v-model="chooseDialog" max-width="820" rounded="xl">
      <v-card rounded="xl">
        <div class="pa-5 border-b d-flex align-center justify-space-between">
          <div>
            <div class="text-h6 font-weight-bold">Choose a Template</div>
            <div class="text-caption text-medium-emphasis">Pick a starting point or begin from scratch</div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="chooseDialog=false"></v-btn>
        </div>

        <div class="pa-5">
          <div class="d-flex align-center gap-3 mb-4">
            <v-btn-toggle v-model="filterType" density="compact" variant="outlined" divided rounded="lg" mandatory>
              <v-btn v-for="t in ['All','Modal','Embedded']" :key="t" :value="t" size="small" class="text-none px-4">{{ t }}</v-btn>
            </v-btn-toggle>
            <v-text-field v-model="templateSearch" prepend-inner-icon="mdi-magnify" placeholder="Search templates…"
              variant="outlined" density="compact" hide-details class="flex-grow-1"></v-text-field>
          </div>

          <!-- Popular badge row -->
          <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase mb-3" v-if="filteredTemplates.some(t=>t.popular)">⚡ Most Popular</div>

          <v-row dense style="max-height:420px;overflow-y:auto;">
            <v-col v-for="tmpl in filteredTemplates" :key="tmpl.id" cols="12" sm="6" md="4">
              <v-card
                @click="selectedTemplate=tmpl.id"
                :variant="selectedTemplate===tmpl.id?'tonal':'outlined'"
                :color="selectedTemplate===tmpl.id?'primary':'default'"
                rounded="xl" class="pa-4 cursor-pointer template-card h-100"
                :class="{selected:selectedTemplate===tmpl.id}">
                <div class="d-flex align-start justify-space-between mb-2">
                  <v-icon :color="tmpl.color" size="28">{{ tmpl.icon }}</v-icon>
                  <div class="d-flex gap-1">
                    <v-chip v-if="tmpl.popular" color="primary" size="x-small" variant="flat" class="font-weight-bold">Popular</v-chip>
                    <v-chip size="x-small" variant="outlined">{{ tmpl.type }}</v-chip>
                  </div>
                </div>
                <div class="text-body-2 font-weight-bold mb-1">{{ tmpl.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ tmpl.desc }}</div>
                <v-icon v-if="selectedTemplate===tmpl.id" color="primary" class="selected-check" size="20">mdi-check-circle</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div class="pa-5 border-t d-flex justify-space-between align-center">
          <v-btn variant="text" class="text-none" @click="chooseDialog=false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" class="text-none" :disabled="selectedTemplate===null"
            prepend-icon="mdi-pencil-ruler" @click="openBuilder">Open Builder →</v-btn>
        </div>
      </v-card>
    </v-dialog>
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
.gap-5 { gap: 20px; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.form-card { transition: all 0.15s ease; }
.form-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important; }
.add-card { transition: all 0.15s; }
.add-card:hover { border-color: rgb(var(--v-theme-primary)) !important; background: rgba(var(--v-theme-primary),0.04); }
.template-card { position: relative; transition: all 0.15s; }
.template-card:hover { border-color: rgb(var(--v-theme-primary)) !important; }
.template-card.selected { border-color: rgb(var(--v-theme-primary)) !important; }
.selected-check { position:absolute; top:8px; right:8px; }
.ActionButtons { opacity: 0; transition: opacity 0.2s; }
tr:hover .ActionButtons { opacity: 1; }
</style>
