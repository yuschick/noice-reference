import { useAuthenticatedUser, useSoundController } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef } from 'react';

import { useActiveCardSoundData } from './useActiveCardSoundData.hook';

import { useAonSounds } from '@game-common/sound/hooks';
import {
  CGActiveCardOnPointsUpdated,
  CGActiveCardOnTargetValueChanged,
} from '@game-logic/card';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useMatchEnded } from '@game-logic/game/hooks';
import { GameSoundKeys } from '@game-types';

export function useActiveCardSounds() {
  const { userId: localPlayerId } = useAuthenticatedUser();

  const previousCardProgress = useRef<Nullable<number>>(null);
  const activeCard = usePlayerActiveCard(localPlayerId);
  const activeCardData = useActiveCardSoundData(activeCard?.cardId ?? null);

  const soundController = useSoundController();
  const { playAonCloseToSucceeding } = useAonSounds();

  const resetProgress = useCallback(() => {
    previousCardProgress.current = null;
  }, []);

  // Reset previous card progress
  useMatchEnded(resetProgress);

  useEffect(() => {
    resetProgress();
  }, [activeCard, resetProgress]);

  // Subscriptions
  useEffect(() => {
    if (!activeCardData || !activeCard || activeCardData.id !== activeCard.cardId) {
      return;
    }

    const handlePointsUpdated = ({ isMaxedOut }: CGActiveCardOnPointsUpdated) => {
      if (isMaxedOut) {
        soundController.playSound(GameSoundKeys.CardsMaxPoints);
      }
    };

    const handleTargetValueChanged = ({
      timerDuration,
    }: CGActiveCardOnTargetValueChanged) => {
      // Trigger countdown sound when 5 seconds left. The sound lasts 5 seconds so no need
      // to cancel it separately
      if (timerDuration === 5 && activeCardData.isAllOrNothing) {
        playAonCloseToSucceeding();
        return;
      }
    };

    activeCard.addListener('onPointsUpdated', handlePointsUpdated);
    activeCard.addListener('onTargetValueChanged', handleTargetValueChanged);
    return () => {
      activeCard.removeListener('onPointsUpdated', handlePointsUpdated);
      activeCard.removeListener('onTargetValueChanged', handleTargetValueChanged);
    };
  }, [activeCardData, activeCard, soundController, playAonCloseToSucceeding]);
}
