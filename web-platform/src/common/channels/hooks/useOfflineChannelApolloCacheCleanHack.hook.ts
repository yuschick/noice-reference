import { useApolloClient } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

export function useOfflineChannelApolloCacheCleanHack(gameId: Nullable<string>) {
  const { cache } = useApolloClient();

  // @todo this is a temporary fix so that stream list is kept updated.
  // Long run solutions are either a) server sending info of new/removed streams
  // through subscription or event b) having a shorter TTL for channels (need to validate
  // if works well with pagination)
  useEffect(() => {
    const evictChannelsCache = () => {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'channels' });
      cache.gc();
    };

    evictChannelsCache();

    return () => {
      evictChannelsCache();
    };
  }, [cache, gameId]);
}
