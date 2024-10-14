import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { StoryObj, Meta } from '@storybook/react';
import { useEffect } from 'react';

import { mockTeamMateBoosterButton } from './mocks';
import { TeamMateBoosterButton, Props } from './TeamMateBoosterButton';

import { mockGameState } from '@game-logic/game';
import { GameInitBuilder, withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const BOOSTER_ID = 3;
const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'Team Mate Booster Button',
  component: TeamMateBoosterButton,
  decorators: [
    withGameState(
      mockMatchGroup,
      new GameInitBuilder()
        .withGroupId(mockMatchGroup.groupId)
        .withLocalPlayer({
          userId: LOCAL_PLAYER_ID,
          activeCard: {
            cardId: 'card-1',
          },
        })
        .result(),
    ),
    StoryHelpers.withAuthProvider({ userId: LOCAL_PLAYER_ID }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockTeamMateBoosterButton({
      playerId: LOCAL_PLAYER_ID,
      boosterId: BOOSTER_ID,
    }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
} as Meta<typeof TeamMateBoosterButton>;

export const WithBoosterAvailable = {
  args: {
    ownerId: LOCAL_PLAYER_ID,
  },
  decorators: [
    withGameState(
      mockMatchGroup,
      new GameInitBuilder()
        .withGroupId(mockMatchGroup.groupId)
        .withLocalPlayer({
          userId: LOCAL_PLAYER_ID,
          activeCard: {
            cardId: 'card-1',
          },
          heldBoosterId: BOOSTER_ID,
        })
        .result(),
    ),
  ],
};

export const WithCooldownTimer: StoryObj<Props> = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const now = Date.now();
      mockMatchGroup.triggerEvent('onBoosterCooldownStarted', {
        userId: LOCAL_PLAYER_ID,
        startTime: `${now}`,
        endTime: `${now + 15000}`,
      });

      setTimeout(() => {
        mockMatchGroup.triggerEvent('onBoosterAvailable', {
          userId: LOCAL_PLAYER_ID,
          boosterId: BOOSTER_ID,
        });
      }, 15000);
    }, []);

    return <TeamMateBoosterButton {...args} />;
  },

  args: {
    ownerId: LOCAL_PLAYER_ID,
  },
};

export const WithSoloMode = {
  args: {
    ownerId: LOCAL_PLAYER_ID,
  },

  decorators: [
    withGameState(
      mockMatchGroup,
      new GameInitBuilder()
        .withGroupId(mockMatchGroup.groupId)
        .withSoloGroup(true)
        .withLocalPlayerId(mockMatchGroup.localUserId)
        .result(),
    ),
  ],
};
