import { useAnimatedNumber } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { CardGameRoundPhasePreparation } from '@game-logic/game';
import { useCardGameState } from '@game-logic/game/context';
import { GameTimer } from '@game-logic/timer';

interface HookResult {
  secondsLeft: number;
  isCountingDown: boolean;
  timeLeftClassNameKey: string;
  timeLeftPercentage: number;
}

const numberToWordMap: { [key: number]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
};

export function useRoundPreparationState(): HookResult {
  const [roundPreparationTimer, setRoundPreparationTimer] =
    useState<Nullable<GameTimer>>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(() =>
    roundPreparationTimer && roundPreparationTimer.timeLeft > 1000
      ? roundPreparationTimer.timeLeft
      : 1000,
  );

  const gameInstance = useCardGameState();

  // Update the state when the round has ended
  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const handleRoundEnded = ({ roundStartsTimer }: CardGameRoundPhasePreparation) =>
      setRoundPreparationTimer(roundStartsTimer);

    setRoundPreparationTimer(gameInstance.roundPhaseCountdown);

    gameInstance.addListener('onRoundPhasePreparation', handleRoundEnded);

    return () => {
      gameInstance.removeListener('onRoundPhasePreparation', handleRoundEnded);
    };
  }, [gameInstance]);

  const { value: animatedCountdownValue, isAnimating: isCountingDown } =
    useAnimatedNumber({
      // we are not showing 0 sec left so we end to 1
      target: 1,
      initialValue: timeLeftMs / 1000,
      duration: timeLeftMs - 1000,
    });

  // Calculate percentage of time left from 15 seconds
  const secondsLeftNumber = parseInt(animatedCountdownValue, 10);
  const timeLeftPercentage =
    isCountingDown && secondsLeftNumber < 15 ? (secondsLeftNumber / 14 - 1) * 100 - 8 : 0;

  // Determine the class name based on time left
  const classNameKey = numberToWordMap[secondsLeftNumber];
  const timeLeftClassNameKey = secondsLeftNumber <= 5 ? `${classNameKey}SecondsLeft` : '';

  // Update time left if timer updates
  useEffect(() => {
    if (!roundPreparationTimer) {
      return;
    }

    const updateTimeLeft = () =>
      setTimeLeftMs(
        roundPreparationTimer.timeLeft > 1000 ? roundPreparationTimer.timeLeft : 1000,
      );

    updateTimeLeft();
    // If the tab is not visible and back visible update the countdown
    //
    // @todo: this type of logic should probably be part of useAnimatedNumber
    // but need to iterate on this fast so doing it here for now
    const onTabNotVisible = () => {
      if (document.hidden) {
        return;
      }
      updateTimeLeft();
    };

    document.addEventListener('visibilitychange', onTabNotVisible);

    return () => {
      document.removeEventListener('visibilitychange', onTabNotVisible);
    };
  }, [roundPreparationTimer]);

  return {
    secondsLeft: secondsLeftNumber,
    isCountingDown,
    timeLeftClassNameKey,
    timeLeftPercentage,
  };
}
