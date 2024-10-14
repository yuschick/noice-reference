import { WalletCurrencyId } from '@noice-com/common-ui';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';

import { GoalCard } from './GoalCard';

import { RarityRarity } from '@gen';

export default {
  title: 'Goal Card/Goal Card',
  component: GoalCard,
  argTypes: {
    description: {
      name: 'Description',
      description: 'Daily Goal Card description text',
      control: { type: 'text' },
    },
    rewardType: {
      options: Object.values(WalletCurrencyId),
      name: 'Currency type',
      description: 'Type of the currency for the reward',
      control: { type: 'select' },
    },
    rewardAmount: {
      name: 'Currency amount',
      description: 'Amount of currency to get as reward',
      control: { type: 'number' },
    },
    rarity: {
      options: Object.values(Rarity),
      name: 'Card rarity',
      description: 'Rarity of the Daily Goal Card',
      control: { type: 'select' },
    },
    gameId: {
      options: ['fortnite', 'deadbydaylight', ''],
      name: 'Game Id',
      description: 'The identifier name used for a game name badge',
      control: { type: 'select' },
    },
  },
};

export const Default = {
  args: {
    card: {
      id: '1',
      description: 'Use 12 boosters on other players',
      target: 100,
      game: {
        id: 'testGame',
        name: 'Fortnite',
      },
      reward: {
        reward: {
          __typename: 'RewardRewardTypeCurrency',
          currencyAmount: 2000,
          currencyId: 'soft-currency',
        },
      },
      rarity: RarityRarity.RarityCommon,
      gameId: 'fortnite',
    },
  },
};

export const GroupOnly = {
  args: {
    ...Default.args,
    card: {
      ...Default.args.card,
      requiresTeam: true,
    },
  },
};
