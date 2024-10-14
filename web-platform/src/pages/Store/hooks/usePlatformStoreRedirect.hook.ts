import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

import { getGameIdFromGameCreatorsParam } from '@common/game';
import { Routes } from '@common/route';
import { QueryParams } from '@common/route/types';
import { useSelectedUIState } from '@context';
import { usePlatformStoreRedirectProfileQuery } from '@gen';

gql`
  query PlatformStoreRedirectProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      playedGames {
        id
        userId
      }
    }
  }
`;

export function usePlatformStoreRedirect(): Nullable<string> {
  const [searchParams] = useSearchParams();
  const [storeGameId, setStoreGameId] = useState<Nullable<string>>(null);
  const navigate = useNavigate();
  const { userId } = useAuthentication();
  const { selectedGameId, setSelectedGame } = useSelectedUIState();
  const { hash } = useLocation();

  const { data, loading } = usePlatformStoreRedirectProfileQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    // Do nothing when loading data
    if (loading) {
      return;
    }

    // If user has no played games just return (allow empty state)
    if (!data?.profile?.playedGames.length) {
      return;
    }

    const categoryParam = searchParams.get(QueryParams.Category);

    // If there is game id in path try to use that as store game id
    if (categoryParam) {
      const gameId = getGameIdFromGameCreatorsParam(categoryParam);

      // If game id is played, set the store game id and use that game
      if (gameId && data.profile.playedGames?.some((game) => game.id === gameId)) {
        setStoreGameId(gameId);
        setSelectedGame(gameId);
        return;
      }

      // If game id is not played, use the first played game
      const backUpGameId = data.profile.playedGames[0].id;

      navigate(
        `${Routes.Store}?${createSearchParams({
          [QueryParams.Category]: `${backUpGameId}-creators`,
        })}${hash}`,
        {
          replace: true,
        },
      );

      setStoreGameId(backUpGameId);
      setSelectedGame(backUpGameId);
      return;
    }

    // If there is no game id in path, set the ui game id to be store game id
    navigate(
      `${Routes.Store}?${createSearchParams({
        [QueryParams.Category]: `${selectedGameId}-creators`,
      })}${hash}`,
      {
        replace: true,
      },
    );
    setStoreGameId(selectedGameId);
  }, [
    hash,
    navigate,
    data?.profile?.playedGames,
    loading,
    searchParams,
    selectedGameId,
    setSelectedGame,
  ]);

  return storeGameId;
}
