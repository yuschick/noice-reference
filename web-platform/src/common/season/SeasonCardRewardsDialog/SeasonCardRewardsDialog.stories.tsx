import { GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import type { Meta, StoryObj } from '@storybook/react';

import { SeasonCardRewardsDialog } from './SeasonCardRewardsDialog';

import { RarityRarity, SeasonCardRewardsDialogFragment } from '@gen';

const meta: Meta<typeof SeasonCardRewardsDialog> = {
  title: 'Seasons/SeasonCardRewardsDialog',
  component: SeasonCardRewardsDialog,
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
};

export default meta;
type Story = StoryObj<typeof SeasonCardRewardsDialog>;

const seasonData = {
  season: {
    id: 'testSeason',
    name: 'Test Season',
    cardBackgroundUrls: [
      {
        rarity: RarityRarity.RarityLegendary,
        url: 'https://client-assets-cdn.gcp.dev.noice.com/card-rarity-backgrounds/fortnite-season_zero/common1.png',
      },
    ],
    game: {
      id: 'testGame',
      name: 'TestGame',
    },
    badgeUrl:
      'https://client-assets-cdn.gcp.dev.noice.com/season-badges/fortnite/example_season_badge.png',
  },
};

const startingCardsData: SeasonCardRewardsDialogFragment[] = [
  {
    ...GameStoryHelpers.getNewGraphQLGameCard(),
    ...seasonData,
  },
  {
    ...GameStoryHelpers.getNewGraphQLGameCard(),
    ...seasonData,
  },
];

export const Default: Story = {
  render: () => (
    <SeasonCardRewardsDialog
      cards={startingCardsData}
      onClose={() => {}}
    />
  ),
};
