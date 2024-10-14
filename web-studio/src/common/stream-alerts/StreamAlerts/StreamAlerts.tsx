import { ApolloError, gql, useApolloClient } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { useMountEffect } from '@noice-com/common-react-core';
import { useAnalytics } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';
import { useCallback } from 'react';
import { useParams } from 'react-router';

import { CardGameEventsWrapper } from '../CardGameEvents/CardGameEventsWrapper';
import { ChannelEventsWrapper } from '../ChannelEvents/ChannelEventsWrapper';

import { AlertComponentBaseProps } from '@common/alerts';
import {
  ChannelChannel,
  StreamAlertsChannelLiveStatusDocument,
  StreamAlertsChannelLiveStatusSubscription,
  StreamAlertsChannelLiveStatusSubscriptionVariables,
  StreamerChannelActivityEventFilterEventType,
  useStreamAlertsChannelByNameQuery,
} from '@gen';

gql`
  query StreamAlertsChannelByName($channelName: String!) {
    channelByName(name: $channelName) {
      id
      currentStreamId
    }
  }

  subscription StreamAlertsChannelLiveStatus($channelId: ID) {
    channelLiveStatusSubscribe(channelId: $channelId) {
      channelId
      liveStatus
      streamId
    }
  }
`;

type RouteParams = {
  alertType: string;
  channelName: string;
};

export function StreamAlerts() {
  const { alertType, channelName } = useParams<RouteParams>();
  const client = useApolloClient();
  const { trackEvent } = useAnalytics();

  const handleApolloError = useCallback(
    (error: ApolloError) => {
      trackEvent({
        streamAlertApolloError: {
          errorMessage: error.message,
          errorName: error.name,
          alertType,
          channelName,
        },
      });
    },
    [trackEvent, alertType, channelName],
  );

  useMountEffect(() => {
    trackEvent({
      streamAlertLoading: {
        alertType,
        channelName,
      },
    });
  });

  const { data } = useStreamAlertsChannelByNameQuery({
    ...variablesOrSkip({ channelName }),
    onError: handleApolloError,
  });

  useRestartingSubscription<
    StreamAlertsChannelLiveStatusSubscription,
    StreamAlertsChannelLiveStatusSubscriptionVariables
  >(StreamAlertsChannelLiveStatusDocument, {
    ...variablesOrSkip({ channelId: data?.channelByName?.id }),
    onData(options) {
      client.cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: client.cache.identify({
            __typename: 'ChannelChannel',
            id: data?.channelByName?.id,
          }),
          fragment: gql`
            fragment StreamAlertsChannelLiveStatusUpdate on ChannelChannel {
              currentStreamId
            }
          `,
        },
        (oldData) => ({
          ...oldData,
          currentStreamId: options.data.data?.channelLiveStatusSubscribe?.streamId ?? '',
        }),
      );
    },
    onError: handleApolloError,
  });

  if (
    !data?.channelByName?.currentStreamId ||
    !data?.channelByName.id ||
    !channelName ||
    !alertType
  ) {
    return null;
  }

  const baseProps: AlertComponentBaseProps = {
    alertType,
    channelId: data.channelByName.id,
    channelName,
    streamId: data.channelByName.currentStreamId,
  };

  return (
    <>
      {alertType === 'card-game-events' && (
        <CardGameEventsWrapper
          {...baseProps}
          channelActivityEventTypes={[
            StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted,
          ]}
          topPredictions
        />
      )}
      {alertType === 'channel-events' && (
        <ChannelEventsWrapper
          {...baseProps}
          channelActivityEventTypes={[
            StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed,
            StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
            StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionRenewed,
            StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionGifted,
            StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
            StreamerChannelActivityEventFilterEventType.EventTypeBundlePurchased,
          ]}
        />
      )}
    </>
  );
}
