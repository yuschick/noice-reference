import { useSpectatorCoordination } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { StreamGameState } from '../types';

import { useStreamGameActions } from './useStreamGameActions.hook';

interface HookResult {
  spectatorState: Nullable<StreamGameState>;
  spectateGame: (streamId: string) => void;
}

export function useSpectatorState(): HookResult {
  const [streamId, setStreamId] = useState<Nullable<string>>(null);
  const [spectatorState, setSpectatorState] = useState<Nullable<StreamGameState>>(null);
  const { spectateGame } = useStreamGameActions();

  const { groupID } = useSpectatorCoordination(streamId);
  const [isChangeBlocked, setChangeBlocked] = useState(false);

  const initSpectatorState = useCallback(
    async (streamId: string, groupID: string) => {
      const [gameInstance, err] = await spectateGame(streamId, groupID);
      if (err) {
        setSpectatorState({
          streamId: null,
          channelId: null,
          matchGroupId: null,
          gameInstance: null,
          isSolo: false,
          gameError: err,
        });
        return;
      }

      setSpectatorState({
        streamId,
        gameInstance,
        matchGroupId: groupID,
        isSolo: false,
        gameError: null,
        channelId: null,
      });
    },
    [spectateGame],
  );

  // Init a new game instance when the groupID changes
  useEffect(() => {
    if (!groupID || !streamId || isChangeBlocked) {
      return;
    }

    initSpectatorState(streamId, groupID);
  }, [groupID, isChangeBlocked, initSpectatorState, streamId]);

  const gameInstance = spectatorState?.gameInstance;

  // Reset and reconnect if server indicates that
  useEffect(() => {
    if (!gameInstance || !streamId || !groupID) {
      return;
    }

    const retry = () => initSpectatorState(streamId, groupID);

    gameInstance.addListener('onRetryMatchMaking', retry);

    return () => {
      gameInstance.removeListener('onRetryMatchMaking', retry);
    };
  }, [gameInstance, streamId, groupID, initSpectatorState]);

  // Subscribe to game events when the game instance is ready
  // so we can update if we are blocked from changing groups
  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const onCinematicStarted = () => setChangeBlocked(true);
    const onCinematicEnded = () => setChangeBlocked(false);

    gameInstance.on('onCinematicStarted', onCinematicStarted);
    gameInstance.on('onCinematicEnded', onCinematicEnded);

    return () => {
      gameInstance.off('onCinematicStarted', onCinematicStarted);
      gameInstance.off('onCinematicEnded', onCinematicEnded);
    };
  }, [gameInstance]);

  return {
    spectatorState: spectatorState,
    spectateGame: setStreamId,
  };
}
