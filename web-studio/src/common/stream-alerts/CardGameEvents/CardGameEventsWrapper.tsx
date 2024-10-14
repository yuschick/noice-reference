import { useMountEffect } from '@noice-com/common-react-core';
import { useAnalytics } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useRef } from 'react';

import { CardGameEvents } from './CardGameEvents';

import {
  AlertComponentBaseProps,
  AlertsUtils,
  useAlertsEvents,
  useAlertsList,
} from '@common/alerts';
import { StreamerChannelActivityEventFilterEventType } from '@gen';

interface Props extends AlertComponentBaseProps {
  channelActivityEventTypes?: StreamerChannelActivityEventFilterEventType[];
  topPredictions?: boolean;
}

export function CardGameEventsWrapper({
  channelActivityEventTypes = [],
  topPredictions = false,
  ...baseProps
}: Props) {
  const { trackEvent } = useAnalytics();
  const lastShownMostPredictedCardId = useRef<Nullable<string>>(null);

  useMountEffect(() => {
    trackEvent({
      streamAlertShown: {
        ...baseProps,
      },
    });
  });

  const {
    alerts,
    actions: { addAlert, completeAlert, getAlertById, removeByTypeName },
  } = useAlertsList();

  const handleAlertShown = useCallback(
    (id: string) => {
      const alert = getAlertById(id);

      if (!alert || alert.data.__typename !== 'MatchTopCardsUpdateCardCountUpdate') {
        return;
      }

      const card = AlertsUtils.getCardWithHighestCount(alert);

      if (!card) {
        return;
      }

      lastShownMostPredictedCardId.current = card.cardId;
    },
    [getAlertById],
  );

  useAlertsEvents({
    ...baseProps,
    channelActivityEventTypes: [
      ...channelActivityEventTypes,
      StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
    ],
    topPredictions,
    onAlertEvent(alert) {
      /*
        If you need to do anything specific related to the incoming alert,
        do it here.
      */

      // Reset last shown most predicted card on match start
      if (
        alert.data.__typename === 'StreamerChannelActivityEvent' &&
        alert.data.content?.__typename === 'StreamerMatchStarted'
      ) {
        lastShownMostPredictedCardId.current = null;
        return;
      }

      // Most predicted cards have to be handled bit separately
      if (alert.data.__typename === 'MatchTopCardsUpdateCardCountUpdate') {
        const newCard = AlertsUtils.getCardWithHighestCount(alert);

        if (!newCard) {
          lastShownMostPredictedCardId.current = null;
          return;
        }

        if (lastShownMostPredictedCardId.current === newCard.cardId) {
          removeByTypeName('MatchTopCardsUpdateCardCountUpdate', 1);
          return;
        }

        if (!lastShownMostPredictedCardId.current) {
          lastShownMostPredictedCardId.current = newCard.cardId;
        }
      }

      const isTopPrediction =
        alert.data.__typename === 'MatchTopCardsUpdateCardCountUpdate';
      const priority = isTopPrediction ? 100 : 1;
      const duration = isTopPrediction ? 3000 : 5000;
      const keepLast = false;
      const maxAmount = isTopPrediction ? 1 : 5;

      // Default action is to just add the alert
      addAlert({
        ...alert,
        priority,
        duration,
        keepLast,
        maxAmount,
      });
    },
  });

  return (
    <CardGameEvents
      {...baseProps}
      alerts={alerts}
      onAlertCompleted={completeAlert}
      onAlertShown={handleAlertShown}
    />
  );
}
