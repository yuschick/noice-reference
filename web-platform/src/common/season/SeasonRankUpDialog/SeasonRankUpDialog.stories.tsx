import { GameStoryHelpers } from '@noice-com/card-game';
import { AnalyticsEventClientRankUpDialogType } from '@noice-com/schemas/analytics/analytics.pb';
import type { Meta, StoryObj } from '@storybook/react';

import { Props, SeasonRankUpDialog } from './SeasonRankUpDialog';

import { RarityRarity, UnclaimedSeasonRewardFragment } from '@gen';

const meta: Meta<ControlProps> = {
  title: 'Seasons/SeasonRankUpDialog',
  component: SeasonRankUpDialog,
  argTypes: {
    rewardAmount: {
      control: { type: 'select' },
      defaultValue: 3,
      description: 'How many rewards to show',
      options: [1, 2, 3, 4, 5, 6, 7],
    },
  },
};

export default meta;
type Story = StoryObj<ControlProps>;

interface ControlProps extends Props {
  rewardAmount: number;
}

function mockRewardItem() {
  return Math.random() > 0.5
    ? {
        id: 'testRewardItem',
        rewardedAt: new Date().toISOString(),
        reason: {
          reason: {
            __typename: 'ReasonReasonLevelUp',
            level: 75,
            season: {
              id: 'testSeason',
              name: 'Beta Season 3',
              cardBackgroundUrls: [
                {
                  rarity: RarityRarity.RarityLegendary,
                  url: 'https://client-assets-cdn.gcp.dev.noice.com/card-rarity-backgrounds/fortnite-season_zero/common1.png',
                },
              ],
              game: {
                id: 'testGame',
                name: 'Fortnite',
              },
            },
          },
        },
        type: {
          reward: {
            __typename: 'RewardRewardTypeItem',
            item: {
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
              },
            },
          },
        },
      }
    : {
        id: 'testRewardCurrency',
        rewardedAt: new Date().toISOString(),
        reason: {
          reason: {
            __typename: 'ReasonReasonLevelUp',
            level: 39,
            season: {
              id: 'testSeason',
              name: 'Beta Season 3',
              cardBackgroundUrls: [
                {
                  rarity: RarityRarity.RarityLegendary,
                  url: 'https://client-assets-cdn.gcp.dev.noice.com/card-rarity-backgrounds/fortnite-season_zero/common1.png',
                },
              ],
              game: {
                id: 'testGame',
                name: 'Fortnite',
              },
            },
          },
        },
        type: {
          reward: {
            __typename: 'RewardRewardTypeCurrency',
            currencyId: ['soft-currency', 'hard-currency', 'reshuffle-token'][
              Math.floor(Math.random() * 4)
            ],
            currencyAmount: Math.floor(Math.random() * 100),
          },
        },
      };
}

export const Default: Story = {
  args: {
    rewardAmount: 3,
  },
  render: (args) => (
    <SeasonRankUpDialog
      context={
        AnalyticsEventClientRankUpDialogType.ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_UNSPECIFIED
      }
      level={75}
      rewards={
        Array.from(Array(args.rewardAmount)).map(() =>
          mockRewardItem(),
        ) as UnclaimedSeasonRewardFragment[]
      }
      onClose={() => {}}
    />
  ),
};
