import { WalletCurrencyId } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import { DailyGoalSelectModal, Props } from './DailyGoalSelectModal';

import { RarityRarity } from '@gen';

export default {
  title: 'Daily Goals/Select',
  component: DailyGoalSelectModal,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    reshuffleCost: {
      name: 'Reshuffle Cost',
      description: 'How much it costs to reshuffle',
      control: { type: 'number' },
    },
    reshuffleTokens: {
      name: 'Reshuffle tokens',
      description: 'Available reshuffle tokens',
      control: { type: 'number' },
    },
    onCardClick: { action: 'clicked' },
    onReshuffle: { action: 'clicked' },
  },
} as Meta<typeof DailyGoalSelectModal>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <DailyGoalSelectModal {...args} />;
};

Template.parameters = {};

export const Default = {
  render: Template,
  parameters: {},

  args: {
    reshuffleCost: 1,
    reshuffleTokens: 8,
    wallet: {
      [WalletCurrencyId.SoftCurrency]: 3500,
      [WalletCurrencyId.ChannelCurrency]: 100,
      [WalletCurrencyId.HardCurrency]: 15,
      [WalletCurrencyId.ReshuffleToken]: 8,
    },
    cards: [
      {
        id: 'id1',
        rarity: RarityRarity.RarityUncommon,
        description: 'Test Card 1',
        gameId: 'test1',
        target: 100,
        game: {
          id: 'fortnite',
          name: 'Fortnite',
        },
        requiresTeam: false,
        reward: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyAmount: 2000,
            currencyId: 'soft-currency',
          },
        },
      },
      {
        id: 'id2',
        rarity: RarityRarity.RarityLegendary,
        description: 'Test Card 2',
        gameId: 'test2',
        target: 3,
        requiresTeam: true,
        game: {
          id: 'fortnite',
          name: 'Fortnite',
        },
        reward: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyAmount: 100,
            currencyId: 'channel-currency',
          },
        },
      },
      {
        id: 'id3',
        rarity: RarityRarity.RarityRare,
        description: 'Test Card 3',
        gameId: 'test3',
        target: 250,
        game: {
          id: 'fortnite',
          name: 'Fortnite',
        },
        requiresTeam: false,
        reward: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyAmount: 2000,
            currencyId: 'reshuffle-token',
          },
        },
      },
      {
        id: 'id4',
        rarity: RarityRarity.RarityLegendary,
        description: 'Test Card 4',
        gameId: 'test4',
        target: 1000,
        game: {
          id: 'fortnite',
          name: 'Fortnite',
        },
        requiresTeam: false,
        reward: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyAmount: 55,
            currencyId: 'soft-currency',
          },
        },
      },
      {
        id: 'id5',
        rarity: RarityRarity.RarityCommon,
        description: 'Test Card 5',
        gameId: 'test5',
        target: 1,
        game: {
          id: 'fortnite',
          name: 'Fortnite',
        },
        requiresTeam: false,
        reward: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyAmount: 10,
            currencyId: 'hard-currency',
          },
        },
      },
    ],
  },
};
