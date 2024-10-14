import { StoryHelpers } from '@noice-com/common-ui';
import { GameInitMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockGameStateChallenges } from '@game-logic/challenges';
import { mockGameState } from '@game-logic/game';

/**
 * This function creates a mock for the game state for the given game init message
 */
export const createGameInitGQLMocks = (
  data: GameInitMsg,
  options?: {
    repeatMockResponse?: boolean;
  },
): StoryHelpers.Apollo.GraphqlMock[] => {
  const { repeatMockResponse = true } = options ?? {};

  return [
    // Mock game state players and boosters
    ...(data?.matchStateData?.players
      ?.map((player) => [
        // Mock game state for the player's active card
        ...(player.activeCard
          ? [mockGameState({ cardId: player.activeCard?.cardId, repeatMockResponse })]
          : []),
        // Mock game state for possible held booster and applied boosters for the card
        ...[
          player.heldBoosterId,
          ...Object.values(player?.activeCard?.activeBoosters ?? {}).map(
            (booster) => booster.boosterId,
          ),
        ].map((boosterId) => mockGameState({ boosterId, repeatMockResponse })),
      ])
      .flat(2) ?? []),

    // Mock game state challenges
    ...(data?.challengeStatesData
      ? mockGameStateChallenges({ challenges: data.challengeStatesData })
      : []),
  ];
};
