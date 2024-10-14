import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useAppLocalStorage } from '@common/localstorage';
import { useSelectedSeasonSeasonsQuery } from '@gen';

gql`
  fragment SelectedSeasonsSeason on GameSeason {
    id
    gameId
  }
  query SelectedSeasonSeasons($userId: ID!, $gameId: ID!) {
    listSeasonProgression(userId: $userId) {
      progression {
        season {
          ...SelectedSeasonsSeason
        }
      }
    }
    playedGames(userId: $userId) {
      games {
        userId
        id
        game {
          id
          activeSeason {
            ...SelectedSeasonsSeason
          }
        }
      }
    }
    game(id: $gameId) {
      id
      activeSeasonId
    }
  }
`;

export function useSelectedSeasonWithDefault(selectedGameId: Nullable<string>) {
  const localStorage = useAppLocalStorage();
  const { userId } = useAuthentication();

  const [selectedSeasonId, setSelectedSeasonId] = useState<Nullable<string>>(() =>
    localStorage.GetValue('season.selected'),
  );

  const setSelectedSeason = useCallback(
    (seasonId: Nullable<string>) => {
      localStorage.SetValue('season.selected', seasonId);
      setSelectedSeasonId(seasonId);
    },
    [localStorage],
  );

  useSelectedSeasonSeasonsQuery({
    ...variablesOrSkip({ userId, gameId: selectedGameId }),
    onCompleted: (data) => {
      const activeSeasonId = data?.game?.activeSeasonId ?? null;

      // When game id changes, we try to select the active season but default to first one found
      const progressionSeasons =
        data?.listSeasonProgression?.progression
          .filter((progression) => progression.season.gameId === selectedGameId)
          .map((progression) => progression.season) ?? [];

      const playedGamesSeasons =
        data?.playedGames?.games
          .filter(({ game }) => game.activeSeason.gameId === selectedGameId)
          // Leave out seasons that are already in the progression list.
          .filter(
            ({ game }) =>
              !progressionSeasons.some((season) => season.id === game.activeSeason.id),
          )
          .map(({ game }) => game.activeSeason) ?? [];

      const seasons = [...progressionSeasons, ...playedGamesSeasons];

      const defaultSelectedSeason =
        seasons.find((season) => season.id === activeSeasonId) ?? seasons[0];

      setSelectedSeason(defaultSelectedSeason?.id ?? null);
    },
  });

  return {
    selectedSeasonId,
    setSelectedSeason,
  };
}
