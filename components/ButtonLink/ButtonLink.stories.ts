import { Meta, StoryObj } from '@storybook/react';

import {
  buttonColors,
  buttonLevels,
  buttonShapes,
  buttonSizes,
  buttonVariants,
} from '../Button/Button.types';

import { ButtonLink } from './ButtonLink';

const meta: Meta<typeof ButtonLink> = {
  title: 'Button Link',
  component: ButtonLink,
  tags: ['autodocs'],
  args: {
    children: 'Button Link',
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      defaultValue: 'light',
      description: 'Define the theme palette of the button.',
      options: buttonColors,
    },
    iconEnd: {
      control: { type: 'text' },
      description:
        'Provide an `SvgComponent` to be rendered at the inline end of the button.',
    },
    iconStart: {
      control: { type: 'text' },
      description:
        'Provide an `SvgComponent` to be rendered at the inline start of the button.',
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
    shape: {
      control: { type: 'select' },
      defaultValue: 'pill',
      description: 'Define the shape of the button.',
      options: buttonShapes,
    },
    size: {
      control: { type: 'select' },
      defaultValue: 'md',
      description:
        'Define the size of the button. This value defines the button block size, while the inline size is built to fill its container.',
      options: buttonSizes,
    },
    to: {
      control: { type: 'text' },
      description: 'Define the URL to navigate to when the button is clicked.',
      required: true,
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
      description: {
        component: `The Button Link component is a wrapper around the Button component that renders an \`<a>\` tag instead of a \`<button>\` tag. This is useful for when you need to render a button-like link that navigates to another page. While the Button Link extends react-router-dom's LinkProps, the APIs for the Button and Button Link are almost identical, with the exception that the <code>isDisabled</code> and <code>isLoading</code> props have been omitted. Both the Button and Button Link share the same styles to remain in sync.
        
To view further examples and docs, please visit the [Button component docs](/docs/common-ui-button--docs).`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonLink>;

export const Default: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
    level: 'primary',
  },
};

export const ExternalLink: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
    level: 'primary',
    to: 'https://www.google.com',
  },
  parameters: {
    docs: {
      description: {
        story: `When the Button Link contains an external link beginning with 'http', we will render an anchor tag directly, and not a React Router <Link> component. By inspecting the following example, you can see the difference in the rendered HTML.`,
      },
    },
  },
};
