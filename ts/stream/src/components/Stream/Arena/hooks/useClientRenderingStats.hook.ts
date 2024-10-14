import { useClient } from '@noice-com/common-react-core';
import {
  AnalyticsEventClientRenderingStatsRendererType,
  AnalyticsEventClientRenderingStatsRendererClass,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import { BatteryStatus } from '../types';

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

export type Stats = {
  rendererClass: AnalyticsEventClientRenderingStatsRendererClass;

  emojiCount: number;
  emoteCount: number;

  avatarCount: number;
  avatarVersions: { [key: string]: number };

  frameTime: {
    avg: number;
    p50: number;
    p75: number;
    p90: number;
    p99: number;
    jankCount: number;
  };

  resources: {
    geometries: number;
    textures: number;
  };

  frameDatas: {
    sampleCount: number;
    staticLimiterCount: number;
    dynamicLimiterCount: number;
    underLimiterCount: number;
    renderThread60Count: number;
    renderThread30Count: number;
    renderThreadUnder30Count: number;
  };

  streamStats: {
    avg: number;
    p50: number;
    p75: number;
    p90: number;
    p99: number;
  };
};
export type StatsProvider = () => Promise<Stats>;

export function useClientRenderingStats(statsProvider: Nullable<StatsProvider>): void {
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

      const {
        rendererClass,
        emojiCount,
        emoteCount,
        avatarCount,
        avatarVersions,
        frameTime,
        resources,
        frameDatas,
        streamStats,
      } = await statsProvider();

      const gpuTierData = await GPU.getTier();
      const gpuTier = gpuTierData?.tier ?? 2;

      const hardwareConcurrency = navigator.hardwareConcurrency;

      let batteryStatus = BatteryStatus.Unavailable;
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();
          batteryStatus = battery.charging
            ? BatteryStatus.Charging
            : BatteryStatus.Discharging;
        } catch (e) {
          // battery API is not available
        }
      }

      const analyticsPerformanceProfile =
        convertPerformanceProfileForAnalytics(performanceProfile);

      cli.AnalyticsService.trackEvent({
        clientRenderingStats: {
          type: AnalyticsEventClientRenderingStatsRendererType.RENDERER_TYPE_WEBGL,

          frameJankCount: frameTime.jankCount,
          frameTimeAvgMs: frameTime.avg,
          frameTimeP50Ms: frameTime.p50,
          frameTimeP75Ms: frameTime.p75,
          frameTimeP90Ms: frameTime.p90,
          frameTimeP99Ms: frameTime.p99,

          geometries: resources.geometries,
          textures: resources.textures,

          memoryJsMb: Math.round(memMb),

          sampleLengthMs: now - sampleStart,
          totalLengthMs: now - start,

          avatarCount,
          avatarVersions,
          emojiCount,
          emoteCount,

          rendererClass,
          gpuTier,
          renderQualityLevel: performanceProfileIndex,

          hardwareConcurrency,
          batteryStatus: batteryStatus.toString(),

          streamUpdateTimeAvgMs: streamStats.avg,
          streamUpdateP50Ms: streamStats.p50,
          streamUpdateP75Ms: streamStats.p75,
          streamUpdateP90Ms: streamStats.p90,
          streamUpdateP99Ms: streamStats.p99,

          frameSampleCount: frameDatas.sampleCount,
          frameStaticLimiterCount: frameDatas.staticLimiterCount,
          frameDynamicLimiterCount: frameDatas.dynamicLimiterCount,
          frameUnderLimiterCount: frameDatas.underLimiterCount,
          frameRenderThread60Count: frameDatas.renderThread60Count,
          frameRenderThread30Count: frameDatas.renderThread30Count,
          frameRenderThreadUnder30Count: frameDatas.renderThreadUnder30Count,

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
