import { useClient } from '@noice-com/common-react-core';
import {
  AnalyticsEventClientRenderingStatsRendererType,
  AnalyticsEventClientRenderingStatsRendererClass,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { FrameAnalyticsStats } from '@noice-com/web-renderer/src/renderer/stats/types';
import { useEffect } from 'react';

import { getBatteryStatus, getHardwareConcurrency } from '../utils';

import { GPU } from '@noice-com/stream';
import { useStreamSettings } from '@stream-context';
import { convertPerformanceProfileForAnalytics } from '@stream-types';

const METRICS_SAMPLE_INTERVAL = 10 * 60 * 1000; // 10mins

const getMemoryUsage = () => {
  if (!performance.memory) {
    return 0;
  }

  const { memory } = performance;

  return memory.usedJSHeapSize / 1048576;
};

export type StatsProvider = () => Promise<FrameAnalyticsStats>;

interface Props {
  statsProvider: Nullable<StatsProvider>;
}

export function useClientRenderingStats({ statsProvider }: Props): void {
  const cli = useClient();
  const { performanceProfile, performanceProfileIndex } = useStreamSettings();

  useEffect(() => {
    if (!statsProvider || !cli) {
      return;
    }

    const start = Date.now();
    let sampleStart = start;

    const send = async (flush = false) => {
      const memMb = getMemoryUsage();
      const now = Date.now();

      const { renderStats, timeStats, analyticsStats, sceneStats, streamStats } =
        await statsProvider();

      const avatarCount = sceneStats.avatarCount;

      const gpuTierData = await GPU.getTier();
      const gpuTier = gpuTierData?.tier ?? 2;

      const hardwareConcurrency = getHardwareConcurrency();
      const batteryStatus = await getBatteryStatus();

      const analyticsPerformanceProfile =
        convertPerformanceProfileForAnalytics(performanceProfile);

      cli.AnalyticsService.trackEvent({
        clientRenderingStats: {
          type: AnalyticsEventClientRenderingStatsRendererType.RENDERER_TYPE_WEBGL,

          frameJankCount: timeStats.jankCount,
          frameTimeAvgMs: timeStats.avg,
          frameTimeP50Ms: timeStats.p50,
          frameTimeP75Ms: timeStats.p75,
          frameTimeP90Ms: timeStats.p90,
          frameTimeP99Ms: timeStats.p99,

          geometries: renderStats.geometries,
          textures: renderStats.textures,

          memoryJsMb: Math.round(memMb),

          sampleLengthMs: now - sampleStart,
          totalLengthMs: now - start,

          avatarCount,
          emojiCount: undefined,
          emoteCount: undefined,

          rendererClass:
            AnalyticsEventClientRenderingStatsRendererClass.RENDERER_CLASS_CLIENT,
          gpuTier,
          renderQualityLevel: performanceProfileIndex,

          hardwareConcurrency,
          batteryStatus: batteryStatus.toString(),

          streamUpdateTimeAvgMs: streamStats.avg,
          streamUpdateP50Ms: streamStats.p50,
          streamUpdateP75Ms: streamStats.p75,
          streamUpdateP90Ms: streamStats.p90,
          streamUpdateP99Ms: streamStats.p99,

          frameSampleCount: analyticsStats.sampleCount,
          frameStaticLimiterCount: analyticsStats.staticLimiterCount,
          frameDynamicLimiterCount: analyticsStats.dynamicLimiterCount,
          frameUnderLimiterCount: analyticsStats.underLimiterCount,
          frameRenderThread60Count: analyticsStats.renderThread60Count,
          frameRenderThread30Count: analyticsStats.renderThread30Count,
          frameRenderThreadUnder30Count: analyticsStats.renderThreadUnder30Count,

          ...analyticsPerformanceProfile,
        },
      });

      if (flush) {
        cli.AnalyticsService.sendEventsImmediately({ keepalive: true });
      }

      sampleStart = now;
    };

    const interval = setInterval(send, METRICS_SAMPLE_INTERVAL);

    const flushSend = send.bind(null, true);

    window.addEventListener('beforeunload', flushSend);

    return () => {
      send();
      window.removeEventListener('beforeunload', flushSend);
      clearInterval(interval);
    };
  }, [cli, statsProvider, performanceProfile, performanceProfileIndex]);
}
