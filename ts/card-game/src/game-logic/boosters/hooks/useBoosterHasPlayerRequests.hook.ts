import { useEffect, useState } from 'react';

import { useLocalPlayerId } from '../../game/hooks';

import { usePlayerBoosterRequests } from './usePlayerBoosterRequests.hook';

export function useBoosterHasPlayerRequests(ownerId: string): boolean {
  const localPlayerId = useLocalPlayerId();
  const requests = usePlayerBoosterRequests(ownerId);
  const [hasBeenRequested, setHasBeenRequested] = useState(requests.includes(ownerId));

  useEffect(() => {
    setHasBeenRequested(requests.includes(localPlayerId));
  }, [localPlayerId, requests]);

  return hasBeenRequested;
}
