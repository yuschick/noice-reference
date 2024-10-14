import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import {
  CGAvailableBooster,
  CGAvailableBoosterOnBoosterRequested,
} from '@game-logic/boosters';

interface HookResult {
  requestedBy: string[];
  onRequestAnimationEnd: (requesteeId: string) => void;
}

export function useBoosterRequestPreviews(
  availableBooster: Nullable<CGAvailableBooster>,
): HookResult {
  const [requestedBy, setRequestedBy] = useState<string[]>([]);

  const onRequestAnimationEnd = (requesteeId: string) => {
    setRequestedBy((prev) => prev.filter((id) => id !== requesteeId));
  };

  useEffect(() => {
    if (!availableBooster) {
      return;
    }

    const onNewRequest = ({ requesteeId }: CGAvailableBoosterOnBoosterRequested) => {
      setRequestedBy((prev) => [...prev, requesteeId]);
    };

    availableBooster.addListener('onBoosterRequested', onNewRequest);

    return () => {
      availableBooster.removeListener('onBoosterRequested', onNewRequest);
    };
  }, [availableBooster]);

  return {
    requestedBy,
    onRequestAnimationEnd,
  };
}
