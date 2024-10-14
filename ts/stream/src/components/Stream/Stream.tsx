import {
  Image,
  useBooleanFeatureFlag,
  useKeyContentLoadTracker,
} from '@noice-com/common-ui';
import { TransitionTarget } from '@noice-com/schemas/rendering/transitions.pb';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';
import { parseDuration } from '@noice-com/utils/src/date-and-time';
import classNames from 'classnames';
import { useState, useEffect, useRef, CSSProperties } from 'react';

import {
  ClientSideRendering,
  useClientSideRenderingEnabled,
} from '../../hooks/useClientSideRenderingEnabled.hook';
import { Arena } from '../Arena';
import { MediaStreamVideo } from '../MediaStreamVideo';

import { Spotlight } from './../Spotlight';
import { Arena as LegacyArena } from './Arena';
import { isMediaStreamVideoTrackProcessorSupported } from './Arena/hooks/useMediaStreamTrackProcessor.hook';
import styles from './Stream.module.css';
import { Transition } from './Transition';

import { useStreamConnection } from '@stream-hooks';
import { StreamError } from '@stream-types';

interface Props {
  className?: string;
  streamId: string;
  groupId: Nullable<string>;
  hideSpotlights?: boolean;
  hideSpotlightsEmotes?: boolean;
  crStreamAvailable: boolean;
  placement: StreamPlacement;
  onErrorCallback?(error: StreamError): void;
}

export function Stream({
  className,
  streamId,
  groupId,
  hideSpotlights,
  hideSpotlightsEmotes,
  onErrorCallback,
  placement,
  crStreamAvailable,
}: Props) {
  const [clientSideRendering, clientSideRenderingLoading] =
    useClientSideRenderingEnabled();

  if (clientSideRenderingLoading) {
    return null;
  }

  if (clientSideRendering === ClientSideRendering.Enabled) {
    return (
      <Arena
        groupId={groupId}
        hideSpotlights={hideSpotlights}
        placement={placement}
        streamId={streamId}
        onErrorCallback={onErrorCallback}
      />
    );
  }

  return (
    <LegacyStream
      className={className}
      fallback={
        !crStreamAvailable || clientSideRendering === ClientSideRendering.Fallback
      }
      groupId={groupId}
      hideSpotlights={hideSpotlights}
      hideSpotlightsEmotes={hideSpotlightsEmotes}
      placement={placement}
      streamId={streamId}
      onErrorCallback={onErrorCallback}
    />
  );
}

type LegacyProps = Omit<Props, 'crStreamAvailable'> & {
  fallback: boolean;
};

export function LegacyStream({
  className,
  streamId,
  groupId,
  hideSpotlights,
  hideSpotlightsEmotes,
  onErrorCallback,
  placement,
  fallback = false,
}: LegacyProps) {
  const [transitionDuration, setTranstionDuration] = useState(0);

  const { stream, streamProps, eventEmitter, signalFirstFrame } = useStreamConnection({
    streamId,
    groupId: groupId ?? null,
    onErrorCallback,
    placement,
    rawVideo: fallback,
  });

  const backgroundImageRef = useRef<HTMLImageElement>(null);

  useKeyContentLoadTracker('stream', !stream);

  const contentMode = streamProps.contentMode?.value ?? null;
  const transition = streamProps.transition?.value ?? null;
  const transitionAge = streamProps.transition?.ageMs ?? 0;
  const spotlightsRunning = !!contentMode?.groupSpotlight || !!contentMode?.userSpotlight;
  const cameraDriveRunning = !!contentMode?.cameraDrive;
  const showSpotlight = !hideSpotlights && spotlightsRunning;
  const transitionTimeoutRef = useRef<Nullable<NodeJS.Timeout>>(null);
  const showTransition = transitionDuration > 0 && !fallback;
  const arenaHidden = !fallback && (spotlightsRunning || cameraDriveRunning);
  const hideEmotes = hideSpotlightsEmotes || fallback;

  const [videoFrameEnabled] = useBooleanFeatureFlag('useVideoFame', false);
  const useVideoFrame =
    !fallback && isMediaStreamVideoTrackProcessorSupported() && videoFrameEnabled;

  const [videoSize, setVideoSize] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>({ x: 0, y: 0, w: 2, h: 2 });

  useEffect(() => {
    if (!transition) {
      return;
    }

    if (transition?.target === TransitionTarget.TARGET_NOICE_LOGO) {
      const dur = parseDuration(transition?.duration ?? '0s') - transitionAge;
      setTranstionDuration(dur);
      transitionTimeoutRef.current = setTimeout(() => {
        setTranstionDuration(0);
      }, dur);
    }
  }, [transition, transitionAge]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={classNames(styles.streamRoot, className)}
      style={
        {
          '--arena-screen-pos-x': `${videoSize.x}px`,
          '--arena-screen-pos-y': `${videoSize.y}px`,
          '--arena-screen-pos-width': `${videoSize.w}px`,
          '--arena-screen-pos-height': `${videoSize.h}px`,
        } as CSSProperties
      }
    >
      {!useVideoFrame && (
        <>
          {fallback && !!streamProps.arena.value?.gameviewScreenshotUrl && (
            <div className={styles.imageContainer}>
              <Image
                className={styles.backgroundImage}
                fit="cover"
                loadingType="none"
                ref={backgroundImageRef}
                src={streamProps.arena.value?.gameviewScreenshotUrl}
              />
            </div>
          )}
          <MediaStreamVideo
            className={classNames({
              [styles.streamVideoWrapper]: !fallback,
              [styles.fallbackStreamVideoWrapper]: fallback,
            })}
            signalFirstFrame={signalFirstFrame}
            stream={stream}
          />
        </>
      )}

      <LegacyArena
        fallback={fallback}
        isHidden={arenaHidden}
        localGroupId={groupId ?? null}
        renderVideo={useVideoFrame}
        screenParamsCallback={setVideoSize}
        signalFirstFrame={signalFirstFrame}
        stream={useVideoFrame ? stream : null}
        streamEventEmitter={eventEmitter}
        streamProps={streamProps}
      />

      {showSpotlight && !!contentMode && (
        <Spotlight
          contentMode={contentMode}
          hideEmotes={hideEmotes}
        />
      )}

      {showTransition && <Transition duration={transitionDuration} />}
    </div>
  );
}
