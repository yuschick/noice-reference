import { Meta, StoryObj } from '@storybook/react';

import { CurrencyButton } from './CurrencyButton';
import { buttonThemes, buttonLevels, buttonSizes } from './CurrencyButton.types';

import { WalletCurrencyId } from '@common-types';

const meta: Meta<typeof CurrencyButton> = {
  title: 'CurrencyButton',
  component: CurrencyButton,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
  argTypes: {
    cannotAfford: {
      control: { type: 'boolean' },
      description: "Display an error message when the user can't afford the item.",
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
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `The base button component with multiple variant, level and color combinations. The button supports icons at either or both sides, and incorporates accessibility benefits while disabled and loading.
        
The inline size of the Button will stretch to fill its container while its minimum inline size should never go below its max-content value. In order to size the button, its container must be styled, not the Button itself.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CurrencyButton>;

export const Primary: Story = {
  args: {
    theme: 'light',
    level: 'primary',
    currency: {
      type: 'in-game',
      currency: WalletCurrencyId.ReshuffleToken,
      value: 10,
    },
  },
};

export const LightSecondary: Story = {
  args: {
    currency: {
      type: 'in-game',
      currency: WalletCurrencyId.ReshuffleToken,
      value: 10,
    },
    theme: 'light',
    level: 'secondary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <CurrencyButton
          {...args}
          size="xs"
        />
        <CurrencyButton
          {...args}
          size="sm"
        />
        <CurrencyButton {...args} />
        <CurrencyButton
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
        <CurrencyButton
          {...args}
          size="xs"
          isDisabled
        />
        <CurrencyButton
          {...args}
          size="sm"
          isDisabled
        />
        <CurrencyButton
          {...args}
          isDisabled
        />
        <CurrencyButton
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
        <CurrencyButton
          {...args}
          size="xs"
          isLoading
        />
        <CurrencyButton
          {...args}
          size="sm"
          isLoading
        />
        <CurrencyButton
          {...args}
          isLoading
        />
        <CurrencyButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
    </div>
  ),
};

export const DarkSecondary: Story = {
  args: {
    theme: 'dark',
    level: 'secondary',
    currency: {
      type: 'in-game',
      currency: WalletCurrencyId.ReshuffleToken,
      value: 10,
    },
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
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <CurrencyButton
          {...args}
          size="xs"
        />
        <CurrencyButton
          {...args}
          size="sm"
        />
        <CurrencyButton {...args} />
        <CurrencyButton
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
        <CurrencyButton
          {...args}
          size="xs"
          isDisabled
        />
        <CurrencyButton
          {...args}
          size="sm"
          isDisabled
        />
        <CurrencyButton
          {...args}
          isDisabled
        />
        <CurrencyButton
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
        <CurrencyButton
          {...args}
          size="xs"
          isLoading
        />
        <CurrencyButton
          {...args}
          size="sm"
          isLoading
        />
        <CurrencyButton
          {...args}
          isLoading
        />
        <CurrencyButton
          {...args}
          size="lg"
          isLoading
        />
      </div>
    </div>
  ),
};

export const CannotAfford: Story = {
  args: {
    currency: {
      type: 'in-game',
      currency: WalletCurrencyId.ReshuffleToken,
      value: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Whenever a purchase cannot be completed due to not having enough currency, we can optionally display a message. This message can be shown inline or as a tooltip in situations where space is limited (ie: game view).`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '5rem',
          flexDirection: 'column',
        }}
      >
        <CurrencyButton
          cannotAfford
          {...args}
        />
        <CurrencyButton
          cannotAfford={{ displayErrorAsTooltip: true }}
          {...args}
        />
      </div>
    </div>
  ),
};
