import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useEffect, useState } from 'react';

import { StreamError, StreamStatus } from '../types';

import { useChannelContext } from '@common/channel';
import { useStudioLocalStorage } from '@common/local-storage';
import { ChannelRole } from '@common/profile';
import {
  StreamDeploymentStreamDeploymentStatusComponentStatus,
  ChannelLiveStatus,
  StreamChannelStatusSubscription,
  StreamChannelStatusSubscriptionVariables,
  StreamChannelStatusDocument,
  StreamStatusSubscription,
  StreamStatusSubscriptionVariables,
  StreamStatusDocument,
  GameLogicStreamStateMatchState,
  ChannelIngestStatsFragment,
  StreamIngestStatsSubscription,
  StreamIngestStatsSubscriptionVariables,
  StreamIngestStatsDocument,
  useMatchStateQuery,
  StreamMatchStatusEventsDocument,
  StreamMatchStatusEventsSubscription,
  StreamMatchStatusEventsSubscriptionVariables,
} from '@gen';

export interface StreamProviderContext {
  streamId: Nullable<string>;
  streamStatus: Nullable<StreamStatus>;
  crStatus: Nullable<StreamDeploymentStreamDeploymentStatusComponentStatus>;
  mlStatus: Nullable<StreamDeploymentStreamDeploymentStatusComponentStatus>;
  restreamingStatus: Nullable<StreamDeploymentStreamDeploymentStatusComponentStatus>;
  matchStatus: Nullable<GameLogicStreamStateMatchState>;
  ingestStatus: Nullable<ChannelIngestStatsFragment>;
  gameRunnerStatus: Nullable<StreamDeploymentStreamDeploymentStatusComponentStatus>;
  isNoicePredictionsEnabled: boolean;
  isServerRenderingEnabled: boolean;
  isStreamOffline: boolean;
  isLoading: boolean;
  hasRunningProcesses: boolean;
  isChallengesEnabled: boolean;
}

const StreamContext = createContext<Nullable<StreamProviderContext>>(null);

const getStreamStatus = (
  streamStatusSubscriptionResult: ReturnType<
    typeof useRestartingSubscription<
      StreamStatusSubscription,
      StreamStatusSubscriptionVariables
    >
  >,
  localStorage: ReturnType<typeof useStudioLocalStorage>,
  streamId: Nullable<string>,
): Nullable<StreamStatus> => {
  const forceChannelOnline = localStorage.GetValue('debug.forceChannelOnline');

  if (forceChannelOnline) {
    // Force channel online for local development
    return ChannelLiveStatus.LiveStatusLive;
  }

  if (!streamId) {
    return ChannelLiveStatus.LiveStatusOffline;
  }

  if (streamStatusSubscriptionResult.error) {
    if (streamStatusSubscriptionResult.error.networkError) {
      return StreamError.NetworkError;
    }

    return StreamError.ServerError;
  }

  return streamStatusSubscriptionResult.data?.streamStatusSubscribe?.liveStatus ?? null;
};

export function StreamProvider({ children }: WithChildren) {
  const localStorage = useStudioLocalStorage();
  const { channelId, userChannelRoles } = useChannelContext();
  // matchStatus is initially fetched from useMatchStateQuery and after that its updated with
  // StreamMatchStatusEvents subscription. Subscription alone is not enough as
  // we don't know the match status initially, e.g. if the streamer refreshes the page.
  const [matchStatus, setMatchStatus] =
    useState<Nullable<GameLogicStreamStateMatchState>>(null);

  const preventSubscription =
    !userChannelRoles.length ||
    userChannelRoles.every((role) => role === ChannelRole.PxAgent);

  const { data: channelStatusData } = useRestartingSubscription<
    StreamChannelStatusSubscription,
    StreamChannelStatusSubscriptionVariables
  >(StreamChannelStatusDocument, {
    variables: {
      channelId,
    },
    skip: preventSubscription,
  });

  const streamId = channelStatusData?.channelStreamDetailSubscribe?.streamId ?? null;
  const isNoicePredictionsEnabled =
    channelStatusData?.channelStreamDetailSubscribe?.noicePredictionsEnabled ?? false;
  const isChallengesEnabled =
    channelStatusData?.channelStreamDetailSubscribe?.challengesEnabled ?? false;
  const isServerRenderingEnabled =
    channelStatusData?.channelStreamDetailSubscribe?.serverRenderingEnabled ?? false;

  useEffect(() => {
    if (!streamId) {
      // Whenever streamId becomes null, e.g. when the streamer stops the stream
      // we reset the client side state so that it stays consistent.
      // Otherwise the matchStatus would stay "lingering" as e.g. Active, which might
      // cause UI issues in consecutive streams.
      setMatchStatus(null);
    }
  }, [streamId]);

  useMatchStateQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { streamId: streamId! },
    skip: !streamId || !isNoicePredictionsEnabled || preventSubscription,
    onCompleted(data) {
      setMatchStatus(data.matchState?.matchState ?? null);
    },
  });

  useRestartingSubscription<
    StreamMatchStatusEventsSubscription,
    StreamMatchStatusEventsSubscriptionVariables
  >(StreamMatchStatusEventsDocument, {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { streamId: streamId! },
    skip: !streamId || !isNoicePredictionsEnabled || preventSubscription,
    onData({ data }) {
      const eventContent = data.data?.streamEventsSubscribe?.content;

      if (!eventContent) {
        return;
      }

      switch (eventContent.__typename) {
        case 'GameLogicMatchStartedMsg':
          setMatchStatus(GameLogicStreamStateMatchState.MatchStateActive);
          return;
        case 'GameLogicMatchEndedMsg':
          setMatchStatus(GameLogicStreamStateMatchState.MatchStateEnded);
          return;
        case 'GameLogicMatchPauseStateChangedMsg':
          if (eventContent.paused) {
            setMatchStatus(GameLogicStreamStateMatchState.MatchStatePaused);
          } else {
            setMatchStatus(GameLogicStreamStateMatchState.MatchStateActive);
          }
          return;
        default:
          return;
      }
    },
  });

  const statusSubscription = useRestartingSubscription<
    StreamStatusSubscription,
    StreamStatusSubscriptionVariables
  >(StreamStatusDocument, {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { channelId, streamId: streamId! },
    skip: !streamId || preventSubscription,
  });

  const { data: ingestData } = useRestartingSubscription<
    StreamIngestStatsSubscription,
    StreamIngestStatsSubscriptionVariables
  >(StreamIngestStatsDocument, {
    variables: { channelId },
    skip: preventSubscription,
  });

  const streamStatus = getStreamStatus(statusSubscription, localStorage, streamId);
  const crStatus = statusSubscription.data?.streamStatusSubscribe?.crStatus ?? null;
  const mlStatus = statusSubscription.data?.streamStatusSubscribe?.mlStatus ?? null;
  const isStreamOffline =
    !streamId || !streamStatus || streamStatus === ChannelLiveStatus.LiveStatusOffline;

  // isLoading: As long as we have streamId but the channel is not live, we know that something is running
  // in the background. Whether its the ml / cr / gameRunner or other services that are being deployed
  // or shutting down.
  const isLoading = !!streamId && streamStatus !== ChannelLiveStatus.LiveStatusLive;
  const hasRunningProcesses = isLoading || !isStreamOffline;

  return (
    <StreamContext.Provider
      value={{
        isChallengesEnabled,
        isNoicePredictionsEnabled,
        isStreamOffline,
        isLoading,
        isServerRenderingEnabled,
        hasRunningProcesses,
        streamId,
        streamStatus,
        crStatus,
        mlStatus,
        restreamingStatus:
          statusSubscription.data?.streamStatusSubscribe?.restreamingStatus ?? null,
        gameRunnerStatus:
          statusSubscription.data?.streamStatusSubscribe?.gameRunnerStatus ?? null,
        matchStatus,
        ingestStatus: ingestData?.ingestStatsSubscribe ?? null,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

export const useStreamContext = (): StreamProviderContext => {
  const context = useContext(StreamContext);

  if (!context) {
    throw new Error('Trying to access stream state from context without StreamContext');
  }

  return context;
};
