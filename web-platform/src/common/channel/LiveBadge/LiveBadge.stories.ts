import { Meta, StoryObj } from '@storybook/react';

import { LiveBadge } from './LiveBadge';

const meta: Meta<typeof LiveBadge> = {
  title: 'Live Badge',
  component: LiveBadge,
  tags: ['autodocs'],
  args: {},
  parameters: {
    docs: {
      description: {
        component: 'A basic badge used to indicate that a stream is live.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LiveBadge>;

export const Default: Story = {};
