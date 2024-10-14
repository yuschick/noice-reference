import { CoreAssets } from '@noice-com/assets-core';
import { useClient } from '@noice-com/common-react-core';
import { Icon, useKeyContentLoadTracker } from '@noice-com/common-ui';
import { AnalyticsEventClientRenderingStatsRendererType } from '@noice-com/schemas/analytics/analytics.pb';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { BatteryStatus } from '../Arena/types';
import { MediaStreamVideo } from '../MediaStreamVideo';
import { Spotlight } from '../Spotlight';

import styles from './SimpleStreamPlayer.module.css';

import { GPU } from '@noice-com/stream';
import { useStreamConnection } from '@stream-hooks';
import { StreamError } from '@stream-types';

const METRICS_SAMPLE_INTERVAL = 10 * 60 * 1000; // 10 minutes

export interface SimpleStreamPlayerProps {
  className?: string;
  streamId: string;
  groupId?: Nullable<string>;
  isMutedStream?: boolean;
  hideSpotlights?: boolean;
  hideSpotlightsEmotes?: boolean;
  onErrorCallback?: (error: StreamError) => void;
  placement: StreamPlacement;
  onStreamPlayerClick?: (videoElement: Nullable<HTMLVideoElement>) => void;
  onPlayerInit?: (videoElement: Nullable<HTMLVideoElement>) => void;
  onFirstFrame?: () => void;
}

export function SimpleStreamPlayer({
  className,
  streamId,
  groupId,
  isMutedStream,
  hideSpotlights,
  hideSpotlightsEmotes,
  onErrorCallback: onErrorCallbackProp,
  placement,
  onStreamPlayerClick,
  onPlayerInit,
  onFirstFrame,
}: SimpleStreamPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const onErrorCallback = useCallback(
    (error: StreamError) => {
      setHasError(true);
      onErrorCallbackProp?.(error);
    },
    [onErrorCallbackProp],
  );

  const { stream, streamProps, egressType, livepeerUrl, signalFirstFrame } =
    useStreamConnection({
      streamId,
      groupId: groupId ?? null,
      rawVideo: true,
      onErrorCallback,
      placement,
    });
  const cli = useClient();

  const onFirstFrameCb = useCallback(async () => {
    onFirstFrame?.();
    await signalFirstFrame();
  }, [onFirstFrame, signalFirstFrame]);

  useKeyContentLoadTracker('stream', !stream);

  useEffect(() => {
    if (!cli) {
      return;
    }

    const start = Date.now();
    let sampleStart = start;

    const send = async (flush = false) => {
      let memMb = 0;

      if (performance.memory) {
        const memory = performance.memory;
        memMb = memory.usedJSHeapSize / 1048576;
      }

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

      const now = Date.now();

      cli.AnalyticsService.trackEvent({
        clientRenderingStats: {
          memoryJsMb: Math.round(memMb),
          sampleLengthMs: now - sampleStart,
          totalLengthMs: now - start,
          type: AnalyticsEventClientRenderingStatsRendererType.RENDERER_TYPE_VIDEO,
          gpuTier: gpuTier,
          hardwareConcurrency: hardwareConcurrency,
          batteryStatus: batteryStatus.toString(),
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
  }, [cli]);

  const contentMode = streamProps.contentMode?.value ?? null;

  const showSpotlight =
    !hideSpotlights && (!!contentMode?.groupSpotlight || !!contentMode?.userSpotlight);

  return (
    <div className={classNames(styles.container, className)}>
      {hasError ? (
        <Icon
          color="blue-600"
          icon={CoreAssets.Icons.DisconnectedVideo}
          size={100}
        />
      ) : (
        <>
          <MediaStreamVideo
            className={styles.videoWrapper}
            egressType={egressType}
            isMuted={isMutedStream}
            livepeerUrl={livepeerUrl}
            signalFirstFrame={onFirstFrameCb}
            stream={stream}
            onPlayerInit={onPlayerInit}
            onVideoClick={onStreamPlayerClick}
          />

          {showSpotlight && !!contentMode && (
            <Spotlight
              contentMode={contentMode}
              hideEmotes={hideSpotlightsEmotes}
            />
          )}
        </>
      )}
    </div>
  );
}
