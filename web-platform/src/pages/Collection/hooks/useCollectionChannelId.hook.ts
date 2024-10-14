import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

interface HookResult {
  channelId: Nullable<string>;
  actions: {
    setChannelId(channelId: Nullable<string>): void;
  };
}

interface Props {
  gameId: Nullable<string>;
}

export function useCollectionChannelId({ gameId }: Props): HookResult {
  const [channelId, setChannelId] = useState<Nullable<string>>(null);

  useEffect(() => {
    setChannelId(null);
  }, [gameId]);

  return {
    channelId,
    actions: {
      setChannelId,
    },
  };
}
