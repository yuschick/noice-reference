import { Rewards } from './Rewards';

export default {
  title: 'TimedAds/Rewards',
  component: Rewards,
};

export const ThreeRewards = {
  args: {
    rewardedWalletTransactions: [
      {
        add: {
          currencyAmount: '18',
          currencyId: 'hard-currency',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
      {
        add: {
          currencyAmount: '208',
          currencyId: 'soft-currency',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
      {
        add: {
          currencyAmount: '9',
          currencyId: 'reshuffle-token',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
    ],
  },
};

export const TwoRewards = {
  args: {
    rewardedWalletTransactions: [
      {
        add: {
          currencyAmount: '18',
          currencyId: 'hard-currency',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
      {
        add: {
          currencyAmount: '208',
          currencyId: 'soft-currency',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
    ],
  },
};

export const OneReward = {
  args: {
    rewardedWalletTransactions: [
      {
        add: {
          currencyAmount: '18',
          currencyId: 'hard-currency',
        },
        reason: {
          adWatched: {
            placementId: 'timed-reward',
          },
        },
      },
    ],
  },
};
