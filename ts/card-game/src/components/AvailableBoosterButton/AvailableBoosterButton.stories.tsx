import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { StoryObj, Meta, StoryFn } from '@storybook/react';
import { Fragment } from 'react';

import { AvailableBoosterButton } from './AvailableBoosterButton';

import { usePlayerAvailableBooster } from '@game-logic/boosters/hooks';
import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_BOOSTER_ID = 3;
const TEAM_MATE_ID = 'other';
const TEAM_MATE_BOOSTER_ID = 5;

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'Card Row/Available Booster Button',
  component: AvailableBoosterButton,
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: LOCAL_PLAYER_ID,
            heldBoosterId: LOCAL_PLAYER_BOOSTER_ID,
            activeCard: {
              cardId: 'card1',
            },
          },
          {
            userId: TEAM_MATE_ID,
            heldBoosterId: TEAM_MATE_BOOSTER_ID,
          },
        ],
      },
    }),
    StoryHelpers.withAuthProvider({ userId: LOCAL_PLAYER_ID }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockGameState({ boosterId: LOCAL_PLAYER_BOOSTER_ID, repeatMockResponse: true }),
    ...mockGameState({ boosterId: TEAM_MATE_BOOSTER_ID, repeatMockResponse: true }),
  ]),
} as Meta<typeof AvailableBoosterButton>;

type StoryProps = {
  ownerId: string;
};

const Template: StoryFn<StoryProps> = (args) => {
  const { availableBooster } = usePlayerAvailableBooster(args.ownerId);

  return availableBooster ? (
    <AvailableBoosterButton
      availableBooster={availableBooster}
      onClick={() => {}}
    />
  ) : (
    <Fragment />
  );
};

export const LocalPlayerBooster: StoryObj = {
  render: () => {
    const triggerRequest = () => {
      mockMatchGroup.triggerEvent('onBoosterRequested', {
        userId: LOCAL_PLAYER_ID,
        targetUserId: LOCAL_PLAYER_ID,
        boosterId: LOCAL_PLAYER_BOOSTER_ID,
      });
    };

    return (
      <>
        <Template ownerId={LOCAL_PLAYER_ID} />
        <button
          style={{ marginTop: '20px' }}
          onClick={triggerRequest}
        >
          Trigger booster request
        </button>
      </>
    );
  },

  args: {
    ownerId: LOCAL_PLAYER_ID,
  },
};

export const TeammateBooster = {
  render: Template,

  args: {
    ownerId: TEAM_MATE_ID,
  },
};
