import { CoreAssets } from '@noice-com/assets-core';
import { Meta, StoryObj } from '@storybook/react';
import { BiMeteor } from 'react-icons/bi';
import { GiUnicorn } from 'react-icons/gi';

import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    icon: CoreAssets.Icons.PlayCircle,
  },
  argTypes: {
    color: {
      control: { type: 'string' },
      defaultValue: 'currentColor',
      description:
        'The Icon will pass the color into the `var(--noi-color-${color})` css variable.',
    },
    icon: {
      control: { type: 'object' },
      description:
        'The SVG icon to render. This can be an internal or external, `react-icons` icon.',
    },
    size: {
      control: { type: 'number' },
      defaultValue: 24,
      description: 'The size of the icon in pixels.',
    },
    title: {
      control: { type: 'string' },
      description: 'The title of the icon.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A standard Icon component to enable icons to be used the same way regardless of whether they're internal or external. The Icon component also takes base accessibility into consideration.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

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
        story: `By default, the icon will \`currentColor\` as its color. However, override this behavior by passing in a \`color\` prop.
      The Icon will concatenate the \`color\` prop with \`var(--noi-color-\${color})\` to create a CSS variable.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Icon
          {...args}
          color="teal-main"
        />
        <Icon
          {...args}
          color="magenta-main"
        />
        <Icon
          {...args}
          color="status-alert-main"
        />
      </div>
    );
  },
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story: `The Icon component can accept both internal and external icons. In the following story, we will render both COmmonIcons and react-icons.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Icon icon={CoreAssets.Icons.PlayCircle} />
        <Icon icon={GiUnicorn} />
        <Icon icon={BiMeteor} />
        <Icon icon={CoreAssets.Icons.Randomise} />
      </div>
    );
  },
};
export const Size: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The icon can accept, for now, an arbitrary number to define its size. This number should be the `px` value to then be converted to `rem`.',
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Icon
          {...args}
          size={24}
        />
        <Icon
          {...args}
          size={32}
        />
        <Icon
          {...args}
          size={48}
        />
      </div>
    );
  },
};

export const Title: Story = {
  parameters: {
    docs: {
      description: {
        story: `Whenever an icon is used by itself and has meaning, it should be provided a \`title\` prop. This will be used as the \`title\` attribute on the \`<svg>\` element and will also mark the icon as \`role="img"\`.
        
  As an example: If the icon is next to a label or text, it does not need a \`title\` prop. However, if the icon is used by itself, it should have a \`title\` prop to ensure it is handled appropriately for assistive technology.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Icon icon={CoreAssets.Icons.PlayCircle} />
          <span>Play</span>
        </div>

        <Icon
          icon={CoreAssets.Icons.PlayCircle}
          title="Play"
        />
      </div>
    );
  },
};
