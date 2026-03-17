import type { Meta, StoryObj } from '@storybook/vue3'
import MpDaVinciBot from './MpDaVinciBot.vue'

const meta = {
  title: 'AI/MpDaVinciBot V2',
  component: MpDaVinciBot,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Da Vinci Copilot V2
The highly upgraded Da Vinci Copilot acts as a comprehensive, actionable AI assistant.

**Features Demonstrated:**
- **Responsive Layout:** Expanded vs Standard width toggling.
- **Rich Chat Components:** It dynamically renders Data Tables, Charts, KPI Cards, Campaign Previews, Journey Flows, and Content Generators right inside the chat thread.
- **10 Use Case Simulations:** Try clicking on the suggestion cards or typing: \`Top 10 products\`, \`Compare this month\`, \`Create a flash sale\`, etc.
        `,
      },
    },
  },
} satisfies Meta<typeof MpDaVinciBot>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultInteractive: Story = {
  render: () => ({
    components: { MpDaVinciBot },
    setup() {
      const toggleExpand = () => {
        const container = document.querySelector('.copilot-container') as HTMLElement
        if (container) {
          container.style.width = container.style.width === '800px' ? '440px' : '800px'
        }
      }
      return { toggleExpand }
    },
    template: `
      <div style="height: 800px; display: flex; background: #ECEFF1; padding: 24px;">
        <div style="flex: 1; border-radius: 12px; background: white; margin-right: 24px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          <h2 style="font-family: sans-serif; margin-bottom: 24px; color: #333;">Dashboard (App Main)</h2>
          <div style="background: #F5F5F5; height: 120px; border-radius: 8px; margin-bottom: 16px;"></div>
          <div style="background: #F5F5F5; height: 300px; border-radius: 8px;"></div>
        </div>
        <div style="width: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1); flex-shrink: 0; transition: width 0.3s ease;" class="copilot-container">
          <MpDaVinciBot @expand="toggleExpand" />
        </div>
      </div>
    `,
  }),
  args: {} as any,
}

export const CompactView: Story = {
  render: () => ({
    components: { MpDaVinciBot },
    template: `
      <div style="height: 700px; width: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
        <MpDaVinciBot />
      </div>
    `,
  }),
  args: {} as any,
}
