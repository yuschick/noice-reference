import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useAppLocalStorage } from '@common/localstorage';
import { useUseSelectedGameIdWithDefaultQuery } from '@gen';

gql`
  query UseSelectedGameIdWithDefault($userId: ID!) {
    playedGames(userId: $userId) {
      games {
        userId
        id
        game {
          id
        }
      }
    }
  }
`;

interface HookResult {
  selectedGameId: Nullable<string>;
  setSelectedGameId(gameId: string): void;
}

export function useSelectedGameIdWithDefault(): HookResult {
  const localStorage = useAppLocalStorage();
  const { userId } = useAuthentication();

  const [selectedGameId, setSelectedGameId] = useState<Nullable<string>>(() =>
    localStorage.GetValue('game.selected'),
  );

  const setSelectedGame = useCallback(
    (gameId: string) => {
      localStorage.SetValue('game.selected', gameId);
      setSelectedGameId(gameId);
    },
    [localStorage],
  );

  useUseSelectedGameIdWithDefaultQuery({
    ...variablesOrSkip({ userId }),
    onCompleted(data) {
      if (selectedGameId) {
        return;
      }

      const playedGamesIds = data.playedGames?.games.map((game) => game.game.id);

      if (!playedGamesIds) {
        return;
      }

      const gameId = playedGamesIds.length > 0 ? playedGamesIds[0] : null;

      if (!gameId) {
        return;
      }

      setSelectedGame(gameId);
    },
  });

  return {
    selectedGameId: selectedGameId,
    setSelectedGameId: setSelectedGame,
  };
}
