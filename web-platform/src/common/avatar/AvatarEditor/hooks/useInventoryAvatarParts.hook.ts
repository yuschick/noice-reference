import { useClient } from '@noice-com/common-react-core';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

const logger = makeLoggers('useAvatarParts');

interface HookResult {
  avatarParts: AvatarPart[];
  loading: boolean;
  reload(): void;
}

export function useInventoryAvatarParts(): HookResult {
  const client = useClient();
  const [avatarParts, setAvatarParts] = useState<AvatarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef<boolean>(true);

  const load = useCallback(
    async function load() {
      while (mounted.current) {
        try {
          const avatarParts = await client.AvatarService.listAvatarParts();

          setAvatarParts(avatarParts);
          setLoading(false);
          return;
        } catch (err) {
          logger.logError('failed to load avatarParts, retrying in 5 seconds', err);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    },
    [client.AvatarService],
  );

  useEffect(() => {
    mounted.current = true;

    load();

    return () => {
      mounted.current = false;
    };
  }, [load]);

  return { avatarParts, loading, reload: load };
}
