import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { CardRowActiveCard, Props } from './CardRowActiveCard';
import { mockCardRowActiveCard } from './mocks';

import { CardHighlightStateType } from '@game-common/card';
import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_CARD_ID = 'card-id';
const LOCAL_PLAYER_BOOSTER_ID = 3;

const TEAM_MATE_1_ID = 'team-mate-1';
const TEAM_MATE_1_BOOSTER_ID = 1;
const TEAM_MATE_2_ID = 'team-mate-2';
const TEAM_MATE_2_BOOSTER_ID = 2;
const TEAM_MATE_3_ID = 'team-mate-3';

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'Card Row Active Card',
  component: CardRowActiveCard,
  argTypes: {
    playerId: {
      name: 'Player ID',
      control: { type: 'text' },
    },
    size: {
      name: 'size',
      control: 'select',
      options: ['small', 'xsmall'],
    },
    onCardHovered: {
      name: 'Card Hovered Handler',
    },
    cardState: {
      name: 'Card State',
      control: 'select',
      options: Object.values(CardHighlightStateType),
    },
  },
} as Meta<typeof CardRowActiveCard>;

const Template: StoryFn<Props> = (args) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        blockSize: '20rem',
      }}
    >
      <div
        style={{ inlineSize: 'var(--game-card-width-breakpoint-large)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardRowActiveCard
          {...args}
          isHovered={hovered}
        />
      </div>
    </div>
  );
};

export const Default = {
  args: {
    playerId: LOCAL_PLAYER_ID,
    cardId: LOCAL_PLAYER_CARD_ID,
    isLocalPlayer: true,
  },
  render: Template,
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: LOCAL_PLAYER_ID,
            activeCard: {
              cardId: LOCAL_PLAYER_CARD_ID,
              points: 250,
            },
            points: 250,
          },
        ],
      },
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks(
    mockCardRowActiveCard({ cardId: LOCAL_PLAYER_CARD_ID, playerId: LOCAL_PLAYER_ID }),
  ),
};

const stateWithBoosters = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: 250,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: LOCAL_PLAYER_BOOSTER_ID,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: TEAM_MATE_1_BOOSTER_ID,
              activatorUserId: TEAM_MATE_1_ID,
            },
            [TEAM_MATE_2_ID]: {
              boosterId: TEAM_MATE_2_BOOSTER_ID,
              activatorUserId: TEAM_MATE_2_ID,
            },
          },
        },
        points: 250,
      },
      {
        userId: TEAM_MATE_1_ID,
      },
      {
        userId: TEAM_MATE_2_ID,
      },
      {
        userId: TEAM_MATE_3_ID,
      },
    ],
  },
};

export const WithAppliedBoosters = {
  args: {
    playerId: LOCAL_PLAYER_ID,
    cardId: LOCAL_PLAYER_CARD_ID,
    isLocalPlayer: true,
  },
  render: Template,
  decorators: [withGameState(mockMatchGroup, stateWithBoosters)],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockGameState({ boosterId: LOCAL_PLAYER_BOOSTER_ID }),
    ...mockGameState({ boosterId: TEAM_MATE_1_BOOSTER_ID }),
    ...mockGameState({ boosterId: TEAM_MATE_2_BOOSTER_ID }),
    ...mockCardRowActiveCard({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      appliedBoosterIds: [LOCAL_PLAYER_BOOSTER_ID],
    }),
    ...mockCardRowActiveCard({
      playerId: TEAM_MATE_1_ID,
      appliedBoosterIds: [TEAM_MATE_1_BOOSTER_ID],
    }),
    ...mockCardRowActiveCard({
      playerId: TEAM_MATE_2_ID,
      appliedBoosterIds: [TEAM_MATE_2_BOOSTER_ID],
    }),
  ]),
};
