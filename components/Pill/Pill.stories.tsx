import { CoreAssets } from '@noice-com/assets-core';
import { Meta, StoryObj } from '@storybook/react';

import { Pill, pillColors } from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Pill',
  component: Pill,
  tags: ['autodocs'],
  args: {
    color: 'gradient-green-teal',
    label: 'Pill',
  },
  argTypes: {
    label: {
      control: { type: 'string' },
      description: 'The label of the pill.',
    },
    color: {
      control: { type: 'string' },
      defaultValue: 'currentColor',
      description:
        'Define the color palette of the pill. The color value will be passed into the `var(--noi-${color})` css variable.',
      options: pillColors,
    },
    iconEnd: {
      control: { type: 'object' },
      description: 'Provide an `SvgComponent` to be rendered on the pill.',
    },
    iconStart: {
      control: { type: 'object' },
      description: 'Provide an `SvgComponent` to be rendered on the pill.',
    },
    title: {
      control: { type: 'string' },
      description:
        'The title of the pill, important to use when the icon explains the meaning of the label.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A component that renders a \`<span>\` with a label and an optional icon, with specific styling to be used as a pill.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
};

export const Color: Story = {
  parameters: {
    docs: {
      description: {
        story: `By default, the Pill will have \`darkBlue\` as its color. However, override this behavior by passing in a \`color\` prop.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Pill
          {...args}
          color="gradient-green-teal"
        />
        <Pill
          {...args}
          color="gradient-violet-magenta"
        />
        <Pill
          {...args}
          color="gradient-violet"
        />
        <Pill
          {...args}
          color="blue-950"
        />
        <Pill
          {...args}
          color="blue-750"
        />
        <Pill
          {...args}
          color="gray-950"
        />
        <Pill
          {...args}
          color="light-main"
        />
        <Pill
          {...args}
          color="status-error-main"
        />
      </div>
    );
  },
};

export const Icon: Story = {
  parameters: {
    docs: {
      description: {
        story: `The Pill component can have an icon`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Pill
          {...args}
          iconStart={CoreAssets.Icons.Friends}
        />
        <Pill
          {...args}
          iconEnd={CoreAssets.Icons.User}
        />
      </div>
    );
  },
};

export const Title: Story = {
  parameters: {
    docs: {
      description: {
        story: `The title is highly recommended when the icon explains the meaning of the label, like when it is clock, it shows some time`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Pill
          {...args}
          iconStart={CoreAssets.Icons.Friends}
          title="Friends"
        />
        <Pill
          {...args}
          iconEnd={CoreAssets.Icons.User}
          title="Viewers"
        />
      </div>
    );
  },
};
