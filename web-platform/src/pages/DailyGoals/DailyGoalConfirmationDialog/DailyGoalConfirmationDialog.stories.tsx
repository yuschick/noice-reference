import { WalletCurrencyId } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import { GoalCard } from '../GoalCard/GoalCard';

import { DailyGoalConfirmationDialog, DialogProps } from './DailyGoalConfirmationDialog';

import { RarityRarity } from '@gen';

export default {
  title: 'Daily Goals/Confirmation Dialog',
  component: DailyGoalConfirmationDialog,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    isOpen: {
      name: 'Is Open',
      control: { type: 'boolean' },
    },
    title: {
      name: 'Title',
      description: 'Title text of the confirmation dialog',
      control: { type: 'text' },
    },
    warning: {
      name: 'Warning',
      description: 'The red warning text what will happen if you confirm',
      control: { type: 'text' },
    },
    boxedText: {
      name: 'Boxed Text',
      description: 'The text in a box within the dialog',
      control: { type: 'text' },
    },
    confirmCostCurrency: {
      options: Object.values(WalletCurrencyId),
      name: 'Currency type',
      description: 'Type of the currency for the cost',
      control: { type: 'select' },
    },
    confirmCostAmount: {
      name: 'Currency amount',
      description: 'How much it costs to confirm',
      control: { type: 'number' },
    },
  },
} as Meta<typeof DailyGoalConfirmationDialog>;

const Template: StoryFn<DialogProps> = ({ ...args }) => {
  return <DailyGoalConfirmationDialog {...args}></DailyGoalConfirmationDialog>;
};

Template.parameters = {};

export const WithCard = {
  render: Template,

  args: {
    isOpen: true,
    title: 'Switchout this daily goal card?',
    warning: 'You will lose progress on the current card.',
    currency: {
      currencyId: WalletCurrencyId.ReshuffleToken,
      currencyAmount: 1,
    },
    children: (
      <GoalCard
        card={{
          description: 'Use 12 boosters on group members',
          game: {
            id: 'testGame',
            name: 'Fortnite',
          },
          gameId: 'fortnite',
          id: '1',
          rarity: RarityRarity.RarityLegendary,
          reward: {
            reward: {
              __typename: 'RewardRewardTypeCurrency',
              currencyAmount: 2000,
              currencyId: 'soft-currency',
            },
          },
          target: 100,
          requiresTeam: true,
        }}
      />
    ),
  },
};

export const WithBoxedText = {
  render: Template,

  args: {
    isOpen: true,
    title: 'Switchout this daily goal card?',
    warning: 'You will lose progress on the current card.',
    boxedText: 'Use 12 boosters on other players.',
    currency: {
      currencyId: WalletCurrencyId.ReshuffleToken,
      currencyAmount: 1,
    },
  },
};
