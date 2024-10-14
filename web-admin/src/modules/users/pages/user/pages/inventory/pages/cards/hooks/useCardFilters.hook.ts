import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { TopFilter, useTopFilter } from '@common/top-content';
import {
  InventoryCardsQueryVariables,
  InventoryListUserInventoryRequestFilterInput,
  ItemItemType,
  useCardFilterGameSeasonsLazyQuery,
  useCardFilterGamesQuery,
} from '@gen';

gql`
  query CardFilterGames {
    listGames {
      games {
        id
        name
      }
    }
  }

  query CardFilterGameSeasons($gameId: ID!) {
    listSeasons(gameId: $gameId) {
      seasons {
        id
        name
      }
    }
  }
`;

interface HookResult {
  variables: Omit<InventoryCardsQueryVariables, 'cursor'>;
  skip: boolean;
}

const getVariables = (userId: string, searchParams: URLSearchParams) => {
  let filters: InventoryListUserInventoryRequestFilterInput[] = [];

  if (!searchParams.get('types')) {
    filters = [
      { itemType: ItemItemType.TypeGameCard },
      { itemType: ItemItemType.TypeStreamerCard },
    ];
  } else {
    searchParams
      .get('types')
      ?.split(',')
      .forEach((itemType) => {
        filters.push({ itemType: itemType as ItemItemType });
      });
  }

  searchParams
    .get('games')
    ?.split(',')
    .forEach((gameId) => {
      filters.push({ gameId });
    });

  searchParams
    .get('season')
    ?.split(',')
    .forEach((seasonId) => {
      filters.push({ seasonId });
    });

  return {
    userId,
    filters,
  };
};

export function useCardFilters(): HookResult {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilters } = useTopFilter();
  const { data } = useCardFilterGamesQuery();
  const [seasons, setSeasons] = useState<TopFilter['options']>([]);

  const [fetchSeasons] = useCardFilterGameSeasonsLazyQuery();

  useMountEffect(() => {
    // clear filters on unmount
    return () => {
      setFilters([]);
    };
  });

  useEffect(() => {
    if (!data?.listGames?.games) {
      return;
    }

    const onCardTypeChange = (cardType: string[]) => {
      setSearchParams((prev) => {
        // Always reset cursor when filters are touched
        prev.delete('after');
        prev.delete('before');

        // If there is types selected, but not all types, add them to search params
        if (cardType.length && cardType.length < 2) {
          prev.set('types', cardType.join(','));
          return prev;
        }

        // If all or none of the types are selected, remove search param
        prev.delete('types');
        return prev;
      });
    };

    const onSelectedGameChange = (selectedGames: string[]) => {
      setSearchParams((prev) => {
        // Always reset cursor when filters are touched
        prev.delete('after');
        prev.delete('before');

        // If there is games selected, but not all games, add them to search params
        if (
          selectedGames.length &&
          data?.listGames?.games &&
          selectedGames.length < data.listGames.games.length
        ) {
          prev.set('games', selectedGames.join(','));
          return prev;
        }

        // If all or none of the games are selected, remove search param
        prev.delete('games');
        return prev;
      });
    };

    const onSelectedSeasonChange = (selectedSeasons: string[]) => {
      setSearchParams((prev) => {
        // Always reset cursor when filters are touched
        prev.delete('after');
        prev.delete('before');

        // If there is seasons selected, but not all seasons, add them to search params
        if (
          selectedSeasons.length &&
          seasons.length &&
          selectedSeasons.length < seasons.length
        ) {
          prev.set('season', selectedSeasons.join(','));
          return prev;
        }

        // If all or none of the seasons are selected, remove search param
        prev.delete('season');
        return prev;
      });
    };

    setFilters([
      {
        label: 'Card type',
        options: [
          { value: ItemItemType.TypeGameCard, label: 'Default' },
          { value: ItemItemType.TypeStreamerCard, label: 'Creator cards' },
        ],
        onChange: onCardTypeChange,
        defaultValue: searchParams.get('types')?.split(','),
      },
      {
        label: 'Game title',
        options:
          data?.listGames?.games.map((game) => ({ label: game.name, value: game.id })) ??
          [],
        onChange: onSelectedGameChange,
        defaultValue: searchParams.get('games')?.split(','),
      },
      {
        label: 'Season',
        options: seasons,
        onChange: onSelectedSeasonChange,
        defaultValue: searchParams.get('season')?.split(','),
      },
    ]);
  }, [
    data?.listGames?.games,
    fetchSeasons,
    searchParams,
    seasons,
    setFilters,
    setSearchParams,
  ]);

  const getSeasonsOptions = useCallback(async () => {
    const selectedGames = searchParams.get('games')?.split(',');

    // If no games selected, clear seasons
    if (!selectedGames?.length) {
      setSeasons([]);
      setSearchParams((prev) => {
        prev.delete('season');
        return prev;
      });

      return;
    }

    // Fetch all season related to selected games and add them as options
    const seasons = await Promise.all(
      selectedGames.map(async (gameId) => {
        const { data } = await fetchSeasons({ variables: { gameId } });

        return (
          data?.listSeasons?.seasons.map((season) => ({
            label: season.name,
            value: season.id,
          })) ?? []
        );
      }) ?? [],
    );

    setSeasons(seasons.flat());
  }, [fetchSeasons, searchParams, setSearchParams]);

  useEffect(() => {
    const getSeasonsOptions = async () => {
      let selectedGames = searchParams.get('games')?.split(',');

      // If no games selected, get all seasons for all games
      if (!selectedGames?.length) {
        selectedGames = data?.listGames?.games.map((game) => game.id) ?? [];
      }

      // Fetch all season related to selected games and add them as options
      const seasons = await Promise.all(
        selectedGames.map(async (gameId) => {
          const { data } = await fetchSeasons({ variables: { gameId } });

          return (
            data?.listSeasons?.seasons.map((season) => ({
              label: season.name,
              value: season.id,
            })) ?? []
          );
        }) ?? [],
      );

      setSeasons(seasons.flat());
    };

    getSeasonsOptions();
  }, [
    data?.listGames?.games,
    fetchSeasons,
    getSeasonsOptions,
    searchParams,
    setSearchParams,
  ]);

  return {
    skip: !userId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: getVariables(userId!, searchParams),
  };
}
