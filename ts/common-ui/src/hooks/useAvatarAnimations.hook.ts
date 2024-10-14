import { useClient } from '@noice-com/common-react-core';
import { Animation } from '@noice-com/schemas/avatar/animation.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

const logger = makeLoggers('useAvatarAnimations');

interface HookResult {
  animations: Nullable<Animation[]>;
  loading: boolean;
}

export function useAvatarAnimations(): HookResult {
  const cli = useClient();
  const [animations, setAnimations] = useState<Nullable<Animation[]>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      while (mounted) {
        try {
          const animations = await cli.AvatarAnimationService.listAnimations();
          setAnimations(animations);
          setLoading(false);
          return;
        } catch (err) {
          logger.logError('failed to load animations, retrying in 5 seconds', err);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [cli]);

  return { animations, loading };
}
