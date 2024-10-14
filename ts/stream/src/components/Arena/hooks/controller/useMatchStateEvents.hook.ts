import { useCardGameState } from '@noice-com/card-game';
import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

interface Props {
  arenaController: ArenaControllerType;
}

export function useMatchStateEvents({ arenaController }: Props) {
  const gameState = useCardGameState();

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const onMatchStarted = () => {
      arenaController.triggerCrowdAnimationByCategory(AnimationCategory.CATEGORY_EXCITED);
    };

    const onMatchEnded = () => {};

    const onMatchResultsAvailable = () => {
      const playerIds =
        gameState?.matchResultSystem.matchResults?.bestGroup?.players?.reduce<string[]>(
          (prev, current) => {
            current.id && prev.push(current.id);
            return prev;
          },
          [],
        ) ?? [];

      playerIds.forEach((playerId) =>
        arenaController.triggerPlayerAnimation({
          playerId: playerId,
          animationCategory: AnimationCategory.CATEGORY_EXCITED,
        }),
      );
    };

    gameState?.addListener('onMatchStarted', onMatchStarted);
    gameState?.addListener('onMatchEnded', onMatchEnded);
    gameState?.matchResultSystem.addListener(
      'onMatchResultsAvailable',
      onMatchResultsAvailable,
    );

    return () => {
      gameState?.removeListener('onMatchStarted', onMatchStarted);
      gameState?.removeListener('onMatchEnded', onMatchEnded);
    };
  }, [gameState, arenaController]);
}
