import { useEffect, useState } from 'react';

import { usePlayerAvailableBooster } from './usePlayerAvailableBooster.hook';

export function usePlayerBoosterRequests(playerId: string): string[] {
  const { cooldownTimer, availableBooster } = usePlayerAvailableBooster(playerId);
  const [requests, setRequests] = useState<string[]>(
    availableBooster?.currentRequests ?? [],
  );

  // Reset requests manually if we get a cooldown timer
  // (they will be reset with the new instance, but this reflects the
  // change in react as well)
  useEffect(() => {
    if (!cooldownTimer) {
      return;
    }

    setRequests([]);
  }, [cooldownTimer]);

  useEffect(() => {
    if (!availableBooster) {
      return;
    }

    // Since the booster instance handles merging the list for us,
    // we can avoid the duplicate work by just updating requests to
    // equal whatever the class is currently equal to.
    const updateRequests = () => {
      setRequests(availableBooster.currentRequests);
    };

    // Save initial state when we get a booster, then subscribe.
    updateRequests();
    availableBooster.addListener('onBoosterRequested', updateRequests);
    availableBooster.addListener('onRequestCancelled', updateRequests);

    return () => {
      availableBooster.removeListener('onBoosterRequested', updateRequests);
      availableBooster.removeListener('onRequestCancelled', updateRequests);
    };
  }, [availableBooster]);

  return requests;
}
