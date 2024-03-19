import { Meta, StoryObj } from '@storybook/react';

import { NoiceLogo } from './NoiceLogo';

const meta: Meta<typeof NoiceLogo> = {
  title: 'Noice Logo',
  component: NoiceLogo,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: {
        type: 'select',
        required: true,
      },
      description: 'Defines which color scheme to use.',
      options: ['black', 'black-flat', 'dark', 'light', 'light-flat', 'spectrum'],
    },
    variant: {
      control: {
        type: 'select',
        required: true,
      },
      description: 'Defines which logo style to use.',
      options: ['horizontal', 'mark', 'type', 'vertical'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A standard way of displaying the Noice logo. The logo renders the base <code>Image</code> component under the hood and can be sized using <code>className</code> or manual <code>height</code> and <code>width</code> attributes.
        
> Note: Not all colors and variants are compatible. See below for all available combinations.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoiceLogo>;

export const Basic: Story = {
  args: {
    color: 'light',
    variant: 'horizontal',
  },
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story: `All 'horizontal' variants of the Noice logo.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <NoiceLogo
          color="dark"
          height={100}
          variant="horizontal"
        />
        <NoiceLogo
          color="light"
          height={100}
          variant="horizontal"
        />
      </div>
    );
  },
};

export const Mark: Story = {
  parameters: {
    docs: {
      description: {
        story: `All 'mark' variants of the Noice logo.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <NoiceLogo
          color="black"
          height={100}
          variant="mark"
        />
        <NoiceLogo
          color="black-flat"
          height={100}
          variant="mark"
        />
        <NoiceLogo
          color="light"
          height={100}
          variant="mark"
        />
        <NoiceLogo
          color="light-flat"
          height={100}
          variant="mark"
        />
        <NoiceLogo
          color="spectrum"
          height={100}
          variant="mark"
        />
      </div>
    );
  },
};

export const Type: Story = {
  parameters: {
    docs: {
      description: {
        story: `All 'type' variants of the Noice logo.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <NoiceLogo
          color="dark"
          height={100}
          variant="type"
        />
        <NoiceLogo
          color="light"
          height={100}
          variant="type"
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: `All 'vertical' variants of the Noice logo.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <NoiceLogo
          color="dark"
          height={100}
          variant="vertical"
        />
        <NoiceLogo
          color="light"
          height={100}
          variant="vertical"
        />
      </div>
    );
  },
};
