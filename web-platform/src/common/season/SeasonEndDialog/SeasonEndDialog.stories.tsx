import type { Meta, StoryObj } from '@storybook/react';

import { SeasonEndDialog } from './SeasonEndDialog';

import {
  ItemItemType,
  RarityRarity,
  SeasonEndDialogInventoryFragment,
  SeasonEndDialogProfileFragment,
  SeasonEndDialogProfileStatsFragment,
  SeasonEndDialogSeasonFragment,
} from '@gen';

const meta: Meta<typeof SeasonEndDialog> = {
  title: 'Seasons/SeasonEndDialog',
  component: SeasonEndDialog,
};

export default meta;
type Story = StoryObj<typeof SeasonEndDialog>;

const seasonData: SeasonEndDialogSeasonFragment = {
  id: 'testSeason',
  name: 'Beta Season 3',
  progression: {
    seasonId: 'testSeason',
    level: 75,
    xpAmount: 45843,
  },
  game: {
    id: 'testGame',
    name: 'Dead by Daylight',
  },
  cardBackgroundUrls: [
    {
      rarity: RarityRarity.RarityLegendary,
      url: 'https://client-assets-cdn.gcp.dev.noice.com/card-rarity-backgrounds/fortnite-season_zero/common1.png',
    },
  ],
  badgeUrl:
    'https://client-assets-cdn.gcp.dev.noice.com/season-badges/fortnite/example_season_badge.png',
};

const profileData: SeasonEndDialogProfileFragment = {
  userTag: 'Testo Tester',
  userId: 'testUserId',
  avatars: {
    avatarFullbody:
      'https://media-cdn.gcp.prd.noice.com/avatar/image_body_img/de2c7f5f-4d8a-505b-bfe4-6c12178a2f90/bf115b44-8ea5-42f9-84e1-583b80d1e200.png&width=750&quality=high',
  },
};

const profileStats: SeasonEndDialogProfileStatsFragment = {
  matchesPlayed: 38,
};

const inventoryData: SeasonEndDialogInventoryFragment[] = [
  {
    itemId: 'testItem1',
    item: {
      id: 'testItem1',
      type: ItemItemType.TypeGameCard,
    },
  },
  {
    itemId: 'testItem2',
    item: {
      id: 'testItem2',
      type: ItemItemType.TypeGameCard,
    },
  },
  {
    itemId: 'testItem3',
    item: {
      id: 'testItem3',
      type: ItemItemType.TypeGameCard,
    },
  },
];

export const Default: Story = {
  render: () => (
    <SeasonEndDialog
      inventory={inventoryData}
      profile={profileData}
      season={seasonData}
      stats={profileStats}
      onClose={() => {}}
    />
  ),
};
