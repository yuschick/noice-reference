import { useCallback } from 'react';

interface HookResult {
  addBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  removeBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  clearPlayerBoosterRequests: (playerId: string) => void;
  clearAllBoosterRequests: () => void;
}

interface Props {
  onAddBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  onRemoveBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  onClearPlayerBoosterRequests: (playerId: string) => void;
  onClearAllBoosterRequests: () => void;
}

export function useBoosterRequests({
  onAddBoosterRequest,
  onRemoveBoosterRequest,
  onClearPlayerBoosterRequests,
  onClearAllBoosterRequests,
}: Props): HookResult {
  const addBoosterRequest = useCallback(
    async (targetUserId: string, requestUserId: string) => {
      onAddBoosterRequest(targetUserId, requestUserId);
    },
    [onAddBoosterRequest],
  );

  const removeBoosterRequest = useCallback(
    (targetUserId: string, requestUserId: string) => {
      onRemoveBoosterRequest(targetUserId, requestUserId);
    },
    [onRemoveBoosterRequest],
  );

  const clearPlayerBoosterRequests = useCallback(
    (playerId: string) => {
      onClearPlayerBoosterRequests(playerId);
    },
    [onClearPlayerBoosterRequests],
  );

  const clearAllBoosterRequests = useCallback(() => {
    onClearAllBoosterRequests();
  }, [onClearAllBoosterRequests]);

  return {
    addBoosterRequest,
    removeBoosterRequest,
    clearPlayerBoosterRequests,
    clearAllBoosterRequests,
  };
}
