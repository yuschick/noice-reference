import { Nullable } from '@noice-com/utils';
import { useParams } from 'react-router';

import { getGameIdFromGameCreatorsParam } from '@common/game';

interface HookResult {
  gameId: Nullable<string>;
}

export function useCollectionIdsFromUrl(): HookResult {
  const { gameCreators } = useParams();
  const gameId = getGameIdFromGameCreatorsParam(gameCreators) ?? null;

  return {
    gameId,
  };
}
