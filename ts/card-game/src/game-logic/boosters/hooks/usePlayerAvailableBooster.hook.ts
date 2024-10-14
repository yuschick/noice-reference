import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useCardGamePlayer } from '../../player/hooks';
import type { GameTimer } from '../../timer';
import type { CGAvailableBooster } from '../CGAvailableBooster';

import {
  CGPlayerOnBoosterAvailable,
  CGPlayerOnBoosterCooldownTimer,
} from '@game-logic/player';

interface HookResult {
  cooldownTimer: Nullable<GameTimer>;
  availableBooster: Nullable<CGAvailableBooster>;
  isTimerPaused: boolean;
}

export function usePlayerAvailableBooster(playerId: string): HookResult {
  const player = useCardGamePlayer(playerId);
  const [cooldownTimer, setTimer] = useState<Nullable<GameTimer>>(
    player?.nextBoosterTimer ?? null,
  );
  const [availableBooster, setAvailableBooster] = useState<Nullable<CGAvailableBooster>>(
    player?.getAvailableBooster() ?? null,
  );
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    if (!cooldownTimer) {
      return;
    }

    const updatePaused = ({ isPaused }: { isPaused: boolean }) => {
      setIsTimerPaused(isPaused);
    };

    cooldownTimer.addListener('onPausedStateChange', updatePaused);

    return () => {
      cooldownTimer.removeListener('onPausedStateChange', updatePaused);
    };
  }, [cooldownTimer]);

  useEffect(() => {
    if (!player) {
      return;
    }

    setTimer(player.nextBoosterTimer);
    setAvailableBooster(player.getAvailableBooster());

    const clear = () => {
      setTimer(null);
      setAvailableBooster(null);
    };

    const onBooster = ({ booster }: CGPlayerOnBoosterAvailable) => {
      setAvailableBooster(booster);
      setTimer(null);
    };

    const onTimer = ({ timer }: CGPlayerOnBoosterCooldownTimer) => {
      setAvailableBooster(null);
      setTimer(timer);
    };

    player.addListener('onBoosterAvailable', onBooster);
    player.addListener('onBoosterCooldownTimer', onTimer);
    player.addListener('onRemoved', clear);

    return () => {
      player.removeListener('onBoosterAvailable', onBooster);
      player.removeListener('onBoosterCooldownTimer', onTimer);
      player.removeListener('onRemoved', clear);
    };
  }, [player]);

  return {
    cooldownTimer,
    availableBooster,
    isTimerPaused,
  };
}
