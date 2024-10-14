import { useEffect, useState } from 'react';

import { usePlayerActiveCard } from '../../card/hooks/usePlayerActiveCard.hook';
import { useLocalPlayerId } from '../../game/hooks';
import { useCardGamePlayer } from '../../player/hooks';

import { usePlayerBoosterApply } from './usePlayerBoosterApply.hook';
import { usePlayerBoosterRequests } from './usePlayerBoosterRequests.hook';

interface HookResult {
  hasRequestedBooster: boolean;
  isBoosterTarget: boolean;
}

export function useIsBoosterTarget(playerId: string): HookResult {
  const { applyModeActive, availableBooster } = usePlayerBoosterApply();
  const localPlayerId = useLocalPlayerId();
  const localPlayerRequests = usePlayerBoosterRequests(localPlayerId);

  const player = useCardGamePlayer(playerId);
  const currentCard = usePlayerActiveCard(playerId);
  const [isBoosterTarget, setIsBoosterTarget] = useState(false);
  const [hasRequestedBooster, setHasRequestedBooster] = useState(false);

  useEffect(() => {
    if (!player || !currentCard || !applyModeActive || !availableBooster) {
      setIsBoosterTarget(false);
      return;
    }

    const update = () => setIsBoosterTarget(availableBooster.canBeUsedOn(player));
    update();

    player.addListener('onCardSelected', update);
    currentCard.addListener('onSucceeded', update);
    currentCard.addListener('onFailed', update);

    return () => {
      player.removeListener('onCardSelected', update);
      currentCard.removeListener('onSucceeded', update);
      currentCard.removeListener('onFailed', update);
    };
  }, [applyModeActive, availableBooster, player, currentCard]);

  useEffect(() => {
    setHasRequestedBooster(localPlayerRequests.includes(playerId));
  }, [localPlayerRequests, playerId]);

  return {
    isBoosterTarget,
    hasRequestedBooster,
  };
}
