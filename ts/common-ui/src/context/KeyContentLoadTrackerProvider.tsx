import { useClient } from '@noice-com/common-react-core';
import {
  AnalyticsEventKeyContentLoaded,
  AnalyticsEventKeyContentLoadedEndReason,
  AnalyticsEventKeyContentLoadedTiming,
} from '@noice-com/schemas/analytics/analytics.pb';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { WithChildren } from '@common-types';

interface Context {
  loadingKeyContent: (name: string) => void;
  loadedKeyContent: (name: string) => void;

  setMetadata: (name: string, value: string) => void;
}

type Timing = {
  start: number;
  end: number;
};

const KeyContentLoadTrackerContext = createContext<Context | null>(null);
const SEND_DELAY_MS = 3000;

function performanceNowOrZero() {
  return typeof performance === 'undefined' ? 0 : performance.now();
}

export function KeyContentLoadTrackerProvider({ children }: WithChildren) {
  const [loading, setLoading] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const eventSent = useRef(false);
  const lastPath = useRef<string | null>(null);
  const timings = useRef<{ [key: string]: Timing }>({});
  const metadata = useRef<{ [key: string]: string }>({});

  const client = useClient();
  const location = useLocation();

  const sendMetrics = useCallback(
    (reason: AnalyticsEventKeyContentLoadedEndReason, timeSinceStart: number) => {
      if (timeSinceStart === 0) {
        return;
      }

      if (eventSent.current) {
        return;
      }

      eventSent.current = true;

      const evTimings: { [key: string]: AnalyticsEventKeyContentLoadedTiming } = {};
      for (const [key, timing] of Object.entries(timings.current)) {
        evTimings[key] = {
          end: timing.end,
          duration: timing.end - timing.start,
        };
      }

      const event: AnalyticsEventKeyContentLoaded = {
        duration: timeSinceStart,
        endReason: reason,
        pathname: lastPath.current || '',
        timings: evTimings,
        metadata: metadata.current,
      };

      client.AnalyticsService.trackEvent({
        keyContentLoaded: event,
      });
      client.AnalyticsService.sendEventsImmediately({ keepalive: true });
    },
    [client],
  );

  const loadingKeyContent = useCallback((name: string) => {
    timings.current[name] = timings.current[name] || {
      start: performanceNowOrZero(),
      end: 0,
    };

    setLoading((prev) => (prev || 0) + 1);
  }, []);

  const loadedKeyContent = useCallback((name: string) => {
    const time = performanceNowOrZero();

    if (!timings.current[name]) {
      timings.current[name] = {
        start: time,
        end: time,
      };
      return;
    }

    timings.current[name].end = time;

    setLoading((prev) => (prev || 0) - 1);
  }, []);

  useEffect(() => {
    const cb = () => {
      sendMetrics(
        AnalyticsEventKeyContentLoadedEndReason.END_REASON_PAGE_UNLOAD,
        performanceNowOrZero(),
      );
    };
    window.addEventListener('beforeunload', cb);

    return () => {
      window.removeEventListener('beforeunload', cb);
    };
  }, [sendMetrics]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (lastPath.current && path !== lastPath.current) {
      sendMetrics(
        AnalyticsEventKeyContentLoadedEndReason.END_REASON_NAVIGATION,
        performance.now(),
      );
    }

    lastPath.current = path;
  }, [location, sendMetrics]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (loading !== 0) {
      return;
    }

    const time = performanceNowOrZero();

    timeoutRef.current = setTimeout(() => {
      sendMetrics(AnalyticsEventKeyContentLoadedEndReason.END_REASON_FINISHED, time);
    }, SEND_DELAY_MS);
  }, [loading, sendMetrics]);

  const setMetadata = useCallback((name: string, value: string) => {
    metadata.current[name] = value;
  }, []);

  return (
    <KeyContentLoadTrackerContext.Provider
      value={useMemo(
        () => ({ loadingKeyContent, loadedKeyContent, setMetadata }),
        [loadingKeyContent, loadedKeyContent, setMetadata],
      )}
    >
      {children}
    </KeyContentLoadTrackerContext.Provider>
  );
}

export function useKeyContentLoadTracker(name: string, loading = false) {
  const context = useContext(KeyContentLoadTrackerContext);

  const { loadingKeyContent, loadedKeyContent } = useMemo(() => {
    if (!context) {
      return {
        loadingKeyContent: () => {},
        loadedKeyContent: () => {},
      };
    }

    return context;
  }, [context]);

  useEffect(() => {
    if (loading) {
      loadingKeyContent(name);
      return () => loadedKeyContent(name);
    }
  }, [loadedKeyContent, loading, loadingKeyContent, name]);
}

export function useKeyContentLoadMetadata(): (name: string, value: string) => void {
  const context = useContext(KeyContentLoadTrackerContext);

  return useMemo(() => {
    if (!context) {
      return () => {};
    }

    return context.setMetadata;
  }, [context]);
}
