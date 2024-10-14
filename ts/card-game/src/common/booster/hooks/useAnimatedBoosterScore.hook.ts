import { SetTimeoutId } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { CardHighlightState } from '../../card/types';

interface HookResult {
  animatedPlayerScore: Nullable<number>;
  scoreAnimationDuration?: number;
  showBoosterLabels: boolean;
}

interface Props {
  highlightState: Nullable<CardHighlightState>;
}

export function useAnimatedBoosterScore({ highlightState }: Props): HookResult {
  const [showBoosterLabels, setShowBoosterLabels] = useState<boolean>(false);
  const [animatedPlayerScore, setAnimatedPlayerScore] = useState<Nullable<number>>(null);

  // Prototyping about score animations
  useEffect(() => {
    // When highlight state over, clear states
    // We also don't want to animate the score if having AoN dialog
    if (!highlightState || !highlightState.boosterAnimationTimings) {
      setShowBoosterLabels(false);
      setAnimatedPlayerScore(null);
      return;
    }
    const timeouts: SetTimeoutId[] = [];

    const {
      playerScoreDuration,
      highlightBoosterDuration,
      boosterLabelStartDelay,
      boosterScoreStartDelay,
      boosterScoreInternalDelay,
      highlightBoosterDelay,
    } = highlightState.boosterAnimationTimings;

    // 1. Add the card points without boosters to the score
    const highlightScoreWithoutBoosters =
      highlightState.playerTotalPoints -
      highlightState.boosters.reduce((acc, booster) => acc + (booster.points ?? 0), 0);
    setAnimatedPlayerScore(highlightScoreWithoutBoosters);

    // 2. Start timeouts adding booster points to the score
    highlightState.boosters.forEach((booster, index) => {
      timeouts.push(
        setTimeout(() => {
          setAnimatedPlayerScore((prev) => (prev ?? 0) + (booster.points ?? 0));
        }, playerScoreDuration + boosterScoreStartDelay + index * highlightBoosterDuration + index * highlightBoosterDelay + boosterScoreInternalDelay),
      );
    });

    // 3. Start animating the booster labels on top of the score
    timeouts.push(
      setTimeout(
        () => setShowBoosterLabels(true),
        playerScoreDuration + boosterLabelStartDelay,
      ),
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [highlightState]);

  return {
    showBoosterLabels,
    animatedPlayerScore,
    scoreAnimationDuration: highlightState
      ? showBoosterLabels
        ? highlightState.boosterAnimationTimings?.boosterScoreInternalDuration
        : highlightState.boosterAnimationTimings?.playerScoreDuration
      : undefined,
  };
}
