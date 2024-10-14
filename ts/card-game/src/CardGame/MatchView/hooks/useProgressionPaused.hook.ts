import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { useProgressionPausedSeasonQuery } from '@game-gen';
import { useStreamGame } from '@game-logic/game/context';

gql`
  query ProgressionPausedSeason($channelId: ID!) {
    channel(id: $channelId) {
      id
      game {
        id
        activeSeason {
          id
          progressionPaused
          progressionPauseReason
        }
      }
    }
  }
`;

interface HookResult {
  isProgressionPaused: boolean;
  progressionPauseReason: string;
}

export function useProgressionPaused(): HookResult {
  const { channelId } = useStreamGame();

  const { data } = useProgressionPausedSeasonQuery({
    ...variablesOrSkip({ channelId }),
  });

  return {
    isProgressionPaused: data?.channel?.game.activeSeason.progressionPaused ?? false,
    progressionPauseReason: data?.channel?.game.activeSeason.progressionPauseReason ?? '',
  };
}
