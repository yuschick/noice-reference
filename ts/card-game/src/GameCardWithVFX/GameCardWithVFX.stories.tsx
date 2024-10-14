import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { GameCardWithVFX, Props } from './GameCardWithVFX';

import { mockGameCard } from '@game-card';
import { RarityRarity } from '@game-gen';
import {
  getNewGraphQLGameCard,
  getNewGraphQLGameStreamerCard,
} from '@game-story-helpers';

interface ArgTypes {
  rarity: RarityRarity;
  isAllOrNothing: boolean;
  isMatchCard: boolean;
  isStreamerCard: boolean;
  level: number;
  heroArt?: string;
}

type WithArgsProps = Props & ArgTypes;

const card = {
  ...getNewGraphQLGameCard(),
  rarity: RarityRarity.RarityUncommon,
  level: 1000,
  icon: 'https://storage.googleapis.com/noice-client-assets-b9745b84/card-hero-art/apex_legends/season_zero/heavy_score.png',
};

const streamerCard = {
  ...card,
  activeStreamerCard: {
    ...getNewGraphQLGameStreamerCard(),
    image: CoreAssets.Images.CardFrame,
  },
};

export default {
  title: 'GameCardWithVFX',
  component: GameCardWithVFX,
  argTypes: {
    // this prevents the large object prop 'card' to take ovee the controls sidebar
    ...StoryHelpers.disableArgs<Props>(['card'], {}),
    vfxWebmUrl: {
      name: 'Webm URL',
      control: {
        type: 'text',
      },
    },

    rarity: {
      name: 'Card Rarity',
      defaultValue: RarityRarity.RarityCommon,
      options: Object.values(RarityRarity),
      control: {
        type: 'select',
        labels: {
          [RarityRarity.RarityCommon]: 'Common',
          [RarityRarity.RarityUncommon]: 'Uncommon',
          [RarityRarity.RarityRare]: 'Rare',
          [RarityRarity.RarityEpic]: 'Epic',
          [RarityRarity.RarityLegendary]: 'Legendary',
        },
      },
    },
    isAllOrNothing: {
      name: 'All or Nothing',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    isMatchCard: {
      name: 'Match Card',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    level: {
      name: 'Card Level',
      control: {
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
      },
    },
    heroArt: {
      name: 'Hero Art Url',
      options: [
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/win_match_card.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_no_shotgun.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/smg_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/multiple_assits_before_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/no_dmg_before_storm.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/pickaxe_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/shield_health_full.png`,
        `---`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/deal_dmg_in_duration.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/collect_material_before_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/remain_kill_leader_for.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/crafter_before_duration.png`,
      ],
      control: {
        type: 'select',
      },
    },
    isStreamerCard: {
      name: '(For testing) is Streamer Card',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
} as Meta<WithArgsProps>;

const WithArgsControls = ({
  rarity,
  card,
  isAllOrNothing,
  isMatchCard,
  isStreamerCard,
  level,
  heroArt,
  ...props
}: WithArgsProps) => {
  // Since arg types cannot (in my knowledge) define object properties, we combine
  // those here to the card object
  const args = {
    card: {
      ...(isStreamerCard ? streamerCard : card),
      rarity: rarity || card.rarity,
      isAllOrNothing: isAllOrNothing || card.isAllOrNothing,
      isMatchCard: isMatchCard || card.isMatchCard,
      leveling: {
        ...card.leveling,
        currentLevel: level || card.leveling.currentLevel,
      },
      icon: heroArt || card.icon,
    },
    ...props,
  };

  return <GameCardWithVFX {...args} />;
};

export const Default = {
  args: {
    card,
    vfxWebmUrl:
      'https://storage.googleapis.com/noice-client-assets-b9745b84/vfx-test/Card_vfx_v008.webm',
  },
  render: WithArgsControls,
};
