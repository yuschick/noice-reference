import { useClient } from '@noice-com/common-react-core';
import { Client } from '@noice-com/platform-client';
import { AnalyticsEventClientButtonClick } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import { createContext, useCallback, useContext, MouseEvent, useEffect } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useWindowSize } from '../hooks/useWindowSize.hook';

import { WithChildren } from '@common-types';

interface Context {
  trackEvent: Client['AnalyticsService']['trackEvent'];
  /**
   * Track event that is sent to the server immediately; needed to be used when
   * event is going to send user to external page, so we can be sure that event is sent
   */
  trackExternalEvent: (
    ...params: Parameters<Client['AnalyticsService']['trackEvent']>
  ) => Promise<void>;
  trackButtonClickEvent(
    action: string,
    params: Pick<AnalyticsEventClientButtonClick, 'section'>,
  ): void;
  /**
   * Track button click event that is sent to the server immediately; needed to be used when
   * event is going to send user to external page, so we can be sure that event is sent
   */
  trackExternalButtonClickEvent(
    ...params: Parameters<Context['trackButtonClickEvent']>
  ): Promise<void>;

  trackButtonClickEventOnMouseClick(
    event: MouseEvent<HTMLElement>,
    section: string,
  ): void;
  /**
   * Track button click event on mouse click that is sent to the server immediately; needed to be used when
   * event is going to send user to external page, so we can be sure that event is sent
   */
  trackExternalButtonClickEventOnMouseClick(
    ...params: Parameters<Context['trackButtonClickEventOnMouseClick']>
  ): Promise<void>;
  /**
   * Lazy mans way of handling .catch on promises while keeping the linter happy
   * Only use as a last resort. You should always handle promise rejections
   * in a graceful way
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackUnhandledPromiseRejection(prefix: string): (reason: any) => void;
  trackAnchorClick(event: MouseEvent<HTMLAnchorElement>, section: string): void;
}

const { logError } = makeLoggers('AnalyticProvider');

const AnalyticContext = createContext<Context | null>(null);

export function AnalyticProvider({ children }: WithChildren) {
  const client = useClient();
  const windowSize = useWindowSize();

  const trackEvent = useCallback(
    (...params: Parameters<Client['AnalyticsService']['trackEvent']>) =>
      client.AnalyticsService.trackEvent(...params),
    [client],
  );

  const trackButtonClickEvent = useCallback(
    (action: string, params: Pick<AnalyticsEventClientButtonClick, 'section'>) => {
      const { pathname } = location;

      client.AnalyticsService.trackEvent({
        clientButtonClick: {
          ...params,
          action,
          pathname,
        },
      });
    },
    [client.AnalyticsService],
  );

  const trackButtonClickEventOnMouseClick = useCallback(
    (event: MouseEvent<HTMLElement>, section: string) => {
      if (event.type !== 'click') {
        logError(
          `trackButtonClickEventOnMouseClick is used in wrong event type '${event.type}', when it should be 'click'`,
        );
        return;
      }

      const clickedButton = event.currentTarget;

      const buttonLabel =
        clickedButton.getAttribute('aria-label') || clickedButton.innerText || '';

      trackButtonClickEvent(buttonLabel, {
        section,
      });
    },
    [trackButtonClickEvent],
  );

  const trackExternalEvent = useCallback(
    async (...params: Parameters<Client['AnalyticsService']['trackEvent']>) => {
      trackEvent(...params);
      await client.AnalyticsService.sendEventsImmediately();
    },
    [client.AnalyticsService, trackEvent],
  );

  const trackExternalButtonClickEvent = useCallback(
    async (...params: Parameters<Context['trackButtonClickEvent']>) => {
      trackButtonClickEvent(...params);
      await client.AnalyticsService.sendEventsImmediately();
    },
    [client.AnalyticsService, trackButtonClickEvent],
  );

  const trackExternalButtonClickEventOnMouseClick = useCallback(
    async (...params: Parameters<Context['trackButtonClickEventOnMouseClick']>) => {
      trackButtonClickEventOnMouseClick(...params);
      await client.AnalyticsService.sendEventsImmediately();
    },
    [client.AnalyticsService, trackButtonClickEventOnMouseClick],
  );

  const trackUnhandledPromiseRejection = useCallback(
    (prefix: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (reason: any) => {
        const textReason = JSON.stringify(reason);

        client.AnalyticsService.trackEventWithName('unhandled_rejection', {
          clientUnhandledPromiseRejection: {
            message: `${prefix}: ${textReason}`,
          },
        });
      };
    },
    [client.AnalyticsService],
  );

  const trackAnchorClick = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>, section: string) => {
      const anchor = event.currentTarget;
      const targetAddress = anchor.getAttribute('href') || '';
      const label = anchor.innerText;
      const { pathname } = location;

      client.AnalyticsService.trackEvent({
        clientAnchorClick: {
          targetAddress,
          pathname,
          section,
          label,
        },
      });
      await client.AnalyticsService.sendEventsImmediately();
    },
    [client],
  );

  useEffect(() => {
    if (!client.AnalyticsService) {
      return;
    }

    client.AnalyticsService.setClientCharacteristics({
      windowWidth: windowSize.width,
      windowHeight: windowSize.height,
    });
  }, [windowSize, client.AnalyticsService]);

  return (
    <AnalyticContext.Provider
      value={{
        trackEvent,
        trackExternalEvent,
        trackButtonClickEvent,
        trackExternalButtonClickEvent,
        trackButtonClickEventOnMouseClick,
        trackExternalButtonClickEventOnMouseClick,
        trackUnhandledPromiseRejection,
        trackAnchorClick,
      }}
    >
      {children}
    </AnalyticContext.Provider>
  );
}

export function useAnalytics(): Context {
  const context = useContext(AnalyticContext);

  if (!context) {
    throw new Error('Trying to access context without AnalyticContext');
  }

  return context;
}

const mockLogger = makeLoggers('MockAnalyticProvider');

const mockedTrackEvent = (
  ...params: Parameters<Client['AnalyticsService']['trackEvent']>
) => mockLogger.logInfo('Logged mocked track event', ...params);

const mockedExternalTrackEvent = async (
  ...params: Parameters<Client['AnalyticsService']['trackEvent']>
) => mockLogger.logInfo('Logged mocked external track event', ...params);

const mockedTrackButtonClickEvent = (
  action: string,
  params: Pick<AnalyticsEventClientButtonClick, 'section'>,
) => mockLogger.logInfo('Logged mocked button click track event', action, params);

const mockedTrackExternalButtonClickEvent = async (
  ...params: Parameters<Context['trackButtonClickEvent']>
) => mockLogger.logInfo('Logged mocked external button click track event', ...params);

const mockedTrackButtonClickEventOnMouseClick = (
  event: MouseEvent<HTMLButtonElement>,
  section: string,
) =>
  mockLogger.logInfo('Logged mocked button click track event on click', event, section);

const mockedTrackExternalButtonClickEventOnMouseClick = async (
  ...params: Parameters<Context['trackButtonClickEventOnMouseClick']>
) =>
  mockLogger.logInfo(
    'Logged mocked external button click track event on click',
    ...params,
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedTrackUnhandledPromiseRejection = (prefix: string) => (reason: any) => {
  return () => {
    mockLogger.logError('Logged mocked unhandled promise rejection', prefix, reason);
  };
};

const mockedTrackAnchorClick = (event: MouseEvent<HTMLAnchorElement>, section: string) =>
  mockLogger.logInfo('Logged mocked anchor click track event', event, section);

export function MockAnalyticProvider({ children }: WithChildren) {
  return (
    <AnalyticContext.Provider
      value={{
        trackEvent: mockedTrackEvent,
        trackExternalEvent: mockedExternalTrackEvent,
        trackButtonClickEvent: mockedTrackButtonClickEvent,
        trackExternalButtonClickEvent: mockedTrackExternalButtonClickEvent,
        trackButtonClickEventOnMouseClick: mockedTrackButtonClickEventOnMouseClick,
        trackExternalButtonClickEventOnMouseClick:
          mockedTrackExternalButtonClickEventOnMouseClick,
        trackUnhandledPromiseRejection: mockedTrackUnhandledPromiseRejection,
        trackAnchorClick: mockedTrackAnchorClick,
      }}
    >
      {children}
    </AnalyticContext.Provider>
  );
}
