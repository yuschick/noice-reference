import { Meta, StoryObj } from '@storybook/react';
import { GiUnicorn } from 'react-icons/gi';

import {
  buttonThemes,
  buttonLevels,
  buttonSizes,
  buttonVariants,
} from '../Button/Button.types';

import { IconButtonLink } from './IconButtonLink';

const meta: Meta<typeof IconButtonLink> = {
  title: 'Icon Button Link',
  component: IconButtonLink,
  tags: ['autodocs'],
  args: {
    icon: GiUnicorn,
  },
  argTypes: {
    icon: {
      control: { type: 'text' },
      description: 'Provide the `SvgComponent` to be rendered inside the button.',
      required: true,
    },
    level: {
      control: { type: 'select' },
      defaultValue: 'primary',
      description: 'Define the hierarchy level of the button.',
      options: buttonLevels,
    },
    ref: {
      description: 'Define a HTMLAnchorElement ref to be passed to the link.',
    },
    size: {
      control: { type: 'select' },
      defaultValue: 'md',
      description:
        'Define the size of the button. This value defines the button block size, while the inline size is built to fill its container.',
      options: buttonSizes,
    },
    theme: {
      control: { type: 'select' },
      defaultValue: 'light',
      description: 'Define the color theme of the button.',
      options: buttonThemes,
    },
    variant: {
      control: { type: 'select' },
      defaultValue: 'solid',
      description: 'Define the button variant, or style, type.',
      options: buttonVariants,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      controls: { exclude: ['iconEnd', 'iconStart'] },
      description: {
        component: `The Icon Button Link component is a wrapper around the Icon Button component that renders an \`<a>\` tag instead of a \`<button>\` tag. This is useful for when you need to render a button-like link that navigates to another page. While the Icon Button Link extends react-router-dom's LinkProps, the APIs for the Icon Button and Icon Button Link are almost identical, with the exception that the <code>isDisabled</code> and <code>isLoading</code> props have been omitted. Both the Icon Button and Icon Button Link share the same styles to remain in sync.
        
To view further examples and docs, please visit the [Icon Button component docs](/docs/common-ui-icon-button--docs).`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButtonLink>;

export const Default: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
    label: 'Return home',
    level: 'primary',
    to: '/',
  },
};

export const ExternalLink: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
    label: 'Ever heard of Google?',
    level: 'primary',
    to: 'https://www.google.com',
  },
  parameters: {
    docs: {
      description: {
        story: `When the Icon Button Link contains an external link beginning with 'http', we will render an anchor tag directly, and not a React Router <Link> component. By inspecting the following example, you can see the difference in the rendered HTML.`,
      },
    },
  },
};
