import { Meta, StoryObj } from '@storybook/react';

import { buttonThemes } from '../Button/Button.types';

import { Anchor } from './Anchor';

const meta: Meta<typeof Anchor> = {
  title: 'Anchor',
  component: Anchor,
  tags: ['autodocs'],
  args: {
    children: 'Anchor',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      defaultValue: 'light',
      description: 'Define the color palette of the button.',
      options: buttonThemes,
    },
    ref: {
      description: 'Define a HTMLAnchorElement ref to be passed to the link.',
    },
    href: {
      control: { type: 'text' },
      description: 'Define the URL to navigate to when the button is clicked.',
      required: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export default meta;

type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  args: {
    color: 'light',
  },
};

export const ExternalLink: Story = {
  args: {
    color: 'light',
    href: 'https://www.google.com',
    showExternalLinkIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: `When the Anchor contains an external link beginning with 'http', we will render an anchor tag directly, and not a React Router <Link> component. By inspecting the following example, you can see the difference in the rendered HTML.`,
      },
    },
  },
};
