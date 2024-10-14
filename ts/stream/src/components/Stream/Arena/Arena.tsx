import { useConditionalOnce } from '@noice-com/common-react-core';
import {
  Button,
  CommonUtils,
  useAsyncEffect,
  useAvatarAnimations,
  useFeatureFlags,
  LoadingSpinner,
  Icon,
  useAnalytics,
  useKeyContentLoadTracker,
} from '@noice-com/common-ui';
import { createNoiceWorker } from '@noice-com/platform-client';
import { AnalyticsEventClientStreamVideoEventEventType } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import * as Comlink from 'comlink';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { ImVolumeMute2 } from 'react-icons/im';

import { ElementRenderer } from '../../ElementRenderer';

import styles from './Arena.module.css';
import type { ArenaBridge } from './classes/ArenaBridge';
import {
  StatsProvider,
  useClientRenderingStats,
} from './hooks/useClientRenderingStats.hook';
import { useContainerSize } from './hooks/useContainerSize.hook';
import { useMediaStreamVideoTrackProcessor } from './hooks/useMediaStreamTrackProcessor.hook';
import { useMetricsPanel } from './hooks/useMetricsPanel.hook';
import { usePlayAudioStream } from './hooks/usePlayAudioStream.hook';
import { useStreamEventBind } from './hooks/useStreamEventBind.hook';
import { ArenaHandlerType, ScreenParamsCallback } from './types';
// eslint-disable-next-line import/default
import arenaWorkerUrl from './worker/Arena.worker.ts?worker&url';

import { StreamEventEmitter } from '@stream-classes';
import { useStreamSettings } from '@stream-context';
import { StreamProps } from '@stream-types';

function isOffscreenCanvasSupported() {
  return 'OffscreenCanvas' in window;
}

interface Props {
  localGroupId: Nullable<string>;
  streamProps: StreamProps;
  stream: Nullable<MediaStream>;
  streamEventEmitter: StreamEventEmitter;
  isHidden: boolean;
  renderVideo: boolean;
  fallback: boolean;
  signalFirstFrame: () => Promise<void>;
  screenParamsCallback?: ScreenParamsCallback;
}

export function Arena({
  localGroupId,
  streamProps,
  streamEventEmitter,
  fallback,
  stream,
  isHidden,
  renderVideo,
  signalFirstFrame,
  screenParamsCallback,
}: Props) {
  const { trackEvent, trackUnhandledPromiseRejection } = useAnalytics();
  const useWebWorker = isOffscreenCanvasSupported();
  const [handler, setHandler] = useState<ArenaHandlerType>(null);
  const [canvas, setCanvas] = useState<Nullable<HTMLCanvasElement>>(null);
  const [containerRef, size] = useContainerSize();
  const { animations, loading: loadingAnimations } = useAvatarAnimations();
  const [featureFlags, loadingFeatureFlags] = useFeatureFlags();
  const { performanceProfile, metricsVisible } = useStreamSettings();
  const videoTrackProcessor = useMediaStreamVideoTrackProcessor(stream);
  const { needsInteractionToUnmute, play: audioPlay } = usePlayAudioStream(stream);
  const metricsCallback = useMetricsPanel(metricsVisible);
  const [showSoftwareRenderingWarning, setShowSoftwareRenderingWarning] = useState(false);
  const [firstVideoFrameRendered, setFirstVideoFrameRendered] = useState(false);

  useKeyContentLoadTracker('arena_handler', !handler);

  const onFirstVideoFrameRendered = useCallback(() => {
    setFirstVideoFrameRendered(true);
  }, [setFirstVideoFrameRendered]);

  const loading = !firstVideoFrameRendered && renderVideo;

  useKeyContentLoadTracker('first_frame_rendered', loading);

  const statsProvider = useMemo<Nullable<StatsProvider>>(() => {
    if (!handler) {
      return null;
    }

    return async () => {
      const stats = await handler.getStats();

      return stats;
    };
  }, [handler]);

  useClientRenderingStats(statsProvider);

  useStreamEventBind({
    eventEmitter: streamEventEmitter,
    handler,
    streamProps,
    isArenaHidden: isHidden,
    groupId: localGroupId,
  });

  useConditionalOnce(() => {
    let worker: Worker;

    const canvas = document.createElement('canvas');
    setCanvas(canvas);

    if (useWebWorker) {
      worker = createNoiceWorker(arenaWorkerUrl);
      const Constructor = Comlink.wrap<typeof ArenaBridge>(worker);
      const offscreen = canvas.transferControlToOffscreen();
      new Constructor(
        Comlink.transfer(offscreen, [offscreen]),
        animations || [],
        fallback,
        featureFlags?.values() || {},
      )
        .then(async (handler) => {
          setHandler(() => handler);
          return handler;
        })
        .catch(trackUnhandledPromiseRejection('Error creating web worker arena bridge'));
    } else {
      import('./classes/ArenaBridge')
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .then(({ ArenaBridge }) => {
          const handler = new ArenaBridge(
            canvas,
            animations || [],
            fallback,
            featureFlags?.values() || {},
          );

          setHandler(() => handler);

          return ArenaBridge;
        })
        .catch(trackUnhandledPromiseRejection('Error creating arena bridge'));
    }

    return () => {
      worker?.terminate();
    };
  }, !loadingAnimations && !loadingFeatureFlags && !!streamProps.arena && !!streamProps.avatars && !!streamEventEmitter);

  useEffect(() => {
    if (!screenParamsCallback || !handler) {
      return;
    }

    handler.setScreenParamsCallback(
      useWebWorker && screenParamsCallback
        ? Comlink.proxy(screenParamsCallback)
        : screenParamsCallback,
    );
  }, [handler, useWebWorker, screenParamsCallback]);

  useEffect(() => {
    handler?.setPerformanceProfile(performanceProfile);
  }, [handler, performanceProfile]);

  const updateAvatarOverride = useCallback(async () => {
    if (!handler) {
      return;
    }

    handler.setAvatarOverride(await CommonUtils.getAvatarOverride());
  }, [handler]);
  useAsyncEffect(updateAvatarOverride);

  useEffect(() => {
    handler?.setFrameStatsCallback(
      useWebWorker && metricsCallback ? Comlink.proxy(metricsCallback) : metricsCallback,
    );
  }, [handler, useWebWorker, metricsCallback]);

  useEffect(() => {
    return () => {
      handler?.destruct();
    };
  }, [handler]);

  useEffect(() => {
    if (!size || !handler) {
      return;
    }

    handler.resize(size.width, size?.height, window.devicePixelRatio);

    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    const media = matchMedia(mqString);
    const resizeCb = () =>
      handler.resize(size.width, size.height, window.devicePixelRatio);

    media.addEventListener('change', resizeCb);

    return () => {
      media.removeEventListener('change', resizeCb);
    };
  }, [handler, size]);

  useEffect(() => {
    if (!renderVideo || !videoTrackProcessor) {
      return;
    }

    handler?.setVideoTrackStream(
      useWebWorker
        ? Comlink.transfer(videoTrackProcessor.readable, [videoTrackProcessor.readable])
        : videoTrackProcessor.readable,
    );
  }, [renderVideo, handler, videoTrackProcessor, useWebWorker]);

  useEffect(() => {
    if (!handler) {
      return;
    }

    Promise.resolve(handler.getGPUType())
      .then((gpuType) => {
        setShowSoftwareRenderingWarning(gpuType.includes('SwiftShader'));
        return gpuType;
      })
      .catch(trackUnhandledPromiseRejection('Error getting GPU type'));
  }, [handler, trackUnhandledPromiseRejection]);

  useEffect(() => {
    if (!onFirstVideoFrameRendered || !handler) {
      return;
    }

    handler.setFirstVideoRenderedCallback(
      useWebWorker && onFirstVideoFrameRendered
        ? Comlink.proxy(onFirstVideoFrameRendered)
        : onFirstVideoFrameRendered,
    );
  }, [handler, onFirstVideoFrameRendered, useWebWorker]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const paused = document.visibilityState === 'hidden' ? true : false;
      handler?.setRenderingPaused(paused);
    };

    document.addEventListener('visibilitychange', onVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [handler]);

  useConditionalOnce(() => {
    trackEvent({
      clientStreamPlayback: {
        wasAutoUnmuteSuccessful: !needsInteractionToUnmute,
      },
    });
  }, renderVideo && !!videoTrackProcessor);

  // Send analytic event when first frame is rendered
  useConditionalOnce(() => {
    if (!renderVideo || !videoTrackProcessor) {
      return;
    }

    trackEvent({
      clientStreamVideoEvent: {
        eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_PLAY,
      },
    });

    trackEvent({
      clientStreamVideoEvent: {
        eventType:
          AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_FIRST_VIDEO_FRAME,
      },
    });
    signalFirstFrame();
  }, firstVideoFrameRendered);

  const showNeedsInteractionButton = stream && needsInteractionToUnmute;

  return (
    <div
      className={styles.canvasWrapper}
      ref={containerRef}
    >
      <ElementRenderer
        element={canvas}
        height={size.height}
        width={size.width}
      />
      {showNeedsInteractionButton && (
        <div className={styles.streamActionButton}>
          <Button
            iconStart={ImVolumeMute2}
            level="secondary"
            size="sm"
            onClick={audioPlay}
          >
            Unmute
          </Button>
        </div>
      )}
      {showSoftwareRenderingWarning && (
        <div className={styles.softwareRenderingWarning}>
          <p>
            Turn on <strong>hardware acceleration</strong> in Google Chrome to use Noice!
          </p>
          <div className={styles.hardwareAccelerationInstructions}>
            <span>Settings</span>
            <Icon icon={FaArrowRight} />
            <span>System</span>
            <Icon icon={FaArrowRight} />
            <span>Use hardware acceleration</span>
          </div>
        </div>
      )}
      {loading && (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
