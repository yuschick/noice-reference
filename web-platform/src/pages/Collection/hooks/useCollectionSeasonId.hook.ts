import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { useUseCollectionSeasonIdGameQuery } from '@gen';

gql`
  query UseCollectionSeasonIdGame($gameId: ID!) {
    game(id: $gameId) {
      id
      activeSeasonId
    }
  }
`;

interface HookResult {
  seasonId: Nullable<string>;
  loading: boolean;
  actions: {
    setSeasonId(seasonId: Nullable<string>): void;
  };
}

interface Props {
  gameId: Nullable<string>;
}

export function useCollectionSeasonId({ gameId }: Props): HookResult {
  const [seasonId, setSeasonId] = useState<Nullable<string>>(null);

  const { loading: gameDataLoading } = useUseCollectionSeasonIdGameQuery({
    ...variablesOrSkip({ gameId }),
    onCompleted({ game }) {
      setSeasonId(game?.activeSeasonId ?? null);
    },
  });

  return {
    seasonId,
    loading: gameDataLoading,
    actions: { setSeasonId },
  };
}
