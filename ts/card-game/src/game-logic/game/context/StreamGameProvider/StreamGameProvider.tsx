import { gql } from '@apollo/client';
import { useKeyContentLoadTracker } from '@noice-com/common-ui';
import { Nullable, makeLoggers } from '@noice-com/utils';
import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from 'react';

import { useCardGameAPIInternal } from '../../../../context/CardGameAPIProvider';
import { CardGame } from '../../CardGame';

import { useSpectatorState } from './hooks/useSpectatorState.hook';
import {
  ChangeTeamOptions,
  JoinGameOptions,
  LeaveGameOptions,
  useStreamGameActions,
} from './hooks/useStreamGameActions.hook';
import { StreamGameState } from './types';

import { useGameSessionStorage } from '@game-common/session/hooks';
import { useStreamGameChannelLazyQuery } from '@game-gen';

const { logInfo, logWarn } = makeLoggers('game-logic:game:StreamGameProvider');

export interface StreamGameProviderContext extends StreamGameState {
  isJoiningGame: boolean;
  joinGame(streamId: string, options?: JoinGameOptions): Promise<void>;
  spectateGame(streamId: string): void;
  changeTeam(streamId: string, options?: ChangeTeamOptions): Promise<void>;
  leaveGame(options?: LeaveGameOptions): Promise<void>;
}

const defaultStreamGameState: StreamGameState = {
  streamId: null,
  channelId: null,
  matchGroupId: null,
  gameInstance: null,
  isSolo: false,
  gameError: null,
};

const Context = createContext<StreamGameProviderContext>({
  ...defaultStreamGameState,

  joinGame: () => Promise.resolve(),
  spectateGame: () => {},
  changeTeam: () => Promise.resolve(),
  leaveGame: () => Promise.resolve(),
  isJoiningGame: false,
});

gql`
  query StreamGameChannel($id: ID!) {
    stream(id: $id) {
      streamId
      channelId
    }
  }
`;

interface Props {
  children: ReactNode;
}

export function StreamGameProvider({ children }: Props) {
  const sessionStorage = useGameSessionStorage();
  const { emitAPIEvent } = useCardGameAPIInternal();
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  useKeyContentLoadTracker('joining_game', isJoiningGame);

  // For internal use we want to access isJoiningGame value through ref
  // so our functions don't update on isJoiningGame state change
  const isJoiningGameInternalRef = useRef(false);

  // State
  const [streamGameState, setStreamGameState] = useState<StreamGameState>({
    ...defaultStreamGameState,
  });
  const { spectatorState, spectateGame } = useSpectatorState();

  const [fetchStreamGameChannelData] = useStreamGameChannelLazyQuery();

  const {
    joinGame: joinGameAction,
    leaveGame: leaveGameAction,
    changeTeam: changeTeamAction,
  } = useStreamGameActions();

  const changeTeam = useCallback(
    async (streamId: string, options?: ChangeTeamOptions) => {
      const { isSolo = false } = options ?? {};

      const [matchGroup, teamChangeAvailableAt, err] = await changeTeamAction(
        streamId,
        options,
      );

      setStreamGameState((prev) => {
        if (err) {
          return {
            ...prev,
            gameError: err,
          };
        }

        // if no vacant teams, don't change the match group
        if (!matchGroup) {
          return prev;
        }

        sessionStorage.setValue('gameStream.active.streamId', streamId);
        sessionStorage.setValue('gameStream.active.isSoloPlay', isSolo ?? false);

        prev.gameInstance?.setTeamChangeAvailableAt(teamChangeAvailableAt);
        emitAPIEvent('onChangeTeamSucceeded', isSolo ?? false);

        // The same match group gets re-used whenever change team occurs,
        // so we can just update the ID and keep the same instances.
        return {
          ...prev,
          isSolo,
          matchGroup,
          matchGroupId: matchGroup?.groupId ?? null,
          gameError: null,
        };
      });
    },
    [changeTeamAction, emitAPIEvent, sessionStorage],
  );

  const leaveGame = useCallback(
    async (options?: LeaveGameOptions) => {
      const err = await leaveGameAction(options);

      sessionStorage.setValue('gameStream.active.streamId', '');
      sessionStorage.setValue('gameStream.active.isSoloPlay', false);

      setStreamGameState({
        ...defaultStreamGameState,
        gameError: err ?? null,
      });
    },
    [leaveGameAction, sessionStorage],
  );

  const joinGame = useCallback(
    async (streamId: string, options?: JoinGameOptions) => {
      if (isJoiningGameInternalRef.current) {
        logWarn('joinGame has been already called! Something caused race condition');
      }

      isJoiningGameInternalRef.current = true;
      setIsJoiningGame(true);

      const { isSolo = false } = options ?? {};
      const [game, err] = await joinGameAction(streamId, options);

      const { data } = await fetchStreamGameChannelData({ variables: { id: streamId } });

      if (!err) {
        // Add instance to local storage
        sessionStorage.setValue('gameStream.active.streamId', streamId);
        sessionStorage.setValue('gameStream.active.isSoloPlay', isSolo ?? false);
      }

      // If err is set, we can safely assume that game is null
      // (since we don't return the game instance on error)
      setStreamGameState({
        streamId: err ? null : streamId,
        channelId: err ? null : data?.stream?.channelId ?? null,
        isSolo: err ? false : !!isSolo,
        gameError: err ?? null,
        // @note: We have to use the ID from match group because game instance gets it async
        // and it does not have the ID at this point.
        matchGroupId: game?.matchGroup?.groupId ?? null,
        gameInstance: game ?? null,
      });

      setIsJoiningGame(false);
      isJoiningGameInternalRef.current = false;
    },
    [fetchStreamGameChannelData, joinGameAction, sessionStorage],
  );

  // Reset and reconnect if server indicates that
  useEffect(() => {
    if (!streamGameState?.gameInstance || !streamGameState?.streamId) {
      return;
    }

    const { gameInstance, streamId, isSolo } = streamGameState;

    const retry = () => {
      logInfo(`Retrying match making: streamId=${streamId} isSolo=${isSolo}`);
      joinGame(streamId, { isSolo, forceGroupReset: true });
    };

    gameInstance.addListener('onRetryMatchMaking', retry);

    return () => {
      gameInstance.removeListener('onRetryMatchMaking', retry);
    };
  }, [streamGameState, joinGame]);

  return (
    <Context.Provider
      value={{
        ...(spectatorState ? spectatorState : streamGameState),

        joinGame,
        spectateGame,
        changeTeam,
        leaveGame,
        isJoiningGame,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStreamGame(): StreamGameProviderContext {
  return useContext(Context);
}

export function useCardGameState(): Nullable<CardGame> {
  const { gameInstance } = useContext(Context);

  return gameInstance;
}

export interface MockStreamGameProviderProps extends StreamGameProviderContext {
  children: ReactNode;
}

export function MockStreamGameProvider({
  children,
  joinGame,
  spectateGame,
  changeTeam,
  leaveGame,
  ...rest
}: MockStreamGameProviderProps) {
  return (
    <Context.Provider
      value={{
        ...rest,
        joinGame,
        spectateGame,
        changeTeam,
        leaveGame,
      }}
    >
      {children}
    </Context.Provider>
  );
}
