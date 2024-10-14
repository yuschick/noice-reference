import { ApolloError } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { AlertBaseProps, AlertComponentBaseProps } from '../types';

import { useChannelActivityEvents } from './useChannelActivityEvents.hook';
import { useTopPredictions } from './useTopPredictions.hook';

import { StreamerChannelActivityEventFilterEventType } from '@gen';

interface Props extends AlertComponentBaseProps {
  channelActivityEventTypes?: StreamerChannelActivityEventFilterEventType[];
  topPredictions?: boolean;
  onAlertEvent(alert: AlertBaseProps): void;
}

export function useAlertsEvents({
  onAlertEvent,
  channelActivityEventTypes = [],
  topPredictions = false,
  ...baseProps
}: Props) {
  const { trackEvent } = useAnalytics();

  const handleError = useCallback(
    (error: ApolloError) => {
      trackEvent({
        streamAlertApolloError: {
          ...baseProps,
          errorMessage: error.message,
          errorName: error.name,
        },
      });
    },
    [trackEvent, baseProps],
  );

  const { streamId, channelId } = baseProps;

  useTopPredictions({
    streamId,
    enabled: topPredictions,
    onEvent(update) {
      onAlertEvent({
        id: uuid(),
        data: update,
      });
    },
    onError: handleError,
  });

  useChannelActivityEvents({
    channelId,
    filters: channelActivityEventTypes,
    onEvent(event) {
      onAlertEvent({
        id: uuid(),
        data: event,
      });
    },
    onError: handleError,
  });
}
