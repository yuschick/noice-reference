import { Meta, StoryObj } from '@storybook/react';
import { GiUnicorn } from 'react-icons/gi';

import {
  buttonThemes,
  buttonLevels,
  buttonSizes,
  buttonVariants,
} from '../Button/Button.types';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    label: 'Test label',
    icon: GiUnicorn,
  },
  argTypes: {
    icon: {
      control: { type: 'text' },
      description: 'Provide the `SvgComponent` to be rendered inside the button.',
      required: true,
    },
    isDisabled: {
      control: { type: 'boolean' },
      defaultValue: false,
      description:
        'Define if the button is disabled. This props maps to `aria-disabled` instead of `disabled` and avoids using `pointer-events: none` to allow for better accessibility.',
    },
    isLoading: {
      control: { type: 'boolean' },
      defaultValue: false,
      description:
        'Define if the button is in a loading state. This will also disable the button from additional triggers.',
    },
    level: {
      control: { type: 'select' },
      defaultValue: 'primary',
      description: 'Define the hierarchy level of the button.',
      options: buttonLevels,
    },
    ref: {
      description: 'Define a HTMLButtonElement ref to be passed to the button.',
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
        component: `The IconButton is built on top of the base Button component and therefor its APIs and styles are shared. Use it for actions that require a single icon, such as a favorite button.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
    level: 'primary',
  },
};

export const CTAButtons: Story = {
  args: {
    variant: 'cta',
  },
  parameters: {
    docs: {
      description: {
        story: `The CTA variant is used for the primary action on a page. It should be used sparingly, and only once per page. It currently only supports one primary level.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const SolidLightPrimaryButtons: Story = {
  args: {
    theme: 'light',
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const SolidLightSecondaryButtons: Story = {
  args: {
    theme: 'light',
    level: 'secondary',
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const SolidDarkPrimaryButtons: Story = {
  args: {
    theme: 'dark',
    variant: 'solid',
  },
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const SolidDarkSecondaryButtons: Story = {
  args: {
    theme: 'dark',
    level: 'secondary',
    variant: 'solid',
  },
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const GhostButtons: Story = {
  args: {
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story: `Ghost buttons will be used more sparingly. They can be used for auxillary-like actions. This variant mostly serves as a base to the IconButton.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          theme="dark"
          variant="ghost"
        />
        <IconButton
          {...args}
          size="sm"
          theme="dark"
          variant="ghost"
        />
        <IconButton
          {...args}
          theme="dark"
          variant="ghost"
        />
        <IconButton
          {...args}
          size="lg"
          theme="dark"
          variant="ghost"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isDisabled
        />
        <IconButton
          {...args}
          size="sm"
          isDisabled
        />
        <IconButton
          {...args}
          isDisabled
        />
        <IconButton
          {...args}
          size="lg"
          isDisabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
          isLoading
        />
        <IconButton
          {...args}
          size="sm"
          isLoading
        />
        <IconButton
          {...args}
          isLoading
        />
        <IconButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <IconButton
          {...args}
          size="xs"
        />
        <IconButton
          {...args}
          size="sm"
        />
        <IconButton {...args} />
        <IconButton
          {...args}
          size="lg"
        />
      </div>
    </div>
  ),
};
