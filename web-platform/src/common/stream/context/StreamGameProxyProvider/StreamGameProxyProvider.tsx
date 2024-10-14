import { gql } from '@apollo/client';
import {
  StreamGameProviderContext,
  // eslint-disable-next-line no-restricted-imports
  useStreamGame as useStreamGameContext,
  JoinGameOptions,
  LeaveGameOptions,
} from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';
import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { StreamGameProxyStreamFragment, useStreamGameProxyChannelLazyQuery } from '@gen';

gql`
  fragment StreamGameProxyStream on ChannelStreamSummary {
    streamId
    channelId
    noicePredictionsEnabled
  }
  query StreamGameProxyChannel($streamId: ID!) {
    streamSummary(id: $streamId) {
      ...StreamGameProxyStream
    }
  }
`;

const Context = createContext<Nullable<StreamGameProviderContext>>(null);

interface Props {
  children: ReactNode;
}

/**
 * StreamGameProxyProvider acts as a thin wrapper around StreamGameProvider. It allows us to
 * stream the raw stream if noice predictions is disabled. Also to show raw stream in spectator
 * mode when no groups are available.
 */
export function StreamGameProxyProvider({ children }: Props) {
  const context = useStreamGameContext();

  const { spectateGame, joinGame, leaveGame } = context;

  const [modifiedState, setModifiedState] =
    useState<Nullable<Pick<StreamGameProviderContext, 'streamId' | 'channelId'>>>(
      context,
    );

  const [fetchStreamFunc] = useStreamGameProxyChannelLazyQuery();

  const leaveGameFunc = useCallback(
    async (options?: LeaveGameOptions) => {
      setModifiedState(null);
      leaveGame(options);
    },
    [leaveGame],
  );

  const fetchStream = useCallback(
    async (streamId: string): Promise<StreamGameProxyStreamFragment> => {
      const { data } = await fetchStreamFunc({
        variables: {
          streamId,
        },
      });
      const stream = data?.streamSummary;

      if (!stream) {
        throw new Error("Couldn't find channel with stream id: " + streamId);
      }

      return stream;
    },
    [fetchStreamFunc],
  );

  const joinGameFunc = useCallback(
    async (streamId: string, options?: JoinGameOptions) => {
      const stream = await fetchStream(streamId);

      const isNoicePredictionsDisabled = !stream.noicePredictionsEnabled;

      // If noice predictions is disabled, we don't call join game for the stream game, we just
      // update stream id and channel id to the state so that we can render raw stream
      if (isNoicePredictionsDisabled) {
        // To cover our back in case we are joining again to existing game
        await leaveGame();

        const channelId = stream.channelId;

        setModifiedState({ streamId, channelId });
        return;
      }

      // Just in case empty proxied state since we are having the default state behaviour of StreamGameProvider
      setModifiedState(null);
      await joinGame(streamId, options);
    },
    [joinGame, leaveGame, fetchStream],
  );

  const spectateGameFunc = useCallback(
    async (streamId: string) => {
      const stream = await fetchStream(streamId);

      const channelId = stream.channelId;

      // we update the streamId & channelId to the state right away so that we can start render the stream
      setModifiedState({ streamId, channelId });
      spectateGame(streamId);
    },
    [spectateGame, fetchStream],
  );

  return (
    <Context.Provider
      value={{
        ...context,
        channelId: modifiedState?.channelId ?? context.channelId,
        streamId: modifiedState?.streamId ?? context.streamId,
        spectateGame: spectateGameFunc,
        joinGame: joinGameFunc,
        leaveGame: leaveGameFunc,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStreamGame(): StreamGameProviderContext {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Trying to use useStreamGame without having StreamGameProxyProvider');
  }

  return context;
}
