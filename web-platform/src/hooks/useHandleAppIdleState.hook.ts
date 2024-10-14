import { IdleState } from '@noice-com/common-ui';
import { IClient } from '@noice-com/platform-client';
import { AnalyticsEventClientIdleStateState } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, useRef, useState } from 'react';

const { logError } = makeLoggers('useHandleAppIdleState');

export function useHandleAppIdleState(client: IClient) {
  const [idleState, setIdleState] = useState(IdleState.ACTIVE);
  const lastIdleStateRef = useRef(IdleState.ACTIVE);

  const handleIdleStateChange = useCallback(
    async (state: IdleState) => {
      if (lastIdleStateRef.current === state) {
        return;
      }

      let aState = AnalyticsEventClientIdleStateState.STATE_UNSPECIFIED;
      switch (state) {
        case IdleState.ACTIVE:
          if (lastIdleStateRef.current === IdleState.OFFLINE) {
            // lets send a separate state for users who where offline but are now active
            aState = AnalyticsEventClientIdleStateState.STATE_RETURNED;
          } else {
            aState = AnalyticsEventClientIdleStateState.STATE_ACTIVE;
          }
          break;
        case IdleState.IDLE:
          aState = AnalyticsEventClientIdleStateState.STATE_IDLE;
          break;
        case IdleState.OFFLINE:
          aState = AnalyticsEventClientIdleStateState.STATE_OFFLINE;
          break;
      }

      client.AnalyticsService.trackEvent({
        clientIdleState: {
          state: aState,
        },
      });

      try {
        await client.AnalyticsService.sendEventsImmediately({ keepalive: true });
      } catch (e) {
        logError('Failed to send idle state analytics event', e);
      }

      if (state === IdleState.OFFLINE) {
        client.close();
      }

      if (lastIdleStateRef.current === IdleState.OFFLINE && state === IdleState.ACTIVE) {
        // user has come back online, reload the page to get the latest data and reinit everything
        window.location.reload();
        return;
      }

      setIdleState(state);
      lastIdleStateRef.current = state;
    },
    [client],
  );

  return { idleState, handleIdleStateChange };
}
