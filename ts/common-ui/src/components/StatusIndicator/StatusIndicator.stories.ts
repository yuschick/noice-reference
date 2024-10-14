import { Meta, StoryObj } from '@storybook/react';

import { StatusIndicator } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Status Indicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  args: {
    color: 'green',
    message: 'Angus McSix is online.',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      description: 'The color to use for the indicator.',
      options: ['green', 'magenta'],
      required: true,
    },
    message: {
      control: { type: 'text' },
      description:
        'The message is what will be announced to assistive technologies. This should be a short, descriptive message in present tense, such as "Angus McSix is online." or "You have 5 unread messages."',
      required: true,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Status Indicator is used to alert to changes such as unread messages, new requests or online status. It uses `aria-live` and `role` to ensure that the supplied `message` is communicated to assistive technologies. The component contains no positioning, and must be positioned by a wrapper.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatusIndicator>;

export const Default: Story = {};
