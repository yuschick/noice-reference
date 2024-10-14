import { useMountEffect } from '@noice-com/common-react-core';
import { useAnalytics } from '@noice-com/common-ui';

import { ChannelEvents } from './ChannelEvents';

import { AlertComponentBaseProps, useAlertsEvents, useAlertsList } from '@common/alerts';
import { StreamerChannelActivityEventFilterEventType } from '@gen';

interface Props extends AlertComponentBaseProps {
  channelActivityEventTypes?: StreamerChannelActivityEventFilterEventType[];
}

export function ChannelEventsWrapper({ channelActivityEventTypes, ...baseProps }: Props) {
  const { trackEvent } = useAnalytics();

  useMountEffect(() => {
    trackEvent({
      streamAlertShown: {
        ...baseProps,
      },
    });
  });

  const {
    alerts,
    actions: { addAlert, completeAlert },
  } = useAlertsList();

  useAlertsEvents({
    ...baseProps,
    channelActivityEventTypes,
    onAlertEvent(alert) {
      addAlert({ ...alert, duration: 4940, priority: 1, keepLast: false, maxAmount: 20 });
    },
  });

  return (
    <ChannelEvents
      alerts={alerts}
      onAlertCompleted={completeAlert}
      {...baseProps}
    />
  );
}
