import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { useSelectedUIState } from '@context';
import { useUseGameSelectorQuery, GameSelectorGameFragment } from '@gen';

gql`
  fragment GameSelectorGame on GameGame {
    id
    name
  }

  query UseGameSelector($gameIds: [String!]) {
    games(ids: $gameIds) {
      games {
        id
        ...GameSelectorGame
      }
    }
  }
`;

interface HookResult {
  loading: boolean;
  games: GameSelectorGameFragment[];
  selectedGameId: Nullable<string>;
}

/**
 * Gets list of games data and optionally the current selected
 * gameId from SelectedUIState context.
 *
 * @param gameIds for selected games
 */
export function useGameSelector(gameIds: string[]): HookResult {
  const { selectedGameId } = useSelectedUIState();
  const { data, loading } = useUseGameSelectorQuery({
    variables: {
      gameIds,
    },
    skip: !gameIds.length,
  });

  return {
    loading,
    games: data?.games?.games ?? [],
    selectedGameId,
  };
}
