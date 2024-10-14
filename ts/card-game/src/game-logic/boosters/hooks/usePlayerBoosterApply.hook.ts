import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useCardGameState } from '../../game/context';
import { useCardGameLocalPlayer } from '../../player/hooks';
import type { CGAvailableBooster } from '../CGAvailableBooster';

import { useGameAnalytics } from '@game-common/analytics/hooks';
import { CGPlayerOnApplyingBooster } from '@game-logic/player';

interface HookResult {
  applyModeActive: boolean;
  availableBooster: Nullable<CGAvailableBooster>;
  toggleApplyMode: (active: boolean) => void;
  applyBooster: (target: string) => Promise<boolean>;
}

export function usePlayerBoosterApply(): HookResult {
  const gameState = useCardGameState();
  const player = useCardGameLocalPlayer();
  const { sendBoosterClickedEvent } = useGameAnalytics();

  const [applyModeActive, setApplyModeActive] = useState<boolean>(
    player?.isApplyingBooster ?? false,
  );
  const [availableBooster, setAvailableBooster] = useState<Nullable<CGAvailableBooster>>(
    player?.getAvailableBooster() ?? null,
  );

  useEffect(() => {
    if (!player) {
      return;
    }

    setApplyModeActive(player.isApplyingBooster);
    setAvailableBooster(player.getAvailableBooster() ?? null);

    const handleModeChanged = ({ isApplying, booster }: CGPlayerOnApplyingBooster) => {
      setApplyModeActive(isApplying);
      setAvailableBooster(booster);
    };

    player.addListener('onApplyingBooster', handleModeChanged);

    return () => {
      player.removeListener('onApplyingBooster', handleModeChanged);
    };
  }, [player]);

  const toggleApplyMode = (active: boolean) => {
    player?.toggleBoosterApply(active);

    if (active && availableBooster) {
      sendBoosterClickedEvent(availableBooster);
    }
  };

  const applyBooster = async (target: string): Promise<boolean> => {
    const targetPlayer = gameState?.getPlayer(target);

    // If statements broken apart for readability and maintainability
    if (!targetPlayer || !availableBooster) {
      return false;
    }

    const result = await availableBooster.useBooster(targetPlayer);

    if (result) {
      player?.toggleBoosterApply(false);
    }

    return result;
  };

  return {
    applyModeActive,
    toggleApplyMode,
    availableBooster,
    applyBooster,
  };
}
