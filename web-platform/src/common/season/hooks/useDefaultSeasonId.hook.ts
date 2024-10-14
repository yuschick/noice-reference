import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { useDefaultGameId } from '@common/game/hooks/useDefaultGameId.hook';
import { useUseDefaultSeasonIdGameQuery } from '@gen';

gql`
  query UseDefaultSeasonIdGame($gameId: ID!) {
    game(id: $gameId) {
      id
      activeSeasonId
    }
  }
`;

interface HookResult {
  seasonId: Nullable<string>;
  loading: boolean;
}

export function useDefaultSeasonId(): HookResult {
  const [seasonId, setSeasonId] = useState<Nullable<string>>(null);
  const { gameId, loading: gameIdLoading } = useDefaultGameId();

  const queryOptions = variablesOrSkip({ gameId });
  const { loading } = useUseDefaultSeasonIdGameQuery({
    ...queryOptions,
    skip: queryOptions.skip || gameIdLoading,
    onCompleted(data) {
      setSeasonId(data.game?.activeSeasonId ?? null);
    },
    fetchPolicy: 'cache-and-network',
  });

  return { seasonId, loading };
}
