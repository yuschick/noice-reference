import { gql, useApolloClient } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { WithChildren, useAuthentication } from '@noice-com/common-ui';
import { DeepPartial, Nullable } from '@noice-com/utils';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router';

import { setTag } from '../../../../sentry';
import { StreamViewState } from '../../types';
import { useStreamGame } from '../StreamGameProxyProvider';

import { useDebugContext } from '@common/debug';
import { useIsChannelRoute } from '@common/route';
import {
  ChannelChannel,
  ChannelLiveStatus,
  ChannelStream,
  ChannelStreamSummary,
  StreamStateChannelLiveStateDocument,
  StreamStateChannelLiveStateSubscription,
  StreamStateChannelLiveStateSubscriptionVariables,
  useStreamStateProfileLazyQuery,
} from '@gen';

interface Context {
  streamViewState: StreamViewState;
  streamWrapperRef: RefObject<HTMLDivElement>;
  setStreamViewState: Dispatch<SetStateAction<StreamViewState>>;
}

gql`
  subscription StreamStateChannelLiveState($channelId: ID) {
    channelStreamDetailSubscribe(channelId: $channelId) {
      channelId
      liveStatus
      streamId
      matureRatedContent
      serverRenderingEnabled
    }
  }

  query StreamStateProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        matureRatedContentAllowed
      }
    }
  }
`;

const StreamStateContext = createContext<Context | null>(null);

export function StreamStateProvider({ children }: WithChildren) {
  const { userId, isFullAccount } = useAuthentication();
  const client = useApolloClient();
  const streamWrapperRef = useRef<HTMLDivElement>(null);
  const { isChannelRoute: onChannelPage, isChannelSubRoute: onChannelSubRoute } =
    useIsChannelRoute();
  const location = useLocation();

  const [streamViewState, setStreamViewState] = useState(StreamViewState.None);

  const { leaveGame, streamId, channelId } = useStreamGame();
  const { forceChannelOnline } = useDebugContext();

  useEffect(() => {
    if (!streamId) {
      setStreamViewState(StreamViewState.None);
    }
  }, [streamId]);

  useEffect(() => {
    setTag('noi.stream-view-state', streamViewState);
  }, [streamViewState]);

  const [fetchCurrentProfile] = useStreamStateProfileLazyQuery();

  const subscriptionOptions = variablesOrSkip({ channelId });
  useRestartingSubscription<
    StreamStateChannelLiveStateSubscription,
    StreamStateChannelLiveStateSubscriptionVariables
  >(StreamStateChannelLiveStateDocument, {
    ...subscriptionOptions,
    skip: subscriptionOptions.skip || forceChannelOnline,
    async onData({ data: { data } }) {
      // Update the Apollo Cache result
      client.cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: client.cache.identify({
            __typename: 'ChannelChannel',
            id: channelId,
          }),
          fragment: gql`
            fragment ActiveChannelLiveStatus on ChannelChannel {
              liveStatus
              currentStreamId
              id
              matureRatedContent
            }
          `,
        },
        (oldData) => ({
          ...oldData,
          liveStatus: data?.channelStreamDetailSubscribe?.liveStatus,
          currentStreamId: data?.channelStreamDetailSubscribe?.streamId,
          matureRatedContent: data?.channelStreamDetailSubscribe?.matureRatedContent,
        }),
      );

      client.cache.updateFragment<DeepPartial<ChannelStream>>(
        {
          id: client.cache.identify({
            __typename: 'ChannelStream',
            streamId: data?.channelStreamDetailSubscribe?.streamId,
          }),
          fragment: gql`
            fragment ActiveStreamLiveStatus on ChannelStream {
              streamId
              serverRenderingEnabled
            }
          `,
        },
        (oldData) => ({
          ...oldData,
          streamId: data?.channelStreamDetailSubscribe?.streamId,
          serverRenderingEnabled:
            data?.channelStreamDetailSubscribe?.serverRenderingEnabled,
        }),
      );

      client.cache.updateFragment<DeepPartial<ChannelStreamSummary>>(
        {
          id: client.cache.identify({
            __typename: 'ChannelStreamSummary',
            streamId: data?.channelStreamDetailSubscribe?.streamId,
          }),
          fragment: gql`
            fragment ActiveChannelSummaryLiveStatus on ChannelStreamSummary {
              streamId
              matureRatedContent
              serverRenderingEnabled
              channelId
            }
          `,
        },
        (oldData) => ({
          ...oldData,
          serverRenderingEnabled:
            data?.channelStreamDetailSubscribe?.serverRenderingEnabled,
          streamId: data?.channelStreamDetailSubscribe?.streamId,
          matureRatedContent: data?.channelStreamDetailSubscribe?.matureRatedContent,
          channelId: data?.channelStreamDetailSubscribe?.channelId,
        }),
      );

      // If channel is mature rated content channel and user is not implicit account,
      // fetch profile data to check does user have mature rated content allowed
      if (
        data?.channelStreamDetailSubscribe?.matureRatedContent &&
        isFullAccount &&
        userId
      ) {
        const { data: profileData } = await fetchCurrentProfile({
          variables: { userId },
        });

        // If user is allowed to watch mature rated content, do nothing
        if (profileData?.profile?.account?.matureRatedContentAllowed) {
          return;
        }

        // If user is on channel page, show the mature rated content warning dialog
        if (
          streamViewState === StreamViewState.Full ||
          streamViewState === StreamViewState.ChannelPage
        ) {
          location.state = {
            ...location.state,
            showMatureRatedContentNotAllowed: true,
          };
        }

        // If user is not allowed to watch stream, kick them out
        setStreamViewState(StreamViewState.None);
        leaveGame();
      }

      if (
        data?.channelStreamDetailSubscribe?.liveStatus ===
        ChannelLiveStatus.LiveStatusOffline
      ) {
        setStreamViewState(StreamViewState.None);
        leaveGame();
      }
    },
  });

  useEffect(() => {
    // Do nothing on channel page, excluding channel sub routes
    if (onChannelPage && !onChannelSubRoute) {
      return;
    }

    // Change to pip mode on other pages
    setStreamViewState((prev) => {
      if (prev === StreamViewState.None) {
        return prev;
      }

      return StreamViewState.PiP;
    });
  }, [onChannelPage, onChannelSubRoute]);

  return (
    <StreamStateContext.Provider
      value={{
        streamWrapperRef,
        streamViewState,
        setStreamViewState,
      }}
    >
      {children}
    </StreamStateContext.Provider>
  );
}

export function useStreamState(): Context {
  return useContext(StreamStateContext) as Context;
}

interface StorybookProps {
  defaultStreamViewState?: StreamViewState;
  defaultStreamLoading?: boolean;
  defaultChannelName?: Nullable<string>;
  defaultGameName?: Nullable<string>;
}

export function MockStreamStateProvider({
  defaultStreamViewState = StreamViewState.None,
  children,
}: WithChildren<StorybookProps>) {
  const streamWrapperRef = useRef<HTMLDivElement>(null);
  const [streamViewState, setStreamViewState] = useState(defaultStreamViewState);

  return (
    <StreamStateContext.Provider
      value={{
        streamWrapperRef,
        streamViewState,
        setStreamViewState,
      }}
    >
      {children}
    </StreamStateContext.Provider>
  );
}
