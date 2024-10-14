import { TimedAds } from './TimedAds';

import { RarityRarity } from '@gen';

export default {
  title: 'NavigationSidebar/TimedAds',
  component: TimedAds,
};

export const Default = {
  args: {
    minimizedButtons: false,
    previousReward: {
      prizes: [],
      rarity: RarityRarity.RarityLegendary,
      readyAt: new Date(Date.now() - 5000).toISOString(),
    },
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
    placement: {
      placementId: 'timed-reward',
      rewards: [
        {
          rarity: RarityRarity.RarityLegendary,
          readyAt: new Date(Date.now() - 5000).toISOString(),
          prizes: [
            { max: 20, min: 5, value: 'hard-currency' },
            { max: 250, min: 50, value: 'soft-currency' },
            { max: 10, min: 2, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityEpic,
          readyAt: new Date(Date.now() - 5000).toISOString(),
          prizes: [
            { max: 15, min: 0, value: 'hard-currency' },
            { max: 150, min: 30, value: 'soft-currency' },
            { max: 5, min: 0, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityRare,
          readyAt: new Date(Date.now() - 5000).toISOString(),
          prizes: [
            { max: 5, min: 0, value: 'hard-currency' },
            { max: 100, min: 20, value: 'soft-currency' },
          ],
        },
        {
          rarity: RarityRarity.RarityUncommon,
          readyAt: new Date(Date.now() - 5000).toISOString(),
          prizes: [
            { max: 50, min: 10, value: 'soft-currency' },
            { max: 5, min: 0, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityCommon,
          readyAt: new Date(Date.now() - 5000).toISOString(),
          prizes: [{ max: 10, min: 2, value: 'reshuffle-token' }],
        },
        {
          rarity: RarityRarity.RarityLegendary,
          readyAt: new Date(Date.now() + 30000).toISOString(),
          prizes: [
            { max: 20, min: 5, value: 'hard-currency' },
            { max: 250, min: 50, value: 'soft-currency' },
            { max: 10, min: 2, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityEpic,
          readyAt: new Date(Date.now() + 60000).toISOString(),
          prizes: [
            { max: 15, min: 0, value: 'hard-currency' },
            { max: 150, min: 30, value: 'soft-currency' },
            { max: 5, min: 0, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityRare,
          readyAt: new Date(Date.now() + 90000).toISOString(),
          prizes: [
            { max: 5, min: 0, value: 'hard-currency' },
            { max: 100, min: 20, value: 'soft-currency' },
          ],
        },
        {
          rarity: RarityRarity.RarityUncommon,
          readyAt: new Date(Date.now() + 120000).toISOString(),
          prizes: [
            { max: 50, min: 10, value: 'soft-currency' },
            { max: 5, min: 0, value: 'reshuffle-token' },
          ],
        },
        {
          rarity: RarityRarity.RarityCommon,
          readyAt: new Date(Date.now() + 150000).toISOString(),
          prizes: [{ max: 10, min: 2, value: 'reshuffle-token' }],
        },
      ],
    },
  },
};
