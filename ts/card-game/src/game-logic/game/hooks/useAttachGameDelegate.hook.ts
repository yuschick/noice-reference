import { IMatchGroupDelegate } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { useStreamGame } from '../context';

type DetachHandler = () => void;
type PartialDelegate = Partial<IMatchGroupDelegate>;

interface HookResult {
  attach: (delegate: PartialDelegate) => DetachHandler;
  detach: DetachHandler;
}

export function useAttachGameDelegate(): HookResult {
  const { gameInstance } = useStreamGame();
  const [delegate, setDelegate] = useState<Nullable<PartialDelegate>>(null);

  useEffect(() => {
    if (!delegate || !gameInstance) {
      return;
    }

    gameInstance?.attachDelegate(delegate);
    return () => {
      gameInstance?.detachDelegate(delegate);
    };
  }, [gameInstance, delegate]);

  const attach = useCallback((newDelegate: PartialDelegate) => {
    setDelegate(newDelegate);
    return () => setDelegate(null);
  }, []);

  const detach = useCallback(() => {
    setDelegate(null);
  }, []);

  return {
    attach,
    detach,
  };
}
