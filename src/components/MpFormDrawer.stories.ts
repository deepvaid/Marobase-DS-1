import type { Meta, StoryObj } from '@storybook/vue3'
import MpFormDrawer from './MpFormDrawer.vue'
import { ref } from 'vue'

const meta = {
  title: 'Overlays/MpFormDrawer',
  component: MpFormDrawer,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    width: { control: { type: 'number', min: 320, max: 800, step: 40 } },
  },
} satisfies Meta<typeof MpFormDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MpFormDrawer },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <v-btn color="primary" @click="open = true">Open Drawer</v-btn>
        <MpFormDrawer v-bind="args" v-model="open">
          <v-text-field label="Campaign Name" class="mb-4" />
          <v-select label="Type" :items="['Regular', 'A/B Test', 'Automated']" class="mb-4" />
          <v-text-field label="Subject Line" class="mb-4" />
          <v-textarea label="Preview Text" rows="3" />
          <template #footer>
            <v-spacer />
            <v-btn variant="outlined" @click="open = false" class="mr-2">Cancel</v-btn>
            <v-btn color="primary">Save Campaign</v-btn>
          </template>
        </MpFormDrawer>
      </div>
    `,
  }),
  args: {
    title: 'New Campaign',
    subtitle: 'Create a new email campaign',
  },
}

export const ContactForm: Story = {
  render: (args) => ({
    components: { MpFormDrawer },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <v-btn color="primary" @click="open = true">Add Contact</v-btn>
        <MpFormDrawer v-bind="args" v-model="open">
          <v-row>
            <v-col cols="6"><v-text-field label="First Name" /></v-col>
            <v-col cols="6"><v-text-field label="Last Name" /></v-col>
          </v-row>
          <v-text-field label="Email" class="mt-4" />
          <v-text-field label="Phone" class="mt-4" />
          <v-combobox label="Tags" chips multiple class="mt-4" />
          <template #footer>
            <v-spacer />
            <v-btn variant="outlined" @click="open = false" class="mr-2">Cancel</v-btn>
            <v-btn color="primary">Add Contact</v-btn>
          </template>
        </MpFormDrawer>
      </div>
    `,
  }),
  args: {
    title: 'New Contact',
    subtitle: 'Add a contact to your audience',
    width: 520,
  },
}
