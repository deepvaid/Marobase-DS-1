import type { Meta, StoryObj } from '@storybook/vue3'
import { VAvatar } from 'vuetify/components'

interface AvatarArgs {
  text: string
  size: number
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  rounded: '0' | 'sm' | 'lg' | 'xl' | 'pill' | 'circle'
  variant: 'flat' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'plain'
  icon: string
  image: string
}

const meta = {
  title: 'Base/Avatars',
  component: VAvatar,
  tags: ['autodocs'],

  argTypes: {
    text: {
      control: 'text',
      description: 'Text content (initials) displayed inside the avatar.',
      table: { category: 'Content' },
    },
    size: {
      control: { type: 'range', min: 16, max: 128, step: 4 },
      description: 'Avatar size in pixels.',
      table: { category: 'Appearance', defaultValue: { summary: '40' } },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Background color of the avatar.',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    rounded: {
      control: 'select',
      options: ['0', 'sm', 'lg', 'xl', 'pill', 'circle'],
      description: 'Border-radius preset. Use `circle` for fully round avatars.',
      table: { category: 'Appearance', defaultValue: { summary: 'circle' } },
    },
    variant: {
      control: 'select',
      options: ['flat', 'tonal', 'outlined', 'elevated', 'text', 'plain'],
      description: 'Visual style of the avatar.',
      table: { category: 'Appearance', defaultValue: { summary: 'flat' } },
    },
    icon: {
      control: 'text',
      description: 'MDI icon class (e.g. `mdi-account`). Leave empty for text/image avatars.',
      table: { category: 'Icons', defaultValue: { summary: '—' } },
    },
    image: {
      control: 'text',
      description: 'Image URL. When set, displays an image instead of text/icon.',
      table: { category: 'Content', defaultValue: { summary: '—' } },
    },
  },

  args: {
    text: 'JC',
    size: 48,
    color: 'primary',
    rounded: 'circle',
    variant: 'flat',
    icon: '',
    image: '',
  },

  parameters: {
    docs: {
      description: {
        component: `### Overview
Vuetify's v-avatar component for displaying user photos, initials, or icons. Used in lists, headers, and comments to identify people or entities.

Use the **Playground** story to interactively configure avatar properties via the Controls panel.

### 🟢 Do's
- Use consistent sizes per context (small for tables, medium for profiles, large for hero sections)
- Provide meaningful fallback initials when images are unavailable
- Use semantic colors for icon-based avatars (primary for user, success for agents, etc.)
- Group avatars for user stacks with negative margin for overlap
- Include alt text or title attributes for accessibility

### 🔴 Don'ts
- Use avatars for decorative icons (use v-icon instead)
- Mix avatar sizes in the same row or component
- Use overly large avatars in tables (max 40px)
- Forget to add hover effects when avatars are clickable
- Use blurry or low-res placeholder images

### 💡 Best Practices
- Match avatar size to context: 24px (tight tables), 32px (lists), 40-48px (comments), 64px+ (profiles)
- Use https://i.pravatar.cc/ for consistent placeholder avatars
- Display initials in uppercase for clarity (Jane Smith → JS)
- Stack avatars with -12px margin for overlapping effect
- Add tooltips showing user names on hover in profile contexts`,
      },
    },
  },
} satisfies Meta<AvatarArgs>

export default meta
type Story = StoryObj<AvatarArgs>

// ── 1. Playground (interactive) ─────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    setup() { return { args } },
    template: `
      <v-avatar
        :size="args.size"
        :color="args.color"
        :rounded="args.rounded"
        :variant="args.variant"
        :icon="args.icon || undefined"
        :image="args.image || undefined"
      >
        <template v-if="!args.icon && !args.image">{{ args.text }}</template>
      </v-avatar>
    `,
  }),
}

// ── 2. Sizes ────────────────────────────────────────────────────────────────
/** Standard size scale from 24 px to 64 px. */
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="d-flex align-center gap-3">
        <v-avatar size="24" color="primary">JS</v-avatar>
        <v-avatar size="32" color="primary">AM</v-avatar>
        <v-avatar size="40" color="primary">BS</v-avatar>
        <v-avatar size="48" color="primary">LA</v-avatar>
        <v-avatar size="64" color="primary">CH</v-avatar>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 3. With Images ──────────────────────────────────────────────────────────
/** Avatar displaying user photos via the `image` prop. */
export const WithImages: Story = {
  render: () => ({
    template: `
      <div class="d-flex gap-3">
        <v-avatar v-for="n in 5" :key="n" size="48" :image="'https://i.pravatar.cc/150?img=' + n" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 4. Colors ───────────────────────────────────────────────────────────────
/** Semantic color variants with icons. */
export const Colors: Story = {
  render: () => ({
    template: `
      <div class="d-flex gap-3">
        <v-avatar size="40" color="primary" icon="mdi-account" />
        <v-avatar size="40" color="secondary" icon="mdi-account" />
        <v-avatar size="40" color="success" icon="mdi-check-circle" />
        <v-avatar size="40" color="warning" icon="mdi-alert" />
        <v-avatar size="40" color="error" icon="mdi-close-circle" />
        <v-avatar size="40" color="info" icon="mdi-information" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}

// ── 5. Avatar Group ─────────────────────────────────────────────────────────
/** Overlapping avatar stack for team member display. */
export const AvatarGroup: Story = {
  render: () => ({
    template: `
      <div>
        <p class="text-medium-emphasis mb-3">Team members:</p>
        <div class="d-flex" style="margin-left: 8px;">
          <v-avatar
            v-for="(user, index) in users"
            :key="user.initials"
            size="40"
            color="primary"
            :style="{ marginLeft: index > 0 ? '-12px' : '0' }"
            :title="user.name"
          >
            {{ user.initials }}
          </v-avatar>
        </div>
        <p class="text-caption mt-3">{{ users.length }} team members assigned</p>
      </div>
    `,
    setup() {
      const users = [
        { name: 'Jane Cooper', initials: 'JC' },
        { name: 'Arlene McCoy', initials: 'AM' },
        { name: 'Brooklyn Simmons', initials: 'BS' },
        { name: 'Leslie Alexander', initials: 'LA' },
      ]
      return { users }
    },
  }),
  parameters: { controls: { disable: true } },
}
