import { Nullable } from '@noice-com/utils';

import { useCollectionIdsFromUrl } from './useCollectionIdsFromUrl.hook';

import { useDefaultGameId } from '@common/game/hooks/useDefaultGameId.hook';

interface HookResult {
  gameId: Nullable<string>;
  loading: boolean;
}

export function useCollectionGameId(): HookResult {
  const { gameId: gameIdFromUrl } = useCollectionIdsFromUrl();
  const { gameId: defaultGameId, loading: loadingDefaultGameId } = useDefaultGameId();

  return {
    gameId: gameIdFromUrl ?? defaultGameId,
    loading: loadingDefaultGameId,
  };
}
