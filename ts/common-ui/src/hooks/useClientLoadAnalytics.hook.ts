import { useMountEffect } from '@noice-com/common-react-core';
import { Client } from '@noice-com/platform-client';

export function useClientLoadAnalytics(client: Client): void {
  useMountEffect(() => {
    const { LOAD_START: loadStart, BUILD_TIME: buildTime, BUILD_HASH: buildHash } = NOICE;

    if (!loadStart || !buildTime || !buildHash) {
      return;
    }

    const now = Date.now();
    const loadtimeMs = (now - loadStart).toString();
    const ttfbMs = getTTFB();

    client.AnalyticsService.trackEvent({
      clientLoadFinished: {
        buildTime: buildTime.toString(),
        buildHash,
        loadtimeMs,
        ttfbMs,
      },
    });
  });
}

function getTTFB(): number | undefined {
  const navigationEntries = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];

  if (navigationEntries.length > 0) {
    const navigationTiming = navigationEntries[0];
    const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;

    return ttfb;
  } else if (performance.timing) {
    // Legacy method using performance.timing
    const timing = performance.timing;
    const ttfb = timing.responseStart - timing.requestStart;

    return ttfb;
  } else {
    return undefined;
  }
}
