import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientShuffleUsedShuffleContext } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

interface HookResult {
  sendShuffleUsedEvent(
    context: AnalyticsEventClientShuffleUsedShuffleContext,
    reshufflePrice: number,
  ): void;
}

export function useDailyGoalAnalytics(): HookResult {
  const { trackEvent } = useAnalytics();

  const sendShuffleUsedEvent = useCallback(
    (context: AnalyticsEventClientShuffleUsedShuffleContext, reshufflePrice: number) => {
      trackEvent({
        clientShuffleUsed: {
          context,
          reshufflePrice,
        },
      });
    },
    [trackEvent],
  );

  return {
    sendShuffleUsedEvent,
  };
}
