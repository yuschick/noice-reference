import { useStreamGame } from '@noice-com/card-game';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import {
  ContentMode,
  ContentModeUserSpotlightMode,
} from '@noice-com/schemas/rendering/transitions.pb';
import { useCallback, useEffect, useRef, useState } from 'react';

import { StreamProp } from '@stream-types';

interface Props {
  contentMode: StreamProp<ContentMode>;
}

interface HookResult {
  contentMode: StreamProp<ContentMode>;
}

export function useLocalContentModeOverride({ contentMode }: Props): HookResult {
  const [internalContentMode, setInternalContentMode] =
    useState<StreamProp<ContentMode>>(contentMode);
  const timeoutRefs = useRef<number[]>([]);

  const { gameInstance } = useStreamGame();

  const clearTimeoutRefs = useCallback(() => {
    timeoutRefs.current.forEach((ref) => window.clearTimeout(ref));
  }, []);

  useEffect(() => {
    if (
      !contentMode.value?.game &&
      !contentMode.value?.cameraDrive &&
      !contentMode.value?.matchEnd
    ) {
      return;
    }

    clearTimeoutRefs();
    setInternalContentMode(contentMode);
  }, [contentMode, clearTimeoutRefs]);

  useEffect(() => {
    if (!gameInstance?.matchResultSystem) {
      return;
    }

    const onResults = () => {
      clearTimeoutRefs();

      const stepTimeoutRefs: number[] = [];
      const firstStepExtraDuration = 2500;
      const defaultStepDuration = 7000;

      const getStepTimeout = () => {
        if (!stepTimeoutRefs.length) {
          return 0;
        }

        return stepTimeoutRefs.length * defaultStepDuration + firstStepExtraDuration;
      };

      const addStep = (contentMode: ContentMode) => {
        const ref = window.setTimeout(() => {
          setInternalContentMode({ ageMs: 0, value: contentMode });
        }, getStepTimeout());

        stepTimeoutRefs.push(ref);
      };

      const endedMsg = gameInstance.matchResultSystem.matchResults as MatchEndedMsg;

      // Set group spotlight
      if (endedMsg.bestGroup) {
        const { group, players } = endedMsg.bestGroup;

        if (!group || !players) {
          return;
        }

        addStep({
          groupSpotlight: {
            groupId: group.id,
            groupName: group.name,
            players: players.map((details) => {
              return { points: details.points, userId: details.id };
            }),
            points: group.points,
          },
        });
      }

      // Set best card spotlight
      if (endedMsg.bestCard) {
        const { groupName, succeedingCard } = endedMsg.bestCard;

        if (!succeedingCard) {
          return;
        }

        addStep({
          userSpotlight: {
            mode: ContentModeUserSpotlightMode.MODE_BEST_CARD,
            card: { groupName, succeedingCard },
            userId: succeedingCard.userId,
          },
        });
      }

      // Set best player spotlight
      if (endedMsg.bestPlayer) {
        const { groupName, id, points } = endedMsg.bestPlayer;

        if (!id || !points) {
          return;
        }

        addStep({
          userSpotlight: {
            mode: ContentModeUserSpotlightMode.MODE_BEST_PLAYER,
            userId: id,
            player: { groupName, id, points },
          },
        });
      }

      timeoutRefs.current = stepTimeoutRefs;
    };

    gameInstance.matchResultSystem.addListener('onMatchResultsAvailable', onResults);
    gameInstance.addListener('onMatchStarted', clearTimeoutRefs);

    return () => {
      clearTimeoutRefs();

      gameInstance.matchResultSystem.removeListener('onMatchResultsAvailable', onResults);
      gameInstance.removeListener('onMatchStarted', clearTimeoutRefs);
    };
  }, [gameInstance, clearTimeoutRefs]);

  return { contentMode: internalContentMode };
}
