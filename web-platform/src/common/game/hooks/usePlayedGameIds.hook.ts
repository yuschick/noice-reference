import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useUsePlayedGameIdsQuery } from '@gen';

gql`
  query UsePlayedGameIds($userId: ID) {
    playedGames(userId: $userId) {
      games {
        id
        userId
      }
    }
  }
`;

interface HookResult {
  gameIds: string[];
  loading: boolean;
}

export function usePlayedGameIds(): HookResult {
  const { userId } = useAuthenticatedUser();
  const client = useClient();

  const {
    data: playedGamesData,
    loading,
    refetch: fetchPlayedGames,
  } = useUsePlayedGameIdsQuery({
    variables: { userId },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onProgressionUpdate: () => fetchPlayedGames(),
    });
  }, [client, fetchPlayedGames]);

  return {
    gameIds: playedGamesData?.playedGames?.games.map((game) => game.id) ?? [],
    loading,
  };
}
