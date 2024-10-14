import { StoryHelpers } from '@noice-com/common-ui';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import { CgChallengesSystemChallengesDocument } from '@game-gen';

export const mockGameStateChallenges = (state: GameLogic.ChallengeStatesData) =>
  StoryHelpers.Apollo.createMock(
    CgChallengesSystemChallengesDocument,
    {
      challengeIds:
        state.challengeStatuses?.flatMap(({ challengeId }) =>
          challengeId ? [challengeId] : [],
        ) ?? [],
    },
    {
      challengesBatch: {
        challenges:
          state.challengeStatuses?.map(({ challengeId, targetValues }, index) => ({
            __typename: 'GameLogicChallenge',
            id: challengeId,
            targetValues: targetValues ?? {
              label: `Target ${index + 1}`,
              value: index * 1000,
            },
          })) ?? [],
      },
    },
    true,
  );
