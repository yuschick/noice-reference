import { GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import type { Meta, StoryObj } from '@storybook/react';

import { SeasonStartDialog } from './SeasonStartDialog';

import { RarityRarity, SeasonStartDialogCardFragment } from '@gen';

const meta: Meta<typeof SeasonStartDialog> = {
  title: 'Seasons/SeasonStartDialog',
  component: SeasonStartDialog,
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
};

export default meta;
type Story = StoryObj<typeof SeasonStartDialog>;

const seasonData = {
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
      name: 'Dead by Daylight',
    },
    badgeUrl:
      'https://client-assets-cdn.gcp.dev.noice.com/season-badges/fortnite/example_season_badge.png',
  },
};

const startingCardsData: SeasonStartDialogCardFragment[] = [
  {
    ...GameStoryHelpers.getNewGraphQLGameCard(),
    ...seasonData,
  },
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
    <SeasonStartDialog
      cards={startingCardsData}
      onClose={() => {}}
    />
  ),
};
