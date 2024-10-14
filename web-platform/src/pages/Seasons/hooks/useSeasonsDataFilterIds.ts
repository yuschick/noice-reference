import { gql } from '@apollo/client';
import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useSelectedUIState } from '@context';
import { useUseSeasonsDataFilterIdsGamesQuery } from '@gen';

gql`
  query UseSeasonsDataFilterIdsGames($userId: ID) {
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

export function useSeasonsDataFilterIds() {
  const { userId } = useAuthenticatedUser();

  const { selectedGameId, selectedSeasonId, setSelectedGame } = useSelectedUIState();

  useUseSeasonsDataFilterIdsGamesQuery({
    variables: {
      userId,
    },
    onCompleted: (gamesData) => {
      if (!gamesData?.playedGames?.games) {
        return;
      }

      // if the current selected game is found in played games, no need to change it
      if (gamesData?.playedGames?.games.some((game) => game.game.id === selectedGameId)) {
        return;
      }

      if (gamesData?.playedGames.games.length > 0) {
        setSelectedGame(gamesData.playedGames.games[0].game.id);
        return;
      }
    },
  });

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!selectedGameId) {
      return;
    }

    trackEvent({
      clientToggleSeasons: {
        gameId: selectedGameId,
      },
    });
  }, [selectedGameId, trackEvent]);

  return { seasonId: selectedSeasonId };
}
