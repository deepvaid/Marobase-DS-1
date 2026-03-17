import { ref, watch } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import MbSlider from '../../../../../packages/marobase-ui/src/components/MbSlider.vue';
import type { MbSliderProps, MbSliderState } from '../../../../../packages/marobase-ui/src/components/MbSlider.types';

const stateOptions: MbSliderState[] = ['default', 'hover', 'focus', 'pressed', 'disabled'];

const meta: Meta<MbSliderProps> = {
  title: 'Components/MbSlider',
  component: MbSlider,
  tags: ['autodocs'],
  args: {
    modelValue: 70,
    rangeStart: null,
    min: 0,
    max: 100,
    step: 1,
    state: 'default',
    label: 'Label',
    showTicks: true,
    showValueLabels: true,
    disabled: false,
    hint: ''
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: stateOptions
    }
  },
  render: (args) => ({
    components: { MbSlider },
    setup() {
      const end = ref(Number(args.modelValue ?? 0));
      const start = ref<number | null>(args.rangeStart ?? null);

      watch(
        () => args.modelValue,
        (next) => {
          end.value = Number(next ?? 0);
        }
      );

      watch(
        () => args.rangeStart,
        (next) => {
          start.value = next ?? null;
        }
      );

      return { args, end, start };
    },
    template: `
      <div style="display:grid;gap:20px;align-items:start;justify-items:start;padding:24px;">
        <MbSlider
          v-bind="args"
          :model-value="end"
          :range-start="start"
          @update:modelValue="end = $event"
          @update:rangeStart="start = $event"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: {
    label: 'Price range',
    rangeStart: 35,
    modelValue: 80
  }
};

export const States: Story = {
  render: () => ({
    components: { MbSlider },
    template: `
      <div style="display:grid;gap:24px;padding:24px;">
        <MbSlider label="Default" :model-value="70" state="default" />
        <MbSlider label="Hover" :model-value="70" state="hover" />
        <MbSlider label="Focus" :model-value="70" state="focus" />
        <MbSlider label="Pressed" :model-value="70" state="pressed" />
        <MbSlider label="Disabled" :model-value="70" state="disabled" :disabled="true" />
        <MbSlider label="Range" :range-start="25" :model-value="75" state="default" />
      </div>
    `
  })
};
